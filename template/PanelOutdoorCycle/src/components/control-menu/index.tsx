import React, { memo, useMemo } from 'react';
import { debounce } from 'lodash';
import { hideLoading, showLoading, Text, View, router } from '@ray-js/ray';
import { useProps, useActions, useDevice } from '@ray-js/panel-sdk';
import { supportDp, hasCommonDps, moreUnlockDPs, lightCheckShow } from '@/utils';
import {
  menuAlarm,
  menuTailBoxLock,
  menuMode,
  menuBucketLock,
  menuLight,
  menuMore,
  menuUnlock,
} from '@/res/iconfont.json';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import { IconSvg } from '@/components';
import Styles from './index.module.less';

interface MenuProps {
  theme: string;
  isHideMap?: boolean;
  isBleOnline: boolean;
  goToRNPage: () => void;
  showChangeMode: () => void;
  checkHideDp: (dpCode: string) => boolean;
  checkPermissions: (dpCode: string, callback: () => void) => void;
}

export const ControlMenu: React.FC<MenuProps> = React.memo(
  ({
    theme,
    isBleOnline,
    isHideMap = false,
    goToRNPage,
    checkHideDp,
    showChangeMode,
    checkPermissions,
  }) => {
    const actions = useActions();
    const dpSchema = useDevice(device => device.dpSchema);
    const devInfo = useDevice(device => device.devInfo);
    const bucketLockDpVal = useProps(props => props[dpCodes.bucketLock]);
    const moveAlarmDpVal = useProps(props => props[dpCodes.moveAlarm]);
    const tailBoxLockDpVal = useProps(props => props[dpCodes.tailBoxLock]);
    const headlightSwitchDpVal = useProps(props => props[dpCodes.headlightSwitch]);
    const modeValue = useProps(props => props[dpCodes.mode]);
    const { devId } = devInfo;

    const SwitchOpenColor = '#36D100'; // 控制开关默认颜色

    const goToMorePage = debounce(menuKey => {
      router.push(`/more?theme=${theme}&menuKey=${menuKey}`);
    }, 500);

    const changeDp = dpCode => {
      showLoading({
        title: '',
        mask: true,
      });
      actions[dpCode].toggle({
        pipelines: [6, 5, 4, 3, 2, 1],
        success: () => {
          hideLoading();
        },
        error: () => {
          hideLoading();
        },
      });
    };

    const menuData = useMemo(() => {
      const { onlyHeadingLight, isShow: isShowLight } = lightCheckShow(dpSchema);
      return [
        {
          name: 'menuMap',
          icon: menuMore,
          color: theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: isHideMap,
          onClick: () => {
            goToRNPage();
          },
        },
        {
          name: dpCodes.bucketLock,
          icon: menuBucketLock,
          color: bucketLockDpVal ? SwitchOpenColor : theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: supportDp(dpCodes.bucketLock, dpSchema) && !checkHideDp(dpCodes.bucketLock),
          onClick: () => {
            checkPermissions(dpCodes.bucketLock, () => changeDp(dpCodes.bucketLock));
          },
        },
        {
          name: dpCodes.tailBoxLock,
          icon: menuTailBoxLock,
          color: tailBoxLockDpVal ? SwitchOpenColor : theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: supportDp(dpCodes.tailBoxLock, dpSchema) && !checkHideDp(dpCodes.tailBoxLock),
          onClick: () => {
            checkPermissions(dpCodes.tailBoxLock, () => changeDp(dpCodes.tailBoxLock));
          },
        },
        /* {
          name: 'moreLock',
          icon: menuUnlock,
          color: theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: hasCommonDps(Object.keys(dpSchema), moreUnlockDPs),
          onClick: () => {
            ty.router({
              url: `tuyaSmart://tsod_additional_unlock_methods?devId=${devId}`,
            });
          },
        }, */
        {
          name: 'alarmTitle',
          icon: menuAlarm,
          color: moveAlarmDpVal ? SwitchOpenColor : theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: supportDp(dpCodes.moveAlarm, dpSchema) && !checkHideDp(dpCodes.moveAlarm),
          onClick: () => {
            checkPermissions(dpCodes.moveAlarm, () => changeDp(dpCodes.moveAlarm));
          },
        },
        {
          name: dpCodes.mode,
          icon: menuMode,
          color: theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: supportDp(dpCodes.mode, dpSchema) && !checkHideDp(dpCodes.mode),
          onClick: () => {
            showChangeMode();
          },
        },
        {
          name: onlyHeadingLight ? dpCodes.headlightSwitch : 'lightTitle',
          icon: menuLight,
          color:
            onlyHeadingLight && headlightSwitchDpVal
              ? SwitchOpenColor
              : theme === 'dark'
              ? '#F1F1F1'
              : '#555555',
          isShow: isShowLight,
          onClick: () => {
            if (onlyHeadingLight) {
              actions[dpCodes.headlightSwitch].toggle();
            } else {
              router.push('/light');
            }
          },
        },
      ];
    }, [
      bucketLockDpVal,
      tailBoxLockDpVal,
      headlightSwitchDpVal,
      dpSchema,
      devId,
      moveAlarmDpVal,
      theme,
      checkHideDp,
      showChangeMode,
      checkPermissions,
      isBleOnline,
      actions,
    ]);

    const dataSource = useMemo(() => {
      const initData = menuData.filter(i => i.isShow);
      const _initData = initData.length > 3 ? initData.slice(0, 3) : initData;
      const menuKey = _initData.map(i => i.name).join(',');
      return [
        ..._initData,
        {
          name: 'moreFuc',
          icon: menuMore,
          color: theme === 'dark' ? '#F1F1F1' : '#555555',
          isShow: true,
          onClick: () => goToMorePage(menuKey),
        },
      ];
    }, [menuData, theme]);

    const MenuItem = (i: { name: string; icon: string; color: string; onClick: () => void }) => (
      <View key={i.name} className={Styles.menuItem} onClick={i.onClick}>
        <View className={Styles.menuIcon}>
          <IconSvg d={i.icon} color={i.color} size="28px" />
        </View>
        <Text className={Styles.menuText}>
          {i.name === 'mode' ? Strings.getDpLang('mode', modeValue) : Strings.getLang(i.name)}
        </Text>
      </View>
    );

    return <View className={Styles.menu}>{dataSource.map(item => MenuItem(item))}</View>;
  }
);
