/* eslint-disable camelcase */
export enum EnumShowType {
  countdown = 1, // 倒计时
  custom = 2, // 自定义模式
  timing = 3, // 定时
  all = 4, // 定时 + 倒计时
  customAll = 5, // 定时 + 自定义模式
  customCountdown = 6, // 倒计时 + 自定义模式
}

type DpValue = boolean | number | string | any;
interface DpState {
  switch_led?: boolean;
  [dpCode: string]: DpValue;
}

export type TAction = {
  label: string; // 执行行为标题
  value?: number; // 执行行为值
  dpList: {
    value: string | number | boolean; // 执行行为对应的dp值
    code: string; // 执行行为对应的dpCode值
  }[];
};

export interface IThemeConfig {
  background: string;
  fontColor: string;
  themeColor: string;
  cardBackgroundColor: string;
}

export type TimeConfig = {
  actionList?: TAction[];
};

export interface TimerData {
  id: string; // 定时组id， 当为本地定时时与timerId一致
  timerId?: string; // 定时id， 当为本地定时时与id一致
  weeks: number[]; // 定时周期[0,0,0,0,0,0,0] => 对应星期的“日一二三四五六”, 1为开启，0为关闭；0000000 => 仅一次；1111111 => 每天
  opened: boolean; // 是否开启
  time: string; // 定时时间
  dps: {
    [v: string]: any;
  };
  // 选中的执行动作
  action?: {
    label: string;
    value: number;
    [v: string]: any;
  };
}

export type DevInfo = Partial<ty.device.DeviceInfo & { state: DpState }>;
