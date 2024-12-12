/**
 * item in data must has height field;
 */
export interface IItem {
  height?: number;
  [key: string]: any;
}

export interface IProps {
  /**
   * @description.zh 需要渲染的长列表数据(每条数据要有 height 表示高度, 如果没有必须传入 defaultItemHeight 参数)
   * @description.en The long list data that needs to be rendered (each data must have a height to indicate the height, if not, the defaultItemHeight parameter must be passed in)
   *
   */
  data: {
    height?: number;
    [key: string]: any;
  }[];

  /**
   * @description.zh 默认单个列表元素的高度
   * @description.en Default height of a single list element
   *
   */
  defaultItemHeight?: number;

  /**
   * @description.zh 组件类名
   * @description.en Component class name
   * @default ''
   *
   */
  className?: string;
  /**
   * @description.zh 预渲染的个数(会渲染当前视口的前 overScanCount 个,和后 2 * overScanCount 个)
   * @description.en Number of pre-rendered (will render the current viewport before overscan count, and after 2 * overscan count)
   */
  overScanCount: number;
  /**
   * @description.zh 对于来不及渲染的元素，可以用一个图片地址来作为背景
   * @description.en For elements that are too late to render, you can use an image address as the background
   * @default ''
   */
  placeholderImage?: string;
  /**
   * @description.zh 如果有 renderHeader 属性方法，则必须要有 headerHeight 表示头部的高度
   * @description.en If you have a render header property method, you must have header height to indicate the height of the header
   * @default 0
   */
  headerHeight?: number;
  /**
   * @description.zh 是否固定头部
   * @description.en Whether to fix the header
   * @default false
   */
  fixedHeader?: boolean;
  /**
   * @description.zh 如果有 renderBottom 属性方法，则必须要有 bottomHeight 表示底部的高度
   * @description.en If you have a render bottom property method, you must have bottom height to indicate the height of the bottom
   * @default 0
   */
  bottomHeight?: number;
  /**
   * @description.zh 渲染头部的方法，会作为长列表的头部进行加载
   * @description.en The method that renders the header is loaded as the header of the long list
   * @default () => null
   */
  renderHeader?: () => React.ReactElement;
  /**
   * @description.zh 渲染底部的方法，会作为长列表的底部进行加载
   * @description.en  The method that renders the bottom is loaded as the bottom of the long list
   * @default () => null
   */
  renderBottom?: () => React.ReactElement;
  /**
   * @description.zh 渲染每条数据的方法，注意： 该方法中的 index 不代表该条目在总数据中的 index，如果需要在总数据中的 index， 请使用 item['__index__']
   * @description.en Render method for each data item. Note: the index in the method is not the index in the total data, if you need the index in the total data, please use item['__index__']
   * @default () => null
   *
   */
  renderItem?: (
    item: {
      height?: number;
      [key: string]: any;
    },
    index: number
  ) => React.ReactElement;
}

export interface IScrollProps {
  /**
   * @description.zh 允许横向滚动
   * @description.en Allow horizontal scrolling
   * @default false
   */
  scrollX?: boolean;
  /**
   * @description.zh 允许纵向滚动
   * @description.en Allow vertical scrolling
   * @default true
   */
  scrollY?: boolean;
  /**
   * @description.zh 设置竖向滚动条位置
   * @description.en Set the vertical scroll bar position
   * @default 0
   */
  scrollTop?: number | string;
  /**
   * @description.zh 设置横向滚动条位置
   * @description.en Set the horizontal scroll bar position
   * @default 0
   */
  scrollLeft?: number | string;

