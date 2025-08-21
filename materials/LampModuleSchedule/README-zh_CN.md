[English](./README.md) | 简体中文

# @ray-js/lamp-module-schedule

> 照明定时倒计时模块组件

## 安装

```sh
// npm
$ npm install @ray-js/lamp-module-schedule
// yarn
$ yarn add @ray-js/lamp-module-schedule

// 或者
$ npm install @ray-js/components-ty-lamp
$ yarn add @ray-js/components-ty-lamp
```

## 预览

![预览](https://images.tuyacn.com/smart/ui_design_pkg_icon/non-session-user/1676625858088a9f4394d.png)

## 使用

- 属性与方法

```js
interface TimerData {
  id: string; // 定时组id， 当为本地定时时与timerId一致
  timerId?: string; // 定时id， 当为本地定时时与id一致
  weeks: number[]; // 定时周期[0,0,0,0,0,0,0] => 对应星期的“日一二三四五六”, 1为开启，0为关闭；0000000 => 仅一次；1111111 => 每天
  opened: boolean; // 是否开启
  time: string; // 定时时间
  dps: {
    [v: string]: any,
  };
}

type TTimer = {
  status: any,
  time: string,
  loops: string,
  dps: Record<string, any>,
  id?: string,
  timerId?: string,
};

interface IProps {
  /**
   * @description.zh 组件样式
   * @description.en Component style
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 设置主题样式
   * @description.en Set theme style
   * @default {}
   */
  themeConfig?: {
    // 整体背景色
    background?: string,
    // 主题
    theme?: 'light' | 'dark',
    // 品牌色
    brandColor?: string,
    // 字体颜色
    fontColor?: {
      titlePrimary?: string, // 主要标题文字颜色
      textPrimary?: string, // 主要文字颜色
      textRegular?: string, // 常规文字颜色
    },
    // 卡片样式
    card?: {
      background?: string,
      borderColor?: string,
      textPrimary?: string,
      textRegular?: string,
    },
    // 时间选择器样式
    timer?: {
      background?: string,
      timerPickerBorderColor?: string,
      customStyle: {
        color?: string,
        borderColor?: string,
        boxShadowColor?: string,
        background?: string,
      },
    },
  };
  /**
   * @description.zh 是否展示顶部导航栏
   * @description.en Whether to display the top navigation bar
   * @default
   */
  showHeader?: boolean;
  /**
   * @description.zh 是否展示胶囊按钮
   * @description.en Whether to display the capsule button
   * @default true 默认展示
   */
  showMenuButton?: boolean;
  /**
   * @description.zh 自定义计划包裹层的样式
   * @description.en Customize the style of the planned wrap layer
   * @default {}
   */
  customItemContainerStyle?: React.CSSProperties;
  /**
   * @description.zh 设备id, 如果是单设备传入devId，如果群组传入groupId
   * @description.en Device id
   * @default
   */
  devId?: string;
  /**
   * @description.zh 群组设备id,如果是单设备传入devId，如果群组传入groupId
   * @description.en Group id
   * @default
   */
  groupId?: string;
  /**
   * @description.zh 是否支持倒计时
   * @description.en Whether to support the countdown
   * @default false
   */
  supportCountdown?: boolean;
  /**
   * @description.zh 是否支持本地定时, 群组不支持本地定时
   * @description.en Whether to support the local time，Group does not support local time
   * @default false
   */
  supportRctTimer?: boolean;
  /**
   * @description.zh 是否支持云定时,如果云定时和本地定时都支持，本地定时优先级更高
   * @description.en Whether to support the cloud, if cloud timed and local support, local time higher priority
   * @default false
   */
  supportCloudTimer?: boolean;
  /**
   * @description.zh 渲染自定义计划的功能
   * @description.en The ability to render custom plans
   * @default {}
   */
  renderCustomItem?: () => React.ReactElement;
  /**
   * @description.zh 定时功能配置项
   * @description.en Timing function configuration items
   * @default {}
   */
  timingConfig?: {
    timerLimitNum?: number, // 默认本地定时10个，云端定时30个
    actionList?: {
      label: string, // 标题
      // 选中行为需要保存的dp列表
      dpList: {
        value: string | number | boolean, // dp值
        code: string, // dp code
        id: number, // dp id
      }[],
      type: 'custom', // 自定义复杂场景动作
      callback: (res: TTimer) => void, // 自定义复杂场景动作的回调函数
      renderCustomActionText: () => string, // 自定义渲染复杂场景动作的文本
    }[],
  };
  /**
   * @description.zh 倒计时功能配置项
   * @description.en The countdown function configuration items
   * @default {}
   */
  countdownConfig?: {
    countdown: number, // 倒数计剩余秒数
  };
  /**
   * @description.zh 倒计时切换时的回调函数
   * @description.en The countdown when switching the callback function
   * @param countdown: 倒数计数值 单位以s计数 / Countdown numerical unit s count
   * @default
   */
  onCountdownToggle?: (countdown: number) => void;
  /**
   * @description.zh 定时数据被修改之前触发，如果返回false，将不会触发后续逻辑，一般用于定时数据的校验
   * @description.en Timing trigger before data is modified, if return false， it will do not trigger after logic, commonly used in data check regularly
   * @default
   */
  onBeforeTimerChange?: (
    timerData: TimerData | TimerData[],
    type: 'add' | 'remove' | 'update' | 'init'
  ) => boolean;
  /**
   * @description.zh 添加本地定时的回调
   * @description.en Add local regular callback
   * @default
   */
  onRtcTimeAdd?: (timerData: TimerData) => void;
  /**
   * @description.zh 删除本地定时的回调
   * @description.en Delete local regular callback
   * @default
   */
  onRtcTimeRemove?: (timerData: TimerData) => void;
  /**
   * @description.zh 更新本地定时的回调
   * @description.en Update the local regular callback
   * @default
   */
  onRtcTimeUpdate?: (timerData: TimerData) => void;
}
```

- useTriggerChildrenFunction 介绍

```js
// 引入
import LampModuleSchedule, { useTriggerChildrenFunction } from '@ray-js/lamp-module-schedule';
// 使用
// "timerToggle" 切换定时项目的开关状态
// "closeAllTimer" 关闭所有的定时
const triggerType = 'timerToggle'; // 触发子组件的方法，支持
const { run: runTimerToggle } = useTriggerChildrenFunction(triggerType);

const triggerType1 = 'closeAllTimer'; // 触发子组件的方法，支持
const { run: runCloseAllTimer } = useTriggerChildrenFunction(triggerType1);

// 触发
const timerId = 1; // timerId
const timerStatus = false; // 定时开启关闭状态

setTimeout(() => {
  const timerId = 1; // timerId
  const timerStatus = false; // 定时开启关闭状态
  runTimerToggle(timerId, timerStatus);
}, 3000);
```

```tsx
// 第一种引用方式
import LampModuleSchedule, {
  useCountdownTime,
  useCountdownDpPull,
  useTriggerChildrenFunction,
} from '@ray-js/lamp-module-schedule';
// 第二种引用方式
import { LampModuleSchedule } from '@ray-js/components-ty-lamp';
const { useCountdownTime, useCountdownDpPull, useTriggerChildrenFunction } = LampModuleSchedule;

const dpCodes = {
  switchCode: 'switch_led',
  countdownCode: 'countdown',
  rtcTimerCode: 'rtc_timer',
  musicCode: 'dreamlightmic_music_data',
  workModeCode: 'woke_mode',
};

// 根据需求自行调整
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
];

const Main = () => {
  const state = useSelector(_state => _state);
  const { countdown } = state.dpState;
  const [_countdown, setCountdown] = useState(countdown);
  // 由于dp获取后不会变化，倒计时数据需要自行进行处理
  useCountdownTime(countdown, (_countdown: number) => {
    // 进行倒计时更新
    setCountdown(_countdown);
    if (_countdown <= 0) {
      // 下发dp
    }
  });

  const { run: runTimerToggle } = useTriggerChildrenFunction('timerToggle');
  // mock dp触发定时状态修改
  useEffect(() => {
    setTimeout(() => {
      const timerId = 1;
      const timerStatus = false;
      runTimerToggle(timerId, timerStatus);
    }, 4000),
  }, []);
  // sigmesh协议下需要主动拉取倒计时dp值，防止倒计时dp不同步
  const dpId = 1; // TODO:
  useCountdownDpPull(state.devInfo.devId, dpId);
  return (
    <LampModuleSchedule
      devId={state.devInfo?.devId}
      groupId={state.devInfo?.groupId}
      supportCountdown
      supportCloudTimer
      supportRctTimer
      // showHeader={false}
      countdownConfig={{
        countdown: _countdown,
      }}
      timingConfig={{
        actionList,
        timerLimitNum: 6,
      }}
      themeConfig={{
        theme: 'dark',
        // 整体背景色
        background: '#0E263E',
        // 品牌色
        brandColor: '#00BE9B',
        // 字体颜色
        fontColor: {
          titlePrimary: '#FFFFFF', // 主要标题文字颜色
          textPrimary: '#FFFFFF', // 主要文字颜色
          textRegular: 'rgba(255, 255, 255, 0.5)', // 常规文字颜色
        },
        // 卡片样式
        card: {
          background: 'rgba(35, 58, 82, 0.78)',
          borderColor: 'rgba(255, 255, 255, 0.102054)',
          textPrimary: '#fff',
          textRegular: 'rgba(255, 255, 255, 0.5)',
        },
        // 时间选择器样式
        timer: {
          background: 'rgba(14, 38, 62, 1)', // 背景色
          timerPickerBorderColor: 'rgba(31, 48, 64, 1)', // 分割线颜色
          customStyle: {
            color: '#fff', // 自定义周期文字颜色
            borderColor: 'rgba(255, 255, 255, 0.1)', // 自定义周期边框颜色
            background: 'rgba(35, 58, 82, 0.78)', // 自定义周期卡片背景色
          },
        },
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
  );
};
```

## 注意事项：

### 定时倒计时模块

- 倒计时最长支持 24 小时可选，支持到分；
- 太阳能方案不支持倒计时，强电方案支持倒计时；

### 模块逻辑

- 单设备走 RTC 定时，群组走云定时，单设备如果既有 RTC 定时又有云定时，默认走 RTC 定时；
