import { navigateToMiniProgram, publishDps, getSystemInfoSync } from '@ray-js/ray';
import { miniIdLabs } from '@/config/cameraData';
import { devices } from '@/devices';
import store from '@/redux';
import Global from '@/config/global';
import Strings from '@/i18n';
import { PanelInfoKey } from '@/redux/modules/panelInfoSlice';
import { updatePanelInfo } from '@/redux/modules/panelInfoSlice';

const { windowHeight, platform, deviceType, windowWidth } = getSystemInfoSync();
export const isIOS = platform === 'ios';

export const isPad = deviceType === 'pad';

export const isIphoneX = isIOS && windowHeight >= 812;

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

export function getWindowInfo() {
  return {
    windowWidth,
    windowHeight,
  };
}

const designScreenWidth = 375;
export function toPx(value: number, decimal = 0): number {
  const computedValue = (value * windowWidth) / designScreenWidth;
  return Number(computedValue.toFixed(decimal));
}

/**
 * 录制中，先关掉录制再进行下一步操作
 * @param show 是否显示录制提示
 */
export const isRecordingFun = (show = true) => {
  // const { isRecording } = store.getState().ipcCommon;
  // if (isRecording && show) showToast('live_page_is_recording_tip', 'none');
  return false;
};

/**
 * 对讲中，先关掉对讲再进行下一步操作
 * @param show 是否显示对讲提示
 */
export const isTwoTalkFun = (show = true) => {
  // const { isTwoTalking } = store.getState().ipcCommon;
  // if (isTwoTalking && show) showToast('live_page_is_talking_tip', 'none');
  return false;
};

/**
 * 拦截操作
 */
export const holdUp = () => {
  return isRecordingFun() || isTwoTalkFun();
};

/**
 * 拦截操作
 */

export const openMiniPanelByCode = (code = 'setting', position = 'right'): void => {
  const devInfo = devices.common.getDevInfo();
  console.log(devInfo, 'devInfo');
  const shortLinkUrl = getShortLinkUrl(code, devInfo?.devId);
  console.log(shortLinkUrl, 'shortLinkUrl');
  navigateToMiniProgram({
    shortLink: shortLinkUrl,
    position: position || 'right',
    success: res => {
      console.log('navigateToMiniProgram success', res);
    },
    fail: err => {
      console.log('navigateToMiniProgram fail', err);
    },
  });
};

const getShortLinkUrl = (code: string, deviceId: string): string => {
  switch (code) {
    case 'setting':
      return `godzilla://${miniIdLabs.deviceSettings}/__functional__/${miniIdLabs.deviceSettings}/pages/detail/index?deviceId=${deviceId}&customType=ipc`;
    case 'vas':
      return `godzilla://${miniIdLabs.deviceSettings}/__functional__/${miniIdLabs.deviceSettings}/pages/detail/index?deviceId=${deviceId}&customType=ipc`;
    default:
      return '';
  }
};

/**
 *
 * 更新redux panelInfo对应code的值
 */

export const changePanelInfoState = (code: PanelInfoKey, value): void => {
  const { dispatch } = store;
  dispatch(
    updatePanelInfo({
      [code]: value,
    })
  );
};

/**
 *  检查当前下发DP是否与当前值一样
 */

export const isEqualCurrentValue = (curValue, sendValue) => {
  if (curValue === sendValue) {
    ty.showToast({
      icon: 'none',
      title: Strings.getLang('isEqualWithCurrentValue'),
    });
    return true;
  }

  return false;
};

/**
 *  DP下发请求超时通用处理
 */

export const publishDpOutTime = (dpCode, value, time?: number): void => {
  const timeOutTime = time ?? 10000;
  ty.showLoading({
    title: '',
  });
  console.log(`下发数据, ${dpCode}: ${value}`);
  publishDps({ [dpCode]: value });
  Global.requestTimeOut = setTimeout(() => {
    ty.hideLoading();
    ty.showToast({
      icon: 'error',
      title: I18n.t('commonDpPublishTimeout'),
    });
  }, timeOutTime);
};

/**
 *  点击超时通用处理，无需下发DP型
 */

export const clickOutTime = (time?: number): void => {
  const timeOutTime = time ?? 10000;
  ty.showLoading({
    title: '',
  });
  Global.requestTimeOut = setTimeout(() => {
    ty.hideLoading();
    ty.showToast({
      icon: 'error',
      title: I18n.t('commonDpPublishTimeout'),
    });
  }, timeOutTime);
};

/**
 *  清除DP下发请求超时
 */

export const clearPublishDpOutTime = (timeOutTime = 10000): void => {
  console.log('清除动画-----------');
  ty.hideLoading();
  Global.requestTimeOut && clearTimeout(Global.requestTimeOut);
};

/**
 *  根据schema, 获取对应ID的DpCode
 */

export const getDpCodeByDpId = (dpId: number): string => {
  const dpSchema = devices.common.getDpSchema();
  const arrayFromValues = Object.values(dpSchema);
  // 将schema中value转为对象数组
  const targetSchema = arrayFromValues.find(item => item.id === dpId);
  return targetSchema?.code;
};

/**
 *  根据schema, 获取对应DP是否存在
 */

