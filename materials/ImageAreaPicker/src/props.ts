export interface IProps {
  /**
   * @description.zh 样式
   * @description.en Style
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 类名
   * @description.en class name
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 图片路径
   * @description.en Image path
   */
  filePath: string;
  /**
   * @description.zh 图片的宽度
   * @description.en Image width
   */
  imgWidth: number;
  /**
   * @description.zh 图片的高度
   * @description.en Image height
   */
  imgHeight: number;
  /**
   * @description.zh 框选框的宽度
   * @description.en Width of the selection box
   * @default 300
   */
  width?: number;
  /**
   * @description.zh 框选框的高度
   * @description.en Height of the selection box
   * @default 300
   */
  height?: number;
  /**
   * @description.zh 框选框的背景色
   * @description.en Background color of the selection box
   * @default rgba(255,255,255,0.4)
   */
  backgroundColor?: string;
  /**
   * @description.zh 蒙层背景色
   * @description.en Mask background color
   * @default rgba(0,0,0,0.7)
   */
  maskBgColor?: string;
  /**
   * @description.zh 是否显示框选框
   * @description.en Whether to display the selection box
   * @default true
   */
  isShowBox?: boolean;
  /**
   * @description.zh 触摸变化事件, 返回选框的坐标数据 topLeftX, topLeftY, bottomRightX, bottomRightY
   * @description.en Touch change event, returns the coordinate data of the selection box topLeftX, topLeftY, bottomRightX, bottomRightY
   * @default null
   */
  onTouchMove?: (data: IData) => void;
  /**
   * @description.zh 触摸结束事件, 返回选框的坐标数据 topLeftX, topLeftY, bottomRightX, bottomRightY
   * @description.enTouch end event, return the coordinate data of the selection box topLeftX, topLeftY, bottomRightX, bottomRightY
   * @default null
   */
  onTouchEnd?: (data: IData) => void;
  /**
   * @description.zh 图片加载失败回调
   * @description.en Image loading failure callback
   * @default null
   */
  onError?: (e: { errMsg: string }) => void;
}

export interface IData {
  /**
   * @description.zh 左上角坐标X
   * @description.en Upper left corner coordinate X
   * @default null
   */
  topLeftX: number;
  /**
   * @description.zh 左上角坐标Y
   * @description.en Upper left corner coordinate Y
   * @default null
   */
  topLeftY: number;
  /**
   * @description.zh 右下角坐标X
   * @description.en Lower right corner coordinate X
   * @default null
   */
  bottomRightX: number;
  /**
   * @description.zh 右下角坐标Y
   * @description.en Lower right corner coordinate Y
   * @default null
   */
  bottomRightY: number;
}

export const defaultProps: IProps = {
  className: '',
  style: {},
  filePath: '',
  imgWidth: 400,
  imgHeight: 400,
  width: 300,
  height: 300,
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  maskBgColor: 'rgba(0, 0, 0, 0.7)',
  isShowBox: true,
  onTouchMove: () => null,
  onTouchEnd: () => null,
};
