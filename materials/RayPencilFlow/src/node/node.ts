/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
import { ScriptEvent } from '../event/event';
import UID from '../utils/uid';
import DisplayProps from '../geom/displayProps';
import Rectangle from '../geom/rectangle';
import Matrix2D from '../geom/matrix2d';
import Graphics from '../node/graphics';

const _eventListeners: unique symbol = Symbol('eventListeners');
const _captureEventListeners: unique symbol = Symbol('captureEventListeners');

interface EventListeners {
  [x: string]: Array<{ listener: (event: ScriptEvent) => void; once?: boolean }>;
}

interface EventOptions {
  capture: boolean;
  once?: boolean;
}

export interface Shadow {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
}

interface ExtraParams {
  render(ctx: CanvasRenderingContext2D): void;
}

export default class Node implements ExtraParams {
  parent: this | null;
  [_eventListeners]: EventListeners;
  [_captureEventListeners]: EventListeners;
  id: number;

  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  skewX: number;
  skewY: number;
  regX: number;
  regY: number;
  alpha: number;
  visible: boolean;

  shadow: Shadow | null;
  mask: Graphics | null;

  _props: DisplayProps;
  _rectangle: Rectangle;
  _bounds: Rectangle | null;

  compositeOperation: string | null;

  hitBox: Array<number> | null;
  ignoreHit: boolean;

  ___instanceof!: string;

  constructor() {
    this[_eventListeners] = {};
    this[_captureEventListeners] = {};
    this.parent = null;
    this.id = UID.get();

    this.x = 0;
    this.y = 0;

    this.scale = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.skewX = 0;
    this.skewY = 0;
    this.regX = 0;
    this.regY = 0;
    this.alpha = 1;
    this.visible = true;

    this.shadow = null;
    this.mask = null;

    this._props = new DisplayProps();
    this._rectangle = new Rectangle();
    this._bounds = null;

    this.compositeOperation = null;

    this.hitBox = null;
    this.ignoreHit = false;
  }

