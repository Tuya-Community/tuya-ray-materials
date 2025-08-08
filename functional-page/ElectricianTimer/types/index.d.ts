declare module '*.scss';
declare module '*.png';

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less?modules' {
  const classes: { [key: string]: string };
  export default classes;
}

type SupportType = 'y' | 'n' | undefined;

interface DpSchema {
  attr?: number;
  canTrigger?: boolean;
  /**
   * 功能点标识码，如 switch
   */
  code: string;
  defaultRecommend?: boolean;
  editPermission?: boolean;
  executable?: boolean;
  extContent?: string;
  iconname?: string;
  /**
   * 功能点 ID
   */
  id: number | string;
  /**
   * 功能点模式类型
   * rw: 可下发可上报（可读可写）
   * ro: 只可上报（仅可读）
   * wr: 只可下发（仅可写）
   */
  mode: 'rw' | 'ro' | 'wr';
  /**
   * 功能点名称，一般用于语音等场景
   */
  name: string;
  /**
   * 功能点属性
   */
  property?: {
    /**
     * 功能点类型
     */
    type: 'bool' | 'value' | 'enum' | 'bitmap' | 'string' | 'raw';
    /**
     * 枚举值范围，type = enum 时才存在
     */
    range?: string[] | readonly string[];
    /**
     * 故障型标签列表，type = bitmap 时才存在
     */
    label?: string[] | readonly string[];
    /**
     * 故障型最大长度，type = bitmap 时才存在
     */
    maxlen?: number;
    /**
     * 数值型单位，type = value 时才存在
     */
    unit?: string;
    /**
     * 数值型最小值，type = value 时才存在
     */
    min?: number;
    /**
     * 数值型最大值，type = value 时才存在
     */
    max?: number;
    /**
     * 数值型精度，type = value 时才存在
     * @example
     * scale = 0; value = 10; 则业务上显示值为 10
     * scale = 1; value = 10; 则业务上显示值为 1
     * scale = 2; value = 10; 则业务上显示值为 0.1
     */
    scale?: number;
    /**
     * 数值型步长，type = value 时才存在
     */
    step?: number;
  };
  type: 'raw' | 'obj';
}

interface FunctionData {
  key: 'normal' | 'cycle' | 'countdown' | 'random' | 'inching' | 'sunrise' | 'sunset'; // 定时类型
  title: string;
  schema?: DpSchema;
  subTitle: string;
  icon: string;
}

type TimeType = 'hour' | 'minute' | 'second';
