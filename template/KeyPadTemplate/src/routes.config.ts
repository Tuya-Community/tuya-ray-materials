import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/alarm',
    path: '/pages/alarm/index',
    name: 'Alarm',
  },
  {
    route: '/records',
    path: '/pages/records/index',
    name: 'Records',
  },
  {
    route: '/set',
    path: '/pages/set/index',
    name: 'Set',
  },
  {
    route: '/lock',
    path: '/pages/lock/index',
    name: 'Lock',
  },
  {
    route: '/addLockList',
    path: '/pages/lock/addLockList/index',
    name: 'AddLockList',
  },
  {
    route: '/openMode',
    path: '/pages/openMode/index',
    name: 'OpenMode',
  },
  {
    route: '/failurePswList',
    path: '/pages/openMode/failurePswList/index',
    name: 'FailurePswList',
  },
  {
    route: '/chooseOpenModeType',
    path: '/pages/openMode/chooseOpenModeType/index',
    name: 'ChooseOpenModeType',
  },
  {
    route: '/chooseLockList',
    path: '/pages/openMode/chooseLockList/index',
    name: 'ChooseLockList',
  },
  {
    route: '/chooseUserList',
    path: '/pages/openMode/chooseUserList/index',
    name: 'ChooseUserList',
  },
  {
    route: '/addGuide',
    path: '/pages/openMode/addGuide/index',
    name: 'AddGuide',
  },
  {
    route: '/addRecord',
    path: '/pages/openMode/addRecord/index',
    name: 'AddRecord',
  },
  {
    route: '/dynamicPsw',
    path: '/pages/openMode/dynamicPsw/index',
    name: 'DynamicPsw',
  },
  {
    route: '/addOfflinePsw',
    path: '/pages/openMode/addOfflinePsw/index',
    name: 'AddOfflinePsw',
  },
  {
    route: '/offlineUnlimitedPsw',
    path: '/pages/openMode/offlineUnlimitedPsw/index',
    name: 'OfflineUnlimitedPsw',
  },
  {
    route: '/choosePswList',
    path: '/pages/openMode/choosePswList/index',
    name: 'ChoosePswList',
  },
  {
    route: '/addPermanentPsw',
    path: '/pages/openMode/addPermanentPsw/index',
    name: 'AddPermanentPsw',
  },
  {
    route: '/addOnlinePsw',
    path: '/pages/openMode/addOnlinePsw/index',
    name: 'AddOnlinePsw',
  },
  {
    route: '/temporaryKey',
    path: '/pages/openMode/temporaryKey/index',
    name: 'TemporaryKey',
  },
];
