import Shape from './shape';

type RoundedRectOption = {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  gradientPoints?: [{ x: number; y: number }, { x: number; y: number }];
  fillGradient?: string[];
  strokeGradient?: string[];
  lt: boolean;
  rt: boolean;
  lb: boolean;
  rb: boolean;
};

class RoundedRect extends Shape {
  private option: RoundedRectOption;
  private radius: number;
  private width: number;
  private height: number;

  constructor(width: number, height: number, radius: number, option: RoundedRectOption) {
    super();
    this.option = Object.assign(
      {
        lineWidth: 1,
        lt: true,
        rt: true,
        lb: true,
        rb: true,
      },
      option
    );
    this.radius = radius || 0;
    this.width = width;
    this.height = height;
  }

  draw(): void {
    const { width, height, radius } = this;
    const ax = radius;
    const ay = 0;
    const bx = width;
    const by = 0;
    const cx = width;
    const cy = height;
    const dx = 0;
    const dy = height;
    const ex = 0;
    const ey = 0;

    this.beginPath();

    this.moveTo(ax, ay);
    if (this.option.rt) {
      this.arcTo(bx, by, cx, cy, radius);
    } else {
      this.lineTo(bx, by);
    }

    if (this.option.rb) {
      this.arcTo(cx, cy, dx, dy, radius);
    } else {
      this.lineTo(cx, cy);
    }

    if (this.option.lb) {
      this.arcTo(dx, dy, ex, ey, radius);
    } else {
      this.lineTo(dx, dy);
    }

    if (this.option.lt) {
      this.arcTo(ex, ey, ax, ay, radius);
    } else {
      this.lineTo(ex, ey);
    }

    if (this.option.fillStyle) {
      this.closePath();
      this.fillStyle(this.option.fillStyle);
      this.fill();
    }

    if (this.option.strokeStyle) {
      this.lineWidth(this.option.lineWidth);
      this.strokeStyle(this.option.strokeStyle);
      this.stroke();
    }

    const {
      gradientPoints = [
        { x: -this.radius, y: this.radius },
        { x: this.radius, y: this.radius },
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

      this.closePath();
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

export default RoundedRect;
