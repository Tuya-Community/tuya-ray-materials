/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Node from '../node/node';

const _type: unique symbol = Symbol('type');
const _bubbles: unique symbol = Symbol('bubbles');
const _originalEvent: unique symbol = Symbol('_originalEvent');

export interface ScriptEvent {
  stageX: number;
  stageY: number;
  dx: number;
  dy: number;
  type: string;
  bubbles: boolean;
  originalEvent: TouchEvent;
  cancelBubble: boolean;
  target: Node;
  stopPropagation: () => void;
}

// 扩展原生事件对象
export default class Event implements ScriptEvent {
  stageX!: number;
  stageY!: number;
  dx!: number;
  dy!: number;
  [_type]: string;
  [_bubbles]: boolean;
  [_originalEvent]: TouchEvent;
  cancelBubble: boolean;
  target!: Node;

  constructor() {
    this[_type] = '';
    this[_originalEvent] = null;
    this[_bubbles] = true;
    this.cancelBubble = false;
  }

  // 模拟阻止冒泡
  stopPropagation() {
    this.cancelBubble = true;
  }

  get type() {
    return this[_type];
  }

  set type(value) {
    this[_type] = value;
  }

  get originalEvent() {
    return this[_originalEvent];
  }

  set originalEvent(value) {
    this[_originalEvent] = value;
  }

  get bubbles() {
    return this[_bubbles];
  }

  set bubbles(value) {
    this[_bubbles] = value;
  }
}
