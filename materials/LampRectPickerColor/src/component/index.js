/* eslint-disable prettier/prettier */
import Render from './index.rjs';

import { formatColorText, rgbToHsv } from '../utils';

const ETipRectPosition = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const defaultThumbOffset = 0.7;

// eslint-disable-next-line no-undef
Component({
  properties: {
    disable: Boolean,
    colorTipStyle: String,
    borderRadius: Number,
    borderRadiusStyle: String,
    rectStyle: String,
    rectWidth: Number,
    rectHeight: Number,
    closed: Boolean,
    thumbRadius: {
      type: Number,
      value: 12,
    },
    hs: {
      type: Object,
      value: {
        h: Number,
        s: Number,
      },
    },
    isShowColorTip: {
      type: Boolean,
      value: true,
    },
    // 是否启用事件通道
    useEventChannel: {
      type: Boolean,
      value: false,
    },
    eventChannelName: {
      type: String,
      value: 'lampRectPickerColorEventChannel',
    },
    closeHiddenThumb: {
      type: Boolean,
      value: false,
    },
    canvasId: {
      type: String,
      value: 'pickerColorRectCanvasId',
    },
    brightValue: Number,
    borderStyleStr: String,
  },
  data: {
    enable: true,
    render: null,
    colorText: '',
    tipRectPosition: {
      left: `${12}rpx`,
      top: `${12}rpx`,
      right: 'auto',
    },
    _borderRadius: 0,
    offset: defaultThumbOffset,
  },
  observers: {
    'hs.**'(hs) {
      const { h: lastH, s: lastS } = this.lastValue || { h: 0, s: 1000 };
      const { isShowColorTip } = this.data;
      const { h, s } = hs;
      const isValueChange = !(
        (lastH === h || (lastH === 360 && h === 0) || (lastH === 0 && h === 360)) &&
        lastS === s
      );
      if (isValueChange) {
        this._updatePosByHs(hs);
        isShowColorTip && this._setColorTextFn(hs);
        this.lastValue = { ...hs };
      }
    },
    'disable.**'(value) {
      this.render.setDisable(value);
    },
    'brightValue.**'(value) {
      this.render.setBrightValue(value);
    },
    'closed.**'(_closed) {
      const { hs } = this.data;
      this._updatePosByHs(hs, _closed);
    },
    isShowColorTip(isShowColorTip) {
      const {
        hs = {
          h: 0,
          s: 1000,
        },
      } = this.data;
      isShowColorTip && this._setColorTextFn(hs);
    },
  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      const {
        hs = {
          h: 0,
          s: 1000,
        },
        isShowColorTip,
        disable,
        rectWidth,
        rectHeight,
        thumbRadius,
        borderRadius,
        closed,
        borderRadiusStyle,
        useEventChannel,
        eventChannelName,
        canvasId,
        closeHiddenThumb,
        brightValue,
      } = this.data;
      const options = {
        useEventChannel,
        eventChannelName,
        closeHiddenThumb,
      }
      canvasId && this.render.renderRectColor(canvasId, rectWidth, rectHeight, thumbRadius, closed, options);
      this.render.setDisable(disable);
      this.render.setBrightValue(brightValue);
      this.lastValue = hs;
      isShowColorTip && this._setColorTextFn(hs);

      this._updatePosByHs(hs);
      // 优先级高于 borderRadius 属性
      if (borderRadiusStyle) {
        this.setData({
          _borderRadius: borderRadiusStyle,
        })
      } else if (borderRadius) {
        this.setData({
          _borderRadius: `${borderRadius * 2}rpx`,
        })
      }
    },
    detached() {
      this.render?.removeEventListeners();
    },
  },
  methods: {
    _setCanvasRect(rect) {
      const { width, height } = rect;
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
    },
    _updatePosByHs(hs, closed) {
      const { rectWidth, rectHeight, thumbRadius, closed: closed1 } = this.data;
      if (!hs) {
        return;
      }
      const _closed = closed || closed1;
      if (closed === undefined) {
        this.render?.updateThumbPositionByHs(
          hs.h,
          hs.s,
          rectWidth + thumbRadius * 2 * defaultThumbOffset,
          rectHeight + thumbRadius * 2 * defaultThumbOffset,
          _closed,
        );
        return;
      }
      this.render?.updateThumbPosition(null, null, null, closed);
    },
    _getRgb(x, y) {
      this.render?.getRectImageData(x, y);
    },
    _getRgbThrottle(x, y) {
      this._getRgb(x, y);
    },
    _updateTextTipPos(pos = ETipRectPosition.LEFT) {
      if (this.textPos === pos) {
        return;
      }
      this.textPos = pos;
      const top = 12;
      const leftOrRight = 12;
      if (pos === ETipRectPosition.LEFT) {
        this.setData({
          tipRectPosition: {
            left: `${leftOrRight}rpx`,
            top: `${top}rpx`,
            right: 'auto',
          },
        });
      } else {
        this.setData({
          tipRectPosition: {
            right: `${leftOrRight}rpx`,
            top: `${top}rpx`,
            left: 'auto',
          },
        });
      }
    },
    _setColorTextFn(hs, pos) {
      // 颜色文案
      const hDegree = Math.floor(hs.h);
      const colorTextRes = formatColorText(hDegree);
      this.setData({
        colorText: colorTextRes,
      });
      if (!pos) {
        return;
      }
      const { h, s } = hs;
      const { rectWidth } = this.data;
      if (h < 40 && s < 200 && pos.x < rectWidth / 2) {
        this._updateTextTipPos(ETipRectPosition.RIGHT);
      } else if (h < 40 && s < 200 && pos.x > rectWidth / 2) {
        this._updateTextTipPos(ETipRectPosition.LEFT);
      } else if (h > 320 && s < 200) {
        this._updateTextTipPos(ETipRectPosition.LEFT);
      }
    },
    _getRectImageData(dataRes) {
      const { rgba, rgbaTransform, touchType, pos } = dataRes;
      const r = rgba[0];
      const g = rgba[1];
      const b = rgba[2];
      let rgbaRes = {
        r,
        g,
        b,
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
        const hs = {
          h: Math.floor(hsvRes.h) || 0,
          s: 0, // 由于色温为0 展示为白色
        };
        this.lastValue = hs;
        this.triggerEvent(touchType, hs);
        return;
      }
      const { data } = this;
      const hsv = rgbToHsv(rgbaRes.r, rgbaRes.g, rgbaRes.b);
      const hs = {
        h: Math.round(hsv.h) || 0,
        s: Math.round(hsv.s * 10) ?? 1000,
      };
      data.isShowColorTip && this._setColorTextFn(hs, pos);
      this.lastValue = hs;
      this.triggerEvent(touchType, hs);
    },
  },
});
