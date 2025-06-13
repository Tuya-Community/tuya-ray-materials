// 小程序ID集合
export const miniIdLabs = {
  // 设备设置页小程序ID
  deviceSettings: 'tycryc71qaug8at6yt',
  // 增值服务小程序ID
  vasMini: 'tyeavwo0j4oocvdrf1',
  // IPC 帮助反馈中间页小程序ID
  ipcHelpMini: 'tybxwaylc6inpkrgeu',
  // 服务大厅小程序ID
  ipcServiceHallMini: 'tyhtutw16qihykz97n',
};

// native页面路由集合
export const nativePageRoute = {
  // 相册
  ipcAlbumPanel: 'ipc_album_panel',
  // 云回放
  ipcCloudPanel: 'camera_cloud_panel',
  // SD卡回放
  ipcPlayBackPanel: 'camera_playback_panel',
  // 消息
  ipcMessagePanel: 'camera_message_panel',
};

// Ptz Size根据高度设置
export const getPtzSize = popupHeight => {
  if (popupHeight < 400) {
    return '320rpx';
  }
  if (popupHeight < 450) {
    return '350rpx';
  }
  if (popupHeight < 500) {
    return '380rpx';
  }
  return '412rpx';
};

// Ptz Size根据高度设置
export const getZoomSize = popupHeight => {
  if (popupHeight < 400) {
    return '90rpx';
  }
  if (popupHeight < 450) {
    return '100rpx';
  }
  if (popupHeight < 500) {
    return '110rpx';
  }
  return '120rpx';
};

// 支持面板云能力集合
export const panelCloudFunLabs = {
  tyabijq3gf: 'playerFit',
  tyabis5d9w: 'brandColor',
};