  get stage(): Node | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let o = this;
    while (o.parent) {
      o = o.parent;
    }
    if (o.___instanceof === 'Stage') return o;
    return null;
  }

  get scale(): number {
    return this.scaleX;
  }

  set scale(scale: number) {
    this.scaleX = scale;
    this.scaleY = scale;
  }

  isVisible(): boolean {
    return this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0;
  }

  clip(graphics: Graphics): void {
    this.mask = graphics;
  }

  unclip(): void {
    this.mask = null;
  }

  setTransform(
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    rotation: number,
    skewX: number,
    skewY: number,
    regX: number,
    regY: number
  ): Node {
    this.x = x || 0;
    this.y = y || 0;
    this.scaleX = scaleX == null ? 1 : scaleX;
    this.scaleY = scaleY == null ? 1 : scaleY;
    this.rotation = rotation || 0;
    this.skewX = skewX || 0;
    this.skewY = skewY || 0;
    this.regX = regX || 0;
    this.regY = regY || 0;
    return this;
  }

  getMatrix(matrix: Matrix2D): Matrix2D {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const o = this;
    const mtx = matrix || new Matrix2D();
    return (
      mtx.identity() &&
      mtx.appendTransform(
        o.x,
        o.y,
        o.scaleX,
        o.scaleY,
        o.rotation,
        o.skewX,
        o.skewY,
        o.regX,
        o.regY
      )
    );
  }

  getConcatenatedMatrix(matrix: Matrix2D): Matrix2D {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let o = this;
    const mtx = this.getMatrix(matrix);
    // eslint-disable-next-line no-cond-assign
    while ((o = o.parent)) {
      mtx.prependMatrix(o.getMatrix(o._props.matrix));
    }
    return mtx;
  }

  getConcatenatedDisplayProps(_props?: DisplayProps): DisplayProps {
    const props = _props ? _props.identity() : new DisplayProps();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let o = this;
    const mtx = o.getMatrix(props.matrix);
    do {
      props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
      if (o !== this) {
        mtx.prependMatrix(o.getMatrix(o._props.matrix));
      }
    } while ((o = o.parent));
    return props;
  }

  getBounds(): Rectangle | null {
    if (this._bounds) {
      return this._rectangle.copy(this._bounds);
    }
    return null;
  }

  setBounds(x: number | null, y: number, width: number, height: number): void {
    if (x === null) {
      return;
    }
    this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
  }

  getTransformedBounds(): Rectangle {
    return this._getBounds();
  }

  _getBounds(matrix?: Matrix2D, ignoreTransform?: boolean): Rectangle {
    return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
  }

  _transformBounds(
    bounds: Rectangle | null,
    matrix: Matrix2D,
    ignoreTransform?: boolean
  ): Rectangle {
    if (!bounds) {
      return bounds;
    }
    let { x } = bounds;
    let { y } = bounds;
    const { width } = bounds;
    const { height } = bounds;
    let mtx = this._props.matrix;
    mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);

    if (x || y) {
      mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
    }
    if (matrix) {
      mtx.prependMatrix(matrix);
    }

    const xA = width * mtx.a;
    const xB = width * mtx.b;
    const yC = height * mtx.c;
    const yD = height * mtx.d;
    const { tx } = mtx;
    const { ty } = mtx;

    let minX = tx;
    let maxX = tx;
    let minY = ty;
    let maxY = ty;

    if ((x = xA + tx) < minX) {
      minX = x;
    } else if (x > maxX) {
      maxX = x;
    }
    if ((x = xA + yC + tx) < minX) {
      minX = x;
    } else if (x > maxX) {
      maxX = x;
    }
    if ((x = yC + tx) < minX) {
      minX = x;
    } else if (x > maxX) {
      maxX = x;
    }

    if ((y = xB + ty) < minY) {
      minY = y;
    } else if (y > maxY) {
      maxY = y;
    }
    if ((y = xB + yD + ty) < minY) {
      minY = y;
    } else if (y > maxY) {
      maxY = y;
    }
    if ((y = yD + ty) < minY) {
      minY = y;
    } else if (y > maxY) {
      maxY = y;
    }

    return bounds.setValues(minX, minY, maxX - minX, maxY - minY);
  }

  on(type: string, listener: (event: ScriptEvent) => void, options?: EventOptions | boolean): void {
    this.addEventListener(type, listener, options);
  }

  off(
    type: string,
    listener: (event: ScriptEvent) => void,
    options?: EventOptions | boolean
  ): void {
    this.removeEventListener(type, listener, options);
  }

  addEventListener(
    type: string,
    listener: (event: ScriptEvent) => void,
    _options?: EventOptions | boolean
  ): Node {
    let options = _options || {};
    if (typeof _options === 'boolean') {
      options = { capture: _options };
    }
    const { capture, once } = options as EventOptions;
    const eventListeners = capture ? _captureEventListeners : _eventListeners;
    this[eventListeners][type] = this[eventListeners][type] || [];
    // 防止重复添加相同事件
    const isExist = this[eventListeners][type].find(event => event.listener === listener);
    if (isExist) {
      return this;
    }
    this[eventListeners][type].push({ listener, once });
    return this;
  }

  removeEventListener(
    type: string,
    listener: (event: ScriptEvent) => void,
    _options?: EventOptions | boolean
  ): Node {
    let options = _options;
    if (typeof _options === 'boolean') {
      options = { capture: _options };
    }
    const { capture } = options as EventOptions;
    const eventListeners = capture ? _captureEventListeners : _eventListeners;

    if (this[eventListeners][type]) {
      const listeners = this[eventListeners][type];
      for (let i = 0; i < listeners.length; i++) {
        const { listener: _listener } = listeners[i];
        if (listener === _listener) {
          this[eventListeners][type].splice(i, 1);
          break;
        }
      }
    }
    return this;
  }

  dispatchEvent(_event: ScriptEvent): void {
    const event = _event;
    event.target = this;
    const { type } = event;
    const elements = [this];
    let { parent } = this;
    while (event.bubbles && parent) {
      elements.push(parent);
      parent = parent.parent;
    }
    // FOCUS: 事件捕获与冒泡实现
    // 捕获阶段
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const listeners = element[_captureEventListeners] && element[_captureEventListeners][type];
      if (listeners && listeners.length) {
        listeners.forEach(({ listener, once }) => {
          listener.call(this, event);
          if (once) {
            element.removeEventListener(event.type, listener, { capture: true });
          }
        });
      }
      if (!event.bubbles && event.cancelBubble) break;
    }

    // 冒泡阶段
    if (!event.cancelBubble) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const listeners = element[_eventListeners] && element[_eventListeners][type];
        if (listeners && listeners.length) {
          listeners.forEach(({ listener, once }) => {
            listener.call(this, event);
            if (once) {
              element.removeEventListener(event.type, listener, { capture: false });
            }
          });
        }
        if (!event.bubbles || event.cancelBubble) break;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!ctx) null;
  }
}
