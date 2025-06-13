import { getCollectionPointsInfo } from '@ray-js/ray-ipc-utils';
import {
  changePanelInfoState,
  publishDpOutTime,
  clearPublishDpOutTime,
  getDpCodeIsExist,
  getEnumRangeIsValid,
  getEnumRangeData,
  getDpValueByDevices,
  getTargetEnumDpActionSheetData,
  isEqualCurrentValue,
  showToastError,
  getDevId,
} from '@/utils';
import Strings from '@/i18n';

export interface FeatureMenu {
  groupKey: string;
  groupTitle?: string;
  key: string;
  title: string;
  label?: string;
  icon: string;
  checkedIcon?: string;
  showCheckedIcon?: boolean;
  onClick: (item) => void | boolean | Promise<void | boolean>;
  isVisible: boolean;
  dpValue?: boolean | string | number;
  dpCode?: string;
  publishValue?: any; // 下发的值
  listen?: boolean;
  hasClick?: boolean;
  type: FeatureType;
  component?: JSX.Element;
  miniPage?: string;
  dpListenCallback?: (value, currentItem) => void;
  initDpValue?: () => any;
  visibilityCondition?: () => Promise<boolean>;
  checkedIconVisibilityCondition?: () => Promise<boolean>;
  iconVisibilityCondition?: () => Promise<boolean>;
}

export enum FeatureType {
  bool = 'bool',
  enum = 'enum',
  popup = 'popup',
  // 列表选择类
  listChoice = 'listChoice',
  miniPage = 'miniPage',
  nativePage = 'nativePage',
}

