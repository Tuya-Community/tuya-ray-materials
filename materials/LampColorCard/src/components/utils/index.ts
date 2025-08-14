/* eslint-disable no-cond-assign */

const limit = (number, min, max) => Math.min(max, Math.max(min, number));

const hsv2rgb = (h = 0, s = 0, v = 0) => {
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
  return toRgbString(rgb, undefined);
};
const toRgbString = (originRgb, a) => {
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
export { hsv2rgb };
