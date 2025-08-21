import React, { useContext } from 'react';
import { useScheduleReducer } from './reducer';
import { IState, IContext } from './types';
import actions from './actions';

const defaultScheduleData: IState = {
  rtcTimerList: [],
};

const ScheduleContext = React.createContext<IContext>({
  state: defaultScheduleData,
  dispatch: () => null,
  props: {
    devId: '',
    groupId: '',
    supportCloudTimer: false,
    supportCountdown: false,
    supportRctTimer: false,
    timingConfig: {
      timerLimitNum: 0,
      actionList: [],
    },
    onCountdownToggle: () => null,
    onRtcTimeAdd: () => null,
    onRtcTimeRemove: () => null,
    onRtcTimeUpdate: () => null,
  },
});

export const ContextProvider = (props: any) => {
  const [state, dispatch] = useScheduleReducer(defaultScheduleData);
  return (
    <ScheduleContext.Provider
      value={{
        state,
        actions,
        dispatch,
        props: props?.props || {},
      }}
    >
      {props.children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = (): IContext => {
  return useContext(ScheduleContext);
};
