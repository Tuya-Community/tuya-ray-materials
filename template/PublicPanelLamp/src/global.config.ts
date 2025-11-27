import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  window: {
    backgroundColor: 'black',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: 'white',
    navigationBarTextStyle: 'black',
  },
  darkmode: 'dark',
  functionalPages: {
    // 设备详情功能页，若未自定义实现设备详情界面，该项为必填配置，不可删除。
    settings: {
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv',
    },
    LampScheduleSetFunction: {
      appid: 'ty56cr7pi6rxiucspo',
    },
    // 酷玩吧功能页，包含情景库、律动库和影像库
    rayPlayCoolFunctional: {
      appid: 'tyg0szxsm3vog8nf6n',
    },
    // 停电勿扰功能页
    LampNoDisturbFunctional: {
      // versionType: 'preview',
      appid: 'typsxgb7vfl1unmkbt',
    },
    // 断电记忆功能页
    LampPowerMemoryFunctional: {
      appid: 'tyabzhlpuchrkh7pe8',
    },
    // 灯光渐变
    LampMutationFunctional: {
      appid: 'tytj0ivsldjndnlnld',
    },
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
