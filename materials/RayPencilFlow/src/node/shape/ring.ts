/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Shape from './shape';

interface optionInterface {
  [x: string]:
    | string
    | number
    | boolean
    | string[]
    | [{ x: number; y: number }, { x: number; y: number }];
  lineWidth?: number;
  strokeGradient?: string[];
  lineCap?: 'butt' | 'round' | 'square';
  percent?: number;
  strokeGradientPercent?: number;
}

function getRGBFromColor(color) {
  if (color.startsWith('rgb(')) {
    return color.slice(4, -1).split(',').map(Number);
  }
  if (color.startsWith('#')) {
    return color.match(/\w\w/g).map(hex => parseInt(hex, 16));
  }
  throw new Error('Invalid color format');
}

function getGradientColor(startColor, endColor, percent) {
  const startRGB = getRGBFromColor(startColor);
  const endRGB = getRGBFromColor(endColor);

  const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * percent);
  const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * percent);
  const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * percent);

  // eslint-disable-next-line no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return `#${hex}`;
}

const isConicGradientSupported =
  CanvasRenderingContext2D.prototype.createConicGradient !== undefined;
if (!CanvasRenderingContext2D.prototype.applyConicGradient) {
  CanvasRenderingContext2D.prototype.applyConicGradient = function (ctx, options) {
    const {
      lineCap,
      strokeGradient = [],
      percent = 1,
      strokeGradientPercent,
      lineWidth = 0,
      radius,
    } = options;
    const FULL_PI = Math.PI * 2;
    const colorListLen = strokeGradient.length;
    if (colorListLen === 1) {
      if (!lineWidth) {
        throw new Error('When the length of strokeGradient is 1, lineWidth is required');
      }
      ctx.save();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeGradient[0];
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, FULL_PI);
      return;
    }
    const _strokeGradientPercent = strokeGradientPercent || percent;
    if (!isConicGradientSupported) {
      const degree = 360 * percent;
      // 根据度数获取颜色列表 strokeGradient 中对应的颜色
      ctx.save();

      const offset = 2;
      const perDegree = Math.round(degree / (colorListLen - 1));
      for (let angle = 0; angle < degree; angle += 1) {
        const startAngle = ((angle - offset) * Math.PI) / (360 / offset);
        const endAngle = (angle * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // 绘制1度扇形 并进行填充
        ctx.arc(0, 0, radius, startAngle, endAngle, false);
        ctx.closePath();
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2);
        const currentColorIndex = Math.floor(angle / perDegree);
        const currentColor = strokeGradient[currentColorIndex];
        const nextColor = strokeGradient[currentColorIndex + 1];
        const color = getGradientColor(currentColor, nextColor, (angle % perDegree) / perDegree);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      if (lineWidth) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, lineWidth, 0, FULL_PI, false);
        ctx.closePath();
      }
      return;
    }
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, FULL_PI * percent, false);
    percent !== 1 && (ctx.lineCap = lineCap);
    const grad = ctx.createConicGradient(0, 0, 0);
    if (strokeGradient.length > 1) {
      const _strokeGradient = strokeGradient;
      for (let i = 0; i < _strokeGradient.length; i++) {
        const percentVal = (i / (_strokeGradient.length - 1)) * _strokeGradientPercent;
        grad.addColorStop(percentVal, _strokeGradient[i]);
        _strokeGradientPercent !== 1 &&
          _strokeGradient.length - 1 === i &&
          grad.addColorStop(1, _strokeGradient[0]);
      }
    } else {
      grad.addColorStop(0, strokeGradient[0]);
      grad.addColorStop(1, strokeGradient[0]);
    }
    if (typeof lineWidth === 'number') {
      ctx.lineWidth = lineWidth;
    }
    if (lineCap) {
      ctx.lineCap = lineCap;
    }
    ctx.strokeStyle = grad;
  };

  CanvasRenderingContext2D.prototype.renderConicGradient = function () {
    if (!isConicGradientSupported) {
      this.fill();
      // this.restore();
      return;
    }
    this.stroke();
    this.restore();
  };
}

class Ring extends Shape {
  r: number;
  option: optionInterface;

  constructor(r: number, option: optionInterface) {
    super();
    this.option = option || {};
    this.r = r;
  }

  draw() {
    const { strokeGradient } = this.option;

    this.beginPath();
    if (strokeGradient && strokeGradient.length) {
      this.applyConicGradient({
        ...this.option,
        radius: this.r,
      });
      this.renderConicGradient();
    }
  }
}

export default Ring;
