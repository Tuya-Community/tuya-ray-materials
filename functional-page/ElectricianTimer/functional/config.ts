export const config = {
  devId: '',
  theme: '', // 主题配色，如果不指定，则跟随系统
  brand: '', // 主题色，如果不指定，则跟随系统
  /**
   * 是否24小时制
   */
  is24Hour: true,
  /**
   * 开关dp，默认为自动获取所有开关
   * 如需要指定，可通过功能页入参传入 switchCodes 指定
   */
  switchCodes: [] as string[],
  /**
   * 倒计时dp，默认自动由开关 dp 获取列表
   * 如需要指定，可通过功能页入参传入 countdownCodes 指定
   */
  countdownCodes: [] as string[],
  /**
   * 综合页面是否支持倒计时，默认为不支持
   * 支持需要满足两个条件： 功能页入参配置为支持，且存在倒计时 dp
   */
  isSupportCountdown: 'n' as SupportType,
  /**
   * 综合页面是否支持云定时， 会根据云端的配置判断是否支持
   */
  isSupportNormal: 'n' as SupportType,
  /**
   * 综合页面是否支持显示循环定时，
   * 支持需要满足两个条件：功能页入参配置为支持循环定时且dp存在
   */
  isSupportCycle: 'y' as SupportType,
  /**
   * 综合页面是否支持显示随机定时
   * 支持需要满足两个条件：功能页入参配置为支持随机环定时且dp存在
   */
  isSupportRandom: 'y' as SupportType,
  /**
   * 综合页面是否支持显示延时关功能，
   * 支持需要满足两个条件：功能页入参配置为支持延时关功能且dp存在
   */
  isSupportInching: 'y' as SupportType,
  /**
   * 是否支持天文定时
   * 支持条件： 1 功能页入参配置支持，2 设备能力支持
   */
  isSupportAstronomical: 'n' as SupportType,
  /**
   * 循环定时code，自动获取标准 dp
   * 可支持入参指定
   */
  cycleCode: '',
  /**
   * 随机定时code， 自动获取标准 dp
   * 可支持入参指定
   */
  randomCode: '',
  /**
   * 点动开关code， 自动获取标准 dp
   * 可支持入参指定
   */
  inchingCode: '',
  /**
   * 综合页面支持的功能
   */
  functions: [] as FunctionData[], // 支持的功能
  /**
   * 支持的开关
   */
  switchDps: [] as DpSchema[],
  /**
   *  支持的倒计时，通过下标与支持的开关一一对应
   */
  countdownDps: [] as DpSchema[],
  /**
   * 定时的分类 code， 默认为 schedule
   */
  category: '',
  /**
   * 所有开关dp，下标对应通道号，值为dp schema
   */
  channelDps: [],
  /**
   * 设置倒计时完成后的动作
   * hold 表示在原页面进入倒计时显示
   * back 表示回退到上一页
   */
  countdownSuccessAction: 'hold' as 'hold' | 'back',
  bgImgUrl: '',
};

export const setConfig = (option) => {
  Object.assign(config, option);
};

const switchReg = /^switch(_led)?(_\d+)?$/;
const pdSwitchReg = /^pd_switch_\d+/;
const usbSwitchReg = /(^usb_switch_\d+)|(^switch_usb\d+)/;
const matchNum = /(\d+)/;

/**
 * 处理开关dp 对应的通道数据
 * @param dpSchema
 */
export const fetchChannelDps = (dpSchema: Record<string, DpSchema>) => {
  // 处理设备的通道号数据
  const channelDps: DpSchema[] = [];
  Object.keys(dpSchema).forEach((code) => {
    // 是否是开关
    if (switchReg.test(code) || pdSwitchReg.test(code) || usbSwitchReg.test(code)) {
      channelDps.push(dpSchema[code]);
    }
  });
  // 排序，已确保通道号对应
  channelDps.sort((a, b) => {
    let aIndex = 100;
    let bIndex = 100;
    if (switchReg.test(a.code)) {
      aIndex = +(a.code.match(matchNum)?.[1] || 0);
    } else if (pdSwitchReg.test(a.code)) {
      aIndex = +a.code.match(matchNum)[1] + 10;
    } else if (usbSwitchReg.test(a.code)) {
      aIndex = +a.code.match(matchNum)[1] + 20;
    }
    if (switchReg.test(b.code)) {
      bIndex = +(a.code.match(matchNum)?.[1] || 0);
    } else if (pdSwitchReg.test(b.code)) {
      bIndex = +b.code.match(matchNum)[1] + 10;
    } else if (usbSwitchReg.test(b.code)) {
      bIndex = +b.code.match(matchNum)[1] + 20;
    }
    return aIndex < bIndex ? -1 : 1;
  });

  config.channelDps = channelDps;
};
