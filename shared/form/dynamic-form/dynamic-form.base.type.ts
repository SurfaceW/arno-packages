export type ComponentType =
  | 'Input.Text'
  | 'Input.Number'
  | 'Input.TextArea'
  | 'Select'
  | 'Switch'
  | 'File'
  | string;


/**
 * Dynamic form configuration item
 */
export interface DynamicFormConfigItem<T = Record<string, any>> {
  /**
   * unique key
   */
  key: string;
  required?: boolean;
  /**
   * extension fields for different scenarios
   */
  extension?: Record<string, any>;
  /**
   * Runtime parser to type
   * @default string
   * @description
   * string, number, boolean, json -> Object
   */
  valueType?: 'string' | 'number' | 'boolean' | 'json';
  /**
   * Setter for the component
   */
  setter?: {
    /**
     * Follow AntDesign 5.0 component name
     * @doc https://ant-design.antgroup.com/components/overview-cn
     */
    componentName: ComponentType | string;
    /**
     * group name / tag
     * @default basic
     */
    group?: 'basic' | 'advanced' | string;
    /**
     * tooltip on the field
     */
    tooltip?: string;
    /**
     * help doc url
     */
    docUrl?: string;
    /**
     * component props
     */
    props: T;
  };
}
