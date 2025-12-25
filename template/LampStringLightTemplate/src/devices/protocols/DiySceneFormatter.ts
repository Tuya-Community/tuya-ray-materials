/* eslint-disable prefer-destructuring */
import { dpCodes } from '@/constant/dpCodes';
import { Transformer } from '@ray-js/panel-sdk/lib/protocols/lamp/interface';
import { generateDpStrStep, numToHexString } from '@ray-js/panel-sdk/lib/utils';

const nToSH = (value = 0, num = 2) => {
  return numToHexString(value || 0, num);
};

export type DaubTypeType = 'all' | 'single' | 'clear';
export enum DAUBTYPE {
  all = 1,
  single,
  clear,
}

export type DiySceneData = {
  name?: string;
  version?: number;
  id?: number;
  /** 涂抹动作（1：全选，2：单选，3：擦除） */
  daubType?: DaubTypeType;
  /** 涂抹效果（1：静态，2：闪烁，3：呼吸） */
  effect?: number;
  /** 当前涂抹色是否是白光 */
  segments?: Array<{
    hue?: number;
    saturation?: number;
    value?: number;
    brightness?: number;
    temperature?: number;
    isWhite?: boolean;
  }>;
};

const _defaultValue: DiySceneData = {
  version: 0,
  id: 0,
  daubType: 'all',
  effect: 1,
  segments: [],
};

const diySceneDpCode = dpCodes.diy_scene;
// 00 00 00 00 16464001000464001646004
export default class DiySceneFormater implements Transformer<DiySceneData> {
  uuid: string;
  defaultValue: DiySceneData = _defaultValue;

  constructor(uuid = diySceneDpCode, defaultValue: DiySceneData = _defaultValue) {
    this.uuid = uuid;
    this.defaultValue = defaultValue || _defaultValue;
  }

  parseUnits(generator) {
    const step2 = () => {
      return generator(2);
    };
    const step4 = () => {
      return generator(4, 'string');
    };
    const result = [];
    for (; true; ) {
      const hueAndMode = step4().value;
      const saturationOrTemp = step2().value;
      const { value: valueOrBright, done } = step2();

      const isWhite = hueAndMode.slice(0, 1) === '1';

      if (isWhite) {
        const temperature = saturationOrTemp;
        const brightness = valueOrBright;

        const unit: DiySceneData['segments'][0] = {
          hue: 0,
          saturation: 0,
          value: 0,
          brightness: +(brightness || 0) * 10,
          temperature: +(temperature || 0) * 10,
          isWhite: true,
        };
        result.push(unit);
      } else {
        const hue = +parseInt(hueAndMode.slice(1, 4), 16);
        const saturation = saturationOrTemp;
        const value = valueOrBright;

        const unit: DiySceneData['segments'][0] = {
          hue: +(hue || 0),
          saturation: +(saturation || 0) * 10,
          value: +(value || 0) * 10,
          brightness: 0,
          temperature: 0,
          isWhite: false,
        };
        result.push(unit);
      }

      if (done) {
        break;
      }
    }

    return result;
  }

  // 00 00 21 00 0ee6 46 40 0ee6 46 40 0ee6 464
  parser = (val: string): DiySceneData => {
    if (typeof val !== 'string') {
      console.warn(diySceneDpCode, 'dp data is invalid, cannot be parsed');
      return this.defaultValue;
    }
    if (!val) {
      console.warn(diySceneDpCode, 'dp data is invalid, cannot be parsed');
      return this.defaultValue;
    }

    const step = generateDpStrStep(val);
    const version = step(2).value;
    const id = step(2).value;
    const daubType = DAUBTYPE[step(2).value];
    const { value: effect, done } = step(2);
    if (done) {
      return {
        version,
        id,
        effect,
        daubType: daubType as any,
        segments: [],
      };
    }

    let segments = [];
    try {
      segments = this.parseUnits(step);
    } catch (error) {
      console.warn('parse data error', error);
    }

    return {
      version,
      id,
      effect,
      daubType: daubType as any,
      segments,
    };
  };

  to16(value, length) {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }

  // 00 00 21 00 07a6 4640 07a6 4640 07a6 464
  formatter = (data: DiySceneData): string => {
    const { version, id, effect, daubType, segments } = data;

    let result = `${nToSH(version)}${nToSH(id)}${nToSH(DAUBTYPE[daubType])}${nToSH(effect)}`;
    if (Array.isArray(segments) && segments.length > 0) {
      result += segments
        .map(item => {
          const {
            hue,
            saturation,
            value,
            brightness,
            temperature,
            isWhite = temperature && temperature !== 0,
          } = item;
          const s = Math.round((saturation || 0) / 10);
          const v = Math.round((value || 0) / 10);
          const b = isWhite ? Math.round((brightness || 0) / 10) : 0;
          const t = isWhite ? Math.round((temperature || 0) / 10) : 0;

          if (isWhite) {
            const typeAndHue = `1000`;
            // 4 + 2 + 2
            const ret = `${typeAndHue}${this.to16(t, 2)}${this.to16(b, 2)}`;
            return ret;
          }
          const typeAndHue = `0${this.to16(hue, 4).slice(1)}`;
          // 4 + 2 + 2
          const ret = `${typeAndHue}${this.to16(s, 2)}${this.to16(v, 2)}`;
          return ret;
        })
        .join('');
    }

    return result;
  };
}
