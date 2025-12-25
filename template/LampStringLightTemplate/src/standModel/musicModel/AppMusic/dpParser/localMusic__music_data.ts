import { generateDpStrStep } from '@ray-js/panel-sdk/lib/utils/dp/parser';

import { nToHS, toN } from './utils';
import { EMusicDpCode } from '../types';

interface MusicColorType {
  time: number; // 单元切换间隔时间 0~100
  speed: number; // 单元变化时间 0~100
  mode: number; // 单元变化模式 静态：0 跳变：1 渐变：2
  hue: number; //
  saturation: number;
  value: number;
  brightness: number;
  temperature: number;
}

interface MusicValueType {
  id: number;
  colorList: MusicColorType[];
}

const _defaultValue = {
  id: 0,
  colorList: [
    {
      hue: 0,
      saturation: 1000,
      value: 1000,
      brightness: 1000,
      temperature: 1000,
      time: 0,
      speed: 50,
      mode: 0,
    },
  ],
};

export default class SmearFormatter {
  uuid: string;

  defaultValue: {
    id: number;
    colorList: MusicColorType[];
  };

  constructor(uuid = EMusicDpCode.music_data, defaultValue = _defaultValue) {
    this.uuid = uuid;
    this.defaultValue = defaultValue;
  }

  parser(val = '') {
    if (!val || typeof val !== 'string') {
      console.warn(EMusicDpCode.music_data, 'dp data is invalid, cannot be parsed', val);
      return this.defaultValue;
    }
    const step = generateDpStrStep(val);
    const id = toN(step(2).value);

    const result = {
      id,
      colorList: [],
    };
    const getHS = () => {
      const time = toN(step(2).value);
      const speed = toN(step(2).value);
      const mode = toN(step(2).value);
      const hue = toN(step(4).value);
      const saturation = toN(step(4).value);
      const value = toN(step(4).value);
      const brightness = toN(step(4).value);
      const lastItem = step(4);
      const temperature = toN(lastItem.value);
      return {
        time,
        speed,
        mode,
        hue,
        saturation,
        value,
        brightness,
        temperature,
        done: lastItem.done,
      };
    };

    result.colorList = [];
    let _done = false;
    while (!_done) {
      const { time, speed, mode, hue, saturation, value, brightness, temperature, done } = getHS();
      const res = { time, speed, mode, hue, saturation, value, brightness, temperature };
      result.colorList.push(res);
      _done = done;
    }
    return result;
  }

  formatter(data: MusicValueType): string {
    const { id, colorList = [] } = data;

    let result = `${nToHS(id)}`;
    if (colorList.length !== 0) {
      if (colorList[0]?.hue === undefined || colorList[0]?.saturation === undefined) {
        throw new Error('color data is invalid, cannot be generated');
      }
    }
    const getColor = (colors: MusicColorType) => {
      return `${nToHS(colors.time)}${nToHS(colors.speed)}${nToHS(colors.mode)}${nToHS(
        colors?.hue,
        4
      )}${nToHS(colors.saturation, 4)}${nToHS(colors.value, 4)}${nToHS(
        colors.brightness,
        4
      )}${nToHS(colors.temperature, 4)}`;
    };
    const colorsString = colorList.map(d => getColor(d)).join('');
    result += colorsString;
    return result;
  }
}
