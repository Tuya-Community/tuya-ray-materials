import { COMMON_BIZ_TYPE } from '@/constant';
import {
  chooseImage as originChooseImage,
  uploadImage as originUploadImage,
  chooseCropImage as originChooseCropImage,
  uploadFile as originUploadFile,
  getPetUploadSign,
  resizeImage,
  ai,
} from '@ray-js/ray';

const { petsPictureQualityDetectForImage } = ai;

export interface UploadFile {
  id: string;
  type: 'image' | 'video' | 'loading';
  url?: string;
  thumbUrl?: string;
}

export function generateId(length = 16) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

export const parseFileName = (fileUrl: string) => {
  try {
    // 确保协议是 file
    if (!fileUrl.startsWith('thingfile://')) {
      throw new Error('URL protocol must be file');
    }

    // 移除协议部分
    const filePath = decodeURIComponent(fileUrl.slice('thingfile://'.length));

    // 提取文件名
    return filePath.substring(filePath.lastIndexOf('/') + 1);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export async function uploadFile(
  url: string,
  filePath: string,
  fileName: string,
  header?: { 'content-type': string }
) {
  const result = await new Promise((resolve, reject) => {
    originUploadFile({
      url,
      filePath,
      name: fileName,
      method: 'PUT',
      header,
      success: res => {
        console.log('[uploadFile] success', res);
        resolve(res);
      },
      failure: err => {
        console.error('[uploadFile] fail', err);
        reject(err);
      },
    });
  });
  return result;
}

export async function uploadImage(filePath: string, bizType: UploadFileBizType) {
  const fileName = parseFileName(filePath);
  const signInfo = await getPetUploadSign({ bizType, fileName });
  console.log('==signInfo', signInfo);

  const { url, objectKey } = signInfo;

  await uploadFile(url, filePath, fileName);

  return { cloudKey: objectKey };
}

const cloudKeyCache = new Map<string, string>();
export async function uploadMedia(type: 'video' | 'image', filePath: string, bizType: string) {
  const filename = parseFileName(filePath);
  const name = `${generateId()}-${filename}`;
  console.log('[uploadMedia]', { name });

  let ext = `${name.split('.').pop()}`;
  if (ext === 'jpg') {
    ext = 'jpeg';
  }

  const miniType = `${type}/${ext}`;

  const result = await new Promise<{
    cloudKey: string;
    publicUrl: string;
  }>((resolve, reject) => {
    originUploadImage({
      bizType,
      filePath,
      contentType: miniType,
      success(res) {
        const data = JSON.parse(res.result);
        cloudKeyCache.set(data.bizUrl, data.publicUrl);
        resolve({ cloudKey: data.bizUrl, publicUrl: data.publicUrl });
      },
      fail(err) {
        console.error('[uploadMedia] fail', err);
        reject(err);
      },
    });
  });

  return result;
}

export async function uploadImageCat(filePath: string, bizType = COMMON_BIZ_TYPE) {
  return uploadMedia('image', filePath, bizType);
}

export async function resizeImageList(pathList: Array<string>) {
  const resizeImageAsync = options => {
    return new Promise((resolve, reject) => {
      resizeImage({
        ...options,
        success(res) {
          resolve(res.path);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  };

  const resPathList = await Promise.all(
    pathList.map(url =>
      resizeImageAsync({
        aspectFitWidth: 1920,
        aspectFitHeight: 1080,
        maxFileSize: 3145728,
        path: url,
      })
    )
  );
  return resPathList;
}

export async function chooseImage(count = 1, successCallback) {
  const paths = await new Promise<string[]>((resolve, reject) => {
    originChooseImage({
      count,
      sizeType: ['compressed'],
      success: async res => {
        successCallback();
        const resImageList = (await resizeImageList(res.tempFilePaths)) as Array<string>;
        resolve(resImageList);
      },
      fail(err) {
        reject(err);
      },
    });
  });

  return paths;
}

export async function chooseCropImage() {
  const result = await new Promise<string>((resolve, reject) => {
    originChooseCropImage({
      sourceType: ['album', 'camera'],
      success: ({ path }) => {
        resolve(path);
      },
      fail: error => {
        console.log('[chooseCropImage] fail', error);
        reject(error);
      },
    });
  });
  return result;
}

export async function pictureQualityDetect(pathUrl: string) {
  const result = await new Promise<{
    imagePath: string;
    lowQuality: boolean;
    lowQualityReason: number;
  }>((resolve, reject) => {
    petsPictureQualityDetectForImage({
      inputImagePath: pathUrl,
      labelAllow: 1,
      objectAreaPercent: 30,
      objectFaceRotationAngle: 40,
      objectFaceSideAngle: 45,
      maximumPictureBrightness: 80,
      minimumPictureBrightness: 0,
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      },
    });
  });

  return result;
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`; // 转为秒并保留2位小数
}
