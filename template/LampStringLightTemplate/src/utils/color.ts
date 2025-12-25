import { utils } from '@ray-js/panel-sdk';
import Color from 'color';
const maxIn = 255;
const parse = (d, len = 2) => {
  let res;
  res = `${d}`;
  if (res.length < len) {
    res = '0'.repeat(len - res.length) + res;
  } else {
    res = res.slice(0, len);
  }
  return res;
};
const limit = (number, min, max) => Math.min(max, Math.max(min, number));
const colorUtils = {
  bright2Opacity(brightness: number, option: { min: number; max: number } = { min: 0.2, max: 1 }) {
    const { min = 0.1, max = 1 } = option;
    return Math.round((min + ((brightness - 10) / (1000 - 10)) * (max - min)) * 100) / 100;
  },

  decode(color) {
    let rgb;
    if (/^rgb/.test(color)) {
      const matcher =
        // eslint-disable-next-line no-useless-escape
        color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\.\d]+))?\)/) ||
        [];
      rgb = [matcher[1], matcher[2], matcher[3]].map(item => parseInt(item, 10));
      let alpha = matcher[4];
      if (alpha !== undefined) {
        alpha = Number(alpha) > 1 ? 1 : Number(alpha) < 0 ? 0 : alpha;
        rgb.push(alpha);
      }
      return rgb;
    }
    let newColor = color.replace(/^#/, '');
    const len = newColor.length;
    if (len !== 6 && len !== 3) {
      newColor = '000000';
    }
    if (len === 3) {
      rgb = newColor.split('').map(item => `${item}${item}`);
    } else {
      rgb = newColor.match(/[0-9a-f]{2}/gi) || [];
    }
    return rgb.map(i => {
      let idx = parseInt(i, 16);
      if (idx < 0) idx = 0;
      if (idx > maxIn) idx = maxIn;
      return idx;
    });
  },

  hex2hsv(hex) {
    let [r, g, b] = Color.decode(hex);
    r /= maxIn;
    g /= maxIn;
    b /= maxIn;
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const C = M - m;
    let h;
    let s;
    let v;
    if (C === 0) h = 0;
    else if (M === r) h = ((g - b) / C) % 6;
    else if (M === g) h = (b - r) / C + 2;
    else h = (r - g) / C + 4;
    h *= 60;
    if (h < 0) h += 360;
    v = M;
    if (C === 0) s = 0;
    else s = C / v;
    s *= 100;
    v *= 100;
    return [h, s, v];
  },

  hex2hsb(hex) {
    return Color.hex2hsv(hex);
  },

  rgb2hex(r, g, b) {
    let hex = Math.round(r * 65536) + Math.round(g * 256) + Math.round(b);
    const hexStr = hex.toString(16);
    const len = hexStr.length;
    if (len < 6)
      for (let i = 0; i < 6 - len; i++) {
        hex = `0${hex}` as any;
      }
    if ((hex as unknown as string).toUpperCase) {
      hex = (hex as unknown as string).toUpperCase() as any;
    }
    return `#${hex}`;
  },

  hex2hsl(hex) {
    let [r, g, b] = Color.decode(hex);
    r /= maxIn;
    g /= maxIn;
    b /= maxIn;
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const d = M - m;
    let h;
    let l;
    let s;
    if (d === 0) h = 0;
    else if (M === r) h = ((g - b) / d) % 6;
    else if (M === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
    l = (M + m) / 2;
    if (d === 0) s = 0;
    else s = d / (1 - Math.abs(2 * l - 1));
    s *= 100;
    l *= 100;
    return [h, s, l];
  },

  hex2yuv(hex) {
    const [r, g, b] = Color.decode(hex);
    const y = r * 0.299 + g * 0.587 + b * 0.114;
    const u = r * -0.168736 + g * -0.331264 + b * 0.5 + 128;
    const v = r * 0.5 + g * -0.418688 + b * -0.081312 + 128;
    return [y, u, v];
  },

  yuv2rgb(y, u, v, a) {
    let r;
    let g;
    let b;
    r = y + 1.4075 * (v - 128);
    g = y - 0.3455 * (u - 128) - 0.7169 * (v - 128);
    b = y + 1.779 * (u - 128);
    r = r < 0 ? 0 : r;
    r = r > maxIn ? maxIn : r;
    g = g < 0 ? 0 : g;
    g = g > maxIn ? maxIn : g;
    b = b < 0 ? 0 : b;
    b = b > maxIn ? maxIn : b;
    const rgb = [r, g, b];
    if (a !== undefined) {
      rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    }
    return rgb;
  },

  hsv2rgb(h = 0, s = 0, v = 0, a?) {
    const hsb = [h, s, v].map((bit, i) => {
      let _bit = bit;
      if (_bit) _bit = parseFloat(_bit.toString());
      if (i === 0) {
        _bit %= 360;
        const res = _bit < 0 ? _bit + 360 : _bit;
        return res;
      }
      return limit(Math.round(bit), 0, 100);
    });
    const br = Math.round((hsb[2] / 100) * 255);
    if (hsb[1] === 0) return [br, br, br];
    const hue = hsb[0];
    const f = hue % 60;
    const p = Math.round(((hsb[2] * (100 - hsb[1])) / 10000) * 255);
    const q = Math.round(((hsb[2] * (6000 - hsb[1] * f)) / 600000) * 255);
    const t = Math.round(((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000) * 255);
    let rgb;
    switch (Math.floor(hue / 60)) {
      case 0:
        rgb = [br, t, p];
        break;
      case 1:
        rgb = [q, br, p];
        break;
      case 2:
        rgb = [p, br, t];
        break;
      case 3:
        rgb = [p, q, br];
        break;
      case 4:
        rgb = [t, p, br];
        break;
      default:
        rgb = [br, p, q];
        break;
    }
    if (a !== undefined) {
      rgb.push(limit(Number(a), 0, 1));
    }
    return rgb;
  },

  hsb2rgb(h, s, b, a) {
    return Color.hsv2rgb(h, s, b, a);
  },

  rgb2hsv(r = 0, g = 0, b = 0) {
    let red = parseFloat(r.toString());
    let green = parseFloat(g.toString());
    let blue = parseFloat(b.toString());
    if (red < 0) red = 0;
    if (green < 0) green = 0;
    if (blue < 0) blue = 0;
    if (red > 255) red = 255;
    if (green > 255) green = 255;
    if (blue > 255) blue = 255;
    red /= 255;
    green /= 255;
    blue /= 255;
    const M = Math.max(red, green, blue);
    const m = Math.min(red, green, blue);
    const C = M - m;
    let h;
    let s;
    let v;
    if (C === 0) h = 0;
    else if (M === red) h = ((green - blue) / C) % 6;
    else if (M === green) h = (blue - red) / C + 2;
    else h = (red - green) / C + 4;
    h *= 60;
    if (h < 0) h += 360;
    v = M;
    if (C === 0) s = 0;
    else s = C / v;
    s *= 100;
    v *= 100;
    return [h, s, v];
  },

  rgb2hsb(r, g, b) {
    return Color.rgb2hsv(r, g, b);
  },

  hsv2hex(h, s, v) {
    const rgb = Color.hsv2rgb(h, s, v).map(item => Math.round(item));
    // eslint-disable-next-line prefer-spread
    return Color.rgb2hex.apply(Color, rgb);
  },

  hsb2hex(h, s, b) {
    return Color.hsv2hex(h, s, b);
  },

  rgb2hsl(r = 0, g = 0, b = 0) {
    let red = parseFloat(r.toString());
    let green = parseFloat(g.toString());
    let blue = parseFloat(b.toString());
    if (red < 0) red = 0;
    if (green < 0) green = 0;
    if (blue < 0) blue = 0;
    if (red > 255) red = 255;
    if (green > 255) green = 255;
    if (blue > 255) blue = 255;
    red /= 255;
    green /= 255;
    blue /= 255;
    const M = Math.max(red, green, blue);
    const m = Math.min(red, green, blue);
    const d = M - m;
    let h;
    let s;
    let l;
    if (d === 0) h = 0;
    else if (M === red) h = ((green - blue) / d) % 6;
    else if (M === green) h = (blue - red) / d + 2;
    else h = (red - green) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
    l = (M + m) / 2;
    if (d === 0) s = 0;
    else s = d / (1 - Math.abs(2 * l - 1));
    s *= 100;
    l *= 100;
    h = h.toFixed(0);
    s = s.toFixed(0);
    l = l.toFixed(0);
    return [h, s, l];
  },

  hsl2rgb(h = 0, s = 0, l = 0, a?) {
    let hue = parseFloat(h.toString());
    let sat = parseFloat(s.toString());
    let lit = parseFloat(l.toString());
    if (hue < 0) hue = 0;
    if (sat < 0) sat = 0;
    if (lit < 0) lit = 0;
    if (hue >= 360) hue = 359;
    if (sat > 100) sat = 100;
    if (lit > 100) lit = 100;
    sat /= 100;
    lit /= 100;
    const C = (1 - Math.abs(2 * lit - 1)) * sat;
    const hh = hue / 60;
    const X = C * (1 - Math.abs((hh % 2) - 1));
    let r = 0;
    let g = 0;
    let b = 0;
    if (hh >= 0 && hh < 1) {
      r = C;
      g = X;
    } else if (hh >= 1 && hh < 2) {
      r = X;
      g = C;
    } else if (hh >= 2 && hh < 3) {
      g = C;
      b = X;
    } else if (hh >= 3 && hh < 4) {
      g = X;
      b = C;
    } else if (hh >= 4 && hh < 5) {
      r = X;
      b = C;
    } else {
      r = C;
      b = X;
    }
    const m = lit - C / 2;
    r += m;
    g += m;
    b += m;
    r *= maxIn;
    g *= maxIn;
    b *= maxIn;
    const rgb = [r, g, b];
    if (a !== undefined) {
      rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    }
    return rgb;
  },

  hsl2hex(h, s, l) {
    const [r, g, b] = Color.hsl2rgb(h, s, l);
    return Color.rgb2hex(r, g, b);
  },

  randomRgb(min = 0, max = 255) {
    const random = (mi, ma) => {
      let x = max;
      let y = min;
      if (x < y) {
        x = mi;
        y = ma;
      }
      return Math.random() * (x - y) + y;
    };
    return [random(min, max), random(min, max), random(min, max)];
  },

  randomHsb() {
    const random = (min, max) => {
      let x = max;
      let y = min;
      if (x < y) {
        x = min;
        y = max;
      }
      return Math.random() * (x - y) + y;
    };
    return [random(0, 360), random(0, 100), random(0, 100)];
  },

  complement(color) {
    const rgb = Color.decode(color).map(item => Math.round(item));
    const mm = Math.min(...rgb) + Math.max(...rgb);
    const [r, g, b] = rgb.map(item => mm - item);
    const hex = Color.rgb2hex(r, g, b);
    return hex;
  },

  reversed(color) {
    const rgb = Color.decode(color).map(item => Math.round(item));
    const [r, g, b] = rgb.map(item => maxIn - item);
    return Color.rgb2hex(r, g, b);
  },

  hex2RgbString(hex, a) {
    const rgb = Color.decode(hex);
    return Color.toRgbString(rgb, a);
  },

  hsv2RgbString(h, s, v, a?) {
    const rgb = Color.hsv2rgb(h, s, v, a);
    return Color.toRgbString(rgb);
  },

  hsb2RgbString(...args) {
    // eslint-disable-next-line prefer-spread
    return Color.hsv2RgbString.apply(Color, args);
  },

  hsl2RgbString(h, s, l, a) {
    const rgb = Color.hsl2rgb(h, s, l, a);
    return Color.toRgbString(rgb);
  },

  yuv2RgbString(y, u, v, a) {
    const rgb = Color.yuv2rgb(y, u, v, a);
    return Color.toRgbString(rgb);
  },

  encodeColorData(rgbhsv) {
    const rgbStr = rgbhsv.slice(0, 3);
    let hsv = rgbhsv.slice(3);
    const rgb = rgbStr.map(item => (item < 0 ? 0 : item > 255 ? 255 : item));
    if (hsv.length === 0) {
      hsv = Array(4).fill(0);
    } else {
      let h = Number(hsv[0]);
      h = h % 360 ? h % 360 : h;
      h = h < 0 ? 360 + h : h;
      const hh = Math.floor(h / 256);
      const hl = Math.floor(h % 256);
      hsv.splice(1, 0, hl);
      hsv[0] = hh;
    }
    return rgb
      .concat(hsv)
      .map(item => parse(Math.round(Number(item)).toString(16), 2))
      .join('');
  },

  decodeColorData(data = '') {
    const arr1 = data.match(/[a-z\d]{2}/gi) || [];
    const len = 7 - arr1.length;
    const arr2 = Array(len < 0 ? 0 : len).fill('00');
    const arr = arr1.concat(arr2);
    const hsv = arr.slice(3);
    const rgb = arr.slice(0, 3).map(item => parseInt(item, 16));
    const h = parseInt(hsv[0] + hsv[1], 16);
    const s = parseInt(hsv[2], 16);
    const v = parseInt(hsv[3], 16);
    return [...rgb, h, s, v];
  },

  decodeColorDataWithPosition(data = '') {
    const arr1 = data.match(/[a-z\d]{2}/gi) || [];
    const len = 7 - arr1.length;
    const arr2 = Array(len < 0 ? 0 : len).fill('00');
    const arr = arr1.concat(arr2);
    const rs = arr.map(item => parseInt(item, 16));
    rs[3] /= 100;
    rs[4] /= 100;
    return rs;
  },

  encodeColorDataWithPosition(rgbxyve) {
    let rgb = rgbxyve.slice(0, 3);
    let xyve = rgbxyve.slice(3);
    rgb = rgb.map(item => (item < 0 ? 0 : item > 255 ? 255 : item));
    let len = 4 - xyve.length;
    len = len < 0 ? 0 : len;
    xyve = xyve.concat(Array(len).fill(0));
    const [x, y] = xyve;
    xyve[0] = x * 100;
    xyve[1] = y * 100;
    return rgb
      .concat(xyve)
      .map(item => parse(Math.round(item).toString(16), 2))
      .join('');
  },

  encodeSceneData(data) {
    if (data.length === 0) {
      return '';
    }
    const reduce = (d, init) =>
      d.reduce((curr, next) => {
        if (next.concat) {
          return reduce(next, curr);
        }
        return curr + parse(Math.round(next).toString(16), 2);
      }, init);
    return reduce(data, '');
  },

  decodeSceneData(data) {
    if (!data) {
      return [];
    }
    const arr = data.match(/[a-z\d]{2}/gi);
    const [l, t, f, c, ...d] = arr;
    const ltfc = [l, t, f, c].map(item => parseInt(item, 16));
    const rgbs = [];
    const count = Math.min(ltfc[3], d.length / 3) || 1;
    ltfc[3] = count;
    for (let i = 0; i < count; i++) {
      const n = i * 3 - 1;
      rgbs.push([d[n + 1], d[n + 2], d[n + 3]].map(item => parseInt(item, 16)));
    }
    return ltfc.concat(rgbs);
  },

  decodeSceneDataWithMode(data) {
    if (!data) {
      return [];
    }
    const arr = data.match(/[a-z\d]{2}/gi);
    const [l, t, f, c, ...d] = arr;
    const ltfc = [l, t, f, c].map(item => parseInt(item, 16));
    const mrgbhsvbt = [];
    const count = Math.min(ltfc[3], d.length / 8);
    ltfc[3] = count;
    for (let i = 0; i < count; i++) {
      const n = i * 8 - 1;
      const _arr = [];
      let j = 1;
      while (j < 9) {
        _arr.push(d[n + j]);
        j++;
      }
      mrgbhsvbt.push(_arr.map(item => parseInt(item, 16)));
    }
    return ltfc.concat(mrgbhsvbt);
  },

  toRgbString(originRgb, a?) {
    const len = originRgb.length;
    let alpha;
    if (len === 4) {
      alpha = originRgb.pop();
    }
    const rgb = originRgb.map(item => Math.round(item));
    if (len === 4) {
      rgb.push(alpha);
      return `rgba(${rgb.join(', ')})`;
    }
    if (a !== undefined && rgb.length === 3) {
      rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
      return `rgba(${rgb.join(', ')})`;
    }
    return `rgb(${rgb.join(', ')})`;
  },

  kelvin2rgbUsingTH(kelvin) {
    const temperature = kelvin / 100.0;
    let red;
    let green;
    let blue;
    if (temperature <= 66.0) {
      red = 255;
    } else {
      red = temperature - 60.0;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      if (red < 0) red = 0;
      if (red > 255) red = 255;
    }
    if (temperature <= 66.0) {
      green = temperature;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;
      if (green < 0) green = 0;
      if (green > 255) green = 255;
    } else {
      green = temperature - 60.0;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);
      if (green < 0) green = 0;
      if (green > 255) green = 255;
    }
    if (temperature >= 66.0) {
      blue = 255;
    } else if (temperature <= 19.0) {
      blue = 0;
    } else {
      blue = temperature - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      if (blue < 0) blue = 0;
      if (blue > 255) blue = 255;
    }
    return [red, green, blue];
  },

  kelvin2rgb(kelvin) {
    const temperature = kelvin / 100.0;
    let red;
    let green;
    let blue;
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
  },

  rgb2kelvin([r, , b]) {
    const epsilon = 0.4;
    let temperature;
    let minTemperature = 1000;
    let maxTemperature = 40000;
    while (maxTemperature - minTemperature > epsilon) {
      temperature = (maxTemperature + minTemperature) / 2;
      const [_r, , _b] = Color.kelvin2rgb(temperature);
      if (_b / _r >= b / r) {
        maxTemperature = temperature;
      } else {
        minTemperature = temperature;
      }
    }
    return Math.round(temperature);
  },
};
const { bright2Opacity, kelvin2rgb, hsv2RgbString } = colorUtils;

