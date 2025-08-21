import { Dispatch } from 'react';
import { ETimer } from './constant';
import { IProps } from '../props';

export interface IState {
  rtcTimerList: any[];
}
interface IReturn {
  type: ETimer;
  payload: any;
}

export interface IContext {
  state: IState;
  dispatch: Dispatch<{
    type: string;
    payload?: Partial<IState>;
  }>;
  props: IProps;
  actions?: {
    addRtcTimer: (data: Record<string, any>) => IReturn;
    removeRtcTimer: (data: Record<string, any>) => IReturn;
    updateRtcTimer: (data: Record<string, any>) => IReturn;
    closeAllRtcTimer: (data: Record<string, any>) => IReturn;
    initRtcTimerList: (data: Record<string, any>[]) => IReturn;
  };
}
