import { getSystemInfoSync } from 'ray';

export const transform = function* transform(value) {
  let start = 0;
  let result = 0;
  let length;
  for (; true; ) {
    length = yield result;
    result = value.substr(start, length);
    if (start + length >= value.length) {
      break;
    }
    start += length;
  }
  return result;
};

export const generateStep =
  (generator, length = 4, type = 'number') =>
  () => {
    const { value } = generator.next(length);
    if (type === 'number') {
      return parseInt(value, 16);
    }
    return value;
  };

export const generateUUID = (idList: number[] = []): number => {
  const timestamp = Date.now();
  const id = Number(`${timestamp}`.substring(3, 11));
  const _list = idList.filter(id => id !== undefined);
  if (_list.includes(id)) {
    const _id = Math.max(..._list);
    return _id + 1;
  }
  return id;
};

let w = 0;
export const rpx2px = (rpx: number) => {
  if (w === 0) {
    w = getSystemInfoSync().screenWidth;
  }
  return (rpx * w) / 750;
};
