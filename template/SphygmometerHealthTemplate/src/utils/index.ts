import { getBLEOnlineState, getSystemInfoSync } from '@ray-js/ray';
import { EChartsOption } from 'echarts';
import { get, debounce as lodashDebounce } from 'lodash-es';
import moment from 'moment';

import Strings from '@/i18n';
import store from '@/redux';
import * as ExportUtils from './export';

const { windowHeight, platform } = getSystemInfoSync();

export const isIos = platform === 'ios';
export const isIphoneX = isIos && windowHeight >= 724;
export const smallScreen = windowHeight < 667;

export const middleScreen = windowHeight >= 667 && windowHeight <= 736;

const { statusBarHeight } = getSystemInfoSync();
const topBarHeight = 46;
export const safeTopHeight = statusBarHeight + topBarHeight;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, any> ? DeepPartial<T[K]> : T[K];
};
export type Level = 'WHO_LV0' | 'WHO_LV1' | 'WHO_LV2' | 'WHO_LV3' | 'WHO_LV4' | 'WHO_LV5';

export { ExportUtils };

interface SingleBpData {
  avgSys: number;
  avgDia: number;
  avgPulse: number;
  time: number;
}

type SingleKey = 'avgSys' | 'avgDia' | 'avgPulse';

// 根据IoT配置，生成numberPicker数据
export const nmberPickerData = (min: number, max: number, step: number) => {
  return new Array(max - min + 1).fill(0).reduce((acc, cur, idx) => {
    min = min || step;
    if (idx * step < max) {
      return [
        ...acc,
        {
          label: (idx * step + min).toString(),
          value: idx * step + min,
        },
      ];
    }
    return acc;
  }, []);
};

// 获取单个血压数据展示模块的颜色
export const getDataModuleColor = (level: Level) => {
  switch (level) {
    case 'WHO_LV0':
      return '#2DDBAE';
    case 'WHO_LV1':
      return '#75D788';
    case 'WHO_LV2':
      return '#9AD368';
    case 'WHO_LV3':
      return '#FCA849';
    case 'WHO_LV4':
      return '#F98460';
    case 'WHO_LV5':
      return '#FF4141';
    default:
      return '';
      break;
  }
};

export const PromiseAllSettled = (promises: Promise<any>[]) => {
  return Promise.all(
    promises.map(promise => {
      return promise
        .then((value: any) => {
          return { state: 'fulfilled', value };
        })
        .catch((reason: any) => {
          return { state: 'rejected', reason };
        });
    })
  );
};

export const getUserMax = () => {
  const MAX_USERS = get(getDevInfo(), 'panelConfig.fun.maxUsers', 10);
  return MAX_USERS;
};

// 获取趋势图表数据
export const getBpChartOption = (
  arr: Array<any>,
  isShowTody: boolean,
  type: string
): EChartsOption => {
  let formatString = '';
  if (isShowTody) {
    formatString = 'HH:mm:ss';
  } else {
    formatString = type === 'year' ? 'YYYY-MM' : 'YYYY-MM-DD';
  }

  const series = [];
  const keys = ['avgSys', 'avgDia', 'avgPulse'];

  const avgTitle = {
    avgSys: 'systolic_bp',
    avgDia: 'diastolic_bp',
    avgPulse: 'pulse',
  };

  const xData = arr.map((item: SingleBpData) => moment(item.time).format(formatString)).reverse();

  keys.forEach(key =>
    series.push({
      name: Strings.getDpLang(avgTitle[key]),
      type: 'line',
      data: arr.map((item: SingleBpData) => Number(item[key] ?? 0)).reverse(),
      showSymbol: true,
    })
  );

  return {
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}\n{c0}/{c1}mmHG\n{c2}bpm',
      backgroundColor: getThemeColor(),
      textStyle: {
        color: '#fff',
        fontWeight: 'bold',
      },
    },
    color: ['#FF1860', '#0D6ACB', '#FFD36F'],
    grid: {
      top: 20,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: true,
    },
    yAxis: {
      type: 'value',
      show: true,
      position: 'right',
      boundaryGap: ['20%', '20%'],
      axisLabel: {
        show: true,
      },
    },
    series,
  };
};

// 根据IoT配置，生成BpPicker数据
export const bpPickerData = (code: string) => {
  const { min = 0, max = 0, step = 1 } = getDpSchema(code);
  return new Array(max - min + 1).fill(0).reduce((acc, cur, idx) => {
    const minValue = min || step;
    if (idx * step < max) {
      return [
        ...acc,
        {
          value: (idx * step + minValue).toString(),
          label: (idx * step + minValue).toString(),
        },
      ];
    }
    return acc;
  }, []);
};

// 生成HeightPicker/WeightPicker数据
export const bodyMessasgePickerData = (min = 0, max = 0, step = 1) => {
  return new Array(max - min + 1).fill(0).reduce((acc, cur, idx) => {
    const minValue = min || step;
    if (idx * step < max) {
      return [
        ...acc,
        {
          value: (idx * step + minValue).toString(),
          label: (idx * step + minValue).toString(),
        },
      ];
    }
    return acc;
  }, []);
};

export const debounce = (cb: (...args: any[]) => any, wait = 500) => {
  return lodashDebounce(cb, wait, { trailing: false, leading: true });
};

/**
 * 格式化时间戳 转为13位
 * @param {*} time
 */
export const formatTimestamp = (time: number) => {
  const len = time?.toString().length || 0;
  if (len < 10) return 0;
  return time * Math.pow(10, 13 - len);
};

/**
 * 获取头像路径，不带域名
 * @param avatar 头像路径
 * @returns 不带域名的头像路径
 */
export const getAvatarPath = (avatar: string) => {
  let avatarUrl = avatar;
  if (/^http/.test(avatar)) {
    const query =
      /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.exec(
        avatar
      );
    if (query && query[5]) {
      avatarUrl = `/${query[5]}`;
    }
  }
  return avatarUrl;
};

/**
 * 获取设备信息
 * @returns
 */
export const getDevInfo = () => {
  return store.getState().devInfo as DevInfo;
};

/**
 * 获取DP信息
 * @param dpcode DP Code
 * @returns
 */
export const getDpSchema = (dpCode: string) => {
  // @ts-ignore
  return getDevInfo().schema?.find(({ code }) => code === dpCode)?.property ?? {};
};

/**
 * 检测DP是否存在
 * @param dpCode DP Code
 * @returns
 */
export const checkDpExist = (dpCode: string) => {
  // @ts-ignore
  return getDevInfo().schema?.some(({ code }) => code === dpCode);
};

/**
 * 获取devId
 */
export const getDevId = () => getDevInfo().devId;

/**
 * 获取productId
 */
export const getProductId = () => getDevInfo().productId;

/**
 * 根据dpCode获取dpId
 */
// @ts-ignore
export const getDpIdByCode = (dpCode: string) => getDevInfo().codeIds[dpCode];

/**
 * 根据dpId获取dpCode
 */
export const getDpCodeById = (dpId: number | string) => getDevInfo().idCodes[dpId];

export const getThemeColor = () => store.getState().uiState.themeColor;

/**
 * 上报DP解析
 * @param param0
 * @returns
 */
export const formatDps = ({ dps }: ty.device.DpsChanged) => {
  const dpState = {};
  Object.entries(dps).forEach(([dpId, dpValue]) => {
    dpState[getDpCodeById(dpId)] = dpValue;
  });
  return dpState;
};

export const getDeviceOnlineState = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    getBLEOnlineState({
      deviceId: getDevId(),
      success: ({ isOnline }) => resolve(isOnline),
      complete: () => resolve(true),
    });
  });
};
