import _sortBy from 'lodash/sortBy';

export * from '../api';
import { TimerApi } from '../api';

type TTimer = {
  currentTime: any;
  loops: string;
  actions: {
    dps: any;
    codeDps: any;
    time: string;
  };
};

export const addTimer = (loops: string, instruct: any, _params?: any) => {
  return TimerApi.addTimer(loops, instruct, _params);
};

export const removeTimer = (id: string) => {
  return TimerApi.removeCloudTimer(id);
};

export const updateTimer = (param: TTimer, _params?: any) => {
  const { currentTime, loops, actions } = param;
  delete actions.codeDps; // 本地定时需要用到 云端定时删除
  return TimerApi.updateTimer(currentTime?.id, loops, [actions], _params);
};

// 拉取云端定时列表
export const getTimerList = () => {
  return new Promise(resolve => {
    TimerApi.getTimerList().then((res: { time: string }[]) => {
      let rtcTimerList = res;
      if (res.length > 1) {
        rtcTimerList = _sortBy(res, (o: { time: string }) => {
          const { time } = o;
          const [h, m] = time.split(':');
          if (h === '00') {
            return `12:${m}`;
          }
          return o.time;
        });
      }
      resolve(rtcTimerList);
    });
  });
};
