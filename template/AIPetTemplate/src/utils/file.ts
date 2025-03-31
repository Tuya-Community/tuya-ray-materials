import {
  chooseImage as originChooseImage,
  chooseCropImage as originChooseCropImage,
  uploadImage as originUploadImage,
  uploadFile as originUploadFile,
  getFileSystemManager,
  getPetUploadSign,
} from '@ray-js/ray';
import {
  getUploadIsReady,
  getUploadInstance,
  UPLOAD_COMPONENT_ID,
} from '@/components/UploadWebView/utils';
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

/**
 * 自定义查询
 */
const customFileUpload = async <T>({
  url,
  file,
  componentId = UPLOAD_COMPONENT_ID,
}): Promise<T> => {
  try {
    let uploadInstance = getUploadInstance(componentId);
    if (!uploadInstance) {
      uploadInstance = await getUploadIsReady(componentId);
    }

    const customMiddleFunc = uploadInstance.invoke.bind('uploadFile');
    if (!customMiddleFunc) {
      throw new Error('customMiddleFunc is null');
    }

    const res = await customMiddleFunc(url, file);
    return res;
  } catch (error) {
    console.warn('uploadFile fail', error);
    throw new Error(error);
  }
};

function parseFileName(fileUrl: string) {
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

export async function uploadFile(url: string, filePath: string, fileName: string, header: any) {
  const result = await new Promise((resolve, reject) => {
    originUploadFile({
      url,
      filePath,
      name: fileName,
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

export async function uploadImage(
  filePath: string,
  bizType: UploadFileBizType,
  componentId: string
) {
  const fileName = parseFileName(filePath);
  const signInfo = await getPetUploadSign({ bizType, fileName });
  const manager = await getFileSystemManager();
  const data = manager.readFileSync({
    filePath,
    encoding: 'base64',
  });
  const { url, objectKey } = signInfo;

  await customFileUpload({ url, file: data?.data, componentId });

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
