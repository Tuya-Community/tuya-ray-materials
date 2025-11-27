const cachePrefixMap = {};

export const getCachePrefixData = (prefix: string) => {
  return cachePrefixMap[prefix] || {};
};

export const setCachePrefixData = (prefix: string, map: Record<string, any>) => {
  cachePrefixMap[prefix] = map;
};

export const deleteCachePrefixData = (prefix: string) => {
  delete cachePrefixMap[prefix];
};

const metaData = 'thingfile://';
const specialMark = '___';
export const modifyToNormalUrl = (url = '') => {
  return url.replace(specialMark, metaData);
};

export const modifyToCacheUrl = (url = '') => {
  return url.replace(metaData, specialMark);
};
