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

class EquilateralPolygon extends Shape {
  num: number;
  r: number;
  option: optionInterface;
  vertex: any;

  constructor(num: number, r: number, option: optionInterface) {
    super();

    this.num = num;
    this.r = r;
    this.option = option || {};

    this.vertex = [];
    this.initVertex();
  }

  initVertex(): void {
    this.vertex.length = [];
    const { num, r } = this;
    let i: number;
    let startX: number;
    let startY: number;
    let newX: number;
    let newY: number;

    if (num % 2 === 0) {
      startX = r * Math.cos((2 * Math.PI * 0) / num);
      startY = r * Math.sin((2 * Math.PI * 0) / num);

      this.vertex.push([startX, startY]);
      for (i = 1; i < num; i++) {
        newX = r * Math.cos((2 * Math.PI * i) / num);
        newY = r * Math.sin((2 * Math.PI * i) / num);

        this.vertex.push([newX, newY]);
      }
    } else {
      startX = r * Math.cos((2 * Math.PI * 0) / num - Math.PI / 2);
      startY = r * Math.sin((2 * Math.PI * 0) / num - Math.PI / 2);

      this.vertex.push([startX, startY]);
      for (i = 1; i < num; i++) {
        newX = r * Math.cos((2 * Math.PI * i) / num - Math.PI / 2);
        newY = r * Math.sin((2 * Math.PI * i) / num - Math.PI / 2);

        this.vertex.push([newX, newY]);
      }
    }
  }

  draw(): void {
    this.beginPath();

    this.moveTo(this.vertex[0][0], this.vertex[0][1]);

    for (let i = 1, len = this.vertex.length; i < len; i++) {
      this.lineTo(this.vertex[i][0], this.vertex[i][1]);
    }
    this.closePath();

    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle);
      this.fill();
    }

    if (this.option.strokeStyle) {
      this.strokeStyle(this.option.strokeStyle);
      if (typeof this.option.lineWidth === 'number') {
        this.lineWidth(this.option.lineWidth);
      }
      this.stroke();
    }

    const {
      gradientPoints = [
        { x: -this.r, y: this.r },
        { x: this.r, y: this.r },
      ],
      fillGradient,
      strokeGradient,
    } = this.option;

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
  }
}

export default EquilateralPolygon;
