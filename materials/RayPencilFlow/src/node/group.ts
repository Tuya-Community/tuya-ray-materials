/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable prefer-rest-params */
import Node from './node';
import Shape from './shape/shape';

export default class Group extends Node {
  children: Array<Shape>; // Group shape...
  cacheChildren: Set<string>;
  mouseChildren: boolean; // 是否响应子级鼠标事件

  constructor() {
    super();
    this.children = [];
    this.mouseChildren = true;
    this.cacheChildren = new Set();
  }

  add() {
    const len = arguments.length;
    for (let i = 0; i < len; i++) {
      const c = arguments[i];
      const { id } = c?.option || {};
      if (id) {
        // 通过id方式 防止重复添加
        if (this.cacheChildren.has(id)) {
          continue;
        }
        this.cacheChildren.add(id);
      }
      const parent = c.parent;
      // 防止重复添加
      if (parent) {
        parent.removeChildAt(parent.children.indexOf(c));
      }
      this.children.push(c);
      c.parent = this;
    }
  }

  addChildAt(child: Shape, index: number) {
    const par = child.parent as unknown as Group;
    par && par.removeChildAt(par.children.indexOf(child));
    child.parent = this as unknown as Shape;
    const { id } = child?.option || {};
    if (id) {
      this.cacheChildren.add(id);
    }
    this.children.splice(index, 0, child);
  }

  removeChildAt(index: number) {
    const child = this.children[index];
    if (child) {
      child.parent = null;
    }
    const { id } = child?.option || {};
    if (id) {
      this.cacheChildren.delete(id);
    }
    this.children.splice(index, 1);
  }

  replace(current, pre) {
    const { id: currentId } = current?.option || {};
    if (currentId) {
      this.cacheChildren.add(currentId);
    }

    const { id } = pre?.option || {};
    if (id) {
      this.cacheChildren.delete(id);
    }

    const index = pre.parent.children.indexOf(pre);
    this.removeChildAt(index);
    this.addChildAt(current, index);
  }

  remove(child: Node) {
    if (!child) return;

    const { id } = child?.option || {};
    if (id) {
      this.cacheChildren.add(id);
    }

    const len = arguments.length;
    let cLen = this.children.length;

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < cLen; j++) {
        if (child.id === this.children[j].id) {
          child.parent = null;
          this.children.splice(j, 1);
          j--;
          cLen--;
        }
      }
    }
  }

  empty() {
    this.children.forEach(child => {
      child.parent = null;
    });
    this.children.length = 0;
    this.cacheChildren.clear();
  }

  destroy() {
    this.empty();
    this.parent && this.parent.destroy();
  }

  // 检测坐标与元素是否碰撞
  _getObjectsUnderPoint(x: number, y: number, hitCtx: CanvasRenderingContext2D): Node {
    const ctx = hitCtx;
    if (!this._testMask(this, x, y, ctx) || !ctx) {
      return null;
    }
    const children = this.children;
    const l = children.length;
    // 查找点击中了哪个元素
    // 由于Canvas 上展示的数据是按照添加顺序排列，先添加的在下面会被覆盖
    // 如果存在叠加展示的元素时，最上面的元素是最后添加的，最后面添加的元素会覆盖之前添加的（如果存在视觉重叠）
    // 所以需要倒序遍历
    for (let i = l - 1; i >= 0; i--) {
      const child = children[i];
      const hitBox = child.hitBox;
      if (!child.isVisible() || child.ignoreHit) {
        continue;
      }
      if (!this._testMask(child, x, y, ctx)) {
        continue;
      }
      // 群组下的元素碰撞判断
      if (!hitBox && child instanceof Group) {
        const result = child._getObjectsUnderPoint(x, y, ctx);
        if (result) return !this.mouseChildren ? this : result;
      } else {
        const props = child.getConcatenatedDisplayProps(child._props);
        const mtx = props.matrix;
        // FOCUS: 碰撞检测 两种方式
        // 碰撞检测判断分为： 1.元素点精确判断 2.矩形粗略判断
        // hitBox => 2.矩形粗略判断
        if (hitBox) {
          const mtxClone = mtx.clone();
          child.setBounds(hitBox[0], hitBox[1], hitBox[2], hitBox[3]);
          const bounds = child._getBounds(mtxClone, true);
          const AABB = [bounds.x, bounds.y, bounds.width, bounds.height] as number[];
          if (!this.checkPointInRect(x, y, AABB)) {
            continue;
          }
          if (child instanceof Group) {
            const result = child._getObjectsUnderPoint(x, y, ctx);
            if (result) {
              return !this.mouseChildren ? this : result;
            }
            return child;
          }
          // 非继承Group的元素，直接返回当前元素
          if (child) {
            return child;
          }
        }

        ctx.globalAlpha = props.alpha;
        // 在hitCanvas中生成一个图形副本
        // 会将当前点击的坐标点复制到(0, 0)点
        ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y); // 使用单位矩阵重新设置（覆盖）当前的变换并调用变换的方法
        child.render(ctx);

        // 通过判断(0, 0)点的颜色值 即可判断是否点中🀄️
        if (!this._testHit(ctx)) {
          continue;
        }
        // 重置绘制的图形
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // 清空判断点的图形，防止影响下次碰撞判断； 清除局部优化性能；
        ctx.clearRect(0, 0, 2, 2);
        return !this.mouseChildren ? this : child;
      }
    }
    return null;
  }

  _testMask(target, x: number, y: number, hitCtx: CanvasRenderingContext2D) {
    const ctx = hitCtx;
    const mask = target.mask;
    if (!mask) {
      return true;
    }
    let mtx = this._props.matrix;
    const parent = target.parent;
    mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
    mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);

    ctx.beginPath();
    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
    mask.render(ctx);
    ctx.fillStyle = '#000';
    ctx.fill();
    if (!this._testHit(ctx)) {
      return false;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 2, 2);
    return true;
  }

  _testHit(ctx: CanvasRenderingContext2D) {
    const alpha = ctx.getImageData(0, 0, 1, 1)?.data[3];
    return alpha > 0;
  }

  /**
   * 判断点是否在某矩形内
   *
   * @param {number} x - the x coordinate of the point
   * @param {number} y - the y coordinate of the point
   * @param {number[]} AABB - the Axis-Aligned Bounding Box represented as [minX, minY, width, height]
   * @return {boolean} true if the point is inside the AABB, false otherwise
   */
  checkPointInRect(x: number, y: number, AABB: number[]) {
    const minX = AABB[0];
    if (x < minX) return false;
    const minY = AABB[1];
    if (y < minY) return false;
    const maxX = minX + AABB[2];
    if (x > maxX) return false;
    const maxY = minY + AABB[3];
    if (y > maxY) return false;
    return true;
  }
}
