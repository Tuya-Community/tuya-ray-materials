import { kit, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import store from '@/redux';
import { DpStateKey } from '@/redux/modules/dpStateSlice';
import dayjs from 'dayjs';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import { router } from '@ray-js/ray';

const { getDevInfo } = kit;

export const getFaultStrings = (
  faultCode: string,
  faultValue: number,
  onlyPrior = true
): string => {
  const { devInfo } = store.getState();
  if (!faultValue) return '';
  const { label } = devInfo.schema[faultCode];
  const labels = [];
  for (let i = 0; i < label!.length; i++) {
    const value = label![i];
    const isExist = utils.getBitValue(faultValue, i);
    if (isExist) {
      labels.push(Strings.getDpLang(faultCode, value));
      if (onlyPrior) break;
    }
  }
  return onlyPrior ? labels[0] : labels.join(', ');
};

export const formatDps = ({ dps }: any) => {
  const dpState = {};
  Object.entries(dps).forEach(([dpId, dpValue]) => {
    const dpCode = getDpCodeById(dpId);
    dpState[dpCode] = dpValue;
  });
  return dpState;
};

export const formatDevSchema = devInfo => {
  const { dps, schema } = devInfo;
  const resultSchema = {};
  const resultState = {};
  const dpIdCodeMap = {};
  const dpCodeIdMap = {};

  for (let i = 0; i < schema.length; i++) {
    const { code, id, property, type } = schema[i];
    const define = {
      dptype: type,
      id: `${id}`,
      ...property,
    };

    dpIdCodeMap[id] = code;
    dpCodeIdMap[code] = id;
    resultState[code] = dps[id];
    resultSchema[code] = define;
    delete define.property;
  }
  return { ...devInfo, dpIdCodeMap, dpCodeIdMap, state: resultState, schema: resultSchema };
};

/**
 * dp相关方法
 */

/**
 * 获取devId
 */
export const getDevId = () => getDevInfo().devId;

/**
 * 获取productId
 */
export const getProductId = () => getDevInfo().productId;

/**
 * 获取dpschema
 */
export const getDpSchema = (dpCode: DpStateKey) => store.getState().devInfo.schema[dpCode] ?? {};

/**
 * dp是否存在
 */
export const checkDpExist = (dpCode: DpStateKey) => {
  // if (['fan_vertical', 'fan_horizontal'].includes(dpCode)) return false;
  return dpCode in store.getState().devInfo.schema;
};

/**
 * 根据dpId获取dpCode
 */
export const getDpCodeById = (dpId: number | string) => store.getState().devInfo.dpIdCodeMap[dpId];

/**
 * 根据dpCode获取dpId
 */
export const getDpIdByCode = (dpCode: DpStateKey) => store.getState().devInfo.dpCodeIdMap[dpCode];
/**
 * 获取自定义dpCodes
 * 依赖于state.devInfo.dpCodeIdMap
 */
export const getCustomDpCodes = () => {
  const { dpCodeIdMap } = store.getState().devInfo;
  return Object.keys(dpCodeIdMap).filter(dpCode => dpCodeIdMap[dpCode] >= 100);
};

/**
 * 数值型dp值转真实值
 * @param code dp code
 * @param value 值
 */
export const convertDpToValue = (code: DpStateKey, value: number) => {
  const { scale = 0, min = 0, max = 100 } = getDpSchema(code);
  const temp = Math.min(max, Math.max(min, value));
  const divide = 10 ** scale;
  return temp / divide;
};

/**
 * 数值型真实值转dp值
 * @param code dp code
 * @param value 值
 */
export const convertValueToDp = (code: DpStateKey, value: number) => {
  const { scale = 0 } = getDpSchema(code);
  const divide = 10 ** scale;
  return value * divide;
};

/**
 * 温度相关处理方法
 */

/**
 * 摄氏度转华氏度
 */
export const celsiusToFahrenheit = (value: number, scale = 0) => {
  const fahrenheit = value * 1.8 + 32;
  return fahrenheit.toFixed(scale);
};

/**
 * 华氏度转摄氏度
 */
export const fahrenheitToCelsius = (value: number, scale = 0) => {
  const celsius = (value - 32) / 1.8;
  return celsius.toFixed(scale);
};

// 十六进制转rgba
export const hexToRgba = (sourceColor: string, opacity: number) => {
  let sColor = sourceColor.toLowerCase();
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 处理六位的颜色值
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`, 16));
    }
    return `rgba(${sColorChange.join(',')},${opacity})`;
  }
  return sColor;
};

/**
 * 计算亮度百分比
 */
export const getPercentageByMinAndMax = (
  value: number,
  { min = 10, max = 1000, minPercent = 1 } = {}
) => {
  return Math.round(((100 - minPercent) * (value - min)) / (max - min) + minPercent);
};

/**
 * 毫秒转换为时分秒
 */
export function convertMilliseconds(ms) {
  // 1秒 = 1000毫秒
  const seconds = Math.floor(ms / 1000);
  // 1分钟 = 60秒
  const minutes = Math.floor(seconds / 60);
  // 1小时 = 60分钟
  const hours = Math.floor(minutes / 60);

  // 计算剩余的秒和分钟
  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;

  return {
    hours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
}

/**
 * 毫秒转换为时:分:秒
 */
export function convertMillisecondsToTime(ms: number) {
  // 1秒 = 1000毫秒
  const seconds = Math.floor(ms / 1000);
  // 1分钟 = 60秒
  const minutes = Math.floor(seconds / 60);
  // 1小时 = 60分钟
  const hours = Math.floor(minutes / 60);

  // 计算剩余的秒和分钟
  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  // 将小时、分钟和秒数格式化为两位数
  const formattedHours = String(remainingHours).padStart(2, '0');
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * 秒转换为时:分:秒
 */
export function convertSecondsToTime(seconds: number) {
  // 1分钟 = 60秒
  const minutes = Math.floor(seconds / 60);
  // 1小时 = 60分钟
  const hours = Math.floor(minutes / 60);

  // 计算剩余的秒和分钟
  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  // 将小时、分钟和秒数格式化为两位数
  const formattedHours = String(remainingHours).padStart(2, '0');
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * 秒转换为时:分秒
 */
export function convertSecondsToTimeByLang(seconds: number) {
  // 1分钟 = 60秒
  const minutes = Math.floor(seconds / 60);
  // 1小时 = 60分钟
  const hours = Math.floor(minutes / 60);

  // 计算剩余的秒和分钟
  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  const formattedHours = `${remainingHours}${Strings.getLang('hour_abbr')}`;
  const formattedMinutes = `${remainingMinutes}${Strings.getLang('minute_abbr')}`;
  const formattedSeconds = `${remainingSeconds}${Strings.getLang('second_abbr')}`;

  let str = '';
  if (remainingHours) str += formattedHours;
  if (remainingMinutes) str += formattedMinutes;
  if (remainingSeconds) str += formattedSeconds;
  return str;
}

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

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const matchLanguageWithRegex = (inputLang, langList) => {
  // 构造正则表达式，忽略大小写，将分隔符处理为可选的[-_]
  const regexPattern = langList
    .map(lang => {
      return lang
        .split(/[-_]/) // 按分隔符拆分
        .map(part => part) // 遍历每部分
        .join('[-_]?');
    }) // 用[-_]?重新连接表示分隔符可选
    .join('|'); // 用 | 拼接语言项

  const regex = new RegExp(`^(${regexPattern})$`, 'i'); // 构造正则，忽略大小写

  // 直接匹配输入语言
  const match = inputLang.match(regex);

  return match ? match[0] : null; // 返回匹配的语言，或 null
};

/**
 * 解析任意长度的字符串
 * @param sourceData - 要解析的字符串
 * @returns 解析后的字符串数组
 */
export const parseSourceData = (sourceData: string): string[] => {
  const result: string[] = [];
  while (sourceData.length > 0) {
    const lengthHex = sourceData.slice(4, 8);
    const length = parseInt(lengthHex, 16) + 8;
    const segment = sourceData.slice(0, length);
    result.push(segment);
    sourceData = sourceData.slice(length);
  }

  return result;
};

/**
 * @method getFileSize 根据16进制数据 获取文件大小，kb
 * @param {string} 16进制的文件大小数据
 */
export const getFileSize = (size16: string): string => {
  return `${parseInt(size16, 16)}KB`;
};

/**
 * transStrToUnicode 转化字符串为Unicode编码
 * @param str - 要转化的字符串
 * @returns string
 */
export const transStrToUnicode = (str: string): string => {
  const result: string[] = [];
  for (let i = 0; i < str.length; i += 4) {
    result.push(str.slice(i, i + 4));
  }
  return `\\u${result.join('\\u')}`;
};

/**
 * 将Unicode编码转换为中文字符
 * @param unicodeStr - Unicode编码字符串，例如 "4eca5929"
 * @returns 转换后的中文字符串
 */
export const convertUnicodeToChinese = (unicodeStr: string): string => {
  const unicodes = transStrToUnicode(unicodeStr);
  return unicodes.replace(/\\u[\dA-F]{4}/gi, match => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
};

/**
 * @method getFileType 转换文件类型
 * @param {string} 00 电话录音，01 会议录音
 */
export const getFileType = (type: string): string => {
  const recordType: 0 | 1 = parseInt(type, 10) as 0 | 1;
  return Strings.getLang(`record_type_${recordType}`);
};

export const checkOnlineHandle = (onlineType, index) => {
  const num2 = onlineType.toString(2);
  return !!num2[index];
};

export const backToHome = async (fromType = '', changeTab = true) => {
  // 入门版耳机，由app直接跳转进入的情况
  if (fromType === 'app') {
    console.log('fromType === app');
    changeTab && (await store.dispatch(updateUiState({ currTab: 'history' })));
    router.replace('/'); // 返回首页
  } else {
    changeTab && (await store.dispatch(updateUiState({ currTab: 'history' })));
    router.back();
  }
};
