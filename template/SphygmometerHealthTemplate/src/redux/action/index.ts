import moment from 'moment';

import * as ApiUtils from '@/api';
import { getAvatorPathApi } from '@/api';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import store from '@/redux';
import { UIState, updateUI as updateUIAction } from '@/redux/modules/uiSlice';
import { checkDpExist, getDevInfo } from '@/utils';
import appleHealthUtils from '@/utils/appleHealth';
import storate from '@/utils/netCache/storage';

export const updateUI = (data: Partial<UIState>) => {
  store.dispatch(updateUIAction(data));
};

export const addUser = async (data: any) => {
  const {
    uiState: { userInfo },
  } = store.getState();

  const newUserbackId = (await ApiUtils.addUser(data)) as string;

  const userList = await ApiUtils.fetchUserList();

  let newUserInfo = userInfo;
  userList.find(user => {
    if (user.id === newUserbackId) {
      newUserInfo = user;
      return true;
    }
    return false;
  });

  updateUI({ userInfo: newUserInfo, userList });
  return newUserbackId;
};

export const updateUser = async (data: any) => {
  const {
    uiState: { userInfo },
  } = store.getState();

  const backState = await ApiUtils.updateUser(data);

  const userList = await ApiUtils.fetchUserList();
  let newUserInfo = userInfo;

  userList.find(user => {
    if (user.id === data?.id) {
      newUserInfo = user;
      return true;
    }
    return false;
  });

  updateUI({ userInfo: newUserInfo, userList });
  return backState;
};

export const deleteUser = async (userId: string) => {
  const {
    uiState: { userInfo, userList },
  } = store.getState();

  const backState = await ApiUtils.deleteUser(userId);

  if (backState) {
    const list = userList.filter(item => item.id !== userId);
    let newUserInfo = userInfo;
    if (userInfo?.id === userId) {
      newUserInfo = list[0];
    }
    updateUI({
      userInfo: newUserInfo,
      userList: list,
      currentUserType: newUserInfo?.userType,
      deleteUserSuccess: true,
    });
  }

  return backState;
};

export const deleteRecord = async (uuid: string) => {
  const {
    uiState: { userInfo, latestDetailedData },
  } = store.getState();
  if (userInfo) {
    await ApiUtils.deleteMeasureData(userInfo?.id ?? '', uuid);
    const idx = latestDetailedData.datas.findIndex(item => item?.uuid === uuid);

    if (idx >= 0) {
      updateUI({
        latestDetailedData: {
          ...latestDetailedData,
          datas: latestDetailedData.datas.filter(item => item?.uuid !== uuid),
          totalCount: latestDetailedData.totalCount - 1,
        },
      });
    }
    if (userInfo?.id) {
      getLatestData(userInfo.id);
    }
  }
};

export const addRemark = async (uuid: string, remark: string) => {
  const {
    uiState: { userInfo, latestDetailedData },
  } = store.getState();
  if (userInfo) {
    await ApiUtils.addRemark(uuid, remark);
    const idx = latestDetailedData.datas.findIndex(item => item?.uuid === uuid);

    if (idx >= 0) {
      updateUI({
        latestDetailedData: {
          ...latestDetailedData,
          datas: latestDetailedData.datas.map((v, i) => (i === idx ? { ...v, remark } : v)),
        },
      });
    }
  }
};

// 获取血压登记统计数据
export const getMeasureLevelData = async (type: string) => {
  const {
    uiState: { userInfo },
  } = store.getState();

  let day = 6;
  switch (type) {
    case 'year':
      day = 364;
      break;
    case 'month':
      day = 29;
      break;
    default:
      break;
  }

  const endTime = moment(+new Date()).startOf('seconds').valueOf();

  const startTimeStr = `${moment(endTime).add(-day, 'd').format('YYYY-MM-DD')} 00:00`;
  const startTime = moment(startTimeStr).valueOf();

  const data: any = await ApiUtils.fetchMeasureLevelData({
    userId: userInfo?.id ?? '',
    startTime,
    endTime,
  });

  const levels = [0, 1, 2, 3, 4, 5] as const;

  const numberKeyList = [];
  const percentKeyList = [];
  levels.forEach(i => {
    numberKeyList.push(`lv${i}Num`);
    percentKeyList.push(`lv${i}Ratio`);
  });

  const numberList = [];
  const percentList = [];
  const colorList = ['#2DDBAE', '#75D788', '#9AD368', '#FCA849', '#F98460', '#FF4141'];
  const bpColorList = [];
  levels.forEach(i => {
    numberList.push({
      name: Strings.getLang(`dsc_WHO_LV${i}`),
      value: data[numberKeyList[i]],
      color: colorList[i],
    });
    if (data[percentKeyList[i]] !== 0) {
      percentList.push({
        name:
          Strings.getLang(`dsc_WHO_LV${i}`).length > 11
            ? `${Strings.getLang(`dsc_WHO_LV${i}`).slice(0, 11)}...`
            : Strings.getLang(`dsc_WHO_LV${i}`),
        value: parseFloat(Number(data[percentKeyList[i]] * 100).toPrecision(3)),
      });
    }

    bpColorList.push({
      type: `${Strings.getLang(`dsc_WHO_LV${i}`)} (${Strings.getLang('dsc_times')})`,
      frequency: data[numberKeyList[i]],
      color: colorList[i],
    });
  });

  updateUI({
    bpNumberList: numberList,
    bpPercentList: percentList,
    totalNum: data.totalNum,
    bpColorList,
  });
};

