import Strings from '@/i18n';
import { getDpCodeIsExist } from '@/utils';

export const getMenuData = () => {
  return [
    {
      key: 'autoRecharge',
      show: getDpCodeIsExist('ipc_auto_recharge'),
      dpValue: '0',
      icon: 'auto-recharge',
      title: Strings.getLang('remoteControlAutoRecharge'),
    },
    {
      key: 'autoFollow',
      show: getDpCodeIsExist('motion_tracking'),
      dpValue: '1',
      icon: 'auto-follow',
      title: Strings.getLang('remoteControlAutoFollow'),
    },
  ];
};

export const getPtzData = () => {
  return [
    { type: 'top', show: true, dpValue: '0', icon: 'ptz-arrow' },
    {
      type: 'right',
      show: true,
      dpValue: '90',
      icon: 'ptz-arrow',
    },
    {
      type: 'left',
      show: true,
      dpValue: '270',
      icon: 'ptz-arrow',
    },
    {
      type: 'bottom',
      show: true,
      dpValue: '180',
      icon: 'ptz-arrow',
    },
  ];
};
