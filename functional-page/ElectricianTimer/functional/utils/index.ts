import { DevInfo, DpSchema, utils } from '@ray-js/panel-sdk';
import { getDeviceOnlineType, getSystemInfoSync, platform } from '@ray-js/ray';
import { config, setConfig } from '../config';
import { FuncType } from '../constant';
import Strings from '../i18n';
import { devices } from '../devices';
import { DialogInstance } from '@ray-js/smart-ui';
import { Action, BaseDpData } from '@ray-js/electrician-timing-sdk/lib/interface';
import { electri } from '@ray-js/electrician-timing-sdk';

const systemInfo = getSystemInfoSync();

export const getDpIdByCode = (dpCode: string, devInfo: any) => {
  const { schema = {} } = devInfo;
  if (typeof dpCode === 'string') {
    if (!schema[dpCode]) {
      return null;
    }
    return schema[dpCode].id;
  }
  return null;
};

export const rpx2pxNum = (maybeRpx: string | number) => {
  if (typeof maybeRpx === 'string') {
    if (maybeRpx.endsWith('rpx')) {
      const value = Number(maybeRpx.replace(/rpx/g, ''));
      if (platform.isMiniProgram) {
        return (value / 750) * systemInfo.windowWidth;
      }
      if (platform.isWeb) {
        return value / 2;
      }
    } else if (maybeRpx.endsWith('px')) {
      const value = Number(maybeRpx.replace(/px/g, ''));
      return Number(value);
    }
  } else {
    if (platform.isMiniProgram) {
      return (maybeRpx / 750) * systemInfo.windowWidth;
    }
    if (platform.isWeb) {
      return maybeRpx / 2;
    }
  }
  return Number(maybeRpx);
};

export const px2rpxNum = (maybeRpx: string | number) => {
  if (typeof maybeRpx === 'string') {
    if (maybeRpx.endsWith('rpx')) {
      const value = Number(maybeRpx.replace(/rpx/g, ''));
      return value;
    }
    if (maybeRpx.endsWith('px')) {
      const value = Number(maybeRpx.replace(/px/g, ''));
      if (platform.isMiniProgram) {
        return (value * 750) / systemInfo.windowWidth;
      }
      if (platform.isWeb) {
        return value * 2;
      }
    }
  }
  if (platform.isMiniProgram) {
    return (Number(maybeRpx) * 750) / systemInfo.windowWidth;
  }
  if (platform.isWeb) {
    return Number(maybeRpx) * 2;
  }
  return Number(maybeRpx);
};

export const range = (min: number, max: number, step = 1) => {
  const result: number[] = [];
  for (let i = min; i <= max; i += step) {
    result.push(i);
  }
  if (result[result.length - 1] !== max) {
    result.push(max);
  }

  return result;
};

export function parseDevice(dev: ty.device.DeviceInfo | DevInfo): DevInfo & { dpSchema: Record<string, DpSchema> } {
  if (!dev) return null;
  const deviceInfo = { ...dev } as any;
  // tuyalink 协议设备没有 schema 字段。避免崩溃加设置为空数组
  const { schema = [] } = dev;
  const idCodes = {};
  const codeIds = {};
  const dpSchema = {};
  schema.forEach((item) => {
    // @ts-ignore
    const { id, code } = item;
    idCodes[id] = code;
    codeIds[code] = id;
    dpSchema[code] = item;
  });
  deviceInfo.idCodes = idCodes;
  deviceInfo.codeIds = codeIds;
  deviceInfo.dpSchema = dpSchema;

  return deviceInfo;
}

const cycleReg = /cycle_/;
const randomReg = /random_/;
/**
 * 支持的功能
 * @param dpSchema
 */
