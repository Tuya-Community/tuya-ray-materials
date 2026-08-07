import { utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import store from '@/redux';
import { DpStateKey } from '@/redux/modules/dpStateSlice';
import dayjs from 'dayjs';
import { atopCheckBalance } from '@/api/shop';
import { updateDevsSync } from '@/redux/modules/deviceListSlice';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import {
  router,
  setStorageSync,
  getStorageSync,
  device,
  showToast,
  setNavigationBarBack,
  showModal,
} from '@ray-js/ray';
import { RecordMode, AudioSource, BenefitScope, BenefitType, BusinessType } from '@/constant/enums';
import { RecordStatus, RecordType } from '@/redux/modules/audioFileSlice';
import { DEVTYPES } from '@/constant/enums';

const { getDeviceOnlineType } = device;

const getDevInfo = () => {
  return store.getState()?.devInfo;
};

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

const getDpCodeByIdFromSchema = (schema: any, dpId: number | string) => {
  if (!schema) return undefined;
  const normalizedDpId = `${dpId}`;

  if (Array.isArray(schema)) {
    return schema.find(item => `${item?.id}` === normalizedDpId)?.code;
  }

  const schemaEntry = Object.entries(schema).find(([, define]: [string, any]) => {
    return `${define?.id}` === normalizedDpId;
  });
  return schemaEntry?.[0];
};

export const getDpCodeByIdFromDevice = (dpId: number | string, deviceId?: string) => {
  const { devInfo, deviceList } = store.getState();

  // DP 上报可能来自非当前选中设备，例如当前选中手机但卡片上报录音状态。
  // 优先用上报设备自己的 schema 做 id -> code 映射，避免写入 { undefined: value }。
  if (deviceId) {
    if (devInfo?.devId === deviceId) {
      const currentDpCode = devInfo?.dpIdCodeMap?.[dpId];
      if (currentDpCode) return currentDpCode;
    }

    const targetDevice = deviceList?.find(item => item?.devId === deviceId);
    const targetDpCode =
      targetDevice?.dpIdCodeMap?.[dpId] || getDpCodeByIdFromSchema(targetDevice?.schema, dpId);
    if (targetDpCode) return targetDpCode;
  }

  return devInfo?.dpIdCodeMap?.[dpId] || getDpCodeByIdFromSchema(devInfo?.schema, dpId);
};

export const formatDps = ({ dps, deviceId }: any) => {
  const dpState = {};
  Object.entries(dps).forEach(([dpId, dpValue]) => {
    const dpCode = getDpCodeByIdFromDevice(dpId, deviceId);
    if (!dpCode) {
      console.warn('[formatDps] dp code not found', { deviceId, dpId, dpValue });
      return;
    }
    // if (dpCode !== controlDataCode) {
    dpState[dpCode] = dpValue;
    // }
  });
  return dpState;
};

export const formatDevSchema = devInfo => {
  // 兼容 devInfo 为空的情况
  if (!devInfo) {
    console.warn('formatDevSchema::::devInfo is null');
    return {
      dpIdCodeMap: {},
      dpCodeIdMap: {},
      state: {},
      schema: {},
    };
  }

  const { dps = {}, schema = [] } = devInfo;
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
export const getDpSchema = (dpCode: DpStateKey) =>
  (store.getState().devInfo.schema[dpCode] ?? {}) as DpSchemaOrigin;

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
        rst = str;
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

/**
 * @method getRecordingTime 根据16进制数据获取录音时间
 */
const getRecordingTime = (time16: string): string => {
  const time = parseInt(time16, 16) * 1000;
  return dayjs(time).format('YYYY/MM/DD HH:mm');
};

// 从16进制文件数据转换为文件内容
export const transFileDatasFrom16 = datas => {
  // let sourceData =
  //   '0001002001010000550000590000679FC3C44eca0002002401010000550000590000679FC3C44eca59290003002c01010000550000590000679FC3C44eca59294f5c7684';
  const sourceData = datas.slice(6); // 第7位开始是文件列表内容
  const fileDatas16 = parseSourceData(sourceData);
  const fileDatas = fileDatas16.map(item => {
    const fileId = item.slice(0, 4);
    const fileType = getFileType(item.slice(8, 10));
    const fileStatus = item.slice(10, 12);
    const fileSize = getFileSize(item.slice(12, 18));
    const audioTimeLen = convertSecondsToTime(Number(item.slice(18, 24)));
    const timeZone = item.slice(24, 28);
    const recordingTime = getRecordingTime(item.slice(28, 36));
    const fileTitle = convertUnicodeToChinese(item.slice(36));
    return {
      fileId,
      fileType,
      fileStatus,
      fileSize,
      audioTimeLen,
      timeZone,
      recordingTime,
      fileTitle,
    };
  });
  return fileDatas;
};

export const checkOnlineHandle = (onlineType, index) => {
  // 二进制从右往左取第 index 位，越界视为 0
  // eslint-disable-next-line no-bitwise
  return !!((onlineType >> index) & 1);
};

export const backToHome = async (fromType = '') => {
  // 入门版耳机，由app直接跳转进入的情况
  if (fromType === 'app') {
    router.replace('/'); // 返回首页
  } else {
    router.back();
  }
};

// 根据像素比，将px转换为rpx
export const pxToRpx = (px: number) => {
  // 获取像素比，不能直接使用systemInfo 的 pixelRatio
  const { screenWidth } = store.getState().systemInfo;
  const pixelRatio = 750 / screenWidth;
  return Math.round(px * pixelRatio);
};

export const getCustomDevType = item => {
  const typeJson = item.configMetas?.tyabiw4jrd;
  const type = JSON.parse(typeJson || '{}');
  // entry_version 入门版
  // pro_version 专业版
  // card 卡片设备
  // os buds // os_buds os耳机
  if (type?.product_type === 'os_buds' || type?.product_type === 'os buds') {
    return DEVTYPES.os; // os耳机
  }
  return type?.product_type || DEVTYPES.unKnown;
};

// 缓存最后一次点击的设备信息
export const setStorageDevInfo = devInfo => {
  const {
    customDevType,
    devId,
    icon,
    isOnline,
    name,
    schema,
    dps,
    dpIdCodeMap,
    dpCodeIdMap,
    devType,
    iconName,
  } = devInfo;
  setStorageSync({
    key: 'storageDevInfo',
    data: JSON.stringify({
      customDevType,
      devId,
      icon,
      isOnline,
      name,
      schema,
      dps,
      dpIdCodeMap,
      dpCodeIdMap,
      devType,
      iconName,
    }),
  });
};

// 获取最后一次点击的设备信息
export const getStorageDevInfo = () => {
  const devInfoJsonStr = getStorageSync({ key: 'storageDevInfo' });
  const devInfo = devInfoJsonStr ? JSON.parse(devInfoJsonStr) : null;
  if (!devInfo?.devId) {
    return null;
  }
  const normalizedDevInfo = {
    ...devInfo,
    iconName: devInfo.iconName,
  };
  return normalizedDevInfo;
};

// 缓存最后一次点击的路由地址
export const setStorageLastModePath = path => {
  setStorageSync({ key: 'modePath', data: path });
};

// 获取最后一次点击的路由地址
export const getStorageLastModePath = () => {
  const modePath = getStorageSync({ key: 'modePath' });
  const path = modePath || null;
  return path as string;
};

// 获取设备在线状态
export const getOnlineType = devObj => {
  return new Promise((resolve, reject) => {
    getDeviceOnlineType({
      deviceId: devObj.devId,
      success: ({ onlineType }) => {
        const isOnline = checkOnlineHandle(onlineType, 6);
        const resOnline = devObj?.isVirtualDevice ? true : isOnline;
        resolve(resOnline);
        const devs = store.getState()?.deviceList || [];
        store.dispatch(
          updateDevsSync(
            devs.map(item => {
              if (devObj.devId === item.devId) {
                return {
                  ...item,
                  isOnline: resOnline,
                };
              }
              return item;
            })
          )
        );
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

// 获取设备在线状态
export const getOnlineStatus = async (item, customDevType, online = undefined) => {
  // 入门版耳机
  if (customDevType === DEVTYPES.entry) {
    const isOnline = await getOnlineType(item);
    return isOnline;
  }
  return online === undefined ? item?.isOnline : online; // 如果传入了online参数，则使用传入的值，否则使用设备本身的在线状态
};

// 设备来源常量
const DEVICE_SOURCE = {
  DEVICE: 'device',
  APP: 'app',
} as const;

// 设备ID常量
const DEVICE_ID = {
  PHONE: 'PHONE',
  IMPORT: 'IMPORT',
  PC: 'PC',
} as const;

// 无限权益标识
const INFINITE_BENEFIT_DATE = -1;

/**
 * 校验额度
 * @param homeId - 家庭ID
 * @param deviceId - 设备ID
 * @param isTransferImport - 是否为转写导入
 * @returns 余额，如果余额不足则返回 undefined
 */
export const checkBalance = async (
  homeId: string,
  deviceId: string,
  isTransferImport = false
): Promise<number | undefined> => {
  // 判断设备来源并设置参数
  const isAppSource =
    deviceId === DEVICE_ID.PHONE || deviceId === DEVICE_ID.IMPORT || deviceId === DEVICE_ID.PC;
  const devId = isAppSource ? '' : deviceId;
  const source = isAppSource ? DEVICE_SOURCE.APP : DEVICE_SOURCE.DEVICE;

  // 余额不足的处理逻辑
  // 仅只有无限权益+转写导入文件提示：此耳机不支持转写导入的音频
  const { benefits } = store.getState().shopInfo;
  // 过滤出有效的权益：排除已过期的和已用完的（type为usage且leftQuantity为0）
  const validBenefits = benefits.filter(item => {
    const now = Date.now();
    const isExpired =
      item.effectiveEndDate !== INFINITE_BENEFIT_DATE && item.effectiveEndDate < now;
    const isUsedUp = item.type === BenefitType.Usage && item.leftQuantity === 0;
    return !isExpired && !isUsedUp;
  });
  // 判断是否仅有无限权益：所有有效权益都是 scope 为 device 且 type 为 day 的权益
  const hasOnlyInfiniteBenefit =
    validBenefits.length > 0 &&
    validBenefits.every(
      item => item.scope === BenefitScope.Device && item.type === BenefitType.Day
    );
  if (isTransferImport && hasOnlyInfiniteBenefit) {
    showToast({
      title: Strings.getLang('not_support_transfer_import'),
      icon: 'none',
    });
    return undefined;
  }

  const balance = await atopCheckBalance({ devId, ownerId: homeId, source });

  // 余额充足，直接返回
  if (balance === 1) {
    return balance;
  }

  // 权益受限，显示受限弹窗
  if (balance === 2) {
    store.dispatch(updateUiState({ benefitRestrictedShow: true }));
    return balance;
  }

  // 余额不足：提示并引导至商城（已移除礼包/订阅弹窗）
  const quotaGuide = store.getState()?.uiState?.switchConfig?.quotaGuide;
  showToast({
    title: Strings.getLang('benefit_expire_desc'),
    icon: 'none',
  });
  if (quotaGuide) {
    router.push('/shop', { subpackage: 'pkgShop' });
  }
  return balance;
};

export const getAudioSource = (customDevType, currRecordType, isCall = false) => {
  if (isCall) return AudioSource.proCall; // 如果是电话录音，直接返回电话录音源
  switch (customDevType) {
    case 'phone':
      return AudioSource.phone; // 手机
    case 'entry_version':
    case 'os_buds':
      return AudioSource.entry; // os耳机 || 入门版
    case 'card':
      return AudioSource.cardSigle; // 卡片
    case 'glasses':
      return AudioSource.glasses; // 眼镜设备
    case 'pro_version':
      if (currRecordType === 3) {
        // 面对面翻译
        return AudioSource.proFaceToFace; // pro版面对面翻译
      }
      return currRecordType === RecordType.Call ? AudioSource.proCall : AudioSource.proLive; // pro版电话录音或现场录音
    default:
      return RecordMode.realTimeRecording; // 实时转写
  }
};

export const getTtsOutput = (audioSource: number) => {
  switch (audioSource) {
    case AudioSource.card:
    case AudioSource.cardSigle:
    case AudioSource.phone:
      return 1;
    case AudioSource.entry:
      return 2;
    default:
      return 3;
  }
};

// 获取录音来源的特定标识，用来展示文案和图标
export const getAudioSourceCode = source => {
  switch (source) {
    case AudioSource.phone:
    case AudioSource.merge:
    case AudioSource.mergeImport:
      return 'phone'; // 手机
    case AudioSource.card:
    case AudioSource.cardSigle:
      return 'card';
    case AudioSource.entry:
    case AudioSource.proCall:
    case AudioSource.proLive:
    case AudioSource.proFaceToFace:
      return 'earPhone';
    case AudioSource.pc:
      return 'pc'; // PC音源
    case AudioSource.wifiTrans:
      return 'wifiTrans'; // wifi翻译器
    default:
      return '';
  }
};

export const updateVisitState = visit => {
  if (visit === 0) return 1; // 未读变已读
  if (visit === 2) return 3; // 已生成未读变已生成已读
  return visit;
};

// 设置最近使用的语言
export const setStorageRecentlyLangs = lang => {
  if (!lang) return;
  // 获取当前缓存
  const recentlyLangs = getStorageRecentlyLangs();
  // 去重（删除已存在的语言）
  const filteredLangs = recentlyLangs.filter(item => item.lang !== lang.lang);
  // 新语言插入最前面
  filteredLangs.unshift(lang);
  // 最多保存5条
  const newLangs = filteredLangs.slice(0, 5);
  setStorageSync({
    key: 'recentlyLangs',
    data: JSON.stringify(newLangs),
  });
};

// 获取最近使用的语言
export const getStorageRecentlyLangs = () => {
  const langsStr = getStorageSync({ key: 'recentlyLangs' });
  try {
    const langs = langsStr ? JSON.parse(langsStr) : null;
    return Array.isArray(langs) ? langs : [];
  } catch {
    return [];
  }
};

// 判断是否是pro耳机的电话录音

export const checkIsCall = task => {
  if (task?.audioSource !== undefined) {
    // 卡片的话，直接是非电话录音
    if (task?.audioSource === AudioSource.card || task?.audioSource === AudioSource.cardSigle) {
      return false;
    }
  }
  // pro耳机的电话录音
  return task?.recordType === RecordType.Call;
};

/**
 * @brief Intercept back while recording and confirm stop
 * @param[in] textList optional ASR text list
 * @param[in] task current record task
 * @param[in] clear optional timer clearer
 * @param[in] handleStopRecord stop handler
 * @param[in] back navigate back handler
 * @return none
 */
export const onCustomBack = ({ textList, task, clear, handleStopRecord, back }) => {
  const isFaceToFace =
    task?.recordType === RecordType.FaceToFace ||
    task?.recordType === RecordType.FaceToFacePro ||
    task?.recordType === RecordType.PhoneEar;
  const canLeaveWithoutConfirm =
    (!textList?.length && (!task || task?.state === RecordStatus.FINISH)) ||
    (task?.businessType !== BusinessType.Trans && !isFaceToFace);

  if (canLeaveWithoutConfirm) {
    setNavigationBarBack({ type: 'system' });
    back();
    return;
  }

  showModal({
    title: Strings.getLang('tip'),
    content: Strings.getLang('sure_to_stop_record'),
    showCancel: true,
    cancelText: Strings.getLang('cancel'),
    cancelColor: 'var(--color-text-tertiary)',
    confirmText: Strings.getLang('confirm'),
    confirmColor: 'var(--color-primary)',
    success: async ({ confirm }) => {
      try {
        if (confirm) {
          clear?.();
          handleStopRecord();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
};

// 默认语言设置
export const getDefaultLangs = (supportLangList, initMyLang) => {
  let initFriendLang = '';
  if (initMyLang === 'en' || initMyLang === 'en_GB') {
    const fLang = supportLangList?.find(({ lang }) => lang === 'es')
      ? 'es'
      : supportLangList?.find(({ lang }) => lang !== initMyLang)?.lang;
    initFriendLang = fLang;
  } else {
    initFriendLang = supportLangList?.find(({ lang }) => lang === 'en') ? 'en' : 'en_GB';
  }
  return initFriendLang;
};

// 是否是安卓
export const isAndroid = () => {
  const { platform } = store.getState().systemInfo;
  return /android/gi.test(platform);
};

// 是否是iOS
export const isIOS = () => {
  const { platform } = store.getState().systemInfo;
  return /ios/gi.test(platform);
};

// 添加文件名安全处理函数
export const sanitizeFileName = (fileName: string): string => {
  return (
    fileName
      // eslint-disable-next-line no-control-regex
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') // 替换非法字符
      .replace(/^\.+/, '') // 移除开头的点号
      .replace(/\.+$/, '') // 移除结尾的点号
      .replace(/\s+/g, '_') // 替换空格为下划线
      .substring(0, 100) // 限制长度
      .trim() || 'untitled'
  ); // 如果为空则使用默认名称
};

export { realtimeLog } from './realtimeLog';
