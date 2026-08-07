// this file generate by @ray-js/build-plugin-router.
// do not modify this file!!!
export const thing = {
  themeLocation: 'theme.json',
  window: {
    backgroundColor: '@bgColor',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationStyle: 'custom',
    custom: true,
  },
  webviewRoot: 'webview',
  preloadRule: {
    'pages/home/index': {
      network: 'all',
      packages: ['pkgEntry'],
    },
    'pages/detail/index': {
      network: 'all',
      packages: ['pkgTemplate'],
    },
  },
  pages: [
    'pages/home/index',
    'pages/detail/index',
    'pages/btOffline/index',
    'pages/recordingMode/index',
    'pages/imagePreview/index',
  ],
  subPackages: [
    {
      root: 'pkgEntry',
      pages: ['pages/search/index', 'pages/cardTransfer/index', 'pages/batchFileList/index'],
    },
    {
      root: 'pkgShop',
      pages: [
        'pages/shop/index',
        'pages/activatedBenefit/index',
        'pages/autoRenewAgreement/index',
      ],
    },
    {
      root: 'pkgSettings',
      pages: [
        'pages/setting/index',
        'pages/records/index',
        'pages/cloud/index',
        'pages/webVersion/index',
        'pages/widget/index',
      ],
    },
    {
      root: 'pkgTemplate',
      pages: [
        'pages/customTemplate/create/index',
        'pages/customTemplate/manage/index',
        'pages/moreTemplate/index',
        'pages/templateDetail/index',
      ],
    },
  ],
};
