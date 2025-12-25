/* eslint-disable no-return-assign */
// @ts-nocheck

const rgb2RgbString = (originRgb, a) => {
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
};

const limit = (number, min, max) => Math.min(max, Math.max(min, number));

function hsv2rgb(h = 0, s = 0, v = 0, a) {
  const hsb = [h, s, v].map((bit, i) => {
    let _bit = bit;
    if (_bit) _bit = parseFloat(_bit);
    if (i === 0) {
      // eslint-disable-next-line no-cond-assign
      return (_bit %= 360) < 0 ? _bit + 360 : _bit;
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
}

function toRgbString(rgb, a) {
  const len = rgb.length;

  if (len === 4) {
    a = rgb.pop();
  }
  rgb = rgb.map(item => Math.round(item));
  if (len === 4) {
    rgb.push(a);
    return `rgba(${rgb.join(', ')})`;
  }

  if (a !== undefined && rgb.length === 3) {
    rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    return `rgba(${rgb.join(', ')})`;
  }
  return `rgb(${rgb.join(', ')})`;
}

function hsv2rgbString(h, s, v, a) {
  const rgb = hsv2rgb(h, s, v, a);
  return toRgbString(rgb, a);
}

/**
 * A more accurate version algorithm based on a different curve fit to the
 * original RGB to Kelvin data.
 * Input: color temperature in degrees Kelvin
 * Output: json object of red, green and blue components of the Kelvin temperature
 */
function kelvin2rgb(kelvin) {
  const temperature = kelvin / 100.0;
  let red;
  let green;
  let blue;

  if (temperature < 66.0) {
    red = 255;
  } else {
    // a + b x + c Log[x] /.
    // {a -> 351.97690566805693`,
    // b -> 0.114206453784165`,
    // c -> -40.25366309332127
    // x -> (kelvin/100) - 55}
    red = temperature - 55.0;
    red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }

  /* Calculate green */

  if (temperature < 66.0) {
    // a + b x + c Log[x] /.
    // {a -> -155.25485562709179`,
    // b -> -0.44596950469579133`,
    // c -> 104.49216199393888`,
    // x -> (kelvin/100) - 2}
    green = temperature - 2;
    green =
      -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  } else {
    // a + b x + c Log[x] /.
    // {a -> 325.4494125711974`,
    // b -> 0.07943456536662342`,
    // c -> -28.0852963507957`,
    // x -> (kelvin/100) - 50}
    green = temperature - 50.0;
    green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  }

  /* Calculate blue */

  if (temperature >= 66.0) {
    blue = 255;
  } else if (temperature <= 20.0) {
    blue = 0;
  } else {
    // a + b x + c Log[x] /.
    // {a -> -254.76935184120902`,
    // b -> 0.8274096064007395`,
    // c -> 115.67994401066147`,
    // x -> kelvin/100 - 10}
    blue = temperature - 10;
    blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
    if (blue < 0) blue = 0;
    if (blue > 255) blue = 255;
  }

  return [red, green, blue];
}

function rgb2hsv(r = 0, g = 0, b = 0) {
  r = parseFloat(r);
  g = parseFloat(g);
  b = parseFloat(b);
  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;
  if (r > 255) r = 255;
  if (g > 255) g = 255;
  if (b > 255) b = 255;
  r /= 255;
  g /= 255;
  b /= 255;
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
}

export function brightKelvin2rgb(
  bright = 1000,
  kelvin = 1000,
  { temperatureMin = 4000, temperatureMax = 8000 } = {}
) {
  let newKelvin = kelvin;
  let newBright = bright;
  newBright /= 10;
  newKelvin /= 10;
  const temp = temperatureMin + ((temperatureMax - temperatureMin) * newKelvin) / 100;
  const hsv = rgb2hsv(...kelvin2rgb(temp));
  const brightV = newBright;
  hsv[2] = brightV;
  return hsv2rgbString(...hsv, 1);
}

const brightKelvin2rgbOpacity = function (
  bright = 1000,
  kelvin = 1000,
  { temperatureMin = 4000, temperatureMax = 8000 }: any = {}
) {
  bright /= 10;
  kelvin /= 10;
  const temp = temperatureMin + ((temperatureMax - temperatureMin) * kelvin) / 100;
  const hsv = rgb2hsv(...kelvin2rgb(temp));
  const brightV = bright;
  hsv[2] = brightV;
  return hsv2rgbString(...hsv);
};

const bright2Opacity = (
  brightness: number,
  option: { min: number; max: number } = { min: 0.2, max: 1 }
) => {
  const { min = 0.2, max = 1 } = option;
  return Math.round((min + ((brightness - 10) / (1000 - 10)) * (max - min)) * 100) / 100;
};

export const brightKelvin2rgba = (brightness: number, temperature: number) => {
  const color = brightKelvin2rgbOpacity(1000, temperature);
  const alpha = bright2Opacity(brightness);
  const ret = color.replace(/\)$/, `, ${alpha})`);
  return ret;
};
