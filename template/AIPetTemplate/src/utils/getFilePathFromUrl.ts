/* eslint-disable no-useless-escape */
/**
 * 如给定的 url 为 https://www.cos-ap.com/4443123/003b_1?sign=q-sign，
 * 则返回 003b_1
 *
 * @param url
 * @returns string | null
 */
export function getFilePathFromUrl(url: string): string | null {
  // 匹配路径中的最后一个片段
  const regex = /\/([^\/?#]+)(?=[^\/]*$)/;
  const matches = url.match(regex);
  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
}
