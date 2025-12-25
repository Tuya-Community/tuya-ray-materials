import { isSameColor } from './isSameColor';
import { dedup, getArray } from './kit';

export const getToggleAppendColor = (
  list: { h: number; s: number; v?: number; id?: number }[],
  color: { h: number; s: number; v?: number; id?: number },
  isDel = false
) => {
  if (isDel) {
    const hadColor = !!getArray(list).find(item => isSameColor(item, color));
    if (hadColor) {
      return getArray(list).filter(item => !isSameColor(item, color));
    }
  }

  return dedup(getArray(list).concat(color), isSameColor);
};
