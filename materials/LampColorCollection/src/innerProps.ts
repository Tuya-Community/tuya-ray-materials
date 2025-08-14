export interface IColor {
  h?: number; // hue 取值范围： 0 - 360
  s?: number; // saturation 取值范围： 0 - 1000
  v?: number; // value 取值范围： 0 - 1000
  b?: number; // brightness 取值范围： 0 - 1000
  t?: number; // temperature 取值范围： 0 - 1000
}

export type ThemeStyle = {
  background: string;
  addBgColor: string;
};

export interface IProps {
  /**
   * @description.zh 是否允许删除
   * @description.en Whether or not allowed to delete
   * @default true
   */
  disableDelete?: boolean;
  /**
   * @description.zh 主题色，支持自定义
   * @description.en Theme color, support custom
   * @default dark
   */
  theme?: 'dark' | 'light' | ThemeStyle;

  /**
   * @description.zh 整体样式
   * @description.en The overall style
   * @default {}
   */
  style?: React.CSSProperties;

  /**
   * @description.zh 整体类名
   * @description.en The overall class name
   * @default ''
   */
  className?: string;

  /**
   * @description.zh 内容样式
   * @description.en Content style
   * @default {}
   */
  contentStyle?: React.CSSProperties;

  /**
   * @description.zh 内容类名
   * @description.en Content class name
   * @default ''
   */
  contentClassName?: string;

  /**
   * @description.zh 圆形大小，单位：px
   * @description.en Circle size, unit：px
   * @default 48
   */
  circleSize?: number;
  /**
   * @description.zh 色值列表
   * @description.en Color value list
   * @default []
   */
  colorList: IColor[];
  /**
   * @description.zh 当前选中颜色索引
   * @description.en The color of the currently selected index
   * @default -1
   */
  activeIndex: number;

  /**
   * @description.zh 添加按钮的位置
   * @description.en Add button position
   * @default head
   */
  addButtonPos?: 'head' | 'tail';

  /**
   * @description.zh 限制的颜色个数
   * @description.en The number of colors in the limit
   * @default 6
   */
  limit?: number;

  /**
   * @description.zh 自定义删除样式
   * @description.en Custom delete style
   * @default () => null
   */
  renderDeleteElement?: () => React.ReactNode;
  /**
   * @description.zh 增加色值的回调函数
   * @description.en Increase the color value of the callback function
   * @default () => {}
   */
  onAdd?: () => void;
  /**
   * @description.zh 删除色值的回调函数
   * @description.en Delete the color value of the callback function
   * @default () => {}
   */
  onDelete?: (colorList: IColor[], activeIndex: number, deletedIndex: number) => void;
  /**
   * @description.zh 选中色值的回调函数
   * @description.en Select the color value of the callback function
   * @default () => {}
   */
  onChecked?: (colorItem: IColor, index: number) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const nilFn = () => null;
export const defaultProps: IProps = {
  theme: 'light',
  style: {},
  className: '',
  contentStyle: {},
  contentClassName: '',
  circleSize: 48,
  limit: 6,
  onAdd: nilFn,
  onDelete: nilFn,
  onChecked: nilFn,
  colorList: [],
  activeIndex: -1,
};
