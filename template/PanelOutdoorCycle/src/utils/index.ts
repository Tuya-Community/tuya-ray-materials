import { utils } from '@ray-js/panel-sdk';
import Res from '@/res';
import Strings from '@/i18n';

const { scaleNumber } = utils;

export const toSvgCssBackground = (svgString: string) => {
  let res = svgString;
  res = svgString
    .replace(
      '<svg',
      ~svgString.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'
    )
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')

    .replace(/\s+/g, ' ');
  return {
    backgroundImage: `url("data:image/svg+xml,${res}")`,
    width: '16px',
    height: '16px',
    backgroundRepeat: 'no-repeat',
  };
};

// KM - Mile 转换
export const scaleMileageValue = (
  dpCode: string,
  dpValue: number,
  dpSchema: Record<string, any>,
  isMile = false
) => {
  const dpCodeSchema = dpSchema[dpCode];
  const { scale } = dpCodeSchema?.property;
  const scaleValue = scaleNumber(scale, dpValue);
  let newValue = +scaleValue;
  if (isMile) {
    /* newValue = Math.round(+scaleValue) * 0.621371; */
    newValue *= 0.621371;
  }
  return +newValue.toFixed(1);
};

// 检查DP是否存在
export const isDpExist = (dpCode: string, dpSchema: Record<string, any>) => {
  if (!dpSchema) {
    return false;
  }
  return typeof dpSchema[dpCode] !== 'undefined' && dpSchema[dpCode] !== null;
};

// 电池图标
export const getBatInfo = (num, theme) => {
  const batInfo = {
    icon: Res.batNull,
    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#c6c6c6', // 进度条颜色
  };
  const batLightIcons = [
    Res.batHighLight,
    Res.batMiddle2Light,
    Res.batMiddleLight,
    Res.batLowLight,
  ];
  const batDarkIcons = [Res.batHigh, Res.batMiddle2, Res.batMiddle, Res.batLow];

  if (num > 0) {
    const idx = num > 80 ? 0 : num > 50 ? 1 : num > 20 ? 2 : 3;
    batInfo.color = num > 30 ? '#36D100' : num > 20 ? '#EFD700' : '#FF1818'; // 进度条颜色
    batInfo.icon = theme === 'dark' ? batDarkIcons[idx] : batLightIcons[idx];
  }
  return batInfo;
};

// 信号图标
export const getWifiIcon = (signal: number, theme: 'dark' | 'light') => {
  const signalIcons = {
    cut: Res.wifi4,
    bad: Res.wifi4,
    general: Res.wifi3,
    good: Res.wifi2,
    great: Res.wifi1,
  };
  const signalIconsLight = {
    cut: Res.wifi4Light,
    bad: Res.wifi4Light,
    general: Res.wifi3Light,
    good: Res.wifi2Light,
    great: Res.wifi1Light,
  };
  return theme === 'dark' ? signalIcons[signal] : signalIconsLight[signal];
};

// GPS图标
export const getGpsIcon = (gpsNum: number, theme: 'dark' | 'light', max: number, min: number) => {
  let defaultIcon = theme === 'dark' ? Res.gpsOff : Res.gpsOffLight;
  if (typeof gpsNum !== 'number' || gpsNum === 0) {
    return defaultIcon;
  }
  const darkRanges = [Res.gps4, Res.gps3, Res.gps2, Res.gps1, Res.gps1];
  const lightRanges = [Res.gps4Light, Res.gps3Light, Res.gps2Light, Res.gps1Light, Res.gps1Light];
  const portionSize = (max - min) / 4;
  const index = Math.floor((gpsNum - min) / portionSize);
  defaultIcon = theme === 'dark' ? darkRanges[index] : lightRanges[index];
  return defaultIcon;
};

export const addZero = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

// 骑行时间
export const getCyclingTime = (time: number) => {
  const hour = Math.floor(time / 3600);
  const minute = Math.floor((time % 3600) / 60);
  const second = Math.floor(time % 60);
  return `${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
};

// 车辆控制时检查权限
export const checkPermissions = (params: ICheckPermissionParams) => {
  const { dpSchema, dpCode, inService, isPidHadVAS, isBleOnline, cancelCb, successCb } = params;
  const { extContent } = dpSchema[dpCode];
  const isExtNull = extContent === '' || extContent === undefined;
  const route = isExtNull ? 0 : JSON.parse(extContent).route;
  // 若智能服务已到期/未配置赠送用户未购买时，当用户通过蜂窝通道控制车辆时
  if (!inService && isPidHadVAS && (route === 0 || (route === 1 && !isBleOnline) || isExtNull)) {
    ty.showModal({
      title: '',
      content: Strings.getLang('expireControl'),
      showCancel: false,
      confirmText: Strings.getLang('confirm'),
      success: ({ confirm }) => {
        if (confirm && dpCode === 'blelock_switch') {
          cancelCb();
        }
      },
    });
    return;
  }
  successCb();
};
