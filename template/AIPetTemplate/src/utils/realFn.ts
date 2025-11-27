import md5 from 'md5';
import { HashUrl, RealFn, UploadExtraFileData } from '@/types';
import { getFileNameAndExtension } from './getFileNameAndExtension';

/**
 * 基于 url 生成 realFn，
 * realFn 由 url 的 md5 值和时间戳组成，
 * realFn 的作用详见 RealFn 类型定义
 */
export const genRealFn = (url: UploadExtraFileData['url']): RealFn => {
  const timeStamp = Date.now();
  const { fileName, fileType } = getFileNameAndExtension(url) || {};
  const hasUrl = md5(fileName);
  return `${hasUrl}_${timeStamp}.${fileType ?? 'png'}`;
};

// 由于ai 滤镜是http链接 需要将其下载到本地，下载后的地址会改变，所以需要缓存一下
let __aiFilterSrcMap = {};
export const getAiFilterNameMapToFileName = (fileName: string): string => {
  return __aiFilterSrcMap[fileName] || fileName;
};

export const setAiFilterNameMap = (aiFileNameUrl: string, fileNameUrl: string) => {
  // console.warn('setAiFilterNameMap', aiFileNameUrl, fileNameUrl);
  const { fileName: aiFileName = aiFileNameUrl } = getFileNameAndExtension(aiFileNameUrl) || {};
  const { fileName: fileName = fileNameUrl } = getFileNameAndExtension(fileNameUrl) || {};
  __aiFilterSrcMap[aiFileName] = fileName;
};

export const clearAiFilterNameMap = () => {
  // console.warn('clearAiFilterNameMap', __aiFilterSrcMap);
  __aiFilterSrcMap = {};
};

/**
 * 基于 url 生成 hashUrl，
 * 其用途为在 App 批量的上传成功通道中，分辨出上传成功的文件的 url，
 * 并通知推送给设备端，告诉其可以开始下载了
 */
export const genHashUrl = (url: UploadExtraFileData['url']): HashUrl => {
  const { fileName } = getFileNameAndExtension(url) || {};
  const _fileName = getAiFilterNameMapToFileName(fileName);
  if (!url || !_fileName) return '';
  const hashUrl = md5(_fileName);
  return hashUrl;
};
