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

class Polygon extends Shape {
  [x: string]: any;
  option: optionInterface;

  constructor(vertex: any, option: optionInterface) {
    super();

    this.vertex = vertex || [];
    this.option = option || {};
    this.strokeColor = this.option.strokeColor;
  }

  draw() {
    if (this.vertex.length < 3) {
      throw new Error('Polygon must have at least 3 vertices');
    }
    this.clear().beginPath();
    this.strokeStyle(this.strokeColor);
    this.moveTo(this.vertex[0][0], this.vertex[0][1]);

    for (let i = 1, len = this.vertex.length; i < len; i++) {
      this.lineTo(this.vertex[i][0], this.vertex[i][1]);
    }
    this.closePath();
    if (this.option.strokeStyle) {
      this.strokeStyle(this.option.strokeStyle);
      this.stroke();
    }
    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle);
      this.fill();
    }

    const {
      gradientPoints = [
        { x: -this.r, y: this.r },
        { x: this.r, y: this.r },
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

export default Polygon;
