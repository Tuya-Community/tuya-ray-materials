/**
 * 归一化文件路径
 */
export const normalizeFilePath = (path: string) => {
  return path?.replace('thingotherfile://', '');
};
