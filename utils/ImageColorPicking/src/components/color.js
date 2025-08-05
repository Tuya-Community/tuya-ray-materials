/*
 * @Author: mjh
 * @Date: 2025-01-02 18:28:49
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-02 18:29:01
 * @Description:
 */
const limit = (number, min, max) => Math.min(max, Math.max(min, number));

export function hsv2rgb() {
  let h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let a = arguments.length > 3 ? arguments[3] : undefined;
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
}

export function rgb2hsv() {
  let r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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
}
