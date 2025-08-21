export const encodeSvg = (str: string): string => {
  return (
    'data:image/svg+xml,' +
    str
      .replace(/"/g, "'")
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
  );
};

/**
 * 更新svg字符串颜色值
 * @param str 需要被替换的字符串
 * @param color 替换的颜色
 * @returns 替换后svg字符串
 */
export const updateColor = (str: string, color: string): string => {
  const regex = /%23([0-9A-Fa-f]{6})/g;
  const result = str.replace(regex, () => {
    return color.replace(/#/g, '%23');
  });
  return result;
};
