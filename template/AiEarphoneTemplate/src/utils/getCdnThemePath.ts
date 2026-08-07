// @ts-nocheck
import { getCdnUrl } from 'ray';

import { getSystemInfoSync } from '@ray-js/ray';
import cdnImage from '../../cdn/cdnImage.json';

/**
 * 主题缓存单例
 * 避免每次调用都执行同步的 getSystemInfoSync()
 */
let cachedTheme: string | null = null;
const pathCache: Map<string, string> = new Map();

/**
 * 获取当前主题（带缓存）
 */
const getTheme = (): string => {
  if (cachedTheme === null) {
    const systemInfo = getSystemInfoSync();
    cachedTheme = systemInfo?.theme || 'light';
  }
  return cachedTheme;
};

/**
 * 清除主题缓存
 * 在主题切换时调用，确保获取最新主题
 */
export const invalidateThemeCache = () => {
  cachedTheme = null;
  pathCache.clear();
};

/**
 *  获取cdn主题图片路径（带缓存优化）
 */
export const getCdnThemePath = (path: string) => {
  const theme = getTheme();
  const cacheKey = `${theme}/${path}`;

  // 检查缓存
  if (pathCache.has(cacheKey)) {
    return pathCache.get(cacheKey)!;
  }

  // 查找图片路径
  const url = cdnImage[cacheKey];
  let result: string;

  if (!url) {
    const lightUrl = cdnImage[`light/${path}`];
    result = getCdnUrl(lightUrl); // 默认返回light主题图片
  } else {
    result = getCdnUrl(url);
  }

  // 缓存结果
  pathCache.set(cacheKey, result);
  return result;
};
