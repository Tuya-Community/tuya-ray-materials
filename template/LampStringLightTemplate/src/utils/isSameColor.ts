import { isUndefined } from './kit';

type Color = { h?: number; s?: number; v?: number };

export const isSameColor = (c1: Color, c2: Color) => {
  let isSame = false;
  if (c1 && c2) {
    if (!isUndefined(c1.h) && !isUndefined(c2.h)) {
      isSame = +c1.h === +c2.h;
    }
    if (!isUndefined(c1.s) && !isUndefined(c2.s)) {
      isSame = isSame && +c1.s === +c2.s;
    }
    if (!isUndefined(c1.v) && !isUndefined(c2.v)) {
      isSame = isSame && +c1.v === +c2.v;
    }
  }
  return isSame;
};
