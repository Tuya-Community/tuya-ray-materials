/* eslint-disable radix */
/* eslint-disable prettier/prettier */
import Render from './index.rjs';

// eslint-disable-next-line no-undef
Component({
  properties: {
    radius: Number,
    thumbRadius: {
      type: Number,
      value: 6,
    },
    pixelRatio: {
      type: Number,
      value: 1,
    },
    minRange: {
      type: Number,
      value: 0
    },
    thumbBorderWidth: {
      type: Number,
      value: 2,
    },
    showPercent: {
      type: Boolean,
      value: false,
    },
    temperature: {
      type: Number,
      value: 0,
    },
    percentValueMap: {
      type: Object,
    },
    textStyles: {
      type: Object,
      value: {}
    },
    bubbleTextStyles: {
      type: Object,
      value: {}
    },
    whiteRange: {
      type: Number,
      value: 0.15,
    },
    // 是否启用事件通道
    useEventChannel: {
      type: Boolean,
      value: false,
    },
    eventChannelName: {
      type: String,
      value: 'lampCirclePickerWhiteEventChannel',
    },
    canvasId: {
      type: String,
    },
  },
  data: {
    render: null,
    hsChanged: false,
    colorText: '',
    instanceId: `circle_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`,
  },
  observers: {
    temperature(temp) {
      if (this.touchType === 'move') {
        return;
      }
      this._updatePosByTemp(temp);
    },
    showPercent() {
      this._render();
    },
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
      const { thumbRadius, thumbBorderWidth = 2 } = this.data;
      this._setThumbWidth(thumbRadius * 2);
      this._setThumbBorderWidth(thumbBorderWidth);
    },
    ready() {
      this._render();
    },
    detached() {
      this.render?.removeEventListeners();
    },
  },
  methods: {
    _render() {
      const { minRange, thumbRadius, thumbBorderWidth, pixelRatio, showPercent, bubbleTextStyles, textStyles, percentValueMap, temperature, canvasId, whiteRange, radius, useEventChannel, eventChannelName } =
        this.data;
      if (canvasId) {
        const options = {
          useEventChannel,
          eventChannelName,
          percentValueMap,
          textStyles,
          bubbleTextStyles,
          showPercent,
          pixelRatio,
          thumbRadius,
          radius,
          thumbBorderWidth,
        };
        canvasId && this.render?.renderWhiteCircleColor?.({
          id: canvasId,
          whiteRange,
          minRange,
          circleRadius: radius
        }, options);
      }

      this._updatePosByTemp(temperature);
    },
    _setCanvasRect(circle) {
      const { width, height } = circle;
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
    },
    _setThumbWidth(width) {
      this.render?.setThumbWidth?.(width);
    },
    _setThumbBorderWidth(width) {
      this.render?.setThumbBorderWidth?.(width);
    },
    _updatePosByTemp(temp) {
      if (typeof temp !== 'number') {
        console.log('temp: is not numbers');
        return;
      }
      this.render?.updateThumbPositionByTemp(temp, this.data.showPercent);
    },
    _getRgb(x, y) {
      this.render?.getRectImageData(x, y);
    },
    _getRgbThrottle(x, y) {
      this._getRgb(x, y);
    },
    _getRectImageData(dataRes) {
      const { touchType, pos } = dataRes;
      this.touchType = touchType;
      const temp = this.calcTempFromPos(pos);
      this.triggerEvent(touchType, temp);
    },
    calcTempFromPos(pos) {
      return pos.percent * 1000;
    },
  },
});
