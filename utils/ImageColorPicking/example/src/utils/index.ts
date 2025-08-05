import {
  chooseCropImage,
  getSystemInfo,
  getSystemInfoSync,
  getFileSystemManager,
} from '@ray-js/ray';

/* eslint-disable @typescript-eslint/no-empty-function */
export const TTT = {
  // 同时获取相册权限和摄像头权限
  authorizeCameraAndPhoto: function () {
    return new Promise((resolve, reject) => {
      let count = 0;
      ty.authorize({
        /**
         * scope 权限名称
         * 举例子：
         * scope.bluetooth 蓝牙权限
         * scope.writePhotosAlbum 写入相册权限
         * scope.userLocationBackground 后台定位权限
         * scope.record 麦克风权限
         * scope.camera 摄像头权限
         * scope.userLocation 低精度定位权限
         * scope.userPreciseLocation 高精度定位权限
         */
        scope: 'scope.writePhotosAlbum',
        complete: () => {},
        success: () => {
          if (++count === 2) {
            resolve(true);
          }
        },
        fail: err => {
          reject(err);
        },
      });

      ty.authorize({
        scope: 'scope.camera',
        complete: () => {},
        success: () => {
          if (++count === 2) {
            resolve(true);
          }
        },
        fail: err => {
          reject(err);
        },
      });
    });
  },
};

const getSystemInfoData = () =>
  new Promise<ReturnType<typeof getSystemInfoSync>>((resolve, reject) => {
    getSystemInfo({
      success: res => resolve(res),
      fail: reject,
    });
  });

export const chooseImage = (sourceType?: 'album' | 'camera'): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const systemInfo = await getSystemInfoData();
    const isIos = systemInfo.platform === 'ios';
    if (!isIos) {
      await TTT.authorizeCameraAndPhoto();
    }
    chooseCropImage({
      sourceType: [sourceType],
      success: async res => {
        console.log(res.path, '---res.path');
        const { path } = res;
        resolve(path);
        // const manager = getFileSystemManager();
        // manager.readFile({
        //   filePath: path,
        //   encoding: 'base64',
        //   success: res => {
        //     const base64 = `data:image/${path.split('.').slice(-1)[0]};base64,${res.data}`;
        //     resolve(base64);
        //   },
        //   fail: error => {
        //     console.log(error);
        //     reject(error);
        //   },
        // });
      },
      fail: error => {
        console.log(error);
        reject(error);
      },
    });
  });
};
