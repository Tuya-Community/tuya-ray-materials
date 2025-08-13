import Group from '../node/group';
import Matrix2D from '../geom/matrix2d';
import Stage from '../node/stage';
import Node, { Shadow } from '../node/node';

export default class Render {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  update(stage: Stage): void {
    this.clear(this.ctx, this.width, this.height);
    this.render(this.ctx, stage);
  }

  clear(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.clearRect(0, 0, width, height);
  }

  render(ctx: CanvasRenderingContext2D, o: any): void {
    const mtx = o._props.matrix;
    o.getMatrix(mtx);
    if (o.children) {
      const list = o.children.slice(0);
      const l = list.length;
      for (let i = 0; i < l; i++) {
        const child = list[i];
        if (!child.isVisible()) {
          // eslint-disable-next-line no-continue
          continue;
        }
        ctx.save();
        this._render(ctx, child, mtx);
        ctx.restore();
      }
    } else {
      this._render(ctx, o, mtx);
    }
  }

  _render(ctx: CanvasRenderingContext2D, o: Node, _mtx?: Matrix2D): void {
    const { mask } = o;
    let mtx = _mtx;
    if (mtx) {
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    }
    mtx = o._props.matrix;

    if (mask) {
      mask.getMatrix(mtx);
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      ctx.beginPath();
      mask.render(ctx);
      ctx.clip();

      mtx.invert();
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    }

    o.getMatrix(mtx);
    ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

    const props = o.getConcatenatedDisplayProps(o._props);
    mtx = props.matrix;

    ctx.globalAlpha *= o._props.alpha;
    if (o.compositeOperation) {
      ctx.globalCompositeOperation = o.compositeOperation as GlobalCompositeOperation;
    }
    if (o.shadow) {
      this._applyShadow(ctx, o.shadow);
    }
    if (o instanceof Group) {
      const list = o.children.slice(0);
      const l = list.length;
      for (let i = 0; i < l; i++) {
        ctx.save();
        this._render(ctx, list[i]);
        ctx.restore();
      }
    } else {
      o?.render(ctx);
    }
  }

  _applyShadow(ctx: CanvasRenderingContext2D, shadow: Shadow): void {
    ctx.shadowColor = shadow.color;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.shadowBlur = shadow.blur;
  }
}
