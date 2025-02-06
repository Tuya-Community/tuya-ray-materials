import { Routes, TabBar } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/menu',
    path: '/pages/menu/index',
    name: 'Menu',
  },
  {
    route: '/chart',
    path: '/pages/chart/index',
    name: 'Chart',
  },
  {
    route: '/inverterInfo',
    path: '/pages/menu/inverterInfo/index',
    name: 'InverterInfo',
  },
  {
    route: '/energyModeSet',
    path: '/pages/menu/energyModeSet/index',
    name: 'InergyModeSet',
  },
  {
    route: '/pvInfo',
    path: '/pages/home/pvInfo/index',
    name: 'PvInfo',
  },
  {
    route: '/energyStorageInfo',
    path: '/pages/home/energyStorageInfo/index',
    name: 'EnergyStorageInfo',
  },
  {
    route: '/alarm',
    path: '/pages/alarm/index',
    name: 'Alarm',
  },
  {
    route: '/alarmDetail',
    path: '/pages/alarm/alarmDetail/index',
    name: 'AlarmDetail',
  },
];

export const tabBar: TabBar = {
  textColor: '@tabFontColor',
  selectedColor: '@tabSelectedColor',
  backgroundColor: '@tabBgColor',
  borderStyle: 'white',
  list: [
    {
      pagePath: '/pages/home/index',
      text: "@I18n.t('tabDashboard')",
      icon: '@iconPathDashboard',
      activeIcon: '@selectedIconPathDashboard',
    },
    {
      pagePath: '/pages/chart/index',
      text: "@I18n.t('tabChart')",
      icon: '@iconPathChart',
      activeIcon: '@selectedIconPathChart',
    },
    {
      pagePath: '/pages/alarm/index',
      text: "@I18n.t('tabAlarm')",
      icon: '@iconPathAlarm',
      activeIcon: '@selectedIconPathAlarm',
    },
    {
      pagePath: '/pages/menu/index',
      text: "@I18n.t('tabMenu')",
      icon: '@iconPathMenu',
      activeIcon: '@selectedIconPathMenu',
    },
  ],
};
