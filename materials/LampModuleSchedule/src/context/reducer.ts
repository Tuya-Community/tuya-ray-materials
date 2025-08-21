/* eslint-disable no-case-declarations */
import { useReducer, useCallback } from 'react';
import { ETimer } from './constant';
import { IState } from './types';

function deepClone(data: any) {
  let _data = data;
  try {
    _data = JSON.parse(JSON.stringify(data));
  } catch (err) {
    _data = data;
  }
  return _data;
}

// 默认值
export const useScheduleReducer = (init: IState) => {
  const scheduleReducer = useCallback(
    (
      state: IState,
      action: {
        type: string;
        payload?: Partial<IState>;
      }
    ) => {
      switch (action.type) {
        case ETimer.ADD_RTC_TIMER:
          // eslint-disable-next-line no-case-declarations
          const _newTimers = deepClone(state.rtcTimerList);
          const index = _newTimers.findIndex(
            (i: { timerId: string }) => i.timerId === action.payload?.timerId
          );
          index > -1 && _newTimers.splice(index, 1);
          // 添加
          _newTimers.push(action.payload);
          return {
            ...state,
            rtcTimerList: [..._newTimers],
          };
        case ETimer.REMOVE_RTC_TIMER:
          // eslint-disable-next-line no-case-declarations
          const _data = action.payload;
          // eslint-disable-next-line no-case-declarations
          const rNewTimers = state.rtcTimerList.filter(item => item.timerId !== _data?.timerId);
          return {
            ...state,
            rtcTimerList: [...rNewTimers],
          };
        case ETimer.UPDATE_RTC_TIMER:
          // eslint-disable-next-line no-case-declarations
          const data = action.payload;
          // eslint-disable-next-line no-case-declarations
          const newTimers = state.rtcTimerList;
          newTimers.forEach((item: any, index: number) => {
            if (item.timerId === data?.timerId) {
              newTimers[index] = data;
            }
          });
          return {
            ...state,
            rtcTimerList: [...newTimers],
          };
        case ETimer.INIT_RTC_TIMER_LIST:
          return {
            ...state,
            rtcTimerList: action.payload,
          };
        case ETimer.CLOSE_ALL_RTC_TIMER:
          return {
            ...state,
            rtcTimerList: state.rtcTimerList.map(i => {
              return {
                ...i,
                status: 0,
              };
            }),
          };
        default:
          return state;
      }
    },
    []
  );
  return useReducer(scheduleReducer, init);
};
