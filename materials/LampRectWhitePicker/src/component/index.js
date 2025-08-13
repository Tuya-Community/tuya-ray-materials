/* eslint-disable prettier/prettier */
import { getSystemInfoSync } from '@ray-js/ray';
import Render from './index.rjs';
import { setStorageItem, getStorageItem } from '../utils';

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
    canvasId: {
      type: String,
      value: `rect_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`,
    },
    thumbRadius: {
      type: Number,
      value: 12,
    },
    // 兼容老版本属性
    thumbWidth: {
      type: Number,
      value: 0,
    },
    temp: Number,
    isShowTip: {
      type: Boolean,
      value: true,
    },
    colorsGradient: {
      type: Object,
      value: {
        0: '#ffcb5d',
        0.6: '#FFF',
        1: '#CEEDFF',
      },
    },
    // 是否启用事件通道
    useEventChannel: {
      type: Boolean,
      value: false,
    },
    eventChannelName: {
      type: String,
      value: 'lampRectPickerWhiteEventChannel',
    },
    brightValue: Number,
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
    'temp.**'(_temp) {
      if (!this.isReady) {
        return;
      }
      const { isShowTip } = this.data;
      const isValueChange = _temp !== this.lastValue;
      if (isValueChange) {
        this.updatePosByTemp(_temp);
        isShowTip && this._setColorTextFn(_temp);
        this.lastValue = _temp;
      }
    },
    'disable.**'(value) {
      if (!this.isReady) {
        return;
      }
      this.render.setDisable(value);
    },
    'closed.**'(_closed) {
      if (!this.isReady) {
        return;
      }
      const { temp } = this.data;
      this.updatePosByTemp(temp, _closed);
    },
    isShowTip(isShowTip) {
      if (!this.isReady) {
        return;
      }
      const { temp } = this.data;
      isShowTip && this._setColorTextFn(temp);
    },
    brightValue(val) {
      if (!this.isReady) {
        return;
      }
      this.render.setBrightValue(val);
    },
  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      this.isReady = true;
      const {
        temp = 1000,
        canvasId,
        isShowTip,
        disable,
        rectWidth,
        rectHeight,
        thumbRadius,
        thumbWidth,
        borderRadius,
        closed,
        colorsGradient = {
          0: '#ffcb5d',
          0.6: '#FFF',
          1: '#CEEDFF',
        },
        borderRadiusStyle,
        useEventChannel,
        eventChannelName,
        brightValue,
      } = this.data;

      const options = {
        useEventChannel,
        eventChannelName,
      };
      canvasId &&
        this.render.renderRectColor(
          canvasId,
          rectWidth,
          rectHeight,
          thumbRadius,
          closed,
          colorsGradient,
          thumbWidth,
          options
        );
      this.render.setDisable(disable);
      this.render.setBrightValue(brightValue);
      this.lastValue = temp;
      isShowTip && this._setColorTextFn(temp);
      this.updatePosByTemp(temp);
      if (borderRadiusStyle) {
        this.setData({
          _borderRadius: borderRadiusStyle,
        });
      } else if (borderRadius) {
        this.setData({
          _borderRadius: `${borderRadius * 2}rpx`,
        });
      }
    },
    detached() {
      this.render?.removeEventListeners();
    },
  },
  methods: {
    setCanvasRect(rect) {
      const { width, height } = rect;
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
    },

    async getRightPos(x, y, temp) {
      const res = await this.getStorage();
      if (!res) {
        return {
          x,
          y: y === 0 ? this.data.rectHeight / 2 : y,
        };
      }
      const offset = 1;
      if (Math.abs(temp - res.temp) <= offset) {
        const { x: _x, y: _y } = res;
        return {
          x: _x,
          y: _y,
        };
      }
      return {
        x,
        y: y === 0 ? this.data.rectHeight / 2 : y,
      };
    },
    _getPosByBt(t, maxWidth, minWidth = 0) {
      // 白光色盘x对应色温
      let x = (t / 1000) * maxWidth;
      if (x < minWidth) {
        x = maxWidth + x;
      } else if (x > maxWidth) {
        x = maxWidth;
      }
      return {
        x,
        y: 0,
      };
    },
    getRealWidth(width) {
      const { windowWidth, screenWidth } = getSystemInfoSync();
      const scale = windowWidth / 375;
      return Math.round(width * scale);
    },
    async updatePosByTemp(temp, closed) {
      const { closed: closed1 } = this.data;
      if (!temp === undefined) {
        return;
      }
      const { rectWidth } = this.data;
      const _rectWidth = this.getRealWidth(rectWidth);
      const pos = this._getPosByBt(temp, _rectWidth, 0);
      const realPos = await this.getRightPos(pos.x, pos.y, temp);
      const _closed = closed || closed1;
      this.render?.updateThumbPositionByTemp(temp, realPos, _closed);
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
    _setColorTextFn(temp, pos) {
      // 颜色文案
      const hDegree = Math.floor(temp);
      const colorTextRes = `${hDegree}`;
      this.setData({
        colorText: colorTextRes,
      });
      if (!pos) {
        return;
      }
      const { rectWidth, rectHeight } = this.data;
      if (pos.y > rectHeight * 0.3) {
        return;
      }
      if (pos.x < rectWidth / 2) {
        this._updateTextTipPos(ETipRectPosition.RIGHT);
      } else {
        this._updateTextTipPos(ETipRectPosition.LEFT);
      }
    },
    _getRectImageData(dataRes) {
      const { data: temp, touchType, pos } = dataRes;
      const { data } = this;
      data.isShowTip && this._setColorTextFn(temp, pos);
      this.lastValue = temp;
      this.saveStorage({
        ...pos,
        temp: temp,
      });
      this.triggerEvent(touchType, temp);
    },

    async saveStorage(data) {
      const canvasId = this.data.rectId || this.data.canvasId;
      await setStorageItem(canvasId, data);
    },
    async getStorage() {
      const canvasId = this.data.rectId || this.data.canvasId;
      const res = await getStorageItem(canvasId);
      return res;
    },
  },
});
