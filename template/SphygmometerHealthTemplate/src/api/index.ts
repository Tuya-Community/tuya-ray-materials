import { utils } from '@ray-js/panel-sdk';
import { getDevProperty, share as rayShare, saveDevProperty, health } from '@ray-js/ray';

import { getDevId } from '@/utils';

/**
 * 保存数据到云端
 * @param key key
 * @param data value
 * @returns
 */
export const saveDeviceCloudData = async (key: string, data: any) => {
  const devId = getDevId();
  const jsonString = typeof data === 'object' ? JSON.stringify(data) : data;
  const res = await saveDevProperty({
    devId,
    bizType: 0,
    propertyList: JSON.stringify([{ code: key, value: jsonString }]),
  });
  return res;
};

/**
 * 获取云端数据
 * @param key  传入需要查找的key
 * @returns
 */
export const getDeviceCloudData = async (key: string) => {
  try {
    const devId = getDevId();
    const res = await getDevProperty({
      devId,
      bizType: 0,
      code: key,
    });
    console.log('devProperty ===>', res);

    if (res && res.length > 0) {
      return utils.parseJSON(res?.[0]?.value);
    }
    return '';
  } catch (error) {
    // 如果网络不佳为保证面板正常加载则直接返回兜底'isCompleteUser')
    if (key === 'isCompleteUser') {
      return '1';
    }
    return '';
  }
};

/**
 * 获取头像列表
 * @returns
 */
export const getAvatorPathApi = () => {
  return health.getDefaultAvatarList({ bizCode: 'default_avatar' });
};

/**
 * 分享
 */
export const share = (data: {
  type: 'WeChat' | 'Message' | 'Email' | 'More';
  title?: string;
  message?: string;
  imagePath?: string;
  filePath?: string;
  contentType: 'text' | 'image' | 'file';
}) => {
  return new Promise((resolve, reject) => {
    rayShare({
      ...(data as any),
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
      complete: () => {
        resolve(true);
      },
    });
  });
};

// 新增用户
export const addUser = (data: UserInfo) => {
  return health.addPanelUser({ userInfo: data });
};
// 编辑用户信息
export const updateUser = (data: UserInfo) => {
  return health.updatePanelUser({ userInfo: data });
};
// 编辑用户信息
export const deleteUser = (userId: string) => {
  return health.deletePanelUser({ userId });
};

/**
 * 获取用户列表
 * @returns 用户列表
 */
export const fetchUserList = async () => {
  const res = await health.getPanelUserList({ devId: getDevId() });
  // 用户列表处理
  const userList = res.map(item => {
    const user = item;
    const { weightScale = 0 } = item.extInfo ? JSON.parse(item.extInfo) : {};
    // 兼容以前没有单位的情况，这里云端会扩大10倍保存体重，因为云端不支持小数存储
    const transfWeight =
      typeof weightScale === 'number' ? item.weight / Math.pow(10, weightScale) : item.weight;
    user.weight = transfWeight || 0;
    user.weightUnit = item.weightUnit || 'kg';
    user.heightUnit = item.heightUnit || 'cm';
    return user;
  });
  return userList as UserInfo[];
};

/**
 * 删除测量记录
 */
export const deleteMeasureData = (userId: string, uuid: string) => {
  return health.deleteBpgData({ userId, uuids: uuid });
};

/**
 * 更新备注
 */
export const addRemark = (uuid: string, remark: string) => {
  return health.updateBpgDataRemark({ uuid, remark });
};

/**
 * 获取最新一天的数据
 * @param userId
 * @returns
 */
export const fetchLatestData = (userId: string) => {
  return health.getBpgDataTrendLatest({ devId: getDevId(), userId });
};

/**
 * 获取血压测量等级统计信息
 * @param data
 * @returns 血压测量等级统计信息
 */
export const fetchMeasureLevelData = (data: {
  startTime: number;
  endTime: number;
  userId: string;
}) => {
  return health.getBpgDataLevnum({ devId: getDevId(), ...data });
};

/**
 * 获取血压测量等级统计信息
 * @param data
 * @returns 血压测量等级统计信息
 */
export const fetchTrendData = (data: {
  startTime: number;
  endTime: number;
  userId: string;
  dataType: DataType;
}) => {
  return health.getBpgDataTrend({ devId: getDevId(), ...data });
};

/**
 * 手动传输血压数据
 * @param data
 * @returns
 */
export const reportSingleData = (data: DataInfo) => {
  return health.reportSingleBpgData({ dataInfo: data });
};

/**
 * 面板数据上传接口
 * @param userId
 * @param dataJson
 * @returns
 */
export const reportPanelData = (userId: string, dataJson: Array<DataJsonItem>) => {
  return health.reportPanelBpgData({ devId: getDevId(), userId, dataJson });
};

/**
 * 通过筛选信息获取血压测量历史记录
 * @param data
 * @returns 筛选后的血压测量历史记录
 */
export const fetchFiltedDataList = (data: {
  userId: string;
  startTime: number;
  endTime: number;
  bpLevels: string;
  existRemark: string | null;
  offset: number;
  limit: number;
}) => {
  return health.getBpgDataHistory({ devId: getDevId(), ...data });
};

/**
 * 获取有数据日期
 * @returns 日期列表
 */
export const fetchDateList = (data: { userId: string; startTime: number; endTime: number }) => {
  return health.getBpgDataDays({ devId: getDevId(), ...data });
};

/**
 * 获取未分配数据
 * @param data
 * @returns 未分配数据
 */
export const fetchUnallocatedData = async (data: { offset: number; limit: number }) => {
  return health.getBpgDataUnallocated({ devId: getDevId(), ...data });
};

/**
 * 上传选中未分配血压数据
 * @param data
 * @returns
 */
export const reportUnallocatedData = (data: { userId: string; uuids: string }) => {
  return health.updateBpgDataUnallocated({ devId: getDevId(), ...data });
};

/**
 * 删除未分配血压数据
 * @param uuids
 * @returns
 */
export const deleteUnallocatedData = (uuids: string) => {
  return health.deleteBpgDataUnallocated({ uuids });
};
