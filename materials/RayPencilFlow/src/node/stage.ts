/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Group from './group';
import Render from '../render/index';
import { ScriptEvent } from '../event/event';
import Event from '../event/event';
import Node from './node';

class Stage extends Group {
  [x: string]: any;

  container: TMiniCanvas;
  width: number;
  height: number;
  drp!: number;
  ctx: CanvasRenderingContext2D;
  render: Render;
  hitCtx: CanvasRenderingContext2D;
  touchObject: Node;
  ___instanceof: string;

  constructor(container: TMiniCanvas, width: number, height: number, pixelRatio = 1) {
    super();
    this.container = container;
    this.width = width;
    this.height = height;
    const ctx = container.getContext('2d');
    const dpr = pixelRatio;
    container.width = width * dpr;
    container.height = height * dpr;
    ctx.scale(dpr, dpr);
    this.dpr = dpr;
    this.ctx = ctx;
    this.render = new Render(ctx, container.width, container.height);

    this.hitCtx = null;

    this.touchObject = null;
    this.___instanceof = 'Stage';
  }

  update() {
    this.render.update(this);
  }

  setHitCanvas(hitCanvas: TMiniCanvas) {
    const hitCtx = hitCanvas.getContext('2d');
    hitCanvas.width = this.width * this.dpr;
    hitCanvas.height = this.height * this.dpr;
    this.hitCtx = hitCtx;
  }

  getTextWidth(text: string, font: string) {
    this.ctx.font = font;
    return this.ctx.measureText(text).width;
  }

  loadImage(url: string) {
    const canvas = this.container as TMiniCanvas;
    return new Promise((resolve, reject) => {
      const image = canvas.createImage();
      image.src = url;
      image.onload = function () {
        resolve(image);
      };
      image.onerror = function (error: any) {
        reject(error);
      };
    });
  }

  touchStartHandler(evt: TouchEvent) {
    const touch = evt.touches[0];
    if (!touch) {
      return;
    }
    this.now = Date.now();
    const event = evt as ScriptEvent & TouchEvent;
    const rect = this.container.getBoundingClientRect();
    const offsetX = rect.left;
    const offsetY = rect.top;
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    event.stageX = Math.round(x);
    event.stageY = Math.round(y);
    const obj = this.getObjectUnderPoint(event);
    this.touchObject = obj as Node;
    this._mouseDownX = event.stageX;
    this._mouseDownY = event.stageY;
    this.preStageX = event.stageX;
    this.preStageY = event.stageY;
    this.__dispatchEvent(obj, event);
  }

  touchMoveHandler(evt: TouchEvent) {
    const touch = evt.touches[0];
    if (!touch) {
      return;
    }
    const event = evt as ScriptEvent & TouchEvent;
    const rect = this.container.getBoundingClientRect();
    const offsetX = rect.left;
    const offsetY = rect.top;
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    event.stageX = Math.round(x);
    event.stageY = Math.round(y);

    const touchesLength = evt.touches.length;

    const mockEvt = new Event();
    mockEvt.stageX = event.stageX;
    mockEvt.stageY = event.stageY;
    mockEvt.originalEvent = event;
    if (this.touchObject && touchesLength === 1) {
      // 1. 触发拖拽事件
      mockEvt.type = 'drag';
      mockEvt.dx = mockEvt.stageX - this.preStageX;
      mockEvt.dy = mockEvt.stageY - this.preStageY;
      this.preStageX = mockEvt.stageX;
      this.preStageY = mockEvt.stageY;
      this.touchObject.dispatchEvent(mockEvt);
    }
    const obj = this.getObjectUnderPoint(event);
    // 2. 触发move事件
    this.__dispatchEvent(obj, event);
  }

  touchEndHandler(evt: TouchEvent) {
    const touch = evt.changedTouches[0];
    if (!touch) {
      return;
    }
    const event = evt as ScriptEvent & TouchEvent;
    const rect = this.container.getBoundingClientRect();
    const offsetX = rect.left;
    const offsetY = rect.top;
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    event.stageX = Math.round(x);
    event.stageY = Math.round(y);

    const obj = this.getObjectUnderPoint(event);
    this._mouseUpX = event.stageX;
    this._mouseUpY = event.stageY;
    // 触发 end 事件
    this.__dispatchEvent(obj, event);

    this.touchObject = null;
    this.preStageX = null;
    this.preStageY = null;

    const timerOffset = Date.now() - this.now;
    const isTapTime = timerOffset < 300;
    if (
      isTapTime &&
      obj &&
      Math.abs(this._mouseDownX - this._mouseUpX) < 10 &&
      Math.abs(this._mouseDownY - this._mouseUpY) < 10
    ) {
      // 触发 tap 事件
      const mockEvt = new Event();
      mockEvt.stageX = event.stageX;
      mockEvt.stageY = event.stageY;
      mockEvt.originalEvent = event as TouchEvent;
      mockEvt.type = 'tap';
      obj.dispatchEvent(mockEvt);
    }
  }

  getObjectUnderPoint(evt: ScriptEvent) {
    const x = evt.stageX;
    const y = evt.stageY;
    return this._getObjectsUnderPoint(x, y, this.hitCtx) || this;
  }

  private __dispatchEvent(obj: any, evt: TouchEvent) {
    if (!obj) return;
    const mockEvt = new Event();
    mockEvt.originalEvent = evt;
    const event = evt as TouchEvent & ScriptEvent;
    mockEvt.stageX = event.stageX;
    mockEvt.stageY = event.stageY;
    mockEvt.type = evt.type;
    obj.dispatchEvent(mockEvt);
  }
}

export default Stage;
