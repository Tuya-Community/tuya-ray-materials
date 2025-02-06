import { energy } from '@ray-js/ray';

/**
 * 查询EMS系统设备故障事件列表
 * @param devId string 设备id
 * @param brandCode string 品牌商标识（kkt）可选
 * @param weight number 目前事件多语言名称权重为1，事件起因多语言权重为3，事件解决方案多语言权重为5
 * @param startTime Long 开始时间
 * @param endTime Long 结束时间
 * @param eventType String alarm 阈值告警/fault 故障告警
 * @param eventStatus int 0 已恢复/1 未恢复
 * @param pageNum int 1
 * @param pageSize int 50
 */
export const getEnergyDeviceAlarmListApi = (postData: {
  devId: string; // 设备id
  brandCode?: string; // 品牌商标识（kkt）可选
  weight: number; // 目前事件多语言名称权重为1，事件起因多语言权重为3，事件解决方案多语言权重为5
  startTime: number; // 开始时间戳
  endTime: number; // 结束时间戳
  eventType: 'fault' | 'alarm'; // 事件类型 alarm 阈值告警/fault 故障告警
  eventStatus: 0 | 1; // 事件状态 0 已恢复/1 未恢复
}) => {
  return energy.getDeviceAlarmEvent(postData);
};

/**
 * 查询EMS系统设备故障事件详情
 * @param devId string 设备id
 * @param eventId string
 * @param brandCode String 品牌商标识（kkt）可选
 * @param weight Number 目前事件多语言名称权重为1，事件起因多语言权重为3，事件解决方案多语言权重为5
 */
export const getEnergyDeviceAlarmDetailApi = (postData: {
  devId: string; // 设备id
  brandCode?: string; // 品牌商标识（kkt）可选
  weight: number; // 目前事件多语言名称权重为1，事件起因多语言权重为3，事件解决方案多语言权重为5
  eventId: string; // 事件ID
}) => {
  return energy.getDeviceAlarmEventDetail(postData);
};