/**
 * 手动上传血压数据
 * @param data
 */
export const reportSingleData = async (data: DataInfo) => {
  const {
    uiState: { userInfo, type, defaultUser },
  } = store.getState();

  if (userInfo) {
    const res = await ApiUtils.reportSingleData(data);
    const isSuccess = res?.allocate;

    const { userMarkCode } = dpCodes;
    const ishaveUserMark = checkDpExist(userMarkCode);
    // 主用户同步 Apple Health
    // if ((ishaveUserMark && defaultUser === userInfo.userTypeCode) || userInfo?.userType === 1) {
    //   appleHealthUtils.syncAppleHealthBloodPressure(
    //     { avgSys: data?.sys, avgDia: data?.dia },
    //     data?.time
    //   );
    // }

    getMeasureLevelData(type);
    if (userInfo?.id) {
      await getLatestData(userInfo?.id);
    }

    return isSuccess;
  }

  return false;
};

export const reportPanelData = async (data: {
  systolic_bp: number;
  diastolic_bp: number;
  pulse: number;
  arrhythmia: boolean;
  user_mark: string;
  dpsTime: number;
}) => {
  const { userMarkCode } = dpCodes;
  const ishaveUserMark = checkDpExist(userMarkCode);
  const {
    uiState: { userInfo, userList, type, defaultUser },
  } = store.getState();
  if (userInfo) {
    let reportUserId;

    if (ishaveUserMark) {
      const idx = userList.findIndex(item => item?.userTypeCode === data.user_mark);
      reportUserId = userList[idx]?.id;
    } else {
      reportUserId = userInfo?.id;
    }
    if (!reportUserId) return;
    if (data.systolic_bp <= 1 || data.diastolic_bp <= 1 || data.pulse <= 1) return;
    await ApiUtils.reportPanelData(reportUserId ?? '', [
      {
        dps: {
          1: data?.systolic_bp,
          2: data?.diastolic_bp,
          3: data?.pulse,
          4: data?.arrhythmia,
          9: ishaveUserMark ? data?.user_mark : '',
        },
        dpsTime: data?.dpsTime,
      },
    ]);
    // 主用户同步 Apple Health
    // if ((ishaveUserMark && defaultUser === data.user_mark) || userInfo?.userType === 1) {
    //   appleHealthUtils.syncAppleHealthBloodPressure(
    //     { avgSys: data?.systolic_bp, avgDia: data?.diastolic_bp },
    //     data?.dpsTime
    //   );
    // }
    getMeasureLevelData(type);
    if (userInfo?.id) {
      getLatestData(userInfo.id);
    }
  }
};

/**
 * 获取最新一天数据
 * @param userId
 */
export const getLatestData = async (userId: string) => {
  const data = await ApiUtils.fetchLatestData(userId);
  const list = data?.list || [];
  const avgData = {
    avgTotalSys: data?.avgTotalSys || '0',
    avgTotalDia: data?.avgTotalDia || '0',
    avgTotalPulse: data?.avgTotalPulse || '0',
  };

  updateUI({ latestData: { list, avgData } });

  return { list, avgData };
};

