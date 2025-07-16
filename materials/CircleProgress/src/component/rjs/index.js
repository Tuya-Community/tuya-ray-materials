import isEqual from 'lodash/isEqual';
import Render from './index.rjs';

// eslint-disable-next-line no-undef
Component({
  properties: {
    canvasId: String,
    containerStyle: {
      type: String,
      value: 'position: relative;',
    },
    colorList: {
      type: Array,
      value: [],
    },
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
    thumbBorderColor: {
      type: String,
      value: '#fff',
    },
    thumbBorderWidth: {
      type: Number,
      value: 4,
    },
    thumbCanvasOffset: {
      type: Number,
      value: 10,
    },
    trackColor: String,
    thumbColor: String,
    disable: {
      type: Boolean,
      value: false,
    },
    compatibleMode: {
      type: Boolean,
      value: false,
    },
    disableThumbColor: String,
    thumbRadius: Number,
    startDegree: Number,
    endDegree: Number,
    ringBorderColor: String,
    offsetDegree: Number,
    touchCircleStrokeStyle: String,
    onTouchStart: Function,
    onTouchMove: Function,
    onTouchEnd: Function,
  },
  data: {
    render: null,
    touchType: '',
  },
  observers: {
    value(v) {
      if (this.touchType === 'move') {
        return;
      }
      // 处理微小转换精度丢失导致的小跳动
      if (Math.abs(this.lastValue - v) > 0.9 || (this.lastValue === 0 && v === 0)) {
        this.updatePosByRgb(v);
        this.lastValue = v;
      }
    },
    disable(v) {
      this.render?.setDisable(v);
      if (isEqual(this.disable, v)) {
        return;
      }
      // 首次不渲染
      if (!this.disable) {
        this.disable = v;
        return;
      }
      this.disable = v;
      this.updatePosByRgb(this.lastValue);
    },
    colorList(list) {
      if (isEqual(this.list, list)) {
        return;
      }
      // 首次不渲染
      if (!this.list) {
        this.list = list;
        return;
      }
      this.initCanvas({
        colorList: list,
      });
      this.list = list;
    },
    trackColor(tkColor) {
      this.render?.setTrackColor(tkColor);
      if (isEqual(this.tkColor, tkColor)) {
        return;
      }
      // 首次不渲染
      if (!this.tkColor) {
        this.tkColor = tkColor;
        return;
      }
      this.initCanvas({
        trackColor: tkColor,
      });
      this.tkColor = tkColor;
    },
    thumbColor(tbColor) {
      this.render?.setThumbColor(tbColor);
      if (isEqual(this.tbColor, tbColor)) {
        return;
      }
      // 首次不渲染
      if (!this.tbColor) {
        this.tbColor = tbColor;
        return;
      }
      this.initCanvas({
        thumbColor: tbColor,
      });
      this.tbColor = tbColor;
    },
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
      const { radius, innerRingRadius } = this.data;
      this.render.setCircles(radius, innerRingRadius);
    },
    ready() {
      setTimeout(() => {
        // canvas 加载渲染较慢 延时确保
        this.initCanvas();
      }, 10);
    },
  },
  methods: {
    initCanvas(params = {}) {
      const {
        canvasId,
        radius,
        innerRingRadius,
        value = 0,
        colorList,
        touchCircleStrokeStyle,
        ringBorderColor,
        startDegree,
        endDegree,
        offsetDegree,
        thumbRadius,
        thumbBorderColor = '#fff',
        thumbBorderWidth = 4,
        thumbCanvasOffset,
        trackColor,
        thumbColor,
        disable,
        disableThumbColor,
        compatibleMode,
      } = this.data;

      const options = {
        colorList,
        touchCircleStrokeStyle,
        ringBorderColor,
        startDegree,
        endDegree,
        offsetDegree,
        thumbBorderColor,
        thumbBorderWidth,
        thumbCanvasOffset,
        thumbRadius,
        trackColor,
        thumbColor,
        disable,
        disableThumbColor,
        compatibleMode,
        ...params,
      };
      canvasId && this.render.renderAnnulusColor(canvasId, radius, innerRingRadius, options);
      this.lastValue = value;
    },
    initedCanvas() {
      const { value = 0 } = this.data;
      this.updatePosByRgb(value);
    },
    updatePosByRgb(value) {
      if (value === undefined) {
        return;
      }
      this.render?.getAnglePositionByValue(value);
    },
    getRgb(x, y) {
      this.render?.getAnnulusImageData(x, y);
    },

    updateTouchType(touchType) {
      this.touchType = touchType;
      this.touchType === 'end' && this.triggerEvent(this.touchType, this.lastValue);
    },
    getAnnulusImageData(dataRes) {
      const { position } = dataRes;
      const result = this.getLengthByAnglePosition(position.x, position.y);
      if (this.touchType === 'move' && this.lastValue === result) {
        return;
      }
      this.lastValue = result;
      this.triggerEvent(this.touchType, result);
    },
    getLengthByAnglePosition(x, y) {
      const { radius, startDegree, endDegree } = this.data;
      var radian = Math.atan2(y - radius, x - radius); // 弧度
      const _angle = radian * (180 / Math.PI); // 角度
      const angle = _angle < 0 ? 360 + +_angle : _angle;

      if (endDegree > 360) {
        if (angle - startDegree < 0) {
          const preOffset = 360 - startDegree;
          const __angle = angle + preOffset;
          const percent = (__angle / (endDegree - startDegree)) * 100;
          return Math.round(percent);
        }
      }
      const percent = ((angle - startDegree) / (endDegree - startDegree)) * 100;
      return Math.round(percent);
    },
  },
});
