import { setStorage, getStorage } from '@ray-js/ray';
import { utils } from '@ray-js/panel-sdk';

const { rgb2hsv, hsv2rgb } = utils;

type HSL = {
  h: number;
  s: number;
  l: number;
};

export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  const [h, s, v] = rgb2hsv(r, g, b);
  return {
    h,
    s,
    v,
  };
};

export const hsvToRgb = (h: number, s: number, v: number): RGB => {
  const [r, g, b] = hsv2rgb(h, s, v);
  return {
    r,
    g,
    b,
  };
};

/* eslint-disable no-param-reassign */
export const rgbToHsl = (r: number, g: number, b: number): HSL => {
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

export const setStorageItem = (storageKey: string, value: any) => {
  const data = { value, type: typeof value };
  const jsonValue = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    setStorage({
      key: storageKey,
      data: jsonValue,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

export const getStorageItem = (storageKey: string) => {
  return new Promise((resolve, reject) => {
    getStorage({
      key: storageKey,
      success: ({ data }) => {
        if (data) {
          resolve(JSON.parse(data)?.value);
        }
        resolve(null);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};
