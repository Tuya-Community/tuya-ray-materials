/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import Graphics from '../graphics';

class Shape extends Graphics {
  draw(): boolean | void {}

  render(ctx: CanvasRenderingContext2D) {
    // 重新渲染时需要清空当前图形的上一次绘制路径和属性，防止重复层叠渲染
    this.clear();
    this.draw();
    super.render(ctx);
  }
}

export default Shape;
