import { utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import _intersection from 'lodash/intersection';
import dpCodes from '@/constant/dpCodes';
import {
  wifi1,
  wifi2,
  wifi3,
  wifi4,
  wifi5,
  gps1,
  gps2,
  gps3,
  gps4,
  wifi5Light,
  wifi4Light,
  wifi3Light,
  wifi2Light,
  wifi1Light,
  gps4Light,
  gps3Light,
  gps2Light,
  gps1Light,
  gpsOff,
  gpsOffLight,
  batHigh,
  batHighLight,
  batLow,
  batLowLight,
  batMiddle2,
  batMiddle,
  batMiddle2Light,
  batMiddleLight,
  batNull,
} from '@/res';

const { scaleNumber } = utils;

// 更多解锁方式的判断dp集合
export const moreUnlockDPs = [
  dpCodes.autoUnlock,
  dpCodes.autoUnlockPair,
  dpCodes.inductionBroadcast,
  dpCodes.nfcIdInput,
  dpCodes.nfcIdDelete,
  dpCodes.nfcIdSync,
  dpCodes.nfcIdReset,
  dpCodes.passwordCreat,
  dpCodes.passwordDelete,
  dpCodes.passwordSync,
];

// 是否存在包含关系
export const hasCommonDps = (dpSchemas: any, dps) => {
  return _intersection(dpSchemas, dps).length > 0;
};

// 判断是否展示灯以及是否是有headlight_switch dp;
const lightDPs = [
  dpCodes.headlightSwitch,
  dpCodes.autoLightSwitch,
  dpCodes.taillightSwitch,
  dpCodes.switchLed,
];
export const lightCheckShow = (dpSchemas: any) => {
  const dpKeys = Object.keys(dpSchemas);
  const result = _intersection(dpKeys, lightDPs);
  const onlyHeadingLight = result.indexOf(dpCodes.headlightSwitch) > -1 && result.length === 1;
  const isShow = result.length > 0;
  return { isShow, onlyHeadingLight };
};

export const JsonUtil = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },
};

// 判断dpCodes是否支持
export const supportDp = (dpCode, dpSchema) => {
  if (Array.isArray(dpSchema)) {
    return (
      dpSchema.findIndex(
        item => (item === null || item === undefined ? undefined : item.code) === dpCode
      ) > -1
    );
  }
  const dp = dpSchema[dpCode];
  return dp !== undefined;
};

// wifi信号图标
export const getWifiIcon = (signal, theme, min, max, isOffline) => {
  let icon = wifi1;
  const signalIcons = {
    cut: wifi5,
    bad: wifi4,
    general: wifi3,
    good: wifi2,
    great: wifi1,
  };
  const signalIconsLight = {
    cut: wifi5Light,
    bad: wifi4Light,
    general: wifi3Light,
    good: wifi2Light,
    great: wifi1Light,
  };
  if (isOffline) {
    return theme === 'dark' ? wifi5 : wifi5Light;
  }

  if (typeof signal === 'number') {
    const darkRanges = [wifi5, wifi4, wifi3, wifi2, wifi1];
    const lightRanges = [wifi5Light, wifi4Light, wifi3Light, wifi2Light, wifi1Light];
    const portionSize = (max - min) / 4;
    const index = Math.floor((signal - min) / portionSize);
    icon = theme === 'dark' ? darkRanges[index] : lightRanges[index];
  } else {
    icon = theme === 'dark' ? signalIcons[signal] : signalIconsLight[signal];
  }
  return icon;
};

// gps信号图标
export const getGpsIcon = (gpsNum, theme, max, min) => {
  let defaultIcon = theme === 'dark' ? gpsOff : gpsOffLight;
  if (typeof gpsNum !== 'number' || gpsNum === 0) {
    return defaultIcon;
  }
  const darkRanges = [gps4, gps3, gps2, gps1, gps1];
  const lightRanges = [gps4Light, gps3Light, gps2Light, gps1Light, gps1Light];
  const portionSize = (max - min) / 4;
  const index = Math.floor((gpsNum - min) / portionSize);
  console.log('信号值 :>> ', gpsNum, max, min, index);
  defaultIcon = theme === 'dark' ? darkRanges[index] : lightRanges[index];
  return defaultIcon;
};

// 获取电池信息
export const getBatInfo = (num: number, theme: string) => {
  const batInfo = {
    icon: batNull,
    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#c6c6c6', // 进度条颜色
  };
  const batLightIcons = [batHighLight, batMiddle2Light, batMiddleLight, batLowLight];
  const batDarkIcons = [batHigh, batMiddle2, batMiddle, batLow];

  if (num > 0) {
    const idx = num > 80 ? 0 : num > 50 ? 1 : num > 20 ? 2 : 3;
    batInfo.color = num > 30 ? '#36D100' : num > 20 ? '#EFD700' : '#FF1818'; // 进度条颜色
    batInfo.icon = theme === 'dark' ? batDarkIcons[idx] : batLightIcons[idx];
  }
  return batInfo;
};

// 获取设备能力
export const getDeviceType = (capability: number) => {
  const result = Math.log2(capability);
  return result;
};

// 获取里程速度文本
export const getMileSpeedText = (val: string, unit = 'km') => {
  if (val === 'no_limit') return 'no_limit';
  const match = val.match(/\d+/);
  const mileValue = (+match[0] * 0.621371).toFixed(1);
  const newValue = unit === 'km' ? val : `${mileValue}${Strings.getLang('mph')}`;
  return newValue;
};

// DP倍数转化
export const scaleDpValue = (dpCode: string, dpValue, dpSchema: any, isMile = false) => {
  const dpCodeSchema = dpSchema[dpCode];
  const { scale, type } = dpCodeSchema?.property;
  const scaleValue = scaleNumber(scale, dpValue);
  let newValue = +scaleValue;
  if (isMile) {
    newValue = Math.round(+scaleValue) * 0.621371;
  }
  return +newValue.toFixed(1);
};
