/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { getLaunchOptionsSync, router, View, getDeviceInfo } from '@ray-js/ray';

import LampModuleSchedule, {
  useCountdownTime,
  useCountdownDpPull,
  useTriggerChildrenFunction,
} from '../../../src/index';
import { getDpIdByCode } from '../utils';

import './index.less';

type TTimer = {
  status: any;
  time: string;
  loops: string;
  dps: Record<string, any>;
  id?: string;
  timerId?: string;
};

const dpCodes = {
  switchCode: 'switch_led',
  countdownCode: 'countdown',
  rtcTimerCode: 'rtc_timer',
  musicCode: 'dreamlightmic_music_data',
  workModeCode: 'work_mode',
};

const actionList = [
  {
    label: '开启', // 开启
    dpList: [
      {
        value: true,
        code: dpCodes.switchCode,
        id: 1,
      },
    ],
  },
  {
    label: '关闭', // 关闭
    dpList: [
      {
        value: false,
        code: dpCodes.switchCode,
        id: 1,
      },
    ],
  },
  {
    label: '摇滚',
    type: 'custom', // 自定义复杂场景动作
    dpList: [],
    callback(res: TTimer) {
      // 注意如果本函数要生效，必须设置上面的 type: 'custom',
      // 可以跳转新页面去设置
      // 设置完后 重新 设置下新的dpList的值
      console.log(res, 'callbackcallback');

      router.push('/test');
    },
    renderCustomActionText() {
      return '自定义'; // 自定义action的文案
    },
  },
  {
    label: '色温2',
    type: 'custom', // 自定义复杂场景动作
    dpList: [
      {
        value: false,
        code: dpCodes.workModeCode,
      },
    ],
    callback(res: TTimer) {
      // 注意如果本函数要生效，必须设置上面的 type: 'custom',
      // 可以跳转新页面去设置
      // 设置完后 重新 设置下新的dpList的值
      console.log(res, 'callbackcallback');

      router.push('/test');
    },
    renderCustomActionText() {
      return '自定义'; // 自定义action的文案
    },
  },
];

export type DevInfo = Partial<ty.device.DeviceInfo>;

export default function Home() {
  const [_currentDList, setCurrentDpList] = useState([]);
  const [devInfo, setDevInfo] = useState<DevInfo>({});
  const { deviceId: devId } = getLaunchOptionsSync().query;

  const triggerType1 = 'closeAllTimer'; // 触发子组件的方法，支持
  const { run: runCloseAllTimer } = useTriggerChildrenFunction(triggerType1);
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    ty.hideMenuButton();
    return () => {
      console.log('卸载了Home组件');
    };
  }, []);
  // sigmesh协议下需要主动拉取倒计时dp值，防止倒计时dp不同步
  useCountdownDpPull(devInfo?.devId, getDpIdByCode(dpCodes.countdownCode, devInfo?.schema));
  useCountdownTime(countdown, (__countdown: number) => {
    // 更新倒计时dp值
    setCountdown(__countdown);
    // 如果为返回值0，下发倒计时值为0
    if (__countdown === 0) {
      // TODO:下发dp
      console.log('下发dp');
    }
  });

  const { run: runTimerToggle } = useTriggerChildrenFunction('timerToggle');
  const { run: closeAllTimer } = useTriggerChildrenFunction('closeAllTimer');
  useEffect(() => {
    // mock执行定时开关，一般用于dp改变时触发调用
    setTimeout(() => {
      const timerId = 1;
      const timerStatus = true;
      runTimerToggle(timerId, timerStatus);
      // closeAllTimer();
    }, 2000);
    getDeviceInfo({
      deviceId: devId,
      success: deviceInfo => {
        setDevInfo(deviceInfo);
        const __actionList = actionList.map(action => {
          return {
            ...action,
            dpList: (action?.dpList || []).map(i => {
              return {
                ...i,
                id: getDpIdByCode(i.code, deviceInfo.schema),
              };
            }),
          };
        });
        setCurrentDpList(__actionList);
      },
      fail: console.error,
    });
  }, []);

  return (
    <View className="view">
      <LampModuleSchedule
        devId={devInfo?.devId}
        groupId={devInfo?.groupId}
        supportCountdown
        // showHeader={false}
        supportRctTimer
        // supportCloudTimer
        countdownConfig={{
          countdown,
        }}
        themeConfig={{
          theme: 'dark',
          // theme: 'light',
        }}
        timingConfig={{
          actionList: _currentDList,
          timerLimitNum: 10,
        }}
        onBeforeTimerChange={(res, type, timerList) => {
          console.log(res, type, timerList, 'onBeforeTimerChange');
          // 支持异步
          // return new Promise(resolve => {
          //   setTimeout(() => {
          //     resolve(true);
          //   }, 100);
          // });
          // 同步
          return true;
        }}
        onCountdownToggle={(_countdown: number) => {
          console.log(_countdown, '_countdown_countdown');
          setCountdown(_countdown);
        }}
        onRtcTimeAdd={timerData => {
          console.log(timerData, 'onRtcTimeAdd');
        }}
        onRtcTimeRemove={timerData => {
          console.log(timerData, 'onRtcTimeRemove');
        }}
        onRtcTimeUpdate={timerData => {
          console.log(timerData, 'onRtcTimeUpdate');
        }}
      />
    </View>
  );
}
