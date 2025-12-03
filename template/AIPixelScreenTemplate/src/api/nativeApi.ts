import { GetTTTParams, GetTTTSuccessData } from '@ray-js/panel-sdk';
import {
  chooseMedia,
  chooseImage,
  getImageInfo,
  authorize,
  authorizeStatus,
  downloadFile,
  saveImageToPhotosAlbum,
  getUserInfo,
} from '@ray-js/ray';
import { globalToast } from '@/utils';
import Strings from '@/i18n';

type AnyFn = (...args: any) => any;

// const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const nativeFnWrap = <T extends AnyFn>(nativeApi: T, name: string) => {
  const n = name || nativeApi?.name;
  return (args: GetTTTParams<T>) => {
    return new Promise<GetTTTSuccessData<T>>((resolve, reject) => {
      console.log(`🚀 ~ ttt: ${n} run`, args);
      // console.log(`🚀 ~ ttt: ${n} ~ args`, args);
      if (typeof nativeApi !== 'function') {
        console.log(`🚀 ~ ttt: ${n} ~ not exist:`);
        setTimeout(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`${n} not exist`);
        }, 100);
        return;
      }
      nativeApi({
        ...args,
        success: (data: GetTTTSuccessData<T>) => {
          console.log(`🚀 ~ ttt: ${n} ~ success:`, data);
          resolve(data);
        },
        fail: err => {
          console.log(`🚀 ~ ttt: ${n} ~ fail:`, err);
          if (n === 'authorize') {
            // app no permission
            if (err.errorCode === 9004 || err.errorCode === 10002) {
              globalToast.fail(Strings.getLang('noPermissionPleaseEnablePermissionsInTheSettings'));
            } else {
              globalToast.fail(
                Strings.getLang('anErrorOccurredPleaseEnsureThatPermissionsAreEnabled')
              );
            }
          }
          reject(err);
        },
      });
    });
  };
};

/**
 * 批量图片压缩
 */
export const compressImageAsyncBatch = async (pathList: string[], width = 375, height = 375) => {
  const _pathList = pathList.filter(i => i);
  return new Promise((resolve, reject) => {
    ty.compressImage({
      fileList: _pathList,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
      dstWidth: width,
      dstHeight: height,
    });
  });
};

/**
 * 拍摄或从手机相册中选择图片或视频
 */
export const chooseMediaAsync = nativeFnWrap(chooseMedia, 'chooseMedia');

export const chooseImageAsync = nativeFnWrap(chooseImage, 'chooseImage');

export const getImageInfoAsync = nativeFnWrap(getImageInfo, 'getImageInfo');

/**
 * 初始化设备上传
 */
export const initializeUploadFileAsync = nativeFnWrap(
  ty.initializeUploadFile,
  'initializeUploadFile'
);

/**
 * 透传数据给设备
 */
export const publishBLETransparentDataAsync = nativeFnWrap(
  ty.device.publishBLETransparentData,
  'device.publishBLETransparentData'
);

/**
 * 上传文件
 */
export const uploadFileAsync = nativeFnWrap(ty.uploadFileToDevice, 'uploadFileToDevice');

/**
 * 取消上传
 */
export const cancelUploadFileToDevice = nativeFnWrap(ty.uploadFileToDevice, 'uploadFileToDevice');

/**
 * 权限请求方法
 */
export const authorizeAsync = nativeFnWrap(authorize, 'authorize');

/**
 * 查询权限状态
 */
export const authorizeStatusAsync = nativeFnWrap(authorizeStatus, 'authorizeStatus');

/**
 * 下载资源
 */
export const downloadFileAsync = nativeFnWrap(downloadFile, 'downloadFile');

export const getUserInfoAsync = nativeFnWrap(getUserInfo, 'getUserInfo');

/**
 * 保存图片到系统相册
 */
export const saveImageToPhotosAlbumAsync = nativeFnWrap(
  saveImageToPhotosAlbum,
  'saveImageToPhotosAlbum'
);

/**
 * 图片裁剪
 * @param params
 *  cropFileList[{
    filePath?: string
    左上角坐标X
    topLeftX: number
    左上角坐标Y
    topLeftY: number
    右下角坐标X
    bottomRightX: number
     右下角坐标Y
    bottomRightY: number
  }]
 */

export const cropImageAsync = nativeFnWrap(ty.cropImages, 'cropImages');

/**
 * 图像生成初始化
 */
export const pixelImageInit = nativeFnWrap(ty.ai.pixelImageInit, 'ty.ai.pixelImageInit');

export const fetchPixelImageCategoryInfo = nativeFnWrap(
  ty.ai.fetchPixelImageCategoryInfo,
  'ty.ai.fetchPixelImageCategoryInfo'
);

export const generationPixelImage = nativeFnWrap(
  ty.ai.generationPixelImage,
  'ty.ai.generationPixelImage'
);

export const getDeviceOnlineType = nativeFnWrap(
  ty.device.getDeviceOnlineType,
  'ty.device.getDeviceOnlineType'
);
