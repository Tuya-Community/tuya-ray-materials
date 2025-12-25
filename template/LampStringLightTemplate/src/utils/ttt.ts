/* eslint-disable @typescript-eslint/no-empty-function */
export const TTT = {
  // 同时获取相册权限和摄像头权限
  // eslint-disable-next-line func-names
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
export default TTT;
