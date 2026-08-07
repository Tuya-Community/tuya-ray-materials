import Render from './index.rjs';
import { getSystemInfoSync } from '@ray-js/ray';

// 计算canvas尺寸
function calculateCanvasSize(radii, lineWidth) {
  const maxRadius = Math.max(...radii);
  const width = maxRadius * 2 + lineWidth + 4;
  const height = maxRadius * 2 + lineWidth + 4;
  return { width, height };
}

// eslint-disable-next-line no-undef
Component({
  properties: {
    // 自定义类名
    className: {
      type: String,
      value: '',
    },
    // 基础颜色，十六进制格式
    color: {
      type: String,
      value: '#3678E3',
    },
    // 透明度数组，三段圆弧的透明度
    opacities: {
      type: Array,
      value: [0.2, 0.6, 1],
    },
    // 半径数组，三段圆弧的半径
    radii: {
      type: Array,
      value: [10, 16, 22],
    },
    // 线宽，单位px
    lineWidth: {
      type: Number,
      value: 3,
    },
    // 每段圆弧显示的持续时间，单位ms
    duration: {
      type: Number,
      value: 400,
    },
  },

  data: {
    canvasWidth: 50, // 默认：22*2 + 3 + 4 = 51，取整50
    canvasHeight: 50,
  },

  observers: {
    color: function (newVal) {
      this.updateRender();
    },
    opacities: function (newVal) {
      this.updateRender();
    },
    radii: function (newVal) {
      this.updateCanvasSize();
      this.updateRender();
    },
    lineWidth: function (newVal) {
      this.updateCanvasSize();
      this.updateRender();
    },
    duration: function (newVal) {
      this.updateRender();
    },
  },

  lifetimes: {
    attached() {
      this.rjs = new Render(this);
      this.updateCanvasSize();
    },
    ready() {
      this.initRender();
    },
    detached() {
      if (this.rjs) {
        this.rjs.destroy();
      }
    },
  },

  methods: {
    updateCanvasSize() {
      const { radii, lineWidth } = this.data;
      const { width, height } = calculateCanvasSize(radii, lineWidth);
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
    },

    initRender() {
      const { color, opacities, radii, lineWidth, duration } = this.data;
      const dpr = getSystemInfoSync().pixelRatio || 1;
      
      this.rjs.init(color, opacities, radii, lineWidth, duration);
      this.rjs.pageDraw(dpr);
    },

    updateRender() {
      if (!this.rjs) return;
      
      const { color, opacities, radii, lineWidth, duration } = this.data;
      this.rjs.updateConfig(color, opacities, radii, lineWidth, duration);
    },
  },
});

