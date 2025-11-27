import { getImageInfo } from '@ray-js/ray';

// 批量获取图片信息
export const getImageListInfoPatch = (imgList: string[]) => {
  return Promise.all(imgList.map(src => getImageInfoSync(src)));
};

export const getImageInfoSync = (src): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    getImageInfo({
      src,
      success: res => {
        resolve(res);
      },
      fail: err => {
        const error = new Error(err);
        reject(error);
      },
    });
  });
};
