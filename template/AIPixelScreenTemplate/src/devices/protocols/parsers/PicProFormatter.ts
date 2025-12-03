import { transform, generateStep } from './transform';

export default class PicProFormatter {
  uuid: string;
  defaultValue: {
    md5Id: string;
    programId?: number;
    mode?: number;
    playVal?: number;
    effect?: number;
    speed?: number;
    time?: number;
  };

  constructor(uuid = 'pic_pro', defaultValue = null) {
    this.defaultValue = {
      programId: 60,
      md5Id: '',
      mode: 1,
      playVal: 5,
      effect: 1,
      speed: 3,
      time: 2000,
    };
    this.uuid = uuid;
    if (defaultValue) {
      this.defaultValue = defaultValue;
    }
  }

  equal(source, target) {
    return source === target;
  }

  parser(val = '') {
    if (!val) {
      // eslint-disable-next-line no-console
      console.log(`DP ${this.uuid} 数据为空，无法解析`, val, typeof val);
      return this.defaultValue;
    }

    try {
      const generator = transform(val);
      generator.next();
      const step2 = generateStep(generator, 2);
      const step4 = generateStep(generator, 4);
      const step32 = generateStep(generator, 32);
      const programId = step2();
      const md5Id = step32();
      const mode = step2();
      const playVal = step4();
      const effect = step2();
      const speed = step2();
      const time = step4();
      return {
        /**
         * 节目 ID 号 0-60, 60 为默认值, 62 仅播一次
         */
        programId: Number.isNaN(programId) ? 60 : programId,
        /**
         * md5 识别码
         */
        md5Id: Number.isNaN(md5Id) ? 0 : md5Id,
        /**
         * 播放模式 定次播放0, 定时播放1
         */
        mode: Number.isNaN(mode) ? 0 : mode,
        /**
         * 播放数值, 定次播放 0-65534次, 定时播放 0-65534秒
         */
        playVal: Number.isNaN(playVal) ? 0 : playVal,
        /**
         * 特效标识, 0-46
         */
        effect: Number.isNaN(effect) ? 0 : effect,
        /**
         * 特效速度值, 0-14
         */
        speed: Number.isNaN(speed) ? 0 : speed,
        /**
         * 停留时间, 毫秒
         */
        time: Number.isNaN(time) ? 0 : time,
      };
    } catch (error) {
      console.warn(`DP ${this.uuid} 出现异常数据，无法解析`, val, typeof val);
      return this.defaultValue;
    }
  }

  to16(value, length) {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }

  formatter(data) {
    // 自定义格式转为16进制
    const {
      md5Id,
      programId = 60,
      mode = 1,
      playVal = 5,
      effect = 1,
      speed = 3,
      time = 2000,
    } = data;

    const programIdStr = this.to16(programId, 2);
    const modeStr = this.to16(mode, 2);
    const playValStr = this.to16(playVal, 4);
    const effectStr = this.to16(effect, 2);
    const speedStr = this.to16(speed, 2);
    const timeStr = this.to16(time, 4);

    return `${programIdStr}${md5Id}${modeStr}${playValStr}${effectStr}${speedStr}${timeStr}`;
  }
}
