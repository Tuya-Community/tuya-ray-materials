import { isUndefined } from 'lodash-es';
import moment from 'moment';

import { isIos } from '..';
import { getTYQuanlityTypeByCodes, syncAppleHealthCodeConfig } from './constant';

/**
 * 请求写入权限
 */
export const authQuanlityWritePermissions = () => {
  if (!isIos || !ty.health) return undefined;

  try {
    const permissions = Object.values(syncAppleHealthCodeConfig).map(i => `${i.quanlityType}`);

    return new Promise((resolve, reject) => {
      ty.health.authQuanlityWritePermissions({
        permissions,
        success: res => {
          console.log('authQuanlityWritePermissions ==>', res);
          resolve(res);
        },
        fail: e => {
          console.warn(e);
        },
      });
    });
  } catch (error) {
    console.warn(error);
    return undefined;
  }
};

/**
 * 同步血压数据 收缩压/舒张压
 * @param data 示例：{ avgSys: 123, avgDia: 86 } key 为 syncAppleHealthCodeConfig 里的 key
 * @param time 时间，不传就默认当前时间
 */
const syncAppleHealthBloodPressure = async (
  data: { avgSys: number; avgDia: number },
  time?: number
) => {
  if (!isIos || !ty.health) return;
  if (isUndefined(data.avgSys) || isUndefined(data.avgDia)) return;

  await authQuanlityWritePermissions();

  const healthCodes = Object.keys(data);
  const appleHealthAuthStatus = await getAppleHealthAuthStatus(healthCodes);
  // 如果授权了，则直接写入
  if (appleHealthAuthStatus === 2) {
    const timestamp = time || new Date().getTime(); // 时间是秒
    try {
      saveBloodPressureData({
        systolic: data.avgSys,
        diastolic: data.avgDia,
        startTime: moment(timestamp - 30 * 1000).unix(),
        endTime: moment(timestamp).unix(),
      });
    } catch (error) {
      console.info(error, '同步 apple health 数据失败，请在正式app上尝试');
    }
  }
};

/*
 * 写入血压数据
 * @param data
 */
const saveBloodPressureData = (data: {
  systolic: number;
  diastolic: number;
  startTime: number;
  endTime: number;
}) => {
  if (!isIos || !ty.health) return;
  const { systolic, diastolic, startTime, endTime } = data;

  ty.health.saveBloodPressureData({
    systolic: systolic,
    diastolic: diastolic,
    startTime,
    endTime,
    success: res => {
      console.log('saveBloodPressureData success ==>', res);
    },
    fail: err => {
      console.warn('saveBloodPressureData fail ==>', err);
    },
  });
};

/**
 * 用户是否做过授权
 * @param writeTYQuanlityType 写入Quanlity类型
 */
const authStatuPermissions = (writeTYQuanlityType: string[]) => {
  if (!isIos) return undefined;

  return new Promise((resolve, reject) => {
    ty.health.authStatuPermissions({
      writePermissions: writeTYQuanlityType,
      success: res => {
        console.log('authStatuPermissions ==>', res);
        resolve(res);
      },
      fail: e => {
        reject(e);
      },
    });
  });
};

/**
 * 用户是否有写入权限
 * @param writePermission 写入权限类型
 */
const saveQuanlityPermisson = (writePermission: number) => {
  if (!isIos) return undefined;

  return new Promise((resolve, reject) => {
    ty.health.getSaveQuanlityPermission({
      writePermission,
      success: res => {
        console.log('saveQuanlityPermisson ==>', res);
        resolve(res);
      },
      fail: e => {
        reject(e);
      },
    });
  });
};

/**
 * 获取 apple Health 一些指标的授权状态
 * @param healthKeys 要同步的健康指标
 * @returns 连接状态 0: 未连接未授权，1: 已连接未授权，2: 已连接已授权
 */
const getAppleHealthAuthStatus = async (healthKeys: string[]) => {
  try {
    const syncTYQuanlityType = getTYQuanlityTypeByCodes(healthKeys);
    const a = await authStatuPermissions(syncTYQuanlityType);
    const allSaveQuanlityPermisson = syncTYQuanlityType.map((item: string) =>
      saveQuanlityPermisson(Number(item))
    );
    const b = await Promise.all(allSaveQuanlityPermisson);
    const permisAll = b.every(item => !!item);
    const appleHealthAuthStatus = a && !permisAll ? 1 : a && permisAll ? 2 : 0;
    return appleHealthAuthStatus;
  } catch (error) {
    // 没有授权
    console.warn(error, '获取 apple Health 连接状态失败');
    return 0;
  }
};

export default {
  syncAppleHealthBloodPressure,
};