export const handleSupportFunctions = (devInfo: DevInfo, dpSchema: Record<string, DpSchema>) => {
  const {
    isSupportAstronomical,
    isSupportCountdown,
    isSupportCycle,
    isSupportInching,
    switchCodes,
    isSupportRandom,
    countdownCodes,
    cycleCode,
    randomCode,
    inchingCode,
    channelDps,
  } = config;
  const { devAttribute = 0, panelConfig } = devInfo;
  let newSwitchCodes: string[] = switchCodes;
  let newCountdownCodes: string[] = countdownCodes;

  // 更新开关code
  if (switchCodes.length === 0) {
    newSwitchCodes = channelDps.map((item) => item.code);
  }

  const switchDps: DpSchema[] = [];
  const countdownDps: Array<DpSchema | null> = [];
  // 处理倒计时code
  newSwitchCodes.forEach((code) => {
    if (dpSchema[code]) {
      switchDps.push(dpSchema[code]);
    }
    // 如果没有设置倒计时，则自动获取开关对应的倒计时
    if (newCountdownCodes.length === 0) {
      newCountdownCodes = newSwitchCodes.map((code) => {
        const countdownCode = code.replace(code.indexOf('switch_led') >= 0 ? 'switch_led' : 'switch', 'countdown');
        return dpSchema[countdownCode] ? countdownCode : '';
      });
    }
  });

  newCountdownCodes.forEach((code) => {
    countdownDps.push(dpSchema[code] ? dpSchema[code] : null);
  });

  const newConfig: any = {
    switchCodes: newSwitchCodes,
    countdownCodes: newCountdownCodes,
    switchDps,
    countdownDps,
    channelDps,
  };
  console.log('newConfig, ', newConfig);
  const functions: FunctionData[] = [];
  if (isSupportCountdown === 'y') {
    functions.push({
      key: FuncType.countdown,
      title: Strings.getLang('ret_countdown'),
      subTitle: Strings.getLang('ret_countdown_desc'),
      icon: 'countdown',
    });
  } else {
    newConfig.isSupportCountdown = 'n';
  }
  // 是否支持云定时
  const isSupportNormal = panelConfig?.bic.some((item) => item.code === 'timer' && item.selected);
  console.log('panelConfig', isSupportNormal, panelConfig);
  if (isSupportNormal) {
    newConfig.isSupportNormal = 'y';
    functions.push({
      key: FuncType.normal,
      title: Strings.getLang('ret_schedule'),
      subTitle: Strings.getLang('ret_schedule_desc'),
      icon: 'normal',
    });
  } else {
    newConfig.isSupportNormal = 'n';
  }
  //
  if (isSupportAstronomical !== 'n' && utils.getBitValue(devAttribute, 9) === 1) {
    newConfig.isSupportAstronomical = 'y';
    functions.push({
      key: FuncType.sunrise,
      title: Strings.getLang('ret_sunrise'),
      subTitle: Strings.getLang('ret_sunrise_desc'),
      icon: 'sunrise',
    });
    functions.push({
      key: FuncType.sunset,
      title: Strings.getLang('ret_sunset'),
      subTitle: Strings.getLang('ret_sunset_desc'),
      icon: 'sunset',
    });
  } else {
    newConfig.isSupportAstronomical = 'n';
  }

  if (isSupportCycle !== 'n') {
    let dpCode = cycleCode;
    if (!cycleCode) {
      dpCode = Object.keys(dpSchema).find((x) => cycleReg.test(x));
    }
    if (dpCode && dpSchema[dpCode]) {
      newConfig.isSupportCycle = 'y';
      newConfig.cycleCode = dpCode;
      functions.push({
        key: FuncType.cycle,
        schema: dpSchema[dpCode],
        title: Strings.getDpLang(dpCode),
        subTitle: Strings.getLang('ret_cycle_time_desc'),
        icon: 'cycle',
      });
    } else {
      newConfig.isSupportCycle = 'n';
    }
  }
  if (isSupportRandom !== 'n') {
    let dpCode = randomCode;
    if (!randomCode) {
      dpCode = Object.keys(dpSchema).find((x) => randomReg.test(x));
    }
    if (dpCode && dpSchema[dpCode]) {
      newConfig.isSupportRandom = 'y';
      newConfig.randomCode = dpCode;
      functions.push({
        key: FuncType.random,
        schema: dpSchema[dpCode],
        title: Strings.getDpLang(dpCode),
        subTitle: Strings.getLang('ret_random_time_desc'),
        icon: 'random',
      });
    } else {
      newConfig.isSupportRandom = 'n';
    }
  }
  if (isSupportInching !== 'n') {
    const dpCode = inchingCode || 'switch_inching';
    if (dpSchema[dpCode]) {
      newConfig.isSupportInching = 'y';
      newConfig.inchingCode = dpCode;
      functions.push({
        key: FuncType.inching,
        schema: dpSchema[dpCode],
        title: Strings.getDpLang(dpCode),
        subTitle: Strings.getLang('ret_switch_inching_desc'),
        icon: 'inching',
      });
    } else {
      newConfig.isSupportInching = 'n';
    }
  }

  newConfig.functions = functions;

  setConfig(newConfig);
};

/**
 * 根据24/12小时制格式化时间
 * @param time
 * @returns
 */
export const formatTime = (time: number) => {
  let hours = Math.floor(time / 60);
  const minutes = time % 60;
  if (config.is24Hour) {
    return {
      ampm: '',
      text: `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
    };
  }
  const ampm = hours < 12 ? 'am' : 'pm';
  hours %= 12;
  if (hours === 0) {
    hours = 12;
  }
  return {
    ampm,
    text: `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
  };
};

/**
 * 格式化为24时间格式
 * @param time
 * @returns
 */
export const get24Time = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return [hours, minutes];
};

