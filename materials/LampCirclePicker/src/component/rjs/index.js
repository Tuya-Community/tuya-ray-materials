import Render from './index.rjs';
import { getSystemInfo } from '@ray-js/api';

const ETipRectPosition = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

// eslint-disable-next-line no-undef
Component({
  properties: {
    canvasId: String,
    hideThumb: {
      type: Boolean,
      value: false,
    },
    containerStyle: {
      type: String,
      value: 'position: relative;',
    },
    radius: {
      type: Number,
      value: 100,
    },
    colorList: {
      type: Array,
      value: [],
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
      value: 'lampCirclePickerEventChannel',
    },
    lineCap: {
      type: String,
      value: 'round',
    },
    touchCircleStrokeStyle: String,
    touchCircleLineWidth: Number,
    onTouchStart: Function,
    onTouchMove: Function,
    onTouchEnd: Function,
  },
  data: {
    render: null,
    isTouch: false,
    touchType: '',
    colorText: '',
    tipRectPosition: ETipRectPosition.LEFT,
  },
  observers: {
    'value.**'(v) {
      if (this.touchType === 'move') {
        return;
      }
      if (Math.abs(this.lastValue / 10 - v / 10) > 1 || (this.lastValue === 0 && v === 0)) {
        this._updatePosByRgb(v);
        this.lastValue = v;
      }
    },
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
      const { radius, innerRingRadius } = this.data;
      this.render._setCircles(radius, innerRingRadius);
    },
    ready() {
      const { canvasId } = this.data;
      this.initCanvas();
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
        canvasId,
        radius,
        innerRingRadius,
        value = 0,
        hideThumb = false,
        useEventChannel,
        eventChannelName,
        colorList,
        lineCap = 'round',
        touchCircleStrokeStyle = '',
        touchCircleLineWidth = 0,
      } = this.data;
      const options = {
        useEventChannel,
        eventChannelName,
        hideThumb,
        lineCap,
        colorList,
        touchCircleStrokeStyle,
        touchCircleLineWidth,
      };
      // 防止重复渲染
      if (this.lastValue === value) {
        return;
      }
      canvasId && this.render.renderAnnulusColor(canvasId, radius, innerRingRadius, value, options);
      this.lastValue = value;
    },
    initedCanvas() {
      const { value } = this.data;
      value !== undefined && this._updatePosByRgb(value);
    },
    _updatePosByRgb(value) {
      if (value === undefined) {
        return;
      }
      this.render?._getAnglePositionByValue(value);
    },
    _getRgb(x, y) {
      this.render?.getAnnulusImageData(x, y);
    },
    _getAnnulusImageData(dataRes) {
      const { position, touchType } = dataRes;
      this.touchType = touchType;
      const result = this._getLengthByAnglePosition(position.x, position.y);
      this.lastValue = result;
      this.triggerEvent(touchType, result);
    },
    _getLengthByAnglePosition(x, y) {
      const { radius } = this.data;
      var radian = Math.atan2(y - radius, x - radius); // 弧度
      var angle = radian * (180 / Math.PI); // 角度
      let angleData = 0;
      if (+angle > 135 && +angle <= 180) {
        angleData = angle - 135;
      } else if (angle > -180 && angle <= 0) {
        angleData = 45 + angle + 180;
      } else if (angle > 0 && angle <= 45) {
        angleData = 225 + angle;
      }
      const result = Math.round((angleData / 270) * 1000);
      return result;
    },
  },
});
