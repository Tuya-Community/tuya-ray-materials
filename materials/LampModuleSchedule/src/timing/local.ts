import dayjs from 'dayjs';
import _sortBy from 'lodash/sortBy';

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  const hourRes = +hour < 10 ? '0' + +hour : hour;
  const minuteRes = +minute < 10 ? '0' + +minute : minute;
  return `${hourRes}:${minuteRes}`;
};

// 获取合法的id id整数递增
// 如果存在 1,2,3 => 4
// 如果存在 2,4 => 1
// 如果存在 1,2,4 => 3
const getValidId = (_newTimers): number => {
  const idMap = {};
  (_newTimers || []).forEach(item => {
    idMap[item.timerId || item.id] = 1;
  });
  const idList = Object.keys(idMap);
  const notSequence: number[] = [];
  let max = 1;
  idList.reduce((preId, curId) => {
    let nPreId = +preId;
    const nCurId = +curId;
    while (nCurId - nPreId > 1) {
      nPreId += 1;
      notSequence.push(nPreId);
    }
    max = nCurId + 1;
    return curId;
  }, '0');
  return notSequence[0] ?? max;
};

export const addTimer = (loops: string, instruct: any, rtcTimerList, _params = {}) => {
  return new Promise(resolve => {
    const _newTimers = [...rtcTimerList];
    const { dps, time, codeDps } = instruct[0] || {};
    const id = getValidId(_newTimers);
    const [hour, minute] = time.split(':');
    const params = {
      ..._params,
      timerId: id,
      loops,
      codeDps,
      dps,
      date: dayjs().format('YYYYMMDD'),
      groupOrder: 0,
      time: formatTime(time),
      status: 1,
    };
    _newTimers.push(params);
    // 下发的dp格式数据
    const dpFormatter = {
      repeat: loops,
      startDpData: codeDps,
      startTime: hour * 60 + +minute,
      startTimeType: 0,
      status: 1,
      timerId: id,
      type: 1,
    };
    resolve({
      scheduleDpData: dpFormatter,
      scheduleList: _newTimers,
      scheduleShowData: params,
    });
  });
};
export const removeTimer = (timerId: string, rtcTimerList: any[] = []) => {
  return new Promise((resolve, reject) => {
    const _newTimers = [...rtcTimerList];
    let currentTimer = null;
    const rNewTimers = _newTimers.filter(item => {
      if (item.timerId === timerId) {
        currentTimer = item;
      }
      return item.timerId !== timerId;
    });
    if (!currentTimer) {
      console.warn(timerId, rtcTimerList, 'removeTimer currentTimer is null');
      return;
    }
    const dpFormatter = {
      timerId,
      id: timerId,
      status: currentTimer?.status,
    };

    resolve({
      scheduleDpData: dpFormatter,
      scheduleList: rNewTimers,
      scheduleShowData: currentTimer,
    });
  });
};

export const updateTimer = (data, rtcTimerList, _params = {}) => {
  return new Promise(resolve => {
    const newTimers = [...(rtcTimerList || [])];
    const { currentTime, loops, actions: instruct } = data;
    const { dps, time, codeDps } = instruct;
    const { status } = currentTime;
    const timerId = currentTime.timerId || currentTime.id;
    const timeRes = formatTime(time);
    const [hour, minute] = time.split(':');
    const params = {
      ..._params,
      timerId,
      loops,
      dps,
      codeDps,
      time: timeRes,
    };
    let currentTimer = null;
    newTimers.forEach((item: any, index: number) => {
      if (item.timerId === params.timerId) {
        newTimers[index] = {
          ...newTimers[index],
          ...params,
        };
        currentTimer = newTimers[index];
      }
    });

    if (!currentTimer) {
      console.warn(data, rtcTimerList, 'updateTimer currentTimer is null');
      return;
    }

    // 下发的dp格式数据
    const dpFormatter = {
      repeat: loops,
      startDpData: codeDps,
      startTime: hour * 60 + +minute,
      startTimeType: 0,
      status,
      timerId,
      type: 1,
    };

    resolve({
      scheduleDpData: dpFormatter,
      scheduleList: newTimers,
      scheduleShowData: currentTimer,
    });
  });
};

export const changeTimerStatus = (timerId: string | number, status: 0 | 1, rtcTimerList: any[]) => {
  return new Promise((resolve, reject) => {
    const newTimers = [...rtcTimerList];
    let currentTimer = null;
    newTimers.forEach((item: any, index: number) => {
      if (item.timerId && item.timerId === timerId) {
        newTimers[index].status = status;
        currentTimer = newTimers[index];
      }
    });
    if (!currentTimer) {
      console.warn(timerId, rtcTimerList, 'changeTimerStatus currentTimer is null');
      return;
    }
    const { loops = '', time = '', codeDps } = currentTimer;
    const [hour, minute] = time.split(':');
    // 下发的dp格式数据
    const dpFormatter = {
      repeat: loops,
      startDpData: codeDps,
      startTime: Number(hour) * 60 + +minute,
      startTimeType: 0,
      status,
      timerId,
      type: 1,
    };

    resolve({
      scheduleDpData: dpFormatter,
      scheduleList: newTimers,
      scheduleShowData: currentTimer,
    });
  });
};

export const getTimerList = state => {
  return new Promise(resolve => {
    let rtcTimerListRes = state?.rtcTimerList;
    if (rtcTimerListRes.length > 1) {
      rtcTimerListRes = _sortBy(rtcTimerListRes, (o: { time: string }) => {
        const { time } = o;
        const [h, m] = time.split(':');
        if (h === '00') {
          return `12:${m}`;
        }
        return o.time;
      });
    }
    resolve(rtcTimerListRes || []);
  });
};
