/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import { setKeepScreenOn } from '@ray-js/ray';
import { throttle } from 'lodash-es';

import { rgb2hsb } from '@ray-js/panel-sdk/lib/utils/color';
import { calcPosition } from '@ray-js/panel-sdk/lib/utils/number';

let manager = null;

// ⚠️ 需要提前引入media ttt库
export let isListening = false;

/**
 * start the process of audio RGB change
 *
 * @return {void}
 */
const start = () => {
  if (!manager) {
    try {
      manager = (ty as any)?.media?.getRGBAudioManager?.();
    } catch (err) {
      console.warn('no getRGBAudioManager', err);
      return;
    }
  }
  if (!manager) {
    return;
  }
  isListening = true;
  manager.stopRGBRecord();
  manager.startRGBRecord();
  setKeepScreenOn({
    keepScreenOn: true,
  });
};
/**
 * Stops the process of audio RGB change
 *
 * @return {void}
 */
export const offMusic2RgbChange = () => {
  if (!manager) {
    console.warn('no getRGBAudioManager');
    return;
  }
  isListening = false;
  if (manager.offAudioRgbChange) {
    console.log('offAudioRgbChange');
    manager.offAudioRgbChange();
  }
  manager.stopRGBRecord();
  setKeepScreenOn({
    keepScreenOn: false,
  });
};

type TMusicOption = {
  mode?: 0 | 1; // 0 跳变；1 渐变 默认1
  colorList?: { hue: number; saturation: number; value: number }[];
  dBRange?: [number, number]; // 分贝范围，会影响颜色亮度
};
/**
 * Listens for audio RGB change and performs actions based on the provided options.
 *
 * @param {(musicData: {
 *   mode: number;
 *   hue: number;
 *   saturation: number;
 *   value: number;
 *   bright: number;
 *   temperature: number;
 * }) => void} callback - The callback function to be executed with the music data.
 * @param {{
 *  mode: 0 | 1; colorList: { hue: number; saturation: number; value: number }[]
 * }} musicOption - The options for controlling the music data.
 */
export const onMusic2RgbChange = (
  callback: (musicData: {
    mode: number;
    hue: number;
    saturation: number;
    value: number;
    bright: number;
    temperature: number;
    extra: any;
  }) => void,
  musicOption?: TMusicOption
) => {
  // 如果当前正在执行监听，直接返回
  if (isListening) {
    return;
  }
  if (!manager) {
    try {
      manager = (ty as any)?.media?.getRGBAudioManager?.();
    } catch (err) {
      console.warn('no getRGBAudioManager', err);
      return;
    }
  }
  if (!manager) {
    return;
  }
  const handleAudioRgbChange = throttle((data: string) => {
    const {
      R,
      G,
      B,
      C: temp,
      L: bright,
      db,
      dB,
    } = (JSON.parse(data) || {}) as {
      R: number;
      G: number;
      B: number;
      C: number;
      L: number;
      db: number;
      dB: number;
      index: number;
    };
    // 兼容不同版本字段
    const _db = dB || db || 0;
    let hue = 0;
    let saturation = 1000;
    let value = 1000;
    const { mode = 1, colorList, dBRange = [40, 80] } = musicOption || {};
    const [minDB, maxDB] = dBRange;
    const [minBright, maxBright] = [0, 1000];
    if (colorList) {
      // 随机获取colorList中的一个
      const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
      if (!randomColor) {
        console.log('onMusic2RgbChange => no random color');
        return;
      }
      hue = randomColor.hue;
      saturation = randomColor.saturation;
      let brightness = randomColor.value;
      if (_db <= minDB) {
        brightness = minBright;
      } else if (_db >= maxDB) {
        brightness = maxBright;
      } else {
        brightness = Math.round(calcPosition(_db, minDB, maxDB, minBright, maxBright));
      }
      value = brightness;
    } else {
      [hue, saturation, value] = rgb2hsb(R, G, B).map((v, i) => (i > 0 ? v * 10 : v));
    }

    const musicData = {
      mode,
      hue: Math.round(hue),
      saturation: Math.round(saturation),
      value: Math.round(value),
      bright: Math.round(bright * 10),
      temperature: Math.round(temp * 10),
      extra: {
        R,
        G,
        B,
        C: temp,
        L: bright,
        db,
        dB,
      },
    };

    callback && callback(musicData);
  }, 300);
  manager.onAudioRgbChange(({ body }) => {
    handleAudioRgbChange(body);
  });
  start();
};

export default {
  onMusic2RgbChange,
  offMusic2RgbChange,
};
