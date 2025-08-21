English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-module-schedule

> lamp-module-schedule

## install

```sh
$ npm install @ray-js/lamp-module-schedule
$ yarn add @ray-js/lamp-module-schedule

// or
$ npm install @ray-js/components-ty-lamp
$ yarn add @ray-js/components-ty-lamp
```

## Preview

![预览](https://images.tuyacn.com/smart/ui_design_pkg_icon/non-session-user/1676625858088a9f4394d.png)

## Usage

- Props And Methods

```js

interface TimerData {
  id: string; // 定时组id， 当为本地定时时与timerId一致
  timerId?: string; // 定时id， 当为本地定时时与id一致
  weeks: number[]; // 定时周期[0,0,0,0,0,0,0] => 对应星期的“日一二三四五六”, 1为开启，0为关闭；0000000 => 仅一次；1111111 => 每天
  opened: boolean; // 是否开启
  time: string; // 定时时间
  dps: {
    [v: string]: any;
  };
}
type TTimer = {
  status: any;
  time: string;
  loops: string;
  dps: Record<string, any>;
  id?: string;
  timerId?: string;
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
    // background color
    background?: string;
    // 主题
    theme?: 'light' | 'dark';
    // brand color
    brandColor?: string;
    // font color
    fontColor?: {
      titlePrimary?: string; // Main title text color
      textPrimary?: string; // Main text color
      textRegular?: string; // regular text color
    };
    // card style
    card?: {
      background?: string;
      borderColor?: string;
      textPrimary?: string;
      textRegular?: string;
    };
    // Time picker style
    timer?: {
      background?: string;
      timerPickerBorderColor?: string;
      customStyle: {
        color?: string;
        borderColor?: string;
        boxShadowColor?: string;
        background?: string;
      };
    };
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
    timerLimitNum?: number; // "Default local timing is 10, while cloud timing is 30."
    actionList?: {
      label: string; // Title
      // The list of "dp" values to be saved for the selected rows
      dpList: {
        value: string | number | boolean, // dp value
        code: string, // dp code
        id: number; // dp id
      }[],
      type: 'custom'; // Custom complex scenario action
      callback: (res: TTimer) => void; // Callback function for custom complex scenario action
      renderCustomActionText: () => string; // Customize the text for rendering a complex scene action
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
    timerDatas: TimerData | []TimerData,
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

- useTriggerChildrenFunction introduce

```js
// import
import LampModuleSchedule, { useTriggerChildrenFunction } from '@ray-js/lamp-module-schedule';
// usage
// "timerToggle" The switch status of a scheduled item is changed
// "closeAllTimer" Turn off all timing
const triggerType = 'timerToggle'; // Method that triggers child components
const { run: runTimerToggle } = useTriggerChildrenFunction(triggerType);

const triggerType1 = 'closeAllTimer';
const { run: runCloseAllTimer } = useTriggerChildrenFunction(triggerType1);

setTimeout(() => {
  const timerId = 1; // timerId
  const timerStatus = false; // 定时开启关闭状态
  runTimerToggle(timerId, timerStatus);
}, 3000);
```

```tsx
// The first reference method
import LampModuleSchedule, {
  useCountdownTime,
  useCountdownDpPull,
  useTriggerChildrenFunction,
} from '@ray-js/lamp-module-schedule';
// The second reference method
import { LampModuleSchedule } from '@ray-js/components-ty-lamp';
const { useCountdownTime, useCountdownDpPull, useTriggerChildrenFunction } = LampModuleSchedule;

const dpCodes = {
  switchCode: 'switch_led',
  countdownCode: 'countdown',
  rtcTimerCode: 'rtc_timer',
  musicCode: 'dreamlightmic_music_data',
  workModeCode: 'woke_mode',
};

// According to the requirements to adjust
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

  // Under sigmesh protocol, it is necessary to actively pull the countdown dp value to prevent the countdown dp from being out of sync
  const dpId = 1; // TODO:
  useCountdownDpPull(state.devInfo.devId, dpId);

  const { run: runTimerToggle } = useTriggerChildrenFunction('timerToggle');
  // mock dp Triggers the timing status change
  useEffect(() => {
    setTimeout(() => {
      const timerId = 1;
      const timerStatus = false;
      runTimerToggle(timerId, timerStatus);
    }, 4000),
  }, []);

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
        theme: 'dark', // Black theme, default white theme
        // Overall background color
        background: '#0E263E',
        // Brand color
        brandColor: '#00BE9B',
        // Font color
        fontColor: {
          titlePrimary: '#FFFFFF', // Main title text color
          textPrimary: '#FFFFFF', // Main text color
          textRegular: 'rgba(255, 255, 255, 0.5)', // Regular text color
        },
        // Card style
        card: {
          background: 'rgba(35, 58, 82, 0.78)',
          borderColor: 'rgba(255, 255, 255, 0.102054)',
          textPrimary: '#fff',
          textRegular: 'rgba(255, 255, 255, 0.5)',
        },
        // Time selector style
        timer: {
          background: 'rgba(14, 38, 62, 1)', // background
          timerPickerBorderColor: 'rgba(31, 48, 64, 1)', // Divider color
          customStyle: {
            color: '#fff', // Custom cycle text color
            borderColor: 'rgba(255, 255, 255, 0.1)', // Customize the periodic border color
            background: 'rgba(35, 58, 82, 0.78)', // Custom cycle card background color
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

## Notes:

### Timing countdown module

- The countdown supports up to 24 hours, and supports minute-by-minute;
- The solar solution does not support countdown, but the strong power solution does;

### Module logic

- Single device uses RTC timing, and the group uses cloud timing. If a single device has both RTC timing and cloud timing, the default is RTC timing;
