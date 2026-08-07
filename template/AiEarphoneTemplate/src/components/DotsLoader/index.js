import Render from './index.rjs';
import { getSystemInfoSync } from '@ray-js/ray';

// 计算canvas尺寸
function calculateCanvasSize(dotSize, gap) {
  const width = dotSize * 3 + gap * 2;
  const height = dotSize + 2; // 增加2px高度，上下各留1px空间，确保圆点垂直居中
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
    // canvas ID
    canvasId: {
      type: String,
      value: 'dotsLoaderCanvas',
    },
    // 圆点大小，单位px
    dotSize: {
      type: Number,
      value: 4,
    },
    // 圆点间隔，单位px
    gap: {
      type: Number,
      value: 3,
    },
    // 基础颜色，十六进制格式
    color: {
      type: String,
      value: '#3678E3',
    },
    // 透明度数组，三个圆点的透明度
    opacities: {
      type: Array,
      value: [0.2, 0.6, 1],
    },
    // 每个圆点显示的持续时间，单位ms
    duration: {
      type: Number,
      value: 400,
    },
  },

  data: {
    canvasWidth: 18, // 默认：4*3 + 3*2 = 18
    canvasHeight: 6, // 默认：4 + 2 = 6
  },

  observers: {
    dotSize: function (newVal) {
      this.updateCanvasSize();
      this.updateRender();
    },
    gap: function (newVal) {
      this.updateCanvasSize();
      this.updateRender();
    },
    color: function (newVal) {
      this.updateRender();
    },
    opacities: function (newVal) {
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
        const { canvasId } = this.data;
        this.rjs.destroy(canvasId);
      }
    },
  },

  methods: {
    updateCanvasSize() {
      const { dotSize, gap } = this.data;
      const { width, height } = calculateCanvasSize(dotSize, gap);
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      });
    },

    initRender() {
      const { dotSize, gap, color, opacities, duration, canvasId } = this.data;
      const dpr = getSystemInfoSync().pixelRatio || 1;
      
      this.rjs.init(dotSize, gap, color, opacities, duration, canvasId);
      this.rjs.pageDraw(dpr, canvasId);
    },

    updateRender() {
      if (!this.rjs) return;
      
      const { dotSize, gap, color, opacities, duration, canvasId } = this.data;
      this.rjs.updateConfig(dotSize, gap, color, opacities, duration, canvasId);
    },
  },
});

