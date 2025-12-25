/* eslint-disable no-useless-escape */
/* eslint-disable radix */
/* eslint-disable no-cond-assign */
/* eslint-disable no-return-assign */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */

export function rgb2hsv(rgb = '') {
  let [r = 0, g = 0, b = 0] = rgb
    .replace('rgba(', '')
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(item => Number(item));
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
  if (C == 0) h = 0;
  else if (M == r) h = ((g - b) / C) % 6;
  else if (M == g) h = (b - r) / C + 2;
  else h = (r - g) / C + 4;
  h *= 60;
  if (h < 0) h += 360;
  v = M;
  if (C == 0) s = 0;
  else s = C / v;
  s *= 100;
  v *= 100;
  return [h, s, v];
}
const limit = (number, min, max) => Math.min(max, Math.max(min, number));

export function hsv2rgb(h = 0, s = 0, v = 0, a) {
  const hsb = [h, s, v].map((bit, i) => {
    let _bit = bit;
    if (_bit) _bit = parseFloat(_bit);
    if (i === 0) {
      return (_bit %= 360) < 0 ? _bit + 360 : _bit;
    }
    return limit(Math.round(bit), 0, 100);
  });

  const br = Math.round((hsb[2] / 100) * 255);
  if (hsb[1] == 0) return [br, br, br];

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