export const getDpCodeIsExist = (dpCode: string): boolean => {
  const dpSchema = devices.common.getDpSchema();
  const arrayFromKeys = Object.keys(dpSchema);
  return arrayFromKeys.includes(dpCode);
};

/**
 *  根据schema, 获取对应DPCode的值
 */

export const getDpValueByDevices = (dpCode: string) => {
  const { props } = devices.common.model;
  return props[dpCode];
};

/**
 *  获取枚举型dpSchema，组成ActionSheet数据
 */

export const getTargetEnumDpActionSheetData = (dpCode: string) => {
  const dpSchema = devices.common.getDpSchema();
  const { props } = devices.common.model;
  const arrayFromValues = Object.values(dpSchema);
  console.log(arrayFromValues, 'arrayFromValues');
  // 将schema中value转为对象数组
  const targetSchema = arrayFromValues.find(item => item.code === dpCode);
  console.log(targetSchema, 'targetSchema');
  if (targetSchema?.property?.type === 'enum') {
    const { range } = targetSchema.property;
    const actionData = range.map(item => ({
      id: item,
      name: Strings.getLang(`dp_${dpCode}_${item}`),
      checked: props[dpCode] === item,
      dpCode,
      type: 'dp',
    }));
    return actionData;
  }
  return [];
};

/**
 * 获取设备ID
 * getDevId
 * @returns string 设备id
 */
export const getDevId = () => {
  const devInfo = devices.common.getDevInfo();
  return devInfo.devId;
};

/**
 * 通用的显示提示函数
 * @param result: {code: number, msg: string}
 */

export const showToastError = result => {
  if (result?.code !== 0) {
    ty.showToast({ icon: 'error', title: JSON.stringify(result?.msg) });
  }
};
/**
 * 通用toast文案提示
 *
 */
export const showToast = (title, icon = 'none') => {
  ty.showToast({ icon, title });
};

/**
 * 根据DpCode获取枚举型DP的range是否包含对应项
 * @param result: {code: number, msg: string}
 */

export const getEnumRangeIsValid = (dpCode: string, rangValue: string) => {
  const dpSchema = devices.common.getDpSchema();
  const { props } = devices.common.model;
  const arrayFromValues = Object.values(dpSchema);
  // 将schema中value转为对象数组
  const targetSchema = arrayFromValues.find(item => item.code === dpCode);
  if (targetSchema?.property?.type === 'enum') {
    const { range } = targetSchema.property;
    console.log(range, 'range');
    console.log(rangValue, 'rangValue');
    return range.includes(rangValue);
  }
  return false;
};

/**
 * 根据DpCode获取枚举型DP的range数据
 * @param result: any[]
 */

export const getEnumRangeData = (dpCode: string) => {
  const dpSchema = devices.common.getDpSchema();
  const arrayFromValues = Object.values(dpSchema);
  // 将schema中value转为对象数组
  const targetSchema = arrayFromValues.find(item => item.code === dpCode);
  if (targetSchema?.property?.type === 'enum') {
    const { range } = targetSchema.property;
    return range;
  }
  return [];
};

/**
 * 获取设备品类是否为对应值
 * 可移动摄像机 mobilecam
 */
export const getDevCategory = (targetCategory): boolean => {
  const { category } = devices.common.getDevInfo();
  return category === targetCategory;
};

export * from './downloadImage';

export const rgbaToHex = (rgba: string) => {
  // 如果输入是以 # 开头的 16 进制颜色，直接返回
  if (typeof rgba === 'string' && rgba.startsWith('#')) {
    return rgba.length === 7 ? rgba : rgba.slice(0, 7); // 确保是 6 位，不带透明度
  }

  // 校验 rgba 的类型是否是一个数组或字符串，并且长度是否为 4
  if (!Array.isArray(rgba) && typeof rgba !== 'string') {
    return undefined;
  }

  let rgbaArray = [];

  // 如果是字符串形式的 rgba (例如 "rgba(255, 0, 0, 0.5)")
  if (typeof rgba === 'string') {
    const matches = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)/);
    if (!matches) {
      return undefined;
    }
    rgbaArray = [
      parseInt(matches[1], 10),
      parseInt(matches[2], 10),
      parseInt(matches[3], 10),
      parseFloat(matches[4]),
    ];
  } else {
    // 如果是数组形式的 rgba
    if (rgba.length !== 4 || !rgba.every(v => typeof v === 'number')) {
      return undefined;
    }
    rgbaArray = rgba;
  }

  const [r, g, b, a] = rgbaArray;

  // 校验 rgba 中的值是否在有效范围内
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
    return undefined;
  }

  // 计算透明度调整后的颜色
  const adjustedR = Math.round(r * a + (1 - a) * 255);
  const adjustedG = Math.round(g * a + (1 - a) * 255);
  const adjustedB = Math.round(b * a + (1 - a) * 255);

  // 将 RGBA 转换为 HEX 格式（只保留 RGB）
  const hex =
    '#' +
    adjustedR.toString(16).padStart(2, '0') +
    adjustedG.toString(16).padStart(2, '0') +
    adjustedB.toString(16).padStart(2, '0');

  return hex;
};

export * from './getThemeInfo';
