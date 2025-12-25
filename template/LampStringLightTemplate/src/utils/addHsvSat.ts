import { getArray } from './kit';

type ColorItem = {
  h: number;
  s: number;
  v: number;
};
export const addHsvSat = (arr: ColorItem[]) => {
  if (arr?.length > 0) {
    const maxS = getArray(arr)
      .slice()
      .sort((a, b) => b.s - a.s)[0];
    const scale = 1000 / maxS.s;
    return getArray(arr).map(item => ({
      h: item.h,
      s: Math.min(Math.floor(item.s * scale), 1000),
      v: item.v,
    }));
  }
  return arr;
};
