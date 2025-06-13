import { router } from '@ray-js/ray';
import {
  changePanelInfoState,
  publishDpOutTime,
  clearPublishDpOutTime,
  getDpCodeIsExist,
  getDpValueByDevices,
  getTargetEnumDpActionSheetData,
  getDevId,
  showToastError,
  getDevCategory,
} from '@/utils';
import { goToIpcPageNativeRoute, getIsSupportedCloudStorageSync } from '@ray-js/ray-ipc-utils';
import Strings from '@/i18n';
import store from '@/redux';
import { nativePageRoute } from '@/config/cameraData';

export interface FeatureMenu {
  key: string;
  title: string;
  icon: string;
  onClick: (item) => void;
  // 在离线状态下是否可用，优先级最高
  offlineAvailable: boolean;
  // 在非播放状态下是否可用，播放状态一定可用
  notPreviewAvailable: boolean;
  isVisible: boolean;
  showIcon: boolean;
  dpValue?: boolean | string | number;
  dpCode?: string;
  listen?: boolean;
  hasClick?: boolean;
  type: FeatureType;
  nativePage?: string;
  componentKey?: string;
  miniPage?: string;
  dpListenCallback?: (value, currentItem) => void;
  initDpValue?: () => any;
  visibilityCondition?: () => Promise<boolean>;
  iconVisibilityCondition?: () => Promise<boolean>;
}

export enum FeatureType {
  bool = 'bool',
  enum = 'enum',
  popup = 'popup',
  miniPage = 'miniPage',
  nativePage = 'nativePage',
}