// 根据key配置定义数据
export const cruiseData: FeatureMenu[] = [
  {
    groupKey: 'switches',
    groupTitle: undefined,
    key: 'cruiseSwitch',
    title: Strings.getLang('cruiseListSwitch'),
    icon: 'paixu',
    type: FeatureType.bool,
    onClick: item => {
      publishDpOutTime(item.dpCode, !item.dpValue);
    },
    isVisible: false,
    dpValue: false,
    dpCode: 'cruise_switch',
    listen: true,
    dpListenCallback: (value, currentItem) => {
      // 如果为当前点击项, 清除超时，对于已经超时的，状态可先不用还原
      currentItem.hasClick && clearPublishDpOutTime();
    },
    visibilityCondition: async () => {
      return getDpCodeIsExist('cruise_switch');
    },
    initDpValue: async () => {
      return getDpValueByDevices('cruise_switch');
    },
  },
  {
    //  全景巡航
    groupKey: 'modes',
    groupTitle: Strings.getLang('cruiseListModeTitle'),
    key: 'panorama',
    title: Strings.getLang('cruiseListModePanorama'),
    label: Strings.getLang('cruiseListModePanoramaLabel'),
    icon: 'paixu',
    dpCode: 'cruise_mode',
    publishValue: '0',
    checkedIcon: 'list-checked',
    showCheckedIcon: false,
    type: FeatureType.listChoice,
    dpValue: undefined,
    onClick: item => {
      !isEqualCurrentValue(item.dpValue, item.publishValue) &&
        publishDpOutTime(item.dpCode, item.publishValue);
    },
    isVisible: false,
    listen: true,
    visibilityCondition: async () => {
      const enumLength = getEnumRangeData('cruise_mode').length;
      return (
        enumLength >= 2 &&
        getEnumRangeIsValid('cruise_mode', '0') &&
        getDpValueByDevices('cruise_switch')
      );
    },
    checkedIconVisibilityCondition: async () => {
      console.log(getDpValueByDevices('cruise_mode') === '0', '++++++');
      return getDpValueByDevices('cruise_mode') === '0';
    },
    initDpValue: () => {
      return getDpValueByDevices('cruise_mode');
    },
  },
  {
    //  收藏点巡航
    groupKey: 'modes',
    groupTitle: Strings.getLang('cruiseListModeTitle'),
    key: 'collection',
    title: Strings.getLang('cruiseListModeCollection'),
    label: Strings.getLang('cruiseListModeCollectionLabel'),
    icon: 'paixu',
    checkedIcon: 'list-checked',
    showCheckedIcon: false,
    onClick: async item => {
      if (isEqualCurrentValue(item.dpValue, item.publishValue)) {
        return Promise.resolve(false);
      }
      // 判定收藏点数量是否大于2
      const collectData = await getCollectionPointsInfo(getDevId());
      if (collectData.length < 2) {
        showToastError({ code: -1, msg: Strings.getLang('collectListLengthLess2') });
        return Promise.resolve(false);
      }
      publishDpOutTime(item.dpCode, item.publishValue);
      return Promise.resolve(false);
    },
    dpValue: undefined,
    dpCode: 'cruise_mode',
    publishValue: '1',
    isVisible: false,
    type: FeatureType.listChoice,
    listen: true,
    dpListenCallback: (value, currentItem) => {
      // 如果为当前点击项, 清除超时，对于已经超时的，状态可先不用还原
      currentItem.hasClick && clearPublishDpOutTime();
    },
    visibilityCondition: async () => {
      const enumLength = getEnumRangeData('cruise_mode').length;
      return (
        enumLength >= 2 &&
        getEnumRangeIsValid('cruise_mode', '1') &&
        getDpValueByDevices('cruise_switch')
      );
    },
    checkedIconVisibilityCondition: async () => {
      return getDpValueByDevices('cruise_mode') === '1';
    },
    initDpValue: async () => {
      return getDpValueByDevices('cruise_mode');
    },
  },
  {
    //  全天巡航
    groupKey: 'timings',
    groupTitle: Strings.getLang('cruiseListTimingsTitle'),
    key: 'allDay',
    title: Strings.getLang('cruiseListTimingsAllDay'),
    label: Strings.getLang('cruiseListTimingsAllDayLabel'),
    icon: 'paixu',
    checkedIcon: 'list-checked',
    showCheckedIcon: false,
    type: FeatureType.listChoice,
    onClick: item => {
      !isEqualCurrentValue(item.dpValue, item.publishValue) &&
        publishDpOutTime(item.dpCode, item.publishValue);
    },
    dpValue: undefined,
    dpCode: 'cruise_time_mode',
    publishValue: '0',
    isVisible: false,
    listen: true,
    dpListenCallback: (value, currentItem) => {
      // 如果为当前点击项, 清除超时，对于已经超时的，状态可先不用还原
      currentItem.hasClick && clearPublishDpOutTime();
    },
    visibilityCondition: async () => {
      const enumLength = getEnumRangeData('cruise_time_mode').length;
      return (
        enumLength >= 1 &&
        getEnumRangeIsValid('cruise_time_mode', '0') &&
        getDpValueByDevices('cruise_switch')
      );
    },
    checkedIconVisibilityCondition: async () => {
      return getDpValueByDevices('cruise_time_mode') === '0';
    },
    initDpValue: () => {
      return getDpValueByDevices('cruise_time_mode');
    },
  },
  {
    //  定时巡航
    groupKey: 'timings',
    groupTitle: Strings.getLang('cruiseListTimingsTitle'),
    key: 'cruiseTime',
    title: Strings.getLang('cruiseListTimingsCruise'),
    label: Strings.getLang('cruiseListTimingsCruiseLabel'),
    icon: 'paixu',
    checkedIcon: 'list-checked',
    showCheckedIcon: false,
    dpCode: 'cruise_time',
    onClick: item => {
      changePanelInfoState('showSmartPopup', {
        status: true,
        popupData: {
          key: 'cruiseTime',
          title: Strings.getLang('cruiseListTimingsCruise'),
        },
      });
    },
    isVisible: false,
    showIcon: false,
    type: FeatureType.listChoice,
    visibilityCondition: async () => {
      // 待开发
      return false;
      return getEnumRangeIsValid('cruise_time_mode', '1') && getDpValueByDevices('cruise_switch');
    },
    checkedIconVisibilityCondition: async () => {
      return getDpValueByDevices('cruise_time_mode') === '1';
    },
  },
];

export const customData: FeatureMenu[] = [];

export const listData = {
  cruise: cruiseData,
  custom: customData,
};
