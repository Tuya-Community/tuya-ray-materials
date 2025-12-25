import {
  chooseCropImage,
  getSystemInfo,
  getSystemInfoSync,
  hideLoading,
  showLoading,
} from '@ray-js/ray';

import Strings from '../i18n';
import TTT from './ttt';

const timeOutFn = (fn: (...args: any[]) => void) =>
  setTimeout(() => {
    fn();
  }, 20000);

export interface ChooseImageOps<T> {
  sourceType: 'album' | 'camera';
  onLoadStart?(): void;
  onLoad(value: { publicUrl: string; bizUrl: string }): Promise<T>;
}

const getSystemInfoData = () =>
  new Promise<ReturnType<typeof getSystemInfoSync>>((resolve, reject) => {
    getSystemInfo({
      success: res => resolve(res),
      fail: reject,
    });
  });

const chooseImageFn = (
  sourceType: 'album' | 'camera',
  onLoad: (value: { publicUrl: string; bizUrl: string }) => Promise<any>,
  onLoadStart: () => void,
  reject: () => void,
  resolve: (value: any) => void
) => {
  chooseCropImage({
    sourceType: [sourceType],
    success: async ({ path }) => {
      const timeId = timeOutFn(reject);
      onLoadStart && onLoadStart();
      ty.uploadImage({
        filePath: path,
        bizType: 'light-common',
        delayTime: 2,
        pollMaxCount: 5,
        success: async ({ result }: { result: string }) => {
          const { publicUrl, bizUrl } = JSON.parse(result);
          const res = await onLoad({ publicUrl, bizUrl });
          clearTimeout(timeId);
          hideLoading();
          resolve(res);
        },
        fail: error => {
          hideLoading();
          clearTimeout(timeId);
          reject();
        },
      });
    },
    fail: error => {
      reject();
      console.log(error);
    },
  });
};
export const chooseImage = <T>({
  onLoad,
  sourceType,
  onLoadStart,
}: ChooseImageOps<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    getSystemInfoData().then(systemInfo => {
      const isIos = systemInfo.platform === 'ios';
      if (!isIos) {
        TTT.authorizeCameraAndPhoto().then(() => {
          chooseImageFn(sourceType, onLoad, onLoadStart, reject, resolve);
        });
      } else {
        chooseImageFn(sourceType, onLoad, onLoadStart, reject, resolve);
      }
    });
  });
};
