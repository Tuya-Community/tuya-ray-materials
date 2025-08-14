export interface IProps {
  /**
   * @description.zh hs颜色
   * @description.en HS color
   * @default {h:0,s:1000}
   */
  hs?: { h: number; s: number };

  /**
   * @description.zh 彩光色卡宽度
   * @description.en Color card width
   * @default 319
   */
  rectWidth?: number;
  /**
   * @description.zh 彩光色卡高度
   * @description.en Color card height
   * @default 133
   */
  rectHeight?: number;
  /**
   * @description.zh 选中按钮边框宽度
   * @description.en Select button border width
   * @default 2
   */
  thumbBorderWidth?: number;
  /**
   * @description.zh 选中按钮边框颜色
   * @description.en Select button border color
   * @default '#fff'
   */
  thumbBorderColor?: string;
  /**
   * @description.zh 点击结束事件
   * @description.en Click on the end event
   * callback function
   * @default '''
   */
  onTouchEnd?: (e: { h: number; s: number }) => void;
  /**
   * @description.zh 彩光色卡样式
   * @description.en Color card style
   * @default {}
   */
  rectStyle?: React.CSSProperties | string;
  /**
   * @description.zh 容器样式
   * @description.en Container style
   * @default {}
   */
  containerStyle?: React.CSSProperties | string;
  /**
   * @description.zh 选中按钮圆角
   * @description.en Select the button rounded corner
   * @default 4
   */
  thumbBorderRadius?: number;
}
const nilFn = () => null;

export const defaultProps: IProps = {
  hs: { h: 0, s: 1000 },
  rectWidth: 319,
  rectHeight: 133,
  thumbBorderWidth: 2,
  thumbBorderColor: '#fff',
  rectStyle: {},
  containerStyle: {},
  thumbBorderRadius: 4,
  onTouchEnd: nilFn,
};
