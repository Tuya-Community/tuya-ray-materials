import Shape from './shape';

interface optionInterface {
  [x: string]:
    | string
    | number
    | boolean
    | string[]
    | [{ x: number; y: number }, { x: number; y: number }];

  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  gradientPoints?: [{ x: number; y: number }, { x: number; y: number }];
  fillGradient?: string[];
  strokeGradient?: string[];
}

class Ellipse extends Shape {
  width: number;
  height: number;
  option: optionInterface;

  constructor(width: number, height: number, option: optionInterface) {
    super();
    this.option = option || {};
    this.width = width;
    this.height = height;
  }

  draw() {
    const w = this.width;
    const h = this.height;
    const k = 0.5522848;
    const ox = (w / 2) * k;
    const oy = (h / 2) * k;
    const xe = w;
    const ye = h;
    const xm = w / 2;
    const ym = h / 2;

    this.beginPath();
    this.moveTo(0, ym);
    this.bezierCurveTo(0, ym - oy, xm - ox, 0, xm, 0);
    this.bezierCurveTo(xm + ox, 0, xe, ym - oy, xe, ym);
    this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.bezierCurveTo(xm - ox, ye, 0, ym + oy, 0, ym);

    if (this.option.strokeStyle) {
      if (this.option.lineWidth !== undefined) {
        this.lineWidth(this.option.lineWidth);
      }
      this.strokeStyle(this.option.strokeStyle);
      this.stroke();
    }

    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle);
      this.fill();
    }

    const {
      gradientPoints = [
        { x: 0, y: this.height / 2 },
        { x: this.width, y: this.height / 2 },
      ],
      fillGradient,
      strokeGradient,
    } = this.option;

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

export default Ellipse;
