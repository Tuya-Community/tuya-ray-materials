import Render from './index.rjs';

let index = 0;
Component({
  properties: {
    size: Number, // 组件尺寸， rpx为单位
    lineCount: Number, // 刻度总速
    lineWidth: Number, // 刻度线的宽度， rpx为单位
    lineLength: Number, // 刻度线的长度， rpx为单位
    lineColor: String, // 刻度的颜色
    activeColor: String, // 刻度激活的颜色
    value: Number,
    total: Number,
  },
  observers: {
    'value,total': function (value, total) {
      // 重绘数据
      if (this.render) {
        this.render.setConfig({ value, total });
        this.render.update();
      }
    },
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
    },
    ready() {
      //   为确认canvas可用，延迟时间渲染
      setTimeout(() => {
        this.render.setConfig(this.data);
        this.render.initCanvas();
      }, 100);
    },
  },
  methods: {},
  data: {
    canvasId: `countdown_${++index}`,
  },
});
