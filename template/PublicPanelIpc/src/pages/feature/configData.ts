import { router } from '@ray-js/ray';
import {
  changePanelInfoState,
  publishDpOutTime,
  clearPublishDpOutTime,
  getDpCodeIsExist,
  getDpValueByDevices,
} from '@/utils';
import Strings from '@/i18n';

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

// 定义初始的功能列表项数据
export const initData: FeatureMenu[] = [
  {
    // 隐私模式
    key: 'basicPrivate',
    title: Strings.getLang('moreFeaturePrivateMode'),
    icon: 'private',
    onClick: item => {
      publishDpOutTime(item.dpCode, !item.dpValue);
    },
    dpValue: false,
    dpCode: 'basic_private',
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
      return getDpCodeIsExist('basic_private');
    },
    initDpValue: async () => {
      return getDpValueByDevices('basic_private');
    },
  },
  {
    // WDR
    key: 'basicWdr',
    title: Strings.getLang('moreFeatureWdr'),
    icon: 'wdr',
    onClick: item => {
      publishDpOutTime(item.dpCode, !item.dpValue);
    },
    dpValue: false,
    dpCode: 'basic_wdr',
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
      return getDpCodeIsExist('basic_wdr');
    },
    initDpValue: async () => {
      return getDpValueByDevices('basic_wdr');
    },
  },
  {
    // 巡航
    key: 'cruise',
    title: Strings.getLang('moreFeatureCruise'),
    icon: 'cruise',
    type: FeatureType.miniPage,
    miniPage: '/list',
    onClick: item => {
      router.push(`/list?key=cruise&title=${encodeURIComponent(item.title)}`);
    },
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    visibilityCondition: async () => {
      return getDpCodeIsExist('cruise_status');
    },
    iconVisibilityCondition: async () => {
      return true;
    },
  },
  {
    // 警笛
    key: 'siren',
    title: Strings.getLang('moreFeatureSiren'),
    icon: 'siren',
    type: FeatureType.popup,
    componentKey: 'todo',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          key: 'siren',
          title: Strings.getLang('moreFeatureSiren'),
          componentKey: 'todo',
        },
      });
    },
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    visibilityCondition: async () => {
      // return getDpCodeIsExist('siren_switch');
      return false;
    },
    iconVisibilityCondition: async () => {
      return true;
    },
  },
  {
    // 灯
    key: 'floodlight',
    title: Strings.getLang('moreFeatureFloodlight'),
    icon: 'floodlight',
    onClick: item => {
      publishDpOutTime(item.dpCode, !item.dpValue);
    },
    dpValue: false,
    dpCode: 'floodlight_switch',
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
      return getDpCodeIsExist('floodlight_switch');
    },
    initDpValue: async () => {
      return getDpValueByDevices('floodlight_switch');
    },
  },
  {
    // 锁
    key: 'accessoryLock',
    title: Strings.getLang('moreFeatureAccessoryLock'),
    icon: 'lock',
    type: FeatureType.popup,
    componentKey: 'todo',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          popupData: {
            key: 'accessoryLock',
            title: Strings.getLang('moreFeatureAccessoryLock'),
            componentKey: 'todo',
          },
        },
      });
    },
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    visibilityCondition: async () => {
      // return getDpCodeIsExist('accessory_lock');
      return false;
    },
    iconVisibilityCondition: async () => {
      return true;
    },
  },
  {
    // 摇篮曲
    key: 'lullaby',
    title: Strings.getLang('moreFeatureLullaby'),
    icon: 'lullaby',
    type: FeatureType.popup,
    componentKey: 'todo',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          key: 'lullaby',
          title: Strings.getLang('moreFeatureLullaby'),
          componentKey: 'todo',
        },
      });
    },
    offlineAvailable: false,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    visibilityCondition: async () => {
      return getDpCodeIsExist('ipc_lullaby');
    },
    iconVisibilityCondition: async () => {
      return false;
    },
  },
  {
    // 跨设备控制
    key: 'crossControl',
    title: Strings.getLang('moreFeatureCrossControl'),
    icon: 'cross-add',
    type: FeatureType.popup,
    componentKey: 'todo',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          key: 'crossControl',
          title: Strings.getLang('moreFeatureCrossControl'),
          componentKey: 'todo',
        },
      });
    },
    offlineAvailable: true,
    notPreviewAvailable: true,
    isVisible: false,
    showIcon: false,
    visibilityCondition: async () => {
      return false;
    },
    iconVisibilityCondition: async () => {
      return true;
    },
  },
];
