import { REGION_CDN } from '@/constant/url';

// 获取三方资源的cdn url，根据regionCode 和 url 获取
export const getThirdCdnUrl = (url: string, regionCode: string = 'EU') => {
  if (!url) return '';
  const cdn = REGION_CDN[regionCode];
  return url.startsWith('/') ? `https://${cdn}${url}` : `https://${cdn}/${url}`;
};

export function getCDNFileType(url) {
  // 1. 边界值校验：非字符串/空值直接返回空
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    // 2. 移除查询参数（?后面的内容）和锚点（#后面的内容）
    const purePath = url.split('?')[0].split('#')[0];

    // 3. 提取最后一个"."后的扩展名（处理路径中含多个"."的情况，如a.b.c.pdf）
    const lastDotIndex = purePath.lastIndexOf('.');
    // 排除路径中最后一个字符是"."的情况（如xxx./）
    if (lastDotIndex === -1 || lastDotIndex === purePath.length - 1) {
      return '';
    }

    // 4. 提取并转为小写（统一格式，兼容PDF/Pdf等大小写）
    const fileType = purePath.slice(lastDotIndex + 1).toLowerCase();

    // 5. 过滤非法扩展名（仅保留字母/数字组合，排除路径中含"."但非扩展名的情况）
    return /^[a-zA-Z0-9]+$/.test(fileType) ? fileType : '';
  } catch (e) {
    // 异常容错：解析失败返回空
    console.warn('解析CDN文件类型失败：', e);
    return '';
  }
}

export function getUrlParam(url, paramKey) {
  if (!url || !paramKey || typeof url !== 'string' || typeof paramKey !== 'string') {
    return null;
  }

  try {
    const tempHttpUrl = url.replace(/^[a-zA-Z0-9]+:\/\//, 'http://');
    const parsedUrl = new URL(tempHttpUrl);
    const paramValue = parsedUrl.searchParams.get(paramKey);
    return paramValue === null ? null : decodeURIComponent(paramValue);
  } catch (e) {
    console.warn('URL解析失败:', e);
    return null;
  }
}
