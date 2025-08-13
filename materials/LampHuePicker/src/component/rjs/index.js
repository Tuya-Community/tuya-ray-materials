import { utils } from '@ray-js/panel-sdk';

import Render from './index.rjs';

const { rgb2hsv } = utils;

const ETipRectPosition = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

// eslint-disable-next-line no-undef
Component({
  properties: {
    containerStyle: String,
    radius: {
      type: Number,
      value: 100,
    },
    innerRingRadius: {
      type: Number,
      value: 50,
    },
    value: {
      type: Number,
      value: 0,
    },
    // 是否启用事件通道
    useEventChannel: {
      type: Boolean,
      value: false,
    },
    eventChannelName: {
      type: String,
      value: 'lampHuePickerEventChannel',
    },
    onTouchStart: Function,
    onTouchMove: Function,
    onTouchEnd: Function,
  },
  data: {
    render: null,
    isTouch: false,
    touchType: '',
    tipRectPosition: ETipRectPosition.LEFT,
    canvasId: `canvasId_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`,
  },
  observers: {
    'value.**'(h) {
      if (this.touchType !== 'move' && Math.abs(this.lastValue - h) > 1) {
        this._updatePosByH(h, 1000, 1000);
        this.lastValue = h;
      }
    },
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
      const { radius, innerRingRadius } = this.data;
      this.render?._setCircles(radius, innerRingRadius);
    },
    ready() {
      const { canvasId } = this.data;
      this.initCanvas();
      if (!this.render) {
        this.render = new Render(this);
      }
      this.timer = setTimeout(() => {
        this.initCanvas();
        this.render?.checkIsRender(canvasId);
      }, 300);
    },
    detached() {
      clearTimeout(this.timer);
      this.timer = null;
    },
  },
  methods: {
    getCanvas(canvas) {
      if (JSON.stringify(canvas) === '{}') {
        this.initCanvas();
      }
    },
    initCanvas() {
      const {
        value,
        canvasId,
        radius,
        innerRingRadius,
        h = 0,
        useEventChannel,
        eventChannelName,
      } = this.data;

      const options = {
        useEventChannel,
        eventChannelName,
      };
      const isRenderWithImg = false;
      canvasId &&
        this.render.renderAnnulusColor(
          canvasId,
          radius,
          innerRingRadius,
          h,
          isRenderWithImg,
          options
        );
      this._updatePosByH(value, 1000, 1000);
      this.lastValue = h;
    },
    _updatePosByH(h) {
      if (typeof h !== 'number') {
        return;
      }
      this.render?.updateThumbPositionByHs(h);
    },
    _getAnnulusImageData(dataRes = []) {
      const r = dataRes[0];
      const g = dataRes[1];
      const b = dataRes[2];
      const [h] = rgb2hsv(r, g, b);
      const { touchType } = dataRes;
      this.lastValue = h;
      this.touchType = touchType;
      this.triggerEvent(touchType, h);
    },
  },
});
