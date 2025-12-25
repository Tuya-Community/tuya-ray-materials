/* eslint-disable prefer-destructuring */
/* eslint-disable space-in-parens */
import { generateDpStrStep, numToHexString } from '@ray-js/panel-sdk/lib/utils';
import { Transformer } from '@ray-js/panel-sdk/lib/protocols/lamp/interface';
import { dpCodes } from '@/constant/dpCodes';

const nToSH = (value = 0, num = 2) => {
  return numToHexString(value || 0, num);
};

export type RgbicLinerlightSceneData = {
  version?: number;
  key: number;
  id: number;
  changeType: number;
  cellIntervalTime: number;
  cellChangeTime: number;
  setA: number;
  setB: number;
  setC: number;
  hsvbt?: string;
  colors?: Array<{
    value: number;
    hue: number;
    saturation: number;
    brightness: number;
    temperature: number;
  }>;
};

const _defaultValue = {} as RgbicLinerlightSceneData;

export default class RgbicLinerlightSceneFormater implements Transformer<RgbicLinerlightSceneData> {
  uuid: string;

  defaultValue: any;

  constructor(uuid = dpCodes.rgbic_linerlight_scene, defaultValue = _defaultValue) {
    this.uuid = uuid;
    this.defaultValue = defaultValue;
  }

  parseUnits(generator) {
    const step2 = () => {
      return generator(2);
    };
    const step4 = () => {
      return generator(4);
    };
    const result = [];
    // eslint-disable-next-line no-constant-condition
    for (; true; ) {
      const value = step2().value;
      const hue = step4().value;
      const saturation = step2().value;
      const brightness = step4().value;
      const { value: temperature, done } = step4();
      result.push({
        value,
        hue,
        saturation,
        brightness,
        temperature,
      });
      if (done) {
        break;
      }
    }

    return result;
  }

  parser(val = ''): RgbicLinerlightSceneData {
    if (!val || typeof val !== 'string') {
      console.warn('rgbic_linerlight_scene', 'dp data is invalid, cannot be parsed', val);
      return this.defaultValue;
    }
    const step = generateDpStrStep(val);
    const version = step(2).value;
    const key = step(2).value;
    const changeType = step(2).value;
    const cellIntervalTime = step(2).value;
    const cellChangeTime = step(2).value;
    const setA = step(2).value;
    const setB = step(2).value;
    const setC = step(2).value;

    const sceneUnits = this.parseUnits(step);
    const colors = sceneUnits;

    return {
      version,
      key,
      id: key,
      changeType,
      cellIntervalTime,
      cellChangeTime,
      setA,
      setB,
      setC,
      colors,
    };
  }

  to16(value, length) {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }

  formatter(data: RgbicLinerlightSceneData) {
    const {
      id,
      key = id,
      cellChangeTime,
      cellIntervalTime,
      changeType,
      colors,
      setA,
      setB,
      setC,
      hsvbt,
    } = data;
    const version = '01';

    let result = `${version}${nToSH(key)}${nToSH(changeType)}${nToSH(cellIntervalTime)}${nToSH(
      cellChangeTime
    )}${nToSH(setA)}${nToSH(setB)}${nToSH(setC)}`;

    if (hsvbt) {
      result += hsvbt;
    } else if (colors && colors.length) {
      const units = colors
        .map(
          ({ hue = 0, saturation = 0, value = 0, brightness = 0, temperature = 0 }) =>
            `${this.to16(value, 2)}${this.to16(hue, 4)}${this.to16(saturation, 2)}${this.to16(
              brightness,
              4
            )}${this.to16(temperature, 4)}`
        )
        .join('');
      result += units;
    }

    return result;
  }
}
