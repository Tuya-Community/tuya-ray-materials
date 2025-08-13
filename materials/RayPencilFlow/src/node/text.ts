/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import log from '../utils/logger';
import Node from './node';

interface optionInterface {
  [x: string]:
    | string
    | number
    | boolean
    | string[]
    | [{ x: number; y: number }, { x: number; y: number }];
  font?: string;
  size?: number;
  fillStyle?: string;
  strokeStyle?: string;
  textAlign?: 'left' | 'right' | 'center';
  baseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
}

class Text extends Node {
  [s: string]: any;
  option: optionInterface;

  constructor(text: string, option: optionInterface) {
    super();
    this.text = text;
    this.option = option || {};
    this.font = this.option.font;
    this.size = this.option.size || 10;
    this.fontStyle = this.option.fontStyle || 'normal';
    this.textAlign = this.option.textAlign || 'left';
    this.baseline = this.option.baseline || 'top';
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.fontStyle && this.font) {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        log.warning('当font和fontStyle同时存在时, 优先使用font值， font值与CSS font值一致');
      }, 300);
    }
    if (this.font) {
      ctx.font = this.font;
    } else {
      ctx.font = `${this.fontStyle} ${this.size}px serif`;
    }
    ctx.textBaseline = this.baseline;
    ctx.textAlign = this.textAlign;
    if (this.option.fillStyle) {
      ctx.fillStyle = this.option.fillStyle;
      ctx.fillText(this.text, 0, 0);
    }
    if (this.option.strokeStyle) {
      ctx.strokeStyle = this.option.strokeStyle;
      ctx.strokeText(this.text, 0, 0);
    }
  }
}

export default Text;
