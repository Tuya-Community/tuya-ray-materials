import { energy } from '@ray-js/ray';

/**
 * @description 能源设备属性查询
 * @param {*} params
 * @returns
 */
export const getDevicePropertyGet = (postData: {
  devId: string; // 设备id
  dateType?: 'hour' | 'day' | 'month'; // 日期维度
  indicatorCodes?: string; // 指标code
  beginDate?: string; // 开始时间
  endDate?: string; // 结束时间
  aggregationType?: 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'NUM';
  codes?: string; // 指标code
}) => {
  return energy.getPropertySettingTranslate(postData);
};

/**
 * @description 逆变器设备模型查询
 * @param {*} params
 * @returns
 */
export const getDeviceInverterModelApi = (postData: {
  devId: string; // 设备id
  type: string; // 类型
}) => {
  return energy.getInverterDeviceModel(postData);
};

/**
 * @description 逆变器逆变器设备属性下发
 * @param {*} params
 * @returns
 */
export const setDeviceSet = (postData: {
  devId: string; // 设备id
  setting: {
    code: string; // 指标code
    value: string; // 下发数值
  }[];
}) => {
  return energy.setDevicePropertySetting(postData);
};
