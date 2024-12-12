// import { getSystemInfoSync } from '@ray-js/ray';

interface Throttled<T extends (...args: any) => any> {
  (this: ThisParameterType<T>, ...args: Parameters<T>): any;
  cancel(): void;
}

export function throttle<T extends (...args: any) => any>(func: T, wait: number): Throttled<T> {
  let previous = 0;
  let time: ReturnType<typeof setTimeout> | undefined;
  let remaining;

  const throttled = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = +new Date();
    const context = this;
    remaining = wait - (now - previous);
    if (remaining <= 0) {
      func.apply(context, args);
      previous = now;
    } else {
      if (time) {
        clearTimeout(time);
      }
      time = setTimeout(() => {
        func.apply(context, args);
        time = undefined;
        previous = +new Date();
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (time) {
      clearTimeout(time);
    }
  };

  return throttled;
}

// const systemInfo = getSystemInfoSync();

// export const transformRpxToPx = (rpx: number): number => {
//   return (rpx / 750) * systemInfo.windowWidth;
// };

type TData = {
  height: number;
  [k: string]: any;
};
/**
 * 单行数据转多行数据
 * @param data 单行数据
 * @param groupKey 分组 key 值
 * @param rowNum 每行个数
 * @param rowGroupOffsetTopHeight 组块额外高度
 * @param defaultItemHeight 单个元素默认高度
 * @returns
 */
export const transformRow1ToRowNData = (
  // 列表数据
  data: TData[],
  // 分组 key 值
  groupKey = '',
  // 每行个数
  rowNum = 1,
  // 组块额外高度
  rowGroupOffsetTopHeight = 0,
  // 单个元素默认高度
  defaultItemHeight = 0
): {
  groupKey: string;
  height: number;
  data: TData[];
}[] => {
  const obj = {};
  data.forEach(item => {
    if (item[groupKey] === undefined) {
      throw new Error(`item must has ${groupKey} property`);
    }
    if (obj[item[groupKey]] === undefined) {
      obj[item[groupKey]] = [];
    }
    const _item = {
      ...item,
      height: item.height || defaultItemHeight,
    };
    obj[item[groupKey]].push(_item);
  });
  const _data = Object.keys(obj).map(key => {
    const { height = defaultItemHeight } = obj[key][0];
    return {
      groupKey: key,
      height: Math.ceil(obj[key].length / rowNum) * height + rowGroupOffsetTopHeight,
      data: obj[key] as TData[],
    };
  });
  return _data;
};

export const getRandomString = (): string => {
  return Math.random().toString(36).slice(-8);
};

export const getRandomColor = (): string => {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )})`;
};
