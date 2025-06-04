import {
  chooseImage as originChooseImage,
  chooseCropImage as originChooseCropImage,
  uploadFile as originUploadFile,
  getPetUploadSign,
} from '@ray-js/ray';

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
  const { url, objectKey } = signInfo;

  await uploadFile(url, filePath, fileName);

  return { cloudKey: objectKey };
}

export async function chooseImage(count = 1) {
  const paths = await new Promise<string[]>((resolve, reject) => {
    originChooseImage({
      count,
      sizeType: ['compressed'],
      success(res) {
        resolve(res.tempFilePaths);
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
