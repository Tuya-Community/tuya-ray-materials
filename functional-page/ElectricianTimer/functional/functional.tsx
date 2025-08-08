import React from 'react';
import './functional.less';
import { Provider } from 'react-redux';
import { SdmProvider, SmartDeviceModel } from '@ray-js/panel-sdk';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { dpKit, initDevice } from '@/devices';
import { init as initSDK } from '@ray-js/electrician-timing-sdk';
import Strings from '@/i18n';
import store from '@/redux';
import { initializeSystemInfo } from '@/redux/modules/systemInfoSlice';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import { offDpDataChange, offGroupDpCodeChange, onDpDataChange, onGroupDpCodeChange } from '@ray-js/ray';
import { config, fetchChannelDps, setConfig } from './config';
import { handleSupportFunctions } from './utils';
import { syncI18n } from './i18n/sync';
import { fetchDpNames } from './redux/modules/commonSlice';

interface Props {
  children: React.ReactNode;
}

interface State {
  device?: ReturnType<typeof initDevice>[0];
}

// initPanelEnvironment({ useDefaultOffline: true });
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      device: undefined,
    };
  }

  /**
   * 功能只支持 onLaunch
   * @param options
   */
  async onLaunch(options: LaunchOptionsApp) {
    /**
     * 这里可以获取到宿主小程序跳转至当前功能页的 url 配置参数，
     * 而 getLaunchOptionsSync 可以获取到宿主小程序的启动参数
     */
    const {
      deviceId,
      groupId,
      // brand, // 主题色
      theme, // 主题配色方案 dark 或 light，不传则跟随系统
      switchCodes, // 支持的开关
      countdownCodes, // 支持的倒计时，注意，由于开关与倒计时是配对出现，所以配置此属性，需要同时配置支持的开关
      supportCountdown, // 是否支持的倒计时,值可为： n,y，默认为不支持
      supportCycle, // 是否支持循环定时，值可为： n,y，不传则根据是否有dp功能决定是否支持
      supportRandom, // 是否支持随机定时，值可为： n,y，不传则根据是否有dp功能决定是否支持
      supportInching, // 是否支持延时开关，值可为： n,y，不传则根据是否有dp功能决定是否支持
      supportAstronomical, // 是否支持天文定时， 值可为： n,y，不传则根据设备的属性决定是否支持
      dpCodes, // 非开关性 dp 设置，多个的情况请以英文逗号隔开
      cycleCode,
      randomCode,
      inchingCode,
      is24Hour,
      category,
    } = options?.query ?? {};

    const systemInfo = getCachedSystemInfo();

    // if (theme) {
    //   // TODO 处理配色
    // }
    // store.dispatch(updateThemeType(theme || systemInfo.theme));

    // 配置信息保存
    const newConfig = {
      // brand: brand ? brand : '#ff4800',
      switchCodes: switchCodes ? switchCodes.split(',') : [],
      countdownCodes: countdownCodes ? countdownCodes.split(',') : [],
      // 支持的能力，只要配置则
      isSupportCountdown: supportCountdown,
      isSupportCycle: supportCycle,
      isSupportRandom: supportRandom,
      isSupportInching: supportInching,
      isSupportAstronomical: groupId ? 'n' : supportAstronomical,
      cycleCode,
      randomCode,
      inchingCode,
      category,
      is24Hour: is24Hour ? is24Hour === 'y' : systemInfo.is24Hour, // 有设置则以设置为准，否则跟随系统
    };

    setConfig(newConfig);

    const [device] = initDevice({ deviceId, groupId });
    this.setState({ device });

    initSDK({
      type: 'ele',
      devId: deviceId,
      groupId,
      supportCloud: config.isSupportNormal ? config.isSupportNormal : 'auto',
      supportCycle: config.isSupportCycle ? config.isSupportCycle : 'auto',
      supportRandom: config.isSupportRandom ? config.isSupportRandom : 'auto',
      supportInching: config.isSupportInching ? config.isSupportInching : 'auto',
      cycleCode,
      randomCode,
      inchingCode,
      category,
      is24Hour: is24Hour ? is24Hour === 'y' : systemInfo.is24Hour,
      combineSameData: (switchCodes && switchCodes.indexOf(",") === -1) ? false : true,
    });

    device.init();
    device.onInitialized(async (device) => {
      dpKit.init(device);
      console.log('device info', device.getDevInfo());
      const devInfo = device.getDevInfo();
      const dpSchema = device.getDpSchema();
      // 处理通道数据
      fetchChannelDps(dpSchema);

      handleSupportFunctions(devInfo, dpSchema);

      console.log('config', config);

      // 同步pid多语言
      syncI18n(devInfo.productId).then(() => {
        this.forceUpdate();
      });

      store.dispatch(
        fetchDpNames({
          devId: devInfo.devId,
          gwId: devInfo.parentId || devInfo.devId,
          groupId: devInfo.groupId,
        }),
      );
    });
    store.dispatch(initializeSystemInfo(systemInfo));

    // onDpDataChange((data) => {
    //   console.log('receive', data);
    // });
  }

  async onUnload() {
    // @ts-ignore
    this.handleDpChange && offDpDataChange(this.handleDpChange);
    // @ts-ignore
    this.handleDpChange && offGroupDpCodeChange(this.handleDpChange);
  }

  render() {
    let { children } = this.props;

    /**
     * 只有在当前功能页为智能设备时，才会使用 SdmProvider，
     * 当然如果是普通的智能小程序，也可以直接去掉这端适配逻辑
     */
    if (this.state.device instanceof SmartDeviceModel) {
      children = <SdmProvider value={this.state.device}>{this.props.children}</SdmProvider>;
    }
    return (
      <Provider store={store}>
        {/* @ts-ignore */}
        <RayErrorCatch
          // @ts-ignore
          errorTitle={Strings.getLang('errorTitle')}
          // @ts-ignore
          errorText={Strings.getLang('errorText')}
          // @ts-ignore
          submitText={Strings.getLang('submitText')}
        >
          {children}
        </RayErrorCatch>
      </Provider>
    );
  }
}

export default App;
