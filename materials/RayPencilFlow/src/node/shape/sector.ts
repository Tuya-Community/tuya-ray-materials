/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Shape from './shape';

interface optionInterface {
  [x: string]:
    | string
    | number
    | boolean
    | string[]
    | [{ x: number; y: number }, { x: number; y: number }];
  gradientPoints?: [{ x: number; y: number }, { x: number; y: number }];
  fillGradient?: string[];
  strokeGradient?: string[];
  anticlockwise?: boolean;
}

class Sector extends Shape {
  [x: string]: any;
  option: optionInterface;

  constructor(radius: number, startAngle: number, endAngle: number, option: optionInterface) {
    super();

    this.option = option || {};
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  draw() {
    const {
      gradientPoints = [
        { x: -this.radius, y: this.radius },
        { x: this.radius, y: this.radius },
      ],
      fillGradient,
      strokeGradient,
      anticlockwise,
    } = this.option;

    this.beginPath()
      .moveTo(0, 0)
      .arc(0, 0, this.radius, this.startAngle, this.endAngle, anticlockwise)
      .closePath();

    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle);
      this.fill();
    }

    if (this.option.strokeStyle) {
      if (this.option.lineWidth !== undefined) {
        this.lineWidth(this.option.lineWidth);
      }
      this.strokeStyle(this.option.strokeStyle);
      this.stroke();
    }

    if (fillGradient && fillGradient.length) {
      const [point1, point2] = gradientPoints;
      const grad = this.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
      // 可能有多个
      if (this.option.fillGradient.length > 1) {
        for (let i = 0; i < this.option.fillGradient.length; i++) {
          grad.addColorStop(i / (this.option.fillGradient.length - 1), this.option.fillGradient[i]);
        }
      } else {
        grad.addColorStop(0, this.option.fillGradient[0]);
        grad.addColorStop(1, this.option.fillGradient[0]);
      }

      this.fillGradient();
      this.fill();
    }
    if (strokeGradient && strokeGradient.length) {
      const [point1, point2] = gradientPoints;
      const grad = this.createLinearGradient(point1.x, point1.y, point2.x, point2.y);

      if (this.option.strokeGradient.length > 1) {
        for (let i = 0; i < this.option.strokeGradient.length; i++) {
          grad.addColorStop(
            i / (this.option.strokeGradient.length - 1),
            this.option.strokeGradient[i]
          );
        }
      } else {
        grad.addColorStop(0, this.option.strokeGradient[0]);
        grad.addColorStop(1, this.option.strokeGradient[0]);
      }
      if (typeof this.option.lineWidth === 'number') {
        this.lineWidth(this.option.lineWidth);
      }
      this.strokeGradient();
      this.stroke();
    }
  }
}

export default Sector;
