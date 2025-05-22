import store from '@/redux';
import { getDevInfo, setDeviceProperty } from '@ray-js/ray';
import { usePanelConfig } from '@ray-js/panel-sdk';
import { themeColor } from '@/constant';
import mitt from 'mitt';
import { decode } from 'js-base64';
import { requestCloud } from '@ray-js/api';

export const emitter = mitt();

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

/**
 * 获取页面可用高度，单位 px
 */
export const getWrapperHeight = (topBarHeight = 44) => {
  const {
    statusBarHeight,
    screenHeight,
    useableWindowHeight = screenHeight,
  } = store.getState().systemInfo;

  return useableWindowHeight - statusBarHeight - topBarHeight;
};

/**
 * 获取 devId
 */
export const getDevId = () => getDevInfo().devId;

/**
 * 获取主题色
 */
export const getTheme = () => {
  return usePanelConfig()?.fun?.tyabis5d9w || '#408CFF';
};

// 十六进制颜色值转 RGB 值
const hexToRGB = hex => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
};

// 将 RGB 数组转换为十六进制颜色值
const rgbToHex = (r, g, b) => {
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`;
};
// 生成左右相邻渐变色
export const generateAdjacentGradients = (hex, num = 3) => {
  const [r, g, b] = hexToRGB(hex);
  const step = 20;

  const newLR = Math.min(255, Math.max(0, r - num * step));
  const newLG = Math.min(255, Math.max(0, g - num * step));
  const newLB = Math.min(255, Math.max(0, b - num * step));

  const newRR = Math.min(255, Math.max(0, r + num * step));
  const newRG = Math.min(255, Math.max(0, g + num * step));
  const newRB = Math.min(255, Math.max(0, b + num * step));

  return {
    left: rgbToHex(newLR, newLG, newLB),
    right: rgbToHex(newRR, newRG, newRB),
  };
};

// 通过设备信息通用接口储存用户信息，清楚设备后数据自动清零
export const setDevProperty = (code: string, value: any) => {
  const devId = getDevId();

  const jsonString = typeof value === 'object' ? JSON.stringify(value) : value;
  return new Promise((resolve, reject) => {
    try {
      setDeviceProperty({
        deviceId: devId,
        code,
        value: jsonString,
        success: res => {
          resolve(res);
          console.log('setDevProperty---success', res, jsonString);
        },
        fail: e => {
          reject(e);
          console.log('setDevProperty---fail', e);
        },
      });
    } catch (e) {
      console.log('setDevProperty---catch', e);

      reject(e);
    }
  });
};

// 兼容ios errorMessage异常，等待iOS修复后移除这个兼容
export const iOSExtractErrorMessage = errorString => {
  const codeIndex = errorString?.indexOf('Code=');
  if (codeIndex === -1) return null;

  const firstQuote = errorString?.indexOf('"', codeIndex);
  const secondQuote = errorString?.indexOf('"', firstQuote + 1);

  if (firstQuote === -1 || secondQuote === -1) return null;

  return errorString?.slice(firstQuote + 1, secondQuote);
};

export const CLONE_ZH_TIP =
  '小鸟叽叽喳喳地唱着动听的歌，五颜六色的花朵随风舞动，像是在跟我打招呼，真是太美妙啦！';
export const CLONE_EN_TIP =
  "Walk with me where sunlight dances through whispering trees. Discover butterflies among wild roses, hear laughter carried by the warm wind. These moments remind us how life's simplest paths often lead to the most beautiful destinations when we journey with open hearts.";

export const removeSpecialChars = str => {
  // 兼容性更强的正则表达式，支持中文，字母、数字、下划线
  // 增加 Unicode 范围，支持常见的拉丁字母变体和中文字符
  return str.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF\u4E00-\u9FFF]+/g, '');
};

export const getAnonymityNameStr = () => {
  return decode('dHV5YQ==');
};

/**
 * 获取高级能力
 * @param bizId 单设备/群组id
 * @param bizType 0-单设备/1-群组
 * @param abilityCodes  高级能力code列表(多个以英文逗号隔开)
 * @returns
 */
export const getHighPower = (bizId: string, bizType: 0 | 1, abilityCodes: string) => {
  return new Promise((resolve, reject) => {
    requestCloud({
      api: `${getAnonymityNameStr()}.m.light.high.power.get`,
      version: '1.2',
      data: { bizId, bizType, abilityCodes },
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};
