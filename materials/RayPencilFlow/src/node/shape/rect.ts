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

const defaultOption = {
  fillGradient: [],
  strokeGradient: [],
};

class Rect extends Shape {
  width: number;
  height: number;
  option: optionInterface;
  constructor(width: number, height: number, option: optionInterface) {
    super();

    this.width = width;
    this.height = height;
    this.option = { ...defaultOption, ...option } || defaultOption;
  }

  draw() {
    const {
      gradientPoints = [
        { x: 0, y: 0 },
        { x: this.width, y: 0 },
      ],
      fillGradient,
      strokeGradient,
    } = this.option;
    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle);
      this.fillRect(0, 0, this.width, this.height);
    }
    if (this.option.strokeStyle) {
      this.strokeStyle(this.option.strokeStyle);
      if (typeof this.option.lineWidth === 'number') {
        this.lineWidth(this.option.lineWidth);
      }
      this.strokeRect(0, 0, this.width, this.height);
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
      this.fillRect(0, 0, this.width, this.height);
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
      this.strokeRect(0, 0, this.width, this.height);
    }
  }
}

export default Rect;
