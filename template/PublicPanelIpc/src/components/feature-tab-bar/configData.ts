import {
  goToIpcPageNativeRoute,
  getCameraConfigInfo,
  getIsSupportedCloudStorageSync,
  ipcTTTOperatorLog,
} from '@ray-js/ray-ipc-utils';
import Strings from '@/i18n';
import {
  getDevId,
  showToastError,
  getDpCodeIsExist,
  changePanelInfoState,
  getDevCategory,
} from '@/utils';
import { nativePageRoute } from '@/config/cameraData';

export interface TabBar {
  key: string;
  label: string;
  icon: string;
  onPress: (data: any) => void;
  // 在离线状态下是否可用，优先级最高
  offlineAvailable: boolean;
  // 在非播放状态下是否可用，播放状态一定可用
  notPreviewAvailable: boolean;
  isVisible: boolean;
  showIcon: boolean;
  nativePage?: string;
  isCenter?: boolean;
  visibilityCondition?: () => Promise<boolean>;
}

// 定义初始的 Tab 数据
export const initData: TabBar[] = [
  {
    key: 'playback',
    label: Strings.getLang('tabFeaturePlayback'),
    icon: 'playback',
    offlineAvailable: false,
    notPreviewAvailable: false,
    nativePage: nativePageRoute.ipcPlayBackPanel,
    onPress: async item => {
      let useNativePlayBack = true;
      try {
        const res = await new Promise((resolve, reject) => {
          ty.getNgRawData({
            rawKey: 'camera_playback_version',
            success: resolve,
            fail: reject,
          });
        });
        // 匹配NG配置
        if (res?.rawData === '0') {
          useNativePlayBack = false;
        }
      } catch (err) {
        console.log(err, 'err');
      }
      const result = await goToIpcPageNativeRoute(
        useNativePlayBack ? item.nativePage : nativePageRoute.ipcCloudPanel,
        getDevId()
      );
      if (result.code === -1) {
        showToastError(result?.msg?.errorMsg);
      }
    },
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      try {
        const res = await new Promise((resolve, reject) => {
          ty.getNgRawData({
            rawKey: 'camera_playback_version',
            success: resolve,
            fail: reject,
          });
        });
        const result = await getIsSupportedCloudStorageSync(getDevId());
        // 匹配NG配置, 并且需设备支持SD卡回放DP或支持云存
        if (res?.rawData === '0') {
          return !getDevCategory('mobilecam') && (getDpCodeIsExist('sd_status') || result.data);
        }
        return getDpCodeIsExist('sd_status') && !getDevCategory('mobilecam');
      } catch (err) {
        return getDpCodeIsExist('sd_status') && !getDevCategory('mobilecam');
      }
    },
  },

  // visibilityCondition: async () => {

  //   return getDpCodeIsExist('sd_status') && !getDevCategory('mobilecam');
  // },
  // },
  {
    key: 'remote',
    label: Strings.getLang('tabFeatureRemoteControl'),
    icon: 'tab-remote-control',
    offlineAvailable: false,
    notPreviewAvailable: true,
    nativePage: nativePageRoute.ipcPlayBackPanel,
    onPress: async () => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          componentKey: 'remoteControl',
          title: Strings.getLang('homeFeatureRemoteControl'),
        },
      });
    },
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      return getDpCodeIsExist('ipc_direction_control') && getDevCategory('mobilecam');
    },
  },

  {
    key: 'intercom',
    label: Strings.getLang('tabFeatureIntercom'),
    icon: 'one-way-intercom',
    onPress: item => console.log('麦克风'),
    isVisible: false,
    offlineAvailable: false,
    notPreviewAvailable: false,
    showIcon: true,
    isCenter: true,
    visibilityCondition: async () => {
      const result = await getCameraConfigInfo(getDevId());
      ipcTTTOperatorLog(`getCameraConfigInfo-intercom: ${result}`);
      if (result.code === 0) {
        const { isIntercomSupported } = result.data?.intercomInfo;
        changePanelInfoState('isIntercomSupported', isIntercomSupported);
        return isIntercomSupported;
      }
      return false;
    },
  },
  // 路径相关的 dp 还没规划
  {
    key: 'path',
    label: Strings.getLang('tabFeaturePath'),
    icon: 'tab-path',
    offlineAvailable: true,
    notPreviewAvailable: true,
    nativePage: nativePageRoute.ipcPlayBackPanel,
    onPress: async item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: { componentKey: 'pathManager', title: Strings.getLang('pathManagerPopTitle') },
      });
    },
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      return getDpCodeIsExist('ipc_mobile_path');
    },
  },
  {
    key: 'message',
    label: Strings.getLang('tabFeatureMessage'),
    icon: 'message',
    offlineAvailable: true,
    notPreviewAvailable: true,
    nativePage: nativePageRoute.ipcMessagePanel,
    onPress: async item => {
      const result = await goToIpcPageNativeRoute(item.nativePage, getDevId());
      if (result.code === -1) {
        showToastError(result?.msg?.errorMsg);
      }
    },
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      return !getDevCategory('mobilecam');
    },
  },
];
