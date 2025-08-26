/*
 * @Author: mjh
 * @Date: 2024-09-04 17:29:52
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-09 18:05:21
 * @Description:
 */
import { Transformer } from '@ray-js/panel-sdk/lib/protocols/lamp/interface';

export function toFixed16(v, length = 2) {
  let d = parseInt(v, 10).toString(16);
  if (d.length < length) {
    d = '0'.repeat(length - d.length) + d;
  } else {
    d = d.slice(0, length);
  }
  return d;
}

type ControlDataTransformerValueType = {
  hue?: number;
  saturation?: number;
  value?: number;
  temperature?: number;
  brightness?: number;
};

export default class ControlDataTransformer
  implements Transformer<ControlDataTransformerValueType>
{
  defaultValue: ControlDataTransformerValueType;

  uuid: string;

  constructor(uuid?: string) {
    this.uuid = uuid;
  }

  parser(dpValue: string): any {
    return dpValue;
  }

  formatter(data: ControlDataTransformerValueType) {
    const { brightness, temperature, hue, saturation, value } = data;
    if (typeof brightness === 'undefined') {
      return this.encodeColourControlData(hue, saturation, value);
    }
    return this.encodeControlData(0, 0, 0, brightness, temperature);
  }

  encodeControlData(h, s, v, b, k) {
    const hsvbk = [h, s, v, b, k].reduce((total, next) => total + toFixed16(next, 4), '');
    return `1${hsvbk}`;
  }

  encodeColourControlData(h, s, v) {
    const hsv = this.encodeColourData(h, s, v);
    return `1${hsv}00000000`;
  }

  encodeColourData(h, s, v) {
    let hue = h % 360;
    hue = hue > 0 ? hue : h;
    hue = hue < 0 ? 360 + hue : hue;
    const res = [hue, s, v].reduce((total, cur, idx) => {
      return total + toFixed16(cur, 4);
    }, '');
    return res;
  }
}
