// @ts-nocheck

import _ from 'lodash';
import { numToHexString, toFixed } from '@ray-js/panel-sdk/lib/utils';
import { Transformer } from '@ray-js/panel-sdk/lib/protocols/lamp/interface';

const drawToolCode = 'diy_scene';

// eslint-disable-next-line no-shadow
export enum DAUBTYPE {
  all = 1,
  single,
  clear,
}

export const sToN = (str = '', base = 16) => {
  return parseInt(str, base) || 0;
};

export const nToSH = (value = 0, num = 2) => {
  return numToHexString(value || 0, num);
};

export function avgSplit(str = '', num = 1) {
  const reg = new RegExp(`.{1,${num}}`, 'g');
  return str.match(reg) || [];
}

function* transform(value: string) {
  let start = 0;
  let result: number | string = '';
  let length;
  while (true) {
    length = yield result;
    const newStart = length > 0 ? start + length : value.length + (length || 0);
    result = length > 0 ? sToN(value.slice(start, newStart)) : value.slice(start, newStart);
    if (newStart >= value.length) break;
    start = newStart;
  }
  return result;
}

export type DaubTypeType = 'all' | 'single' | 'clear';

export interface DrawToolType {
  /** 版本号 */
  version?: number;
  /** 涂抹动作（1：全选，2：单选，3：擦除） */
  daubType?: DaubTypeType;
  /** 涂抹效果（1：静态，2：闪烁，3：呼吸） */
  effect?: number;
  /** 彩光色相 */
  hue?: number;
  /** 彩光饱和度 */
  saturation?: number;
  /** 彩光亮度 */
  value?: number;
  /** 白光亮度 */
  brightness?: number;
  /** 白光色温 */
  temperature?: number;
  /** 当前涂抹色是否是白光 */
  isWhite?: boolean;
  /** 点选类型(0: 连续，1: 单点) */
  singleType?: number;
  /** 点数 */
  quantity?: number;
  /** 编号 */
  indexs?: number[];
}

export default class DrawToolFormater implements Transformer<DrawToolType> {
  uuid: string;
  defaultValue: DrawToolType;

  constructor(
    uuid = drawToolCode,
    defaultValue = { version: 1, daubType: 0, hue: 0, saturation: 1000, value: 1000 }
  ) {
    this.uuid = uuid;
    this.defaultValue = defaultValue;
  }

  parser(val = ''): DrawToolType {
    if (typeof val !== 'string') {
      console.warn(drawToolCode, 'dp data is invalid, cannot be parsed');
      return this.defaultValue;
    }
    if (!val) {
      console.warn(drawToolCode, 'dp data is invalid, cannot be parsed');
      return this.defaultValue;
    }

    const generator = transform(val);
    const step = (n?: number) => generator.next(n);
    step();
    const version = step(2).value;
    const daubType = DAUBTYPE[step(2).value];
    const effect = step(2).value;
    const hue = step(4).value || 0;
    const saturation = +(step(2).value || 0) * 10;
    const value = +(step(2).value || 0) * 10;
    const brightness = +(step(2).value || 0) * 10;
    const temperature = +(step(2).value || 0) * 10;

    const result = {
      version,
      daubType,
      effect,
      hue,
      saturation,
      value,
      brightness,
      temperature,
      isWhite: [brightness, temperature].some(v => v),
    } as DrawToolType;

    // 处理单选、擦除，逻辑一样
    if ([DAUBTYPE[2], DAUBTYPE[3]].includes(daubType)) {
      const singleDataStr = toFixed(step(2).value?.toString(2) ?? '', 8);
      const singleType = sToN(singleDataStr.slice(0, 1), 2);
      result.singleType = singleType;
      result.quantity = sToN(singleDataStr.slice(1), 2);
      const indexStr = step().value?.toString() ?? '';
      const indexs = new Set<number>();
      if (singleType === 0) {
        // 连续
        avgSplit(indexStr, 8).forEach(v => {
          const arr = avgSplit(v, 4);
          _.range(sToN(arr[0]), sToN(arr[1]) + 1).forEach(a => indexs.add(a));
        });
      } else if (singleType === 1) {
        // 单点
        avgSplit(indexStr, 4).forEach(v => indexs.add(sToN(v)));
      }
      result.indexs = Array.from(indexs);
    }

    return result;
  }

  formatter(data: DrawToolType): string {
    const {
      version = 1,
      daubType = DAUBTYPE[1],
      effect = 1,
      hue = 0,
      saturation = 0,
      value = 0,
      brightness = 0,
      temperature = 0,
      isWhite,
    } = data;

    const s = Math.round((saturation || 0) / 10);
    const v = Math.round((value || 0) / 10);
    const b = isWhite ? Math.round((brightness || 0) / 10) : 0;
    const t = isWhite ? Math.round((temperature || 0) / 10) : 0;

    let result = `${nToSH(version)}${nToSH(DAUBTYPE[daubType])}${nToSH(effect)}${nToSH(
      hue,
      4
    )}${nToSH(s)}${nToSH(v)}${nToSH(b)}${nToSH(t)}`;
    // 点选时额外发送的数据
    if ([DAUBTYPE[2], DAUBTYPE[3]].includes(daubType)) {
      const { singleType = 1, quantity = 1, indexs = [] } = data;
      result += `${nToSH(
        parseInt(`${singleType}${toFixed(indexs.length?.toString(2) ?? '', 7)}`, 2)
      )}${[...indexs].reduce((acc, cur) => acc + nToSH(cur, 4), '')}`;
    }

    return result;
  }
}
