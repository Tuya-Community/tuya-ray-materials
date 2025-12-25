/* eslint-disable @typescript-eslint/no-empty-function */

export enum SmearMode {
  all,
  single,
}

export interface IProps {
  /**
   * @description.zh 类名
   * @description.en class name
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   * @default ''
   */
  style?: string;
  /**
   * @description.zh 灯带涂抹颜色映射表
   * @description.en Light smear color mapping table
   * @default null
   */
  lightColorMaps: Record<number, string>;
  /**
   * @description.zh 灯带长度 也就是灯珠数量
   * @description.en The length of the light strip is the number of light beads
   * @default 19
   */
  length?: number;
  /**
   * @description.zh 唯一标识
   * @description.en Unique identifier
   */
  instanceId?: string;
  /**
   * @description.zh 涂抹类型：all 0：全部涂抹，single 1：单个涂抹
   * @description.en Smear type: all: all smear, single: single smear
   * @default SmearMode.all/0
   */
  mode?: SmearMode;
  /**
   * @description.zh 亮度
   * @description.en brightness
   * @default 100
   */
  bright?: number;
  /**
   * @description.zh 最大选中数量
   * @description.en Maximum selected quantity
   * @default 100
   */
  maxSelect?: number;
  /**
   * @description.zh 选中节点id数组
   * @description.en Select node ID array
   * @default []
   */
  selectList?: number[];
  /**
   * @description.zh eventChannel 事件名称 用于实时更新
   * @description.en EventChannel event name is used for real-time updates
   * @default ''
   */
  eventChannelName?: string;
  /**
   * @description.zh 初始化节点位置等待时间
   * @description.en Initialization node position waiting time
   * @default ''
   */
  initWait?: number;
  /**
   * @description.zh 灯带涂抹结束 灯带数量变化
   * @description.en Light smear end, lightSet is the index of the selected light strip
   * @default null
   */
  onSelectChange?: (lightSet: Set<number>) => void;
  /**
   * @description.zh 灯带最大选中被触发
   * @description.en Light smear max select trigger
   * @default null
   */
  onMaxSelectTrigger?: () => void;
  /**
   * @description.zh event channel 的回调事件
   * @description.en  event channel
   * @default null
   */
  onChannel?: (e: { type: string; data: any[] }) => void;
  /**
   * 订阅 slider 移动事件
   */
  eventSliderMoveName?: string;
}

export const defaultProps: IProps = {
  bright: 100,
  initWait: 100,
  length: 19,
  selectList: [],
  style: '',
  className: '',
  instanceId: 'PointLightBelt',
  mode: SmearMode.all,
  eventChannelName: '',
  lightColorMaps: {},
  onChannel: () => {},
  onMaxSelectTrigger: () => {},
  onSelectChange: () => {},
};
