/* eslint-disable no-console */
import { isEqual } from 'lodash-es';
import Render from './index.rjs';
import { getSystemInfoRes } from '../utils';

// eslint-disable-next-line no-undef
Component({
  properties: {
    data: Array,
    border: Number,
    lightWidth: Number,
    gradient: Boolean,
    move: Function,
    end: Function,
    canvasId: String,
    height: Number,
    width: Number,
  },
  data: {
    rjs: null,
  },
  observers: {
    data(resList) {
      // canvas元素加载完成后再渲染
      if (!this.isReady) {
        return;
      }
      resList?.length && this.renderRjs(resList);
    },
  },
  lifetimes: {
    attached() {
      this.rjs = new Render(this);
    },
    ready() {
      this.renderRjs();
      this.isReady = true;
    },
  },
  methods: {
    renderRjs(resList) {
      if (this.rjs) {
        const { canvasId, data, border, lightWidth, width, height = 330, gradient } = this.data;
        const _data = resList || data;
        const pre = Object.keys(this.preData || {}).map(i => {
          const { onOff, color } = (this.preData || {})[i];
          return {
            onOff,
            color,
          };
        });
        const current = Object.keys(_data || {}).map(i => {
          const { onOff, color } = _data[i];
          return {
            onOff,
            color,
          };
        });

        const isEqualObj = isEqual(pre, current);
        if (isEqualObj) {
          return;
        }
        const { pixelRatio = 2 } = getSystemInfoRes();
        this.rjs.render(canvasId, _data, {
          border,
          width: lightWidth,
          gradient,
          pixelRatio,
          canvasWidth: width,
          canvasHeight: height,
        });
        this.preData = _data;
      }
    },
    touchmove(args) {
      if (args.index === undefined) {
        console.warn('args.index is undefined');
        return;
      }
      if (args.index === -1) {
        return;
      }
      this.triggerEvent('move', {
        index: args.index,
      });
    },
    touchend(args) {
      if (args.index === undefined) {
        console.warn('args.index is undefined');
        return;
      }
      this.triggerEvent('end', {
        index: args.index,
      });
    },
  },
});
