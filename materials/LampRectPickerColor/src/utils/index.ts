import { utils } from '@ray-js/panel-sdk';
import Strings from '../i18n';

const { rgb2hsv, hsv2rgb } = utils;

const rgbToHsv = (r: number, g: number, b: number): HSV => {
  const [h, s, v] = rgb2hsv(r, g, b);
  return {
    h,
    s,
    v,
  };
};

const hsvToRgb = (h: number, s: number, v: number): RGB => {
  const [r, g, b] = hsv2rgb(h, s, v);
  return {
    r,
    g,
    b,
  };
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
export const formatColorText = (hue: number): string => {
  const degree = hue || 0;
  let text = Strings.getLang('color_red');
  if (degree >= 15 && degree < 45) {
    text = Strings.getLang('color_orange');
  } else if (degree >= 45 && degree < 75) {
    text = Strings.getLang('color_yellow');
  } else if (degree >= 75 && degree < 105) {
    text = Strings.getLang('color_yellow_green');
  } else if (degree >= 105 && degree < 135) {
    text = Strings.getLang('color_green');
  } else if (degree >= 135 && degree < 165) {
    text = Strings.getLang('color_cyan_green');
  } else if (degree >= 165 && degree < 195) {
    text = Strings.getLang('color_cyan');
  } else if (degree >= 195 && degree < 225) {
    text = Strings.getLang('color_indigo');
  } else if (degree >= 225 && degree < 255) {
    text = Strings.getLang('color_blue');
  } else if (degree >= 255 && degree < 285) {
    text = Strings.getLang('color_purple');
  } else if (degree >= 285 && degree < 315) {
    text = Strings.getLang('color_magenta');
  } else if (degree >= 315 && degree < 345) {
    text = Strings.getLang('color_purple_red');
  } else {
    text = Strings.getLang('color_red');
  }
  return text;
};

export { rgbToHsl, rgbToHsv, hsvToRgb };
