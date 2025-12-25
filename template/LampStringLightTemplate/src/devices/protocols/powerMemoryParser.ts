import { utils } from '@ray-js/panel-sdk';
import { dpCodes } from '@/constant/dpCodes';
const power_memory = { code: dpCodes.power_memory };

const { generateDpStrStep } = utils;

enum Mode {
  default = 0,
  memory = 1,
  custom = 2,
}

type TData = {
  version: number; // 版本
  mode: Mode; // 模式
  h: number;
  s: number;
  v: number;
  b: number;
  t: number;
};

export default class PowerMemory {
  uuid: string;

  defaultValue: TData = {
    version: 1,
    mode: Mode.default,
    h: 0,
    s: 1000,
    v: 1000,
    b: 1000,
    t: 1000,
  };

  constructor(uuid = power_memory?.code, defaultValue?) {
    this.uuid = uuid;
    defaultValue && (this.defaultValue = defaultValue);
  }

  parser(value: string) {
    const { length } = value;
    if (!length) {
      console.warn(power_memory?.code, 'dp data is invalid, cannot be parsed', value);
      return this.defaultValue;
    }
    const step = generateDpStrStep(value);
    const version = step(2).value;
    const mode = step(2).value;
    const h = step(4).value;
    const s = step(4).value;
    const v = step(4).value;
    const b = step(4).value;
    const t = step(4).value;

    const res = {
      version,
      mode,
      h,
      s,
      v,
      b,
      t,
    };
    console.log('power_memory parser', res);
    return res;
  }

  to16(value: number, length: number): string {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }

  formatter(data: TData): string {
    const { version, mode, h, s, v, b, t } = data;
    const versionHex = this.to16(version, 2);
    const modHex = this.to16(mode, 2);
    const hHex = this.to16(h, 4);
    const sHex = this.to16(s, 4);
    const vHex = this.to16(v, 4);
    const bHex = this.to16(b, 4);
    const tHex = this.to16(t, 4);
    const resHex = `${versionHex}${modHex}${hHex}${sHex}${vHex}${bHex}${tHex}`;
    return resHex;
  }
}
