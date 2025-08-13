/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-multi-assign */
import Matrix2D from './matrix2d';
import { Shadow } from '../node/node';

export default class DisplayProps {
  visible!: boolean;
  alpha!: number;
  shadow!: Shadow | null;
  compositeOperation!: string | null;
  matrix!: Matrix2D;

  constructor(
    visible?: boolean,
    alpha?: number,
    shadow?: Shadow,
    compositeOperation?: string,
    matrix?: Matrix2D
  ) {
    this.setValue(visible, alpha, shadow, compositeOperation, matrix);
  }

  setValue(
    visible?: boolean,
    alpha?: number,
    shadow?: Shadow,
    compositeOperation?: string,
    matrix?: Matrix2D
  ) {
    this.visible = visible == null ? true : !!visible;
    this.alpha = alpha == null ? 1 : alpha;
    this.shadow = shadow || null;
    this.compositeOperation = compositeOperation || null;
    this.matrix = matrix || (this.matrix && this.matrix.identity()) || new Matrix2D(); // (this.matrix && this.matrix.identity()) || new Matrix2D() 均为单位矩阵
    return this;
  }

  append(
    visible: boolean,
    alpha: number,
    shadow: Shadow,
    compositeOperation: string,
    matrix?: Matrix2D
  ) {
    // 效果叠加，一般用于嵌套元素
    this.alpha *= alpha;
    this.shadow = shadow || this.shadow;
    this.compositeOperation = compositeOperation || this.compositeOperation;
    this.visible = this.visible && visible;
    matrix && this.matrix.appendMatrix(matrix);
    return this;
  }

  prepend(
    visible: boolean,
    alpha: number,
    shadow: Shadow | null,
    compositeOperation: string | null,
    matrix?: Matrix2D
  ) {
    // 效果叠加，一般用于嵌套元素
    this.alpha *= alpha;
    this.shadow = this.shadow || shadow;
    this.compositeOperation = this.compositeOperation || compositeOperation;
    this.visible = this.visible && visible;
    matrix && this.matrix.prependMatrix(matrix);
    return this;
  }

  identity() {
    // 转为单位矩阵 相当于还原
    this.visible = true;
    this.alpha = 1;
    this.shadow = this.compositeOperation = null;
    this.matrix.identity();
    return this;
  }
}