export const getFiltedDataList = async (
  pageNo: number,
  isFirst = false,
  bpLevels: string,
  existRemark: string,
  type: string,
  limit = 8,
  startTime = 0,
  endTime = 0
) => {
  const {
    uiState: { userInfo, filtedDataList },
  } = store.getState();

  let day = 6;
  switch (type) {
    case 'year':
      day = 364;
      break;
    case 'month':
      day = 29;
      break;
    case 'threeMonth':
      day = 89;
      break;
    default:
      break;
  }

  const SpareEndTime = moment(+new Date()).startOf('seconds').valueOf();

  const SpareStartTimeStr = `${moment(SpareEndTime).add(-day, 'd').format('YYYY-MM-DD')} 00:00`;
  const SpareStartTime = moment(SpareStartTimeStr).valueOf();

  const dataVo = {
    userId: userInfo?.id ?? '',
    startTime: startTime === 0 ? SpareStartTime : startTime,
    endTime: endTime === 0 ? SpareEndTime : endTime,
    bpLevels,
    existRemark,
    offset: pageNo * limit,
    limit,
  };

  const filtedData: any = await ApiUtils.fetchFiltedDataList(dataVo);
  if (isFirst) {
    filtedData &&
      updateUI({
        filtedDataList: {
          datas: filtedData.datas,
          hasNext: filtedData.hasNext,
          totalCount: filtedData.totalCount,
          pageNo: filtedData.pageNo,
          pageSize: filtedData.pageSize,
        },
      });
  } else if (filtedData?.datas?.length > 0) {
    const list = filtedDataList.datas.concat(filtedData.datas);
    updateUI({
      filtedDataList: {
        datas: list,
        hasNext: filtedData.hasNext,
        totalCount: filtedData.totalCount,
        pageNo: filtedData.pageNo,
        pageSize: filtedData.pageSize,
      },
    });
  }
  return filtedData;
};

/**
 * 获取有数据的日期列表
 */
export const getDateList = async () => {
  const {
    uiState: { userInfo },
  } = store.getState();

  const endTime = moment(+new Date()).startOf('seconds').valueOf();
  const startTime = moment(endTime).add(-364, 'd').valueOf();

  const dateList = await ApiUtils.fetchDateList({ userId: userInfo?.id, startTime, endTime });

  updateUI({ haveDataDateList: dateList });
};

/**
 * 获取最新一天的具体数据内容组
 * @param pageNo
 * @param isFirst
 * @param timerStr
 * @returns
 */
export const getLatestDetailedData = async (pageNo: number, isFirst = false, timerStr: string) => {
  const {
    uiState: { userInfo, latestDetailedData },
  } = store.getState();

  const bpLevels = '';
  const existRemark = '';
  // 这里统计到59,少了一分钟数据
  // const endTime = moment(`${timerStr} 23:59`).valueOf();
  const endTime = moment(`${timerStr}`).endOf('day').valueOf();
  const startTime = moment(`${timerStr}`).startOf('day').valueOf();

  const limit = 5;

  const latestData: any = await ApiUtils.fetchFiltedDataList({
    userId: userInfo?.id ?? '',
    startTime,
    endTime,
    bpLevels,
    existRemark,
    offset: pageNo * limit,
    limit,
  });

  if (isFirst) {
    latestData &&
      updateUI({
        latestDetailedData: {
          datas: latestData.datas,
          hasNext: latestData.hasNext,
          totalCount: latestData.totalCount,
          pageNo: latestData.pageNo,
          pageSize: latestData.pageSize,
        },
      });
  } else if (latestData?.datas?.length > 0) {
    const list = latestDetailedData.datas.concat(latestData.datas);
    updateUI({
      latestDetailedData: {
        datas: list,
        hasNext: latestData.hasNext,
        totalCount: latestData.totalCount,
        pageNo: latestData.pageNo,
        pageSize: latestData.pageSize,
      },
    });
  }
  return latestData;
};

// 获取未分配数据
export const getUnallocatedData = async (pageNo: number, isFirst: boolean) => {
  const {
    uiState: { unallocatedData },
  } = store.getState();

  const limit = 8;

  const historyData: any = await ApiUtils.fetchUnallocatedData({
    offset: pageNo * limit,
    limit,
  });

  if (isFirst) {
    historyData &&
      updateUI({
        unallocatedData: {
          datas: historyData.datas,
          hasNext: historyData.hasNext,
          totalCount: historyData.totalCount,
        },
      });
  } else if (historyData?.datas?.length > 0) {
    const list = unallocatedData.datas.concat(historyData.datas) as [];
    updateUI({
      unallocatedData: {
        datas: list,
        hasNext: historyData.hasNext,
        totalCount: historyData.totalCount,
      },
    });
  }
  return historyData;
};

// 获取所有离线数据