  /**
   * @description.zh 在设置滚动条位置时使用动画过渡
   * @description.en Use animation transition when setting the scroll bar position
   * @default false
   */
  scrollWithAnimation?: boolean;
  /**
   * @description.zh 距顶部/左边多远时，触发 onScrollToUpper
   * @description.en Distance from top/left to trigger onScrollToUpper
   * @default 50
   */
  upperThreshold?: number | string;
  /**
   * @description.zh 距底部/右边多远时，触发 onScrollToLower
   * @description.en Distance from bottom/right to trigger onScrollToLower
   * @default 50
   */
  lowerThreshold?: number | string;
  /**
   * @description.zh 开启自定义下拉刷新 要求: @ray-js/ray>=0.9.3
   * @description.en Enable custom pull down refresh. Require: @ray-js/ray>=0.9.3
   * @default false
   */
  refresherEnabled?: boolean;
  /**
   * @description.zh 设置自定义下拉刷新阈值 @ray-js/ray>=0.9.3
   * @description.en Set the custom pull down refresh threshold @ray-js/ray>=0.9.3
   * @default 45
   */
  refresherThreshold?: number;
  /**
   * @description.zh 设置自定义下拉刷新默认样式，支持设置 black、white、none， none 表示不使用默认样式 @ray-js/ray>=0.9.3
   * @description.en Set the custom pull down refresh default style, support setting black, white, none, none means not using default style @ray-js/ray>=0.9.3
   * @default 'black'
   */
  refresherDefaultStyle?: string;
  /**
   * @description.zh 设置自定义下拉刷新区域背景颜色 @ray-js/ray>=0.9.3
   * @description.en Set the background color of the custom pull down refresh area @ray-js/ray>=0.9.3
   * @default '#FFF'
   */
  refresherBackground?: string;
  /**
   * @description.zh 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发 @ray-js/ray>=0.9.3
   * @description.en Set the current pull down refresh status, true means pull down refresh has been triggered, false means pull down refresh has not been triggered @ray-js/ray>=0.9.3
   * @default false
   */
  refresherTriggered?: boolean;
  /**
   * @description.zh 自定义下拉刷新控件被下拉时触发 @ray-js/ray>=0.9.3
   * @description.en Custom pull down refresh control is triggered when it is pulled down
   * @default (event: { type: 'refresherpulling'; origin: any }) => void
   */
  onRefresherpulling?: (event: { type: 'refresherpulling'; origin: any }) => void;
  /**
   * @description.zh 自定义下拉刷新被触发时触发 @ray-js/ray>=0.9.3
   * @description.en Custom pull down refresh is triggered when it is triggered
   * @default (event: { type: 'refresherrefresh'; origin: any }) => void
   */
  onRefresherrefresh?: (event: { type: 'refresherrefresh'; origin: any }) => void;
  /**
   * @description.zh 自定义下拉刷新被复位时触发 @ray-js/ray>=0.9.3
   * @description.en Custom pull down refresh is reseted when it is reseted
   * @default (event: { type: 'refresherrestore'; origin: any }) => void
   */
  onRefresherrestore?: (event: { type: 'refresherrestore'; origin: any }) => void;
  /**
   * @description.zh 自定义下拉刷新被中止时触发 @ray-js/ray>=0.9.3
   * @description.en Custom pull down refresh is aborted when it is aborted
   * @default (event: { type: 'refresherabort'; origin: any }) => void
   */
  onRefresherabort?: (event: { type: 'refresherabort'; origin: any }) => void;
  /**
   * @description.zh 滚动到顶部/左边时触发
   * @description.en Scroll to the top/left when it is triggered
   * @default (event: { type: 'scrolltoupper'; direction: 'top' or'left'; origin: any }) => void
   */
  onScrollToUpper?: (event: {
    type: 'scrolltoupper';
    direction: 'top' | 'left';
    origin: any;
  }) => void;
  /**
   * @description.zh 滚动到底部/右边时触发
   * @description.en Scroll to the bottom/right when it is triggered
   * @default (event: { type: 'scrolltolower'; direction: 'bottom' or 'right'; origin: any }) => void
   */
  onScrollToLower?: (event: {
    type: 'scrolltolower';
    direction: 'bottom' | 'right';
    origin: any;
  }) => void;
  /**
   * @description.zh 滚动时触发
   * @description.en Scroll when it is triggered
   * @default (event: { type: 'scroll'; scrollLeft: number; scrollTop: number; scrollHeight: number; scrollWidth: number; deltaX: number; deltaY: number; origin: any }) => void
   */
  onScroll?: (event: {
    type: 'scroll';
    scrollLeft: number;
    scrollTop: number;
    scrollHeight: number;
    scrollWidth: number;
    deltaX: number;
    deltaY: number;
    origin: any;
  }) => void;
}

export const defaultProps: IProps & IScrollProps = {
  data: [],
  overScanCount: 5,
  headerHeight: 0,
  bottomHeight: 0,
  scrollY: true,
  scrollX: false,
  className: '',
};
