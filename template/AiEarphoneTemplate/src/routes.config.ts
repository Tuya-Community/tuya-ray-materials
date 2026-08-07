import { Routes, SubPackages } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/detail',
    path: '/pages/detail/index',
    name: 'Detail',
  },
  {
    route: '/btOffline',
    path: '/pages/btOffline/index',
    name: 'BtOffline',
  },
  {
    route: '/recordingMode',
    path: '/pages/recordingMode/index',
    name: 'RecordingMode',
  },
  {
    route: '/imagePreview',
    path: '/pages/imagePreview/index',
    name: 'ImagePreview',
  },
  {
    route: '/faceToFace',
    path: '/pages/FaceToFace/index',
    name: 'FaceToFace',
  },
  {
    route: '/faceToFace/recording',
    path: '/pages/FaceToFace/Recording/index',
    name: 'FaceToFace_Recording',
  },
];

export const subPackages: SubPackages = [
  {
    root: 'pkgEntry',
    routes: [
      {
        route: '/search',
        path: '/pages/search/index',
      },
      {
        route: '/cardTransfer',
        path: '/pages/cardTransfer/index',
      },
      {
        route: '/home/batchFileList',
        path: '/pages/batchFileList/index',
      },
    ],
  },
  {
    root: 'pkgShop',
    routes: [
      {
        route: '/shop',
        path: '/pages/shop/index',
      },
      {
        route: '/activatedBenefit',
        path: '/pages/activatedBenefit/index',
      },
      {
        route: '/autoRenewAgreement',
        path: '/pages/autoRenewAgreement/index',
      },
    ],
  },
  {
    root: 'pkgSettings',
    routes: [
      {
        route: '/setting',
        path: '/pages/setting/index',
      },
      {
        route: '/records',
        path: '/pages/records/index',
      },
      {
        route: '/cloud',
        path: '/pages/cloud/index',
      },
      {
        route: '/webVersion',
        path: '/pages/webVersion/index',
      },
      {
        route: '/widget',
        path: '/pages/widget/index',
      },
    ],
  },
  {
    root: 'pkgTemplate',
    routes: [
      {
        route: '/customTemplate/create',
        path: '/pages/customTemplate/create/index',
      },
      {
        route: '/customTemplate/manage',
        path: '/pages/customTemplate/manage/index',
      },
      {
        route: '/detail/moreTemplate',
        path: '/pages/moreTemplate/index',
      },
      {
        route: '/detail/templateDetail',
        path: '/pages/templateDetail/index',
      },
    ],
  },
];

export const tabBar = {};
