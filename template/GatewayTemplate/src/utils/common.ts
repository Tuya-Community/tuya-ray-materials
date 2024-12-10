import { utils } from '@ray-js/panel-sdk';
import _get from 'lodash/get';
import { getGatewayAbility } from '@/api';
import { GetGatewayAbilityResponse, GatewayCapability, DetectionType } from '@/types';
import Strings from '@/i18n';

const { getBitValue } = utils;

const showModal = (title, content, rest?) => {
  return new Promise((resolve, reject) => {
    ty.showModal({
      title,
      content,
      cancelText: Strings.getLang('cancel'),
      confirmText: Strings.getLang('confirm'),
      confirmColor: '#1082FE',
      cancelColor: 'rgba(0, 0, 0, 0.7)',
      ...rest,
      success: ({ cancel, confirm }) => {
        resolve(confirm);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

const showErrorMsgModal = (error, prefix = 'Error :') => {
  console.error('error', error);
  showModal(Strings.getLang('tips'), `${prefix}${(error && error.errorMsg) || ''}`, {
    showCancel: false,
  });
};

const setPageNavigationBar = (title: string, type = 'light') => {
  title &&
    ty.setNavigationBarTitle({
      title,
    });
  ty.setNavigationBarColor({
    backgroundColor: type === 'light' ? '#F6F7FB' : '#000000',
    frontColor: type === 'light' ? '#000000' : '#ffffff',
    animation: {},
  });
};

const toNativePage = (url: string) => {
  ty.canIUseRouter({
    url,
    success: ({ result }) => {
      if (result) {
        ty.router({
          url,
          fail: e => showErrorMsgModal(e, 'router fail:'),
        });
      }
    },
    fail: e => showErrorMsgModal(e, 'canIUseRouter fail:'),
  });
};

let hideLoadingTimeout;
const showLoading = (params: Parameters<typeof ty.showLoading>[0]) => {
  clearTimeout(hideLoadingTimeout);
  hideLoadingTimeout = null;
  ty.showLoading({
    mask: false,
    ...params,
  });
  // 防止一直转圈
  hideLoadingTimeout = setTimeout(() => {
    ty.hideLoading();
  }, 10 * 1000);
};

const getGatewayLimitation = (
  gatewayId: string
): Promise<ReturnType<typeof translateGatewayAbility>['originData']> => {
  return getGatewayAbility(JSON.stringify([gatewayId]))
    .then(res => {
      if (Array.isArray(res)) {
        const [ability = {} as any] = res;
        const { originData } = translateGatewayAbility(ability);
        console.log('getGatewayLimitation :>> ', gatewayId, originData, ability);
        return originData || {};
      }
      return {};
    })
    .catch(err => {
      console.error('getGatewayLimitation fail', err);
      return {} as any;
    });
};

const calcBluLimitation = (
  originData: ReturnType<typeof translateGatewayAbility>['originData'],
  bleDevLength: number,
  allDevLength: number
): number => {
  const { blu, zig, max } = originData?.subMaximum?.data || {};
  let res;

  if (max === undefined || (max !== undefined && blu + zig <= max)) {
    // 数量上限单独计算
    res = blu - bleDevLength;
  } else {
    // 数量上限合并计算
    res = max - (allDevLength - bleDevLength) - bleDevLength;
  }
  return Math.max(res, 0);
};

/**
 * @description 是否云端在线
 * @param {String} pcc 设备的pcc字段(mesh category)
 * @return 是否在线
 */
const isRemoteOnline = (pcc = ''): boolean => {
  if (pcc === '') return false;
  if (pcc.length > 1) {
    const _head = pcc[0];
    const _footer = pcc[pcc.length - 1];
    return ['05', '50'].includes(`${_head}${_footer}`);
  }
  return false;
};

/**
 * @description 获取设备是否在线。
 * @param {Object} params pcc:设备的 pcc 属性，isOnline: 设备的 isOnline 属性
 * @return 在线状态
 */
const getIsOnline = ({ pcc, isOnline }: { pcc?: string; isOnline: boolean }): boolean => {
  return isRemoteOnline(pcc) || isOnline;
};

/**
 * @language zh-CN
 * @description 获取网关设备转换后的能力
 * @param {Object} gatewayAbility 接口获取到的能力
 * @return {Object} 转换后的能力
 */
const translateGatewayAbility = (gatewayAbility: GetGatewayAbilityResponse[0]) => {
  const { lqi = 0, capability = 0, subMaximum } = gatewayAbility;
  return {
    /** 是否支持迁移优化 */
    isSupportMigrateImprove: !!getBitValue(capability, GatewayCapability.migrate),
    /** 是否支持网关指示灯开关 */
    isSupportIndicator: !!getBitValue(capability, GatewayCapability.indicator),
    /** 是否支持网关网络状态获取 */
    isSupportQueryNetwork: !!getBitValue(capability, GatewayCapability.networkStatus),
    /** 是否有仅关联1个中继能力 */
    isSupportOnlyOneRelay: !!getBitValue(capability, GatewayCapability.onlyOneRelay),
    /** 是否支持Zigbee设备的信号检测 */
    isSupportZigbeeSignalDetect: !!getBitValue(lqi, DetectionType.ZIGBEE),
    /** 是否支持Tread设备的信号检测 */
    isSupportTreadSignalDetect: !!getBitValue(lqi, DetectionType.TREAD),
    /** 是否支持蓝牙类型设备的信号检测 */
    isSupportBleSignalDetect: !!getBitValue(lqi, DetectionType.BLE),
    /** 最多支持添加的蓝牙类型子设备数量 */
    bluLimitation: (subMaximum?.data?.blu as number) || 0,
    /** 原始数据 */
    originData: gatewayAbility,
  };
};

/** 转换路由参数 */
const parseQuery = <T extends Record<string, any>>(query: T): T => {
  const result = {};

  Object.keys(query).forEach(key => {
    const value = decodeURIComponent(query[key]);
    // 检查值是否为字符串并尝试解析为 JSON
    if (typeof value === 'string') {
      try {
        // 尝试解析 JSON
        const parsedValue = JSON.parse(value);
        result[key] = parsedValue; // 如果解析成功，使用解析后的值
      } catch (e) {
        // 如果解析失败，保留原始值
        result[key] = value;
      }
    } else {
      // 如果值不是字符串，直接保留原始值
      result[key] = value;
    }
  });

  return result as T;
};

export {
  showModal,
  showErrorMsgModal,
  setPageNavigationBar,
  toNativePage,
  showLoading,
  getGatewayLimitation,
  calcBluLimitation,
  isRemoteOnline,
  getIsOnline,
  translateGatewayAbility,
  parseQuery,
};