// 定义初始的 Tab 数据
export const initData: FeatureMenu[] = [
  {
    // 回放
    key: 'featurePlayback',
    title: Strings.getLang('homePlayback'),
    icon: 'feature-playback',
    type: FeatureType.nativePage,
    nativePage: nativePageRoute.ipcPlayBackPanel,
    onClick: async item => {
      let useNativePlayBack = true;
      try {
        const res = await new Promise((resolve, reject) => {
          ty.getNgRawData({
            rawKey: 'camera_playback_version',
            success: resolve,
            fail: reject,
          });
        });
        console.log(res, 'res=====dasdas=====');
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
    offlineAvailable: false,
    notPreviewAvailable: false,
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
          return getDevCategory('mobilecam') && (getDpCodeIsExist('sd_status') || result.data);
        }
        return getDpCodeIsExist('sd_status') && getDevCategory('mobilecam');
      } catch (err) {
        return getDpCodeIsExist('sd_status') && getDevCategory('mobilecam');
      }
    },
  },
  {
    // 消息
    key: 'featureMessage',
    title: Strings.getLang('homeFeatureMessage'),
    icon: 'feature-message',
    type: FeatureType.nativePage,
    nativePage: nativePageRoute.ipcMessagePanel,
    onClick: async item => {
      const result = await goToIpcPageNativeRoute(item.nativePage, getDevId());
      if (result.code === -1) {
        showToastError(result?.msg?.errorMsg);
      }
    },
    offlineAvailable: true,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      return getDevCategory('mobilecam');
    },
  },
  {
    key: 'featureAlbum',
    title: Strings.getLang('homeFeatureAlbum'),
    icon: 'album',
    type: FeatureType.nativePage,
    nativePage: nativePageRoute.ipcAlbumPanel,
    onClick: async item => {
      const result = await goToIpcPageNativeRoute(item.nativePage, getDevId());
      if (result.code === -1) {
        showToastError(result?.msg?.errorMsg);
      }
    },
    offlineAvailable: true,
    notPreviewAvailable: true,
    isVisible: true,
    showIcon: true,
    visibilityCondition: async () => {
      return true;
    },
  },
  {
    key: 'featureInteractive',
    title: Strings.getLang('homeFeatureInteractiveMenuTitle'),
    icon: 'move-control-interactive',
    type: FeatureType.popup,
    componentKey: 'interactive',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          key: 'featureInteractive',
          title: Strings.getLang('homeFeatureInteractiveMenuTitle'),
          componentKey: 'interactive',
        },
      });
    },
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      return getDpCodeIsExist('ipc_manual_petting');
    },
  },
  {
    // 激光
    key: 'featureLaserPoint',
    title: Strings.getLang('homeFeatureLaserPointer'),
    icon: 'laser-pointer',
    onClick: item => {
      publishDpOutTime(item.dpCode, !item.dpValue);
    },
    dpValue: false,
    dpCode: 'laser_pointer',
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    type: FeatureType.bool,
    listen: true,
    dpListenCallback: (value, currentItem) => {
      // 如果为当前点击项, 清除超时，对于已经超时的，状态可先不用还原
      currentItem.hasClick && clearPublishDpOutTime();
    },
    visibilityCondition: async () => {
      return getDpCodeIsExist('laser_pointer');
    },
    initDpValue: async () => {
      return getDpValueByDevices('laser_pointer');
    },
  },
  {
    key: 'cloudStorage',
    title: Strings.getLang('homeFeatureCloudStorage'),
    icon: 'cloud-storage',
    type: FeatureType.nativePage,
    nativePage: nativePageRoute.ipcCloudPanel,
    onClick: async item => {
      const result = await goToIpcPageNativeRoute(item.nativePage, getDevId());
      if (result.code === -1) {
        showToastError(result?.msg?.errorMsg);
      }
    },
    offlineAvailable: true,
    notPreviewAvailable: true,
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
        // 匹配NG配置
        if (res?.rawData === '0') {
          return false;
        }
        const result = await getIsSupportedCloudStorageSync(getDevId());
        return result.code === 0 ? result.data : false;
      } catch (err) {
        const result = await getIsSupportedCloudStorageSync(getDevId());
        return result.code === 0 ? result.data : false;
      }
    },
  },
  {
    key: 'featureVoiceChange',
    title: Strings.getLang('homeFeatureVoiceChange'),
    icon: 'voice-change',
    type: FeatureType.popup,
    onClick: () => {
      changePanelInfoState('showSmartPopup', { status: true, componentKey: null });
    },
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: true,
    visibilityCondition: async () => {
      return false;
    },
    iconVisibilityCondition: async () => {
      return true; // 中间 Tab 显示图标
    },
  },
  {
    key: 'featureMotion',
    title: Strings.getLang('homeFeatureMotion'),
    icon: 'voice-change',
    componentKey: 'ptz',
    onClick: item => {
      publishDpOutTime(item.dpCode, !item.dpValue);
    },
    dpValue: false,
    dpCode: 'motion_switch',
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    type: FeatureType.bool,
    listen: true,
    dpListenCallback: (value, currentItem) => {
      // 如果为当前点击项, 清除超时，对于已经超时的，状态可先不用还原
      currentItem.hasClick && clearPublishDpOutTime();
    },
    visibilityCondition: async () => {
      // return getDpCodeIsExist('motion_switch');
      return false;
    },
    initDpValue: async () => {
      return getDpValueByDevices('motion_switch');
    },
  },
  {
    key: 'featureNightvisionMode',
    title: Strings.getLang('featureNightvisionMode'),
    icon: 'paixu',
    type: FeatureType.enum,
    onClick: () => {
      changePanelInfoState('showSmartActionSheet', {
        status: true,
        actionData: getTargetEnumDpActionSheetData('nightvision_mode'),
      });
    },
    dpValue: '',
    dpCode: 'nightvision_mode',
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    listen: true,
    showIcon: false,
    dpListenCallback: (value, currentItem) => {
      // 如果为当前点击项, 清除超时，对于已经超时的，状态可先不用还原
      currentItem.hasClick && clearPublishDpOutTime();
      const { panelInfo } = store.getState();
      const { status } = panelInfo?.showSmartActionSheet;
      // 如果为已经打开, 关闭actionSheet
      if (status && currentItem.hasClick) {
        changePanelInfoState('showSmartActionSheet', { status: false, actionData: null });
      }
    },
    visibilityCondition: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500));
      // return getDpCodeIsExist('nightvision_mode');
      return false;
    },
    iconVisibilityCondition: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    },
    initDpValue: () => {
      return getDpValueByDevices('motion_switch');
    },
  },
  {
    key: 'featurePtz',
    title: Strings.getLang('homeFeaturePtz'),
    icon: 'ptz-collect',
    type: FeatureType.popup,
    componentKey: 'ptz',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          key: 'featurePtz',
          title: Strings.getLang('homeFeaturePtz'),
          componentKey: 'ptz',
        },
      });
    },
    offlineAvailable: false,
    notPreviewAvailable: false,
    // offlineAvailable: true,
    // notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    visibilityCondition: async () => {
      return getDpCodeIsExist('ptz_control');
    },
    iconVisibilityCondition: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500));
      return true; // 右边 Tab 不显示图标
    },
  },
  {
    key: 'featureMore',
    title: Strings.getLang('homeFeatureMore'),
    icon: 'more',
    type: FeatureType.miniPage,
    miniPage: '/feature',
    onClick: item => {
      router.push(item.miniPage);
    },
    offlineAvailable: true,
    notPreviewAvailable: true,
    isVisible: true,
    showIcon: false,
    visibilityCondition: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    },
    iconVisibilityCondition: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1500));
      return true; // 右边 Tab 不显示图标
    },
  },
];