type HSV = {
  h: number; // 0 - 360
  s: number; // 0 - 1000
  v: number; // 0 - 1000
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

const { rgb2hsv, hsv2rgb } = utils;

export const rgbStrToRgb = (rgbStr: string): RGB | null => {
  const match = rgbStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) {
    return null;
  }
  return {
    r: +match[1],
    g: +match[2],
    b: +match[3],
  };
};

export const rgbStrToHsv = (rgbStr: string) => {
  const rgb = rgbStrToRgb(rgbStr);
  if (!rgb) {
    return null;
  }
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
};

export const hsvToRgbStr = (hsv: HSV) => {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
};

const rgbToHsv = (r: number, g: number, b: number): HSV => {
  const [h, s, v] = rgb2hsv(r, g, b);
  return {
    h: Math.floor(h),
    s: Math.floor(s * 10),
    v: Math.floor(v * 10),
  };
};

/**
 * h: 0 - 360
 * s: 0 - 1000
 * v: 0 - 1000
 */
const hsvToRgb = (h: number, s: number, v: number): RGB => {
  const [r, g, b] = hsv2rgb(h, s / 10, v / 10);
  return {
    r,
    g,
    b,
  };
};

const brightKelvin2rgb = (
  bright = 1000,
  kelvin = 1000,
  { temperatureMin = 4000, temperatureMax = 8000 }: any = {}
) => {
  // eslint-disable-next-line no-param-reassign
  bright /= 10;
  // eslint-disable-next-line no-param-reassign
  kelvin /= 10;
  const temp = temperatureMin + ((temperatureMax - temperatureMin) * kelvin) / 100;
  const hsv = rgb2hsv(...kelvin2rgb(temp));
  const [h, s, v] = hsv;
  const brightV = bright;
  hsv[2] = brightV;
  return hsv2RgbString(h, s, v);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const brightKelvin2rgba = (bright = 0, kelvin = 0) => {
  const c = brightKelvin2rgb(bright, kelvin);
  const { color = [], valpha: a } = Color(c).alpha(bright2Opacity(bright)).rgb();
  const [r, g, b] = color;
  return {
    r,
    g,
    b,
    a,
  };
};
export { rgbToHsv, hsvToRgb, brightKelvin2rgba };
