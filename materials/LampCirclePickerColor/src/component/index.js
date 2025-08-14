/* eslint-disable prettier/prettier */
import Render from './index.rjs';
import { rgbToHsv, getPixelRatio } from '../utils';

// eslint-disable-next-line no-undef
Component({
  properties: {
    radius: Number,
    thumbRadius: {
      type: Number,
      value: 6,
    },
    thumbBorderWidth: {
      type: Number,
      value: 4,
    },
    hs: {
      type: Object,
      value: {
        h: 0,
        s: 1000,
      },
    },
    whiteRange: {
      type: Number,
      value: 0.15,
    },
    minRange: {
      type: Number,
      value: 0.15,
    },
    thumbShadowBlur: {
      type: Number,
      value: 10,
    },
    thumbShadowColor: {
      type: String,
      value: 'rgba(0, 0, 0, .16)',
    },
    // 是否启用事件通道
    useEventChannel: {
      type: Boolean,
      value: false,
    },
    eventChannelName: {
      type: String,
      value: 'lampCirclePickerColorEventChannel',
    },
    // 唯一ID
    instanceId: {
      type: String,
    },
  },
  data: {
    render: null,
    hsInit: false,
    colorText: '',
    instanceId: `circle_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`,
  },
  observers: {
    'hs.**'(hs) {
      if (this.touchType === 'move') {
        return;
      }
      const { hsInit } = this.data;
      hsInit && this._updatePosByHs(hs);
    },
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
      const { thumbRadius, thumbBorderWidth = 4 } = this.data;
      this._setThumbWidth(thumbRadius * 2);
      this._setThumbBorderWidth(thumbBorderWidth);
    },
    ready() {
      const {
        hs = {
          h: 0,
        },
        instanceId,
        whiteRange,
        radius,
        useEventChannel,
        eventChannelName,
        thumbBorderWidth,
        thumbShadowBlur,
        thumbShadowColor,
        minRange,
      } = this.data;
      const ratio = getPixelRatio();

      const options = {
        useEventChannel,
        eventChannelName,
        thumbBorderWidth,
        thumbShadowBlur,
        thumbShadowColor,
      };
      instanceId && this.render.renderCircleColor({
        id: instanceId,
        whiteRange,
        minRange,
        circleRadius: radius,
        ratio,
        options
      });
      setTimeout(() => {
        this.data.hsInit = true;
      }, 50);
      this._updatePosByHs(hs);
    },
    detached() {
      this.render?.removeEventListeners();
    },
  },
  methods: {
    _setCanvasRect(circle) {
      const { width, height } = circle;
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
    },
    _setThumbWidth(width) {
      this.render?.setThumbWidth(width);
    },
    _setThumbBorderWidth(width) {
      this.render?.setThumbBorderWidth(width);
    },
    _updatePosByHs(hs = {}) {
      if (!hs) {
        return;
      }
      const { h, s } = hs;
      if (typeof h !== 'number' || typeof s !== 'number') {
        console.log('_updatePosByHs: h or s is not numbers');
        return;
      }
      this.render?.updateThumbPositionByHs(hs.h, hs.s);
    },
    _getRgb(x, y) {
      this.render?.getRectImageData(x, y);
    },
    _getRgbThrottle(x, y) {
      this._getRgb(x, y);
    },
    _getRectImageData(dataRes) {
      const { hs, rgba, rgbaTransform, touchType } = dataRes;
      const r = rgba[0];
      const g = rgba[1];
      const b = rgba[2];
      let rgbaRes = {
        r,
        g,
        b,
      };
      let hsvPersistent = {
        h: Math.round(hs.h) || 0,
        s: Math.round(hs.s) || 0,
      };

      if (r === 255 && g === 255 && b === 255) {
        const rr = rgbaTransform[0];
        const gg = rgbaTransform[1];
        const bb = rgbaTransform[2];
        rgbaRes = {
          r: rr,
          g: gg,
          b: bb,
        };
        const hsvRes = rgbToHsv(rgbaRes.r, rgbaRes.g, rgbaRes.b);
        hsvPersistent = {
          h: Math.round(hsvRes.h) || 0,
          s: 0, // 由于色温为0 展示为白色
        };
      }
      this.touchType = touchType;
      this.preHs = {
        ...hsvPersistent,
        s: hsvPersistent.s
      };
      this.triggerEvent(touchType, this.preHs);
    },
  },
});
