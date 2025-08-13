export interface IProps {
  /**
   * @description.zh 色盘中心空洞半径
   * @description.en Color disc center cavity radius
   * @default 21
   */
  hollowRadius?: number;
  /**
   * @description.zh 色盘中心圆半径
   * @description.en Color disc center circle radius
   * @default 17
   */
  centerRingRadius?: number;
  /**
   * @description.zh hs颜色
   * @description.en { h: number; s: number } color
   * @default {h:0,s:1000}
   */
  hsColor?: { h: number; s: number };
  /**
   * @description.zh 色盘半径
   * @description.en Color wheel radius
   * @default 160
   */
  ringRadius?: number;
  /**
   * @description.zh 选中按钮边框宽度
   * @description.en Select button border width
   * @default 5
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
   * @default ()=>null
   */
  onTouchEnd?: (e: { h: number; s: number }) => void;
  /**
   * @description.zh 内边距
   * @description.en padding
   * @default 5
   */
  paddingWidth?: number;
}
const nilFn = () => null;
export const defaultProps: IProps = {
  hollowRadius: 21,
  centerRingRadius: 17,
  ringRadius: 160,
  thumbBorderWidth: 5,
  thumbBorderColor: '#fff',
  onTouchEnd: nilFn,
  hsColor: { h: 0, s: 1000 },
  paddingWidth: 5,
};
