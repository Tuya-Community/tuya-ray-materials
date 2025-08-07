import pencilFlow from '@ray-js/pencil-flow';

const { Shape } = pencilFlow;

const gradientPercent = 0.5;
const OFF_LIGHT_COLOR = '#e2e2e2';

class RoundLine extends Shape {
  constructor(data, isGradient = false) {
    super();
    this.data = data;
    this.isGradient = isGradient;
  }

  draw() {
    this.clear();
    const { data: _data, isGradient } = this;
    if (!_data) {
      return;
    }
    const {
      x,
      y,
      endX,
      endY,
      width,
      border,
      color = 'red',
      nextColor,
      preColor,
      onOff = true, // 开关
    } = _data;
    const ctx = this;
    ctx.beginPath();

    const innerWidth = onOff ? width - 2 * border : width - 2 * border;
    let innerStrokeColor = color;
    // 颜色渐变 isGradient
    if (isGradient) {
      // 颜色渐变
      if (preColor && nextColor) {
        ctx.createLinearGradient(x, y, endX, endY);
        ctx.addColorStop(0, preColor);
        ctx.addColorStop(gradientPercent, color);
        ctx.addColorStop(1, color);
        ctx.strokeGradient();
      } else {
        innerStrokeColor = color;
        ctx.strokeStyle(onOff ? innerStrokeColor : OFF_LIGHT_COLOR);
      }
    } else {
      ctx.strokeStyle(onOff ? innerStrokeColor : OFF_LIGHT_COLOR);
    }
    ctx.lineWidth(innerWidth);
    ctx.lineCap('round');
    ctx.shadow = {
      color: 'rgba(0, 0, 0, 0.3)',
      offsetX: 0,
      offsetY: 2,
      blur: 4,
    };
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

export default RoundLine;
