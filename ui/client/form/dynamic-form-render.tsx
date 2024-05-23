'use client';

import React, { useCallback, useEffect } from 'react';

import { Form, Input, InputNumber, Select, Upload, Row, Col, FormInstance } from 'antd';
import {
  ComponentType,
  type DynamicFormConfigItem,
} from '@arno/shared/form/dynamic-form/dynamic-form.base.type';
import { debounce, omit } from 'lodash';
import { parseJSONObjectSafe, stringifyObjectSafe } from '@arno/shared';

class ComponentRegistry {
  private _registry: Map<string, React.FC<any>> = new Map();
  getCustomComponentByName(name: string) {
    return this._registry.get(name);
  }

  register(name: string, component: React.FC<any>) {
    this._registry.set(name, component);
  }
}

export const componentRegistry = new ComponentRegistry();

function getDefaultValueFromConfigMeta(config: DynamicFormConfigItem[]) {
  const defaultValue: Record<string, any> = {};
  config.forEach((item) => {
    defaultValue[item.key] = item?.setter?.props?.defaultValue;
  });
  return defaultValue;
}

const getComponentFromType = (type: ComponentType) => {
  switch (type) {
    case 'Input.Text':
      return Input;
    case 'Input.Number':
      return InputNumber;
    case 'Input.TextArea':
      return Input.TextArea;
    case 'Select':
      return Select;
    case 'File':
      return Upload;
    // ============================= Inset Custom Components ==============================
    case 'PromptIOPreprocessorConfig':
      return componentRegistry.getCustomComponentByName('PromptIOPreprocessorConfig') || Input;
    default:
      return Input;
  }
};

export function adaptValueWithValueType(
  values: Record<string, any>,
  configs: DynamicFormConfigItem[]
) {
  const fitValues = {
    ...Object.keys(values).reduce((acc: any, key: string) => {
      const config = configs.find((item) => item.key === key);
      const configValueType = config?.valueType;
      if (configValueType) {
        switch (configValueType) {
          case 'number':
            acc[key] = Number(values[key]);
            break;
          case 'boolean':
            acc[key] = Boolean(values[key]);
            break;
          case 'json':
            acc[key] = parseJSONObjectSafe(values[key]);
            if (typeof acc[key] === 'string') {
              console.error(
                `Dynamic form config: [${name}] ${key} json parse error, please check your input again`
              );
            }
            break;
          case 'string':
            acc[key] = String(values[key]);
            break;
          default:
            acc[key] = values[key];
            break;
        }
      }
      return acc;
    }, values || {}),
  };
  return fitValues;
}

export type DynamicFormFieldsProps = {
  /**
   * Dynamic form name
   */
  name?: string;
  configs: DynamicFormConfigItem[];
  onSave(values: Record<string, any>, form?: FormInstance): any;
  value: Record<string, any>;
  colSpan?: number;
  formSize?: string;
};

export const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({
  configs,
  onSave,
  value,
  colSpan,
  formSize,
  name,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        ...getDefaultValueFromConfigMeta(configs),
        ...Object.keys(value).reduce((acc: any, key: string) => {
          const config = configs.find((item) => item.key === key);
          const configValueType = config?.valueType;
          if (configValueType) {
            switch (configValueType) {
              case 'number':
                acc[key] = Number(value[key]);
                break;
              case 'boolean':
                acc[key] = Boolean(value[key]);
                break;
              case 'json':
                // JSON is a special case, we need to stringify it
                acc[key] = stringifyObjectSafe(value[key], null, '\t');
                break;
              case 'string':
                acc[key] = String(value[key]);
                break;
              default:
                acc[key] = value[key];
                break;
            }
          }
          return acc;
        }, value || {}),
      });
    }
  }, [value, form]);

  const handleFormChange = useCallback(
    debounce(async () => {
      const values = await form.validateFields();
      const fitValues = adaptValueWithValueType(values, configs);
      console.log(`[Dynamic FormFields] [${name}] update values`, fitValues);
      onSave(fitValues, form);
    }, 500),
    [form]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      size={(formSize as any) || 'small'}
      className="mb-4"
      onValuesChange={handleFormChange}
    >
      <Row gutter={16}>
        {configs.map((config, index) => {
          const InputField = getComponentFromType(
            config?.setter?.componentName as ComponentType
          ) as any;
          return (
            <Col key={config?.key} span={colSpan ? colSpan : 24}>
              <Form.Item
                key={index}
                tooltip={config?.setter?.tooltip || ''}
                label={config?.setter?.props?.label || config.key}
                name={config.key}
                rules={[{ required: config?.required }]}
              >
                <InputField {...omit(config?.setter?.props || {}, ['defaultValue', 'value'])} />
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </Form>
  );
};

