import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/Home/index',
    name: 'Home',
  },
  {
    route: '/recording',
    path: '/pages/Recording/index',
    name: 'Recording',
  },
  {
    route: '/realTimeRecording',
    path: '/pages/RealTimeRecording/index',
    name: 'RealTimeRecording',
  },
  {
    route: '/simultaneousRecording',
    path: '/pages/SimultaneousRecording/index',
    name: 'SimultaneousRecording',
  },
  {
    route: '/detail',
    path: '/pages/Detail/index',
    name: 'Detail',
  },
  {
    route: '/setting',
    path: '/pages/Setting/index',
    name: 'Setting',
  },
  {
    route: '/records',
    path: '/pages/Records/index',
    name: 'Records',
  },
  {
    route: '/faceToFace',
    path: '/pages/FaceToFace/index',
    name: 'FaceToFace',
  },
  {
    route: '/btOffline',
    path: '/pages/BtOffline/index',
    name: 'BtOffline',
  },
  {
    route: '/howToUse',
    path: '/pages/HowToUse/index',
    name: 'HowToUse',
  },
];

export const tabBar = {};
