import Echarts from 'echarts';
export type IProps = {
  /**
   * @description.zh 容器组件样式
   * @description.en Container component style
   * @default {}
   */
  customStyle?: React.CSSProperties; // eslint-disable-line react/require-default-props

  /**
   * @description.zh 容器组件类名
   * @description.en Container component class
   * @default ""
   */
  customClass?: string;

  /**
   * @description.zh 图表主题色
   * @description.en Chart theme color
   * @default light
   */
  theme?: 'light' | 'dark';
  /**
   * @description.zh 数据单位，如果为字符串则所有数据的 legend 及 tooltip 均使用该单位，如果为数组则会和数据的索引互相匹配，如果 title 为自定义组件则可以忽略。
   * @description.en Data unit If it is a string, the legend and tooltip for all data will use that unit. If it is an array, it will be matched with the indexes of the data. If the title is a custom component, it can be ignored.
   * @default ""
   */
  unit?: string | string[];

  /**
   * @description.zh 图表配置项 参考 [Echarts 文档](https://echarts.apache.org/zh/option.html)
   * @description.en Chart [configuration](https://echarts.apache.org/zh/option.html)
   * @requires
   */
  option: Echarts.EChartsOption;

  /**
   * @description.zh 是否支持全屏
   * @description.en Whether to support full screen
   * @default false
   */
  supportFullScreen?: boolean;
  /**
   * @description.zh 加载中提示文案
   * @description.en Loading text
   * @default Loading...
   */
  loadingText?: string;

  /**
   * @description.zh 是否使用本组件默认的样式和行为能力
   * @description.en Whether to use the default style and behavior capabilities of this component
   * @default false
   * @version 0.0.4
   */
  notMerge?: boolean;

  /**
   * @description.zh echarts中设置option的第二个可选参数 https://echarts.apache.org/zh/api.html#echartsInstance.setOption
   * @description.en echarts setOption the second params https://echarts.apache.org/en/api.html#echartsInstance.setOption
   * @default {}
   */
  opts?: {
    notMerge?: boolean;
    replaceMerge?: string[] | string;
    lazyUpdate?: boolean;
  };

  /**
   * @description.zh 是否使用插件系统 使用后自行引入echarts插件 https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/plugin/intro#echarts-%E6%8F%92%E4%BB%B6
   * @description.en Whether to use the plugin system. After using it, you need to import the echarts plugin yourself. https://developer.tuya.com/en/miniapp/develop/miniapp/framework/plugin/intro#echarts-plugin
   * @default false
   * @version 0.1.0
   */
  usingPlugin?: boolean;

  /**
   * @description.zh 图表事件
   * @description.en Chart event
   * @example
   *  1. { click: (params) => { console.log(params) } }
   *  2. { query: { seriesIndex: 1 }, callback: (params) => { console.log(params) }
   * @version 0.0.3
   * @default {}
   */
  on?: { [key: string]: ((params: any) => void) | { query: any; callback: (params: any) => void } };

  /**
   * @description.zh 获取 echarts 实例代理器
   * @description.en Get echarts instance proxy
   * @default null
   * @version 0.0.3
   */

  getEchartsProxy?: (echartsInstance: Echarts.ECharts) => void;

  /**
   * @description.zh 错误信息 存在时会展示异常信息和异常图标
   * @description.en Error message
   * @default '''
   */
  errMsg?: string;

  /**
   * @description.zh 错误图标
   * @description.en Error icon
   * @default '''
   */
  iconError?: string;

  /**
   * @description.zh 加载中图标
   * @description.en Loading icon
   * @default '''
   */
  iconLoading?: string;

  /**
   * @description.zh 全屏图标
   * @description.en Full screen icon
   * @default '''
   */
  iconFullScreen?: string;

  /**
   * @description.zh 全屏退出图标
   * @description.en Full screen exit icon
   * @default '''
   */
  iconExitFullScreen?: string;

  /**
   * @description.zh 加载中
   * @description.en loading
   * @default false
   * @version 0.1.0
   */
  loading?: boolean;

  /**
   * @description.zh 注入变量, 配合 string function 使用
   * @description.en inject vars
   * @default {}
   * @version 0.1.0
   * @example { color: 'red' }
   */
  injectVars?: Record<string, any>;

  /**
   * @description.zh string function 在echarts首次绘制时执行，使用方式参考 进阶方式 string function
   * @description.en string function
   * @default ""
   * @version 0.1.0
   * @example `function() { Echarts.connect("common-chart") }`;
   */
  onLoad?: string;

  /**
   * @description.zh string function 在echarts每次绘制时执行，使用方式参考 进阶方式 string function
   * @description.en string function
   * @default ""
   * @version 0.1.0
   * @example `function() { console.log('echarts rendered') }`;
   */
  onRender?: string;

  /**
   * @description.zh 失焦后是否自动隐藏tooltip
   * @description.en Whether to automatically hide the tooltip after losing focus
   * @default true
   * @version 0.1.4
   */
  blurAutoHideTooltip?: boolean;

  /**
   * @description.zh 失焦事件
   * @description.en Blur event
   * @default
   * @version 0.1.4
   */
  onBlur?: () => void;

  /**
   * @description.zh 聚焦事件
   * @description.en Focus event
   * @default
   * @version 0.1.4
   */
  onFocus?: () => void;
};

export const defaultProps: IProps = {
  theme: 'light',
  unit: '',
  supportFullScreen: false,
  option: {},
  loadingText: 'Loading...',
  on: {},
  notMerge: false,
  customStyle: {},
  customClass: '',
  opts: {},
  usingPlugin: false,
  getEchartsProxy: e => e,
  errMsg: '',
  iconError: '',
  iconLoading: '',
  iconFullScreen: '',
  iconExitFullScreen: '',
  loading: false,
  onLoad: '',
  onRender: '',
  injectVars: {},
  blurAutoHideTooltip: true,
  onBlur: () => { },
  onFocus: () => { },
};
