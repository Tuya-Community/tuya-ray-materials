import pencilFlow from '@ray-js/pencil-flow';

const { Shape } = pencilFlow;
const gradientPercent = 0.4;
const OFF_LIGHT_COLOR = '#e2e2e2';

class RightCircleLine extends Shape {
  constructor(data, isGradient) {
    super();
    this.data = data;
    this.isGradient = isGradient;
  }

  draw() {
    this.clear();
    const { data: _data, isGradient } = this;
    const {
      x,
      y,
      length,
      shortLength,
      width = 8,
      diameter,
      border,
      preColor,
      color = 'red',
      nextColor,
      onOff = true,
    } = _data;
    const ctx = this;
    ctx.beginPath();

    const innerWidth = onOff ? width - 2 * border : width - 2 * border;
    const radius = diameter / 2;
    const centerX = x + length;
    const centerY = y + radius;
    let innerStrokeColor = color;
    // 颜色渐变 isGradient
    if (isGradient) {
      // 颜色渐变
      if (preColor && nextColor) {
        const gradient = ctx.createLinearGradient(x, y, x + (length - shortLength), y + diameter);
        gradient.addColorStop(0, preColor);
        gradient.addColorStop(gradientPercent, color);
        gradient.addColorStop(1, color);
        gradient.strokeGradient();
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
    ctx.lineTo(x + length, y);

    ctx.moveTo(x + length, y);
    ctx.arc(centerX, centerY, radius, -90 * (Math.PI / 180), -270 * (Math.PI / 180), false);

    ctx.moveTo(x + length, y + diameter);
    ctx.lineTo(x + (length - shortLength), y + diameter);
    ctx.stroke();
  }
}
export default RightCircleLine;