export const getAllUnallocatedData = async (pageNo: number) => {
  const limit = 40;

  const historyData: any = await ApiUtils.fetchUnallocatedData({
    offset: pageNo * limit,
    limit,
  });

  historyData &&
    updateUI({
      allUnallocatedData: {
        datas: historyData.datas,
        hasNext: historyData.hasNext,
        totalCount: historyData.totalCount,
      },
    });

  return historyData;
};

export const initUserData = async () => {
  const setUpUser = async (state: any, panelUsers: any) => {
    const { userSetCode } = dpCodes;
    const ishaveUserSet = checkDpExist(userSetCode);

    let userInfo = {} as UserInfo;
    let isUnComplete = true;
    // let idx;
    const defaultUser = (await storate.getItem(`${getDevInfo().devId}DefaultUser`)) || '';
    if (state === 'fulfilled') {
      userInfo = panelUsers.find(i => i.userTypeCode === defaultUser);
      if (!userInfo) {
        userInfo = panelUsers?.[0];
      }
      if (ishaveUserSet) {
        isUnComplete = panelUsers.every((user: { gmtModified: number; gmtCreate: number }) => {
          return user.gmtModified === user.gmtCreate;
        });
      } else {
        isUnComplete = !panelUsers.length;
      }
      // 获取头像列表地址
      const res: any = await getAvatorPathApi();
      const avatars = res?.default_avatar?.map(item => {
        return {
          ...item,
          fullUrl: `https://${item.path}`,
        };
      });
      avatars.unshift(
        ...avatars.splice(
          avatars.findIndex(it => it.key === 'avatar3'),
          1
        )
      );
      avatars.unshift(
        ...avatars.splice(
          avatars.findIndex(it => it.key === 'avatar9'),
          1
        )
      );
      updateUI({
        avatars: avatars || [],
        userInfo,
        userList: panelUsers || [],
        needCompleteInfo: isUnComplete,
        currentUserType: userInfo?.userType || 2,
      });

      return isUnComplete;
    }
    return false;
  };

  const panelUsers = await ApiUtils.fetchUserList();

  return setUpUser('fulfilled', panelUsers);
};

/**
 * 初始化数据
 */
export const initData = async () => {
  const userList = await ApiUtils.fetchUserList();

  const targetWeightUnit: any =
    (await storate.getItem(`${getDevInfo().devId}targetWeightUnit`)) || 'kg';
  const targetHeightUnit: any =
    (await storate.getItem(`${getDevInfo().devId}targetHeightUnit`)) || 'cm';
  const defaultUser: any =
    (await storate.getItem(`${getDevInfo().devId}DefaultUser`)) || userList?.[0]?.userTypeCode;
  updateUI({ userList, targetWeightUnit, targetHeightUnit, defaultUser });
  getDateList();
  // getUnallocatedData(0, true);
  getAllUnallocatedData(0);
};

/**
 * 上传未分配数据
 * @param selectedData
 */
export const reportUnallocatedData = async (selectedData: Array<any>) => {
  const {
    uiState: { userInfo },
  } = store.getState();
  await ApiUtils.reportUnallocatedData({
    userId: userInfo?.id,
    uuids: selectedData.map(item => item.uuid).join(','),
  });
  // getUnallocatedData(0, true);
  getAllUnallocatedData(0);
  if (userInfo?.id) {
    getLatestData(userInfo.id);
  }
};

/**
 * 删除未分配数据
 * @param uuids
 */
export const deleteUnallocatedData = async (selectedData: Array<any>) => {
  await ApiUtils.deleteUnallocatedData(selectedData.map(item => item.uuid).join(','));
  getAllUnallocatedData(0);
};

export const getTrendData = async (type: 'year' | 'month' | 'week') => {
  const {
    uiState: { userInfo },
  } = store.getState();

  let day = 6;
  switch (type) {
    case 'year':
      day = 364;
      break;
    case 'month':
      day = 29;
      break;
    default:
      break;
  }

  const endTime = moment(+new Date()).startOf('seconds').valueOf();

  const startTimeStr = `${moment(endTime).add(-day, 'd').format('YYYY-MM-DD')} 00:00`;
  const startTime = moment(startTimeStr).valueOf();

  const data = await ApiUtils.fetchTrendData({
    startTime,
    endTime,
    userId: userInfo?.id ?? '',
    dataType: type,
  });

  const list = data?.list || [];
  const avgData = {
    avgTotalSys: data?.avgTotalSys || '0',
    avgTotalDia: data?.avgTotalDia || '0',
    avgTotalPulse: data?.avgTotalPulse || '0',
  };

  updateUI({ trendData: { list, avgData } });
};
