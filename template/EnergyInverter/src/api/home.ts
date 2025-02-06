import { energy } from '@ray-js/ray';

/**
 * 单设备多指标汇总查询
 * @param {*} params
 * @returns
 */
export const getDeviceDataMultipleApi = (postData: {
  devId: string; // 设备id
  indicatorCodes: string; // 指标code
  dateType: 'day' | 'week' | 'month' | 'year'; // 日期类型
  beginDate: string; // 开始日期
  endDate: string; // 结束日期
}) => {
  return energy.getDeviceDataMultipleSum(postData);
};

/**
 * 查询逆变器设备信息
 * @param devId 设备id
 */
export const getEnergyInverterDevice = (postData: {
  devId: string; // 设备id
}) => {
  return energy.getInverterDeviceInfo(postData);
};

/**
 * 查询逆变器仪表盘信息
 * @param devId 设备id
 */
export const getEnergyInverterPanelApi = (postData: {
  devId: string; // 设备id
}) => {
  return energy.getInverterPanelInfo(postData);
};

/**
 * 流向图功率
 * @param devId 设备id
 * @returns {Object}
 *  pvPower // 光伏→逆变器
 *  chargeDischargePower // 充放电功率
 *  loadPower  // 逆变器→家庭
 *  buyingSellingPower // 电网逆变器买电卖电
 */
export const getEnergyInverterFlowApi = (postData: {
  devId: string; // 设备id
}) => {
  return energy.getInverterFlowInfo(postData);
};

/**
 * @description 获取设备信息
 * @param {*} deviceId
 */
export const getDeviceInfo = (deviceId: string) => {
  return new Promise((resolve, reject) => {
    ty.device.getDeviceInfo({
      deviceId,
      success: info => {
        resolve(info);
      },
      fail: () => {
        reject();
      },
    });
  });
};

/**
 * 通用
 * 获取设备属性
 * @param devId
 * @param bizType
 * @param code
 */
export const getPropertySaveApi = (postData: {
  devId: string; // 设备id
  bizType: number; // bizType类型
  code: string; // 能力code
}) => {
  return energy.getPropertyInfo(postData);
};

/**
 * 通用
 * 保存设备属性
 * @param devId
 * @param bizType
 * @param code
 * @param value
 */
export const setPropertySaveApi = (postData: {
  devId: string; // 设备id
  bizType: number; // bizType类型
  code: string; // 能力code
  value: string; // 装机容量
}) => {
  return energy.saveProperty(postData);
};
