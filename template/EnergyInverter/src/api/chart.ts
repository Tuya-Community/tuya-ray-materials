import { energy } from '@ray-js/ray';

/**
 * @description 碳排放查询
 * @param {*} postData
 * @returns
 */
export const getLCDataListApi = (postData: {
  devId: string; // 设备id
  phoneCode: string; // 国家手机号前缀/或国家码 如德国DE 优先填写国家码,部分国家的手机号前缀一样
  types: string; //  节能数据类型: 1.碳排放(吨) 2.煤炭节约量(吨) 3.等效植树量(棵) 5.三口之家1天用电(天)
}) => energy.getDeviceEnergySavingData(postData);

/**
 * @description 单设备多指标趋势查询
 * @param {*} postData
 * @returns
 */
export const getDpHistoryDataListApi = (postData: {
  devId: string; // 设备id
  dateType: 'day' | 'week' | 'month' | 'year'; // 日期类型
  beginDate: string; // 开始日期
  endDate: string; // 结束日期
  aggregationType: 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'NUM';
  indicatorCodes: string; // 指标code
}) => energy.getDpHistoryDataList(postData);
