import { utils } from '@ray-js/panel-sdk';
import { getSystemInfoSync } from '@ray-js/ray';

const { rgb2hsv, hsv2rgb } = utils;

type HSL = {
  h: number;
  s: number;
  l: number;
};

/* eslint-disable no-param-reassign */
const rgbToHsl = (r: number, g: number, b: number): HSL => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number;
  let s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: h * 360,
    s,
    l,
  };
};

let __systemCacheInfo = null;
export const getSystemCacheInfo = (): { screenWidth: number; screenHeight: number } => {
  if (!__systemCacheInfo) {
    __systemCacheInfo = getSystemInfoSync();
  }
  return __systemCacheInfo;
};

export { rgbToHsl, rgb2hsv, hsv2rgb };
