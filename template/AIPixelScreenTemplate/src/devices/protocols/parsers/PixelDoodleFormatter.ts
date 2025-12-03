import { transform, generateStep } from './transform';

export default class PixelDoodleFormatter {
  uuid: string;
  defaultValue: {
    type: number;
    colour: Record<string, number>;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    hexArr?: string[];
  };

  constructor(uuid = 'pixel_doodle', defaultValue = null) {
    this.defaultValue = {
      type: 0,
      colour: { r: 0, g: 0, b: 0 },
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      hexArr: [],
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
      const type = step2();
      const r = step2();
      const g = step2();
      const b = step2();
      const colour = { r, g, b };
      const minX = step4();
      const minY = step4();
      const maxX = step4();
      const maxY = step4();
      const hexArrStr = val.slice(24);
      const hexArr = hexArrStr.match(/.{1,2}/g);
      return {
        /**
         * 画图类型, 0描点, 1矩形填充
         */
        type: Number.isNaN(type) ? 0 : type,
        /**
         * 画笔颜色
         */
        colour: colour ? { r: 0, g: 0, b: 0 } : colour,
        /**
         * 开始X坐标
         */
        minX: minX,
        /**
         * 开始Y坐标
         */
        minY: minY,
        /**
         * 结束X坐标
         */
        maxX: maxX,
        /**
         * 结束Y坐标
         */
        maxY: maxY,
        /**
         * 数据
         */
        hexArr,
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
    const { type, colour, minX, minY, maxX, maxY, hexArr } = data;

    const typeStr = this.to16(type, 2);

    const rStr = this.to16(colour.r, 2);
    const gStr = this.to16(colour.g, 2);
    const bStr = this.to16(colour.b, 2);
    const colourStr = `${rStr}${gStr}${bStr}`;

    const minXStr = this.to16(minX, 4);
    const minYStr = this.to16(minY, 4);
    const maxXStr = this.to16(maxX, 4);
    const maxYStr = this.to16(maxY, 4);
    const hex = hexArr ? hexArr.join('') : '';

    return `${typeStr}${colourStr}${minXStr}${minYStr}${maxXStr}${maxYStr}${hex}`;
  }
}