const weekMap = ['ret_sun', 'ret_mon', 'ret_tues', 'ret_wed', 'ret_thur', 'ret_fri', 'ret_sat'];
export const formatWeeks = (weeks: number[]) => {
  let isOnce = true;
  const keys = [];
  let weekend = 0;
  let workday = 0;
  weeks.forEach((item, i) => {
    if (item === 1) {
      isOnce = false;
      keys.push(weekMap[i]);
      switch (i) {
        case 0:
        case 6:
          // 周末统计
          weekend++;
          break;
        default:
          // 工作日统计
          workday++;
      }
    }
  });
  if (isOnce) {
    // 一次性
    return Strings.getLang('ret_once_time');
  }
  if (weekend === 2 && workday === 0) {
    // 周末
    return Strings.getLang('ret_weekend');
  }
  if (weekend === 0 && workday === 5) {
    // 工作日
    return Strings.getLang('ret_workday');
  }
  if (weekend === 2 && workday === 5) {
    // 每天
    return Strings.getLang('ret_everyday');
  }

  return keys.map((x) => Strings.getLang(x)).join('、');
};

export const formatSwitches = (actions: Action[], dpNames: Record<string, string>) => {
  return config.switchDps.length > 1
    ? actions
        .map((item) => {
          if (config.switchCodes.includes(item.code)) {
            return dpNames[item.code] || Strings.getDpLang(item.code);
          }
          return '';
        })
        .filter((x) => !!x)
    : [];
};

export const formatLabels = (i18n: string, ...args) => {
  const infos = i18n.match(/\{\d+\}/g);
  const labels = i18n.split(/\{\d+\}/g);
  if (infos) {
    for (let i = args.length - 1; i >= 0; i--) {
      const found = infos.indexOf(`{${i}}`);
      if (found >= 0) {
        labels.splice(found + 1, 0, args[i]);
      }
    }
  }
  return labels.filter((x) => !!x);
};

export const checkAddEnabled = (count: number, type: FuncType) => {
  let addEnabled = true;
  let error = '';
  switch (type) {
    case FuncType.normal: {
      // 由于天文定时和云定时共用了定时上限，所以当支持天文定时时，预留 2 个给天文定时
      const max = config.isSupportAstronomical === 'y' ? 28 : 30;
      addEnabled = count < max;
      if (!addEnabled) {
        error = Strings.formatValue('ret_schedule_max', max);
      }
      break;
    }
    case FuncType.cycle: {
      addEnabled = electri.cycle.validateMax();
      if (!addEnabled) {
        error = Strings.formatValue('ret_cycle_max', electri.cycle.getConfig().max);
      }
      break;
    }
    case FuncType.random: {
      addEnabled = electri.random.validateMax();
      if (!addEnabled) {
        error = Strings.formatValue('ret_random_max', electri.random.getConfig().max);
      }
      break;
    }
    case FuncType.inching: {
      addEnabled = electri.inching.validateMax();
      if (!addEnabled) {
        error = Strings.formatValue('ret_inching_max', electri.inching.getConfig().max);
      }
      break;
    }
    case FuncType.sunrise:
    case FuncType.sunset:
      addEnabled = count < 1;
      if (!addEnabled) {
        error = Strings.getLang(FuncType.sunset ? 'ret_sunset_repeat_tips' : 'ret_sunrise_repeat_tips');
      }
      break;
    default:
  }

  if (!addEnabled) {
    DialogInstance.alert({
      title: error,
      confirmButtonText: Strings.getLang('ret_understand'),
    });
  }
  return addEnabled;
};

export const isOnlyOne = (weeks: Array<1 | 0>) => {
  return parseInt(weeks.join(''), 2) === 0;
};

export const getBrandColor = (brand: string) => {
  if (/^[0-9a-fA-F]{0,6}$/.test(brand)) {
    return `#${brand}`;
  }
  return brand;
};

/**
 * 防抖
 * @param func
 * @param time
 * @returns
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, time = 700): T => {
  let prevTime = +new Date();
  // @ts-expect-error
  return (...args) => {
    const now = +new Date();
    if (now - prevTime >= time) {
      prevTime = now;
      func(...args);
    } else {
      prevTime = now;
    }
  };
};

/**
 * 删除 dp 定时
 * @param id
 * @param timers
 * @returns
 */
export const removeTimer = async <T extends BaseDpData>(
  id: number,
  timers: T[],
  updateHandler: (data: T, op: { useDefaultModal: boolean }) => any,
  remove: (id: number) => any,
) => {
  // 如果当前只有一个显示的dp
  if (config.switchDps.length === 1) {
    // 多路情况，但只显示操作某一个开关
    if (config.channelDps.length > 1) {
      const found = timers.find((item) => item.id === +id);
      if (found) {
        // 去掉选择的开关
        const actions = found.actions.filter((item) => item.code !== config.switchDps[0].code);
        if (actions.length > 0) {
          // 还有数据，则为更新操作
          await updateHandler({ ...found, actions }, { useDefaultModal: true });
          return;
        }
      }
    }
  }

  // 单路情况，直接删除
  await remove(+id);
};
