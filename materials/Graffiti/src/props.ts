export interface IProps {
  /**
   * @description.zh 样式
   * @description.en Style
   * @default {}
   */
  style?: React.CSSProperties;

  /**
   * @description.zh 类名
   * @description.en className
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 画布宽度
   * @description.en Canvas width
   * @default 353
   */
  width?: number;
  /**
   * @description.zh 画布高度
   * @description.en Canvas height
   * @default 353
   */
  height?: number;

  /**
   * @description.zh 画布显示模式(grid: 按格子数量显示, pixel: 按像素显示格子), 如果 mode 设置为 grid, 那么 pixelSizeX, pixelSizeY 属性将不生效, 如果 mode 设置为 pixel, 那么 gridSizeX, gridSizeY 属性将不生效, 推荐使用 grid 模式
   * @description.en Canvas display mode (grid: display by grid number, pixel: display by pixel grid), if mode is set to grid, then pixelSizeX, pixelSizeY properties will not take effect, if mode is set to pixel, then gridSizeX, gridSizeY properties will not take effect, it is recommended to use grid mode
   * @default grid
   */
  mode?: 'grid' | 'pixel';

  /**
   * @description.zh 每行格子数量
   * @description.en Number of grid per row and column
   * @default 32
   */
  gridSizeX?: number;

  /**
   * @description.zh 每列格子数量
   * @description.en Number of grid per column
   * @default 32
   */
  gridSizeY?: number;

  /**
   * @description.zh 格子宽度
   * @description.en Pixel width
   * @default 10
   */
  pixelSizeX?: number;

  /**
   * @description.zh 格子高度
   * @description.en Pixel height
   * @default 10
   */
  pixelSizeY?: number;

  /**
   * @description.zh 格子间距
   * @description.en Pixel gap
   * @default 1
   */
  pixelGap?: number;

  /**
   * @description.zh 格子形状, square 方形, circle 圆形
   * @description.en Pixel shape
   * @default square
   */
  pixelShape?: 'square' | 'circle';

  /**
   * @description.zh 网格颜色
   * @description.en Grid color
   * @default `rgba(255, 255, 255, 0.15)`
   */
  pixelColor?: string;

  /**
   * @description.zh 画笔颜色
   * @description.en Pen color
   * @default `rgb(255, 255, 255)`
   */
  penColor?: string;

  /**
   * @description.zh 操作类型, pencil 画笔, eraser 橡皮擦, paint 油漆桶
   * @description.en Action type
   * @default pencil
   */
  actionType?: 'pencil' | 'eraser' | 'paint';

  /**
   * @description.zh 是否监听每一画笔数据, 开启后可以通过 onStrokeChange 获取每一笔画笔数据
   * @description.en Whether to listen to each stroke data, after opening, you can get each stroke data through onStrokeChange
   * @default false
   */
  needStroke?: boolean;

  /**
   * @description.zh 触发保存的标识, 每次递增该值, 可以触发 onSaveData 返回保存数据
   * @description.en Trigger save mark, increase this value each time, you can trigger onSaveData to return saved data
   * @default 0
   */
  saveTrigger?: number;

  /**
   * @description.zh 触发清空的标识, 每次递增该值, 可以触发画笔清空
   * @description.en Trigger clear mark, increase this value each time, you can trigger the pen to clear
   * @default 0
   */
  clearTrigger?: number;

  /**
   * @description.zh 画笔数据更新时触发, 返回画笔经过的x,y坐标路径数据
   * @description.en Triggered when the brush data is updated, returns the x,y coordinate path data of the brush.
   * @default () => null
   */
  onStrokeChange?: (data: IStrokeData) => void;

  /**
   * @description.zh 保存数据时触发, 返回画布的base64数据
   * @description.en Triggered when saving data, return canvas base64 data
   * @default () => null
   */
  onSaveData?: (data: IData) => void;
}

export type IStrokeData = {
  points: Array<{ x: number; y: number }>;
};

export type IData = {
  base64: string; // 画布数据
};

export const defaultProps: IProps = {
  style: {},
  width: 353,
  height: 353,
  mode: 'grid',
  gridSizeX: 32,
  gridSizeY: 32,
  pixelSizeX: 10,
  pixelSizeY: 10,
  pixelGap: 1,
  pixelShape: 'square',
  pixelColor: 'rgba(255, 255, 255, 0.15)',
  penColor: 'rgb(255, 255, 255)',
  actionType: 'pencil',
  needStroke: false,
  saveTrigger: 0,
  clearTrigger: 0,
  onStrokeChange: () => null,
  onSaveData: () => null,
};
