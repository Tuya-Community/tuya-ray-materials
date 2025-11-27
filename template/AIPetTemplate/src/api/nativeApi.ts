import { videoThumbnailsStorage } from '@/devices';
import { isInIDE } from '@/utils';
import { GetTTTParams, GetTTTSuccessData } from '@ray-js/panel-sdk';
import {
  chooseMedia,
  authorize,
  authorizeStatus,
  downloadFile,
  saveImageToPhotosAlbum,
  saveVideoToPhotosAlbum,
  fetchImageThumbnail,
  compressImage,
  initializeUploadFile,
  uploadFileToDevice,
  cropImages,
  fetchVideoThumbnails,
  clearVideoThumbnails,
  clipVideo,
  setNavigationBarTitle,
} from '@ray-js/ray';

type AnyFn = (...args: any) => any;

// const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const thumbs = [
  '/images/5861720320424_.pic.jpg',
  '/images/5871720320426_.pic.jpg',
  '/images/5881720320426_.pic.jpg',
  '/images/5891720320427_.pic.jpg',
  '/images/5901720320428_.pic.jpg',
  '/images/5921720320430_.pic.jpg',
  '/images/5931720320430_.pic.jpg',
];

const nativeFnWrap = <T extends AnyFn>(nativeApi: T, name: string) => {
  const n = name || nativeApi?.name;
  return (args: GetTTTParams<T>) => {
    return new Promise<GetTTTSuccessData<T>>((resolve, reject) => {
      console.log(`🚀 ~ ttt: ${n} ~ args`, args);
      if (isInIDE && n === 'fetchVideoThumbnails') {
        setTimeout(() => {
          resolve({
            thumbnailsPath: [...thumbs].slice(0, args.thumbnailCount),
          });
        }, 300);
        return;
      }
      if (typeof nativeApi !== 'function') {
        console.log(`🚀 ~ ttt: ${n} ~ not exist:`);
        setTimeout(() => {
          resolve(true);
        }, 100);
        return;
      }
      nativeApi({
        ...args,
        success: (data: GetTTTSuccessData<T>) => {
          console.log(`🚀 ~ ttt: ${n} ~ success:`, data);
          resolve(data);
        },
        fail: (err: GetTTTFailData<T>) => {
          console.log(`🚀 ~ ttt: ${n} ~ fail:`, err);
          reject(err);
        },
      });
    });
  };
};

/**
 * 批量获取资源的缩略图
 */
export const fetchImageThumbnailBatch = async (pathList: string[], videoIndexList = []) => {
  const width = 180;
  const height = 180;
  const _pathList = pathList.filter(i => i);
  const pathListPromise = _pathList.map((path, idx) => {
    return new Promise((resolve, reject) => {
      const isVideo = videoIndexList.includes(idx);
      if (isVideo) {
        resolve({ thumbnailPath: path });
        return;
      }
      fetchImageThumbnail({
        originPath: path,
        thumbWidth: width,
        thumbHeight: height,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  });
  return Promise.all(pathListPromise)
    .then((res: { thumbnailPath: string }[]) => {
      const newRes = (res || []).map(i => i?.thumbnailPath);
      return newRes;
    })
    .catch(err => {
      console.error('=== fetchImageThumbnailBatch err', err);
      return [];
    });
};

/**
 * 批量图片压缩
 */
export const compressImageAsyncBatch = async (pathList: string[], width = 375, height = 375) => {
  const _pathList = pathList.filter(i => i);
  return new Promise((resolve, reject) => {
    compressImage({
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

/**
 * 初始化设备上传
 */
export const initializeUploadFileAsync = nativeFnWrap(initializeUploadFile, 'initializeUploadFile');

/**
 * 上传文件
 */
export const uploadFileAsync = nativeFnWrap(uploadFileToDevice, 'uploadFileToDevice');

/**
 * 取消上传
 */
export const cancelUploadFileToDevice = nativeFnWrap(uploadFileToDevice, 'uploadFileToDevice');

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

/**
 * 保存图片到系统相册
 */
export const saveImageToPhotosAlbumAsync = nativeFnWrap(
  saveImageToPhotosAlbum,
  'saveImageToPhotosAlbum'
);

/**
 * 保存视频到系统相册
 */
export const saveVideoToPhotosAlbumAsync = nativeFnWrap(
  saveVideoToPhotosAlbum,
  'saveVideoToPhotosAlbum'
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

export const cropImageAsync = nativeFnWrap(cropImages, 'cropImages');

/**
 * 获取视频缩略图，如果缓存中有，则优先从缓存中取
 */
export const fetchVideoThumbnailsCacheAsync = (
  params: GetTTTParams<typeof fetchVideoThumbnails>
) => {
  return new Promise<GetTTTSuccessData<typeof fetchVideoThumbnails>>((resolve, reject) => {
    if (isInIDE) {
      setTimeout(() => {
        resolve({
          thumbnailsPath: [...thumbs].slice(0, params.thumbnailCount),
        });
      }, 300);
      return;
    }
    const videoPath = params.filePath;
    const timePath = `${params.startTime}_${params.endTime}`;
    console.log('🚀 ~ fetchVideoThumbnailsCacheAsync ~ path:', videoPath, timePath);
    videoThumbnailsStorage
      .get(videoPath, timePath)
      .then((thumbnailsCache: string[]) => {
        if (thumbnailsCache && thumbnailsCache.length === params.thumbnailCount) {
          console.log('fetchVideoThumbnailsCacheAsync from cache', thumbnailsCache);
          resolve({ thumbnailsPath: thumbnailsCache });
          return;
        }
        fetchVideoThumbnails({
          ...params,
          success: (data: GetTTTSuccessData<typeof fetchVideoThumbnails>) => {
            console.log('fetchVideoThumbnailsCacheAsync success', data);
            videoThumbnailsStorage.save(videoPath, timePath, data.thumbnailsPath);
            resolve(data);
          },
          fail: (err: GetTTTFailData<typeof fetchVideoThumbnails>) => {
            console.log('fetchVideoThumbnailsCacheAsync fail', err);
            reject(err);
          },
        });
      })
      .catch(err => {
        console.log('fetchVideoThumbnailsCacheAsync fail', err);
        reject(new Error(err));
      });
  });
};

/**
 * 获取视频缩略图，不从缓存中取，用于需要持久化的场景
 */
export const fetchVideoThumbnailsAsync = nativeFnWrap(fetchVideoThumbnails, 'fetchVideoThumbnails');

/**
 * 清空视频缩略图
 */
export const clearVideoThumbnailsAsync = nativeFnWrap(clearVideoThumbnails, 'clearVideoThumbnails');

/**
 * 裁剪视频
 */
export const clipVideoAsync = nativeFnWrap(clipVideo, 'clipVideo');

/**
 * 动态设置当前页面的标题
 */
export const setNavigationBarTitleAsync = nativeFnWrap(
  setNavigationBarTitle,
  'setNavigationBarTitle'
);
