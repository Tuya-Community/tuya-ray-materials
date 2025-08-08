import { utils } from '@ray-js/panel-sdk';

const { rgb2hsv, hsv2rgb } = utils;

type HSV = {
  h: number;
  s: number;
  v: number;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

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

const kelvin2rgb = (kelvin: number) => {
  const temperature = kelvin / 100.0;
  let red: number;
  let green: number;
  let blue: number;
  if (temperature < 66.0) {
    red = 255;
  } else {
    red = temperature - 55.0;
    red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }
  if (temperature < 66.0) {
    green = temperature - 2;
    green =
      -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  } else {
    green = temperature - 50.0;
    green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  }
  if (temperature >= 66.0) {
    blue = 255;
  } else if (temperature <= 20.0) {
    blue = 0;
  } else {
    blue = temperature - 10;
    blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
    if (blue < 0) blue = 0;
    if (blue > 255) blue = 255;
  }
  return [red, green, blue];
};

const temp2rgb = (
  kelvin: number,
  { temperatureMin = 4000, temperatureMax = 8000 } = {}
): string => {
  // eslint-disable-next-line no-param-reassign
  kelvin /= 10; // 0 - 1000 范围
  const temp = temperatureMin + ((temperatureMax - temperatureMin) * kelvin) / 100;
  const hsv = rgb2hsv(...kelvin2rgb(temp));
  const [h, s, v] = hsv;
  return hsv2RgbString(h, s, v);
};

const brightKelvin2rgb = (
  bright = 1000,
  kelvin = 1000,
  { temperatureMin = 4000, temperatureMax = 8000 } = {}
): string => {
  // eslint-disable-next-line no-param-reassign
  bright /= 10;
  // eslint-disable-next-line no-param-reassign
  kelvin /= 10;
  const temp = temperatureMin + ((temperatureMax - temperatureMin) * kelvin) / 100;
  const hsv = rgb2hsv(...kelvin2rgb(temp));
  const brightV = bright;
  hsv[2] = brightV;
  const [h, s, v] = hsv;
  return hsv2RgbString(h, s, v);
};

const toRgbString = (originRgb: any[], a = 1) => {
  const len = originRgb.length;
  let alpha: any;
  if (len === 4) {
    alpha = originRgb.pop();
  }
  const rgb = originRgb.map((item: number) => Math.round(item));
  if (len === 4) {
    rgb.push(alpha);
    return `rgba(${rgb.join(', ')})`;
  }
  if (a !== undefined && rgb.length === 3) {
    rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    return `rgba(${rgb.join(', ')})`;
  }
  return `rgb(${rgb.join(', ')})`;
};

const hsv2RgbString = (h: number, s: number, v: number, a = 1): string => {
  const rgb = hsv2rgb(h, s, v, a);
  return toRgbString(rgb);
};

export { rgbToHsv, hsvToRgb, hsv2RgbString, temp2rgb, brightKelvin2rgb };
