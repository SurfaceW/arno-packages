'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Table,
  Typography,
  Popconfirm,
  Button,
} from 'antd';
import type { TableProps } from 'antd';

export type ComponentType =
  | 'Input.Text'
  | 'Input.Number'
  | 'Input.TextArea'
  | 'Select'
  | 'Switch'
  | 'File'
  | string;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: ComponentType;
  record: Record<string, any>;
  index: number;
  children: React.ReactNode;
}

const ExtensionContext = createContext<Record<string, any>>({});

/**
 * AI Generation sample: Chat: https://poe.com/chat/3dgjyn3ng34jov7dn5p
 */
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;

  const tableExtension = useContext(ExtensionContext);

  switch (inputType) {
    case 'Input.Number':
      inputNode = <InputNumber />;
      break;
    case 'Select':
      inputNode = (
        <Select
          options={tableExtension?.[dataIndex]?.options || record.extension?.options || []}
        />
      );
      break;
    case 'Switch':
      inputNode = <Switch />;
      break;
    case 'Input.TextArea':
      inputNode = <Input.TextArea />;
      break;
    default:
      inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: record.required,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : inputType === 'Switch' ? (
        record[dataIndex] ? (
          <Typography.Text type="success">True</Typography.Text>
        ) : (
          <Typography.Text type="danger">False</Typography.Text>
        )
      ) : (
        children
      )}
    </td>
  );
};

interface Props {
  extension?: Record<string, any>;
  value?: Record<string, any>[];
  columns: {
    title: string;
    dataIndex: string;
    width?: string;
    editable: boolean;
    inputType: ComponentType;
    required?: boolean;
    extension?: Record<string, any>;
  }[];
  dataSource: Record<string, any>[];
  onChange: (newData: Record<string, any>[]) => void;
}

export const EditableTable: React.FC<Props> = ({ columns, value, dataSource, onChange, extension }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(value || dataSource);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Record<string, any>) => record.key === editingKey;

  const onEditRow = (record: Partial<Record<string, any>> & { key: React.Key }) => {
    form.resetFields();
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };


  useEffect(() => {
    setData(value || dataSource);
  }, [value, dataSource]);

  const onCancelEditRow = () => {
    setEditingKey('');
  };

  const saveRow = async (key: React.Key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        onChange(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        onChange(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteRow = (key: React.Key) => {
    const newData = data.filter((item) => key !== item.key);
    setData(newData);
    onChange(newData);
  };

  const mergedColumns: TableProps<any>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Record<string, any>) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <ExtensionContext.Provider value={extension || {}}>
      <Form form={form}>
        <Button
          onClick={() => {
            const newData = [...data, { key: Date.now().toString() }];
            setData(newData);
            onChange(newData);
          }}
        >
          Add Row
        </Button>
        <Table
          className="p-2"
          size="small"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered={false}
          dataSource={data}
          columns={[
            ...mergedColumns,
            {
              title: 'operation',
              dataIndex: 'operation',
              render: (_: any, record) => {
                const editable = isEditing(record);
                return editable ? (
                  <span>
                    <Typography.Link onClick={() => saveRow(record.key)} style={{ marginRight: 8 }}>
                      Save
                    </Typography.Link>
                    <Popconfirm title="Sure to cancel?" onConfirm={onCancelEditRow}>
                      <a>Cancel</a>
                    </Popconfirm>
                  </span>
                ) : (
                  <>
                    <Typography.Link
                      disabled={editingKey !== ''}
                      style={{ marginRight: 8 }}
                      onClick={() => onEditRow(record)}
                    >
                      Edit
                    </Typography.Link>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record.key)}>
                      <Typography.Link
                        type="danger"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Delete
                      </Typography.Link>
                    </Popconfirm>
                  </>
                );
              },
            },
          ]}
          rowClassName="editable-row"
          // no need for pagination
          pagination={false}
        />
      </Form>
    </ExtensionContext.Provider>
  );
};
