import Render from './index.rjs';
// eslint-disable-next-line no-undef
Component({
  externalClasses: ['my-class'],
  observers: {
    progress: function (progress) {
      console.log('this.data::', this.data);
      const { radius, strokeWidth, color, strokeStyle, size } = this.data;
      this.rjs?.pageDraw(progress, radius, strokeWidth, color, strokeStyle, size);
    },
  },
  properties: {
    progress: {
      type: Number,
      value: 0, // 进度值，范围 0-100
      observer(newValue, oldValue) {
        console.log('newValue::', newValue);
      },
    },
    radius: {
      type: Number,
      value: 50, // 圆的半径，默认 50
    },
    strokeWidth: {
      type: Number,
      value: 8, // 进度条宽度，默认 8
    },
    color: {
      type: String,
      value: '#4883e5', // 进度条颜色，默认 #4883e5
    },
    strokeStyle: {
      type: String,
      value: '#ececec', // 进度条轨道样式，默认 #ececec
    },
    size: {
      type: String,
      value: 84, // canvas大小
    },
  },
  lifetimes: {
    attached() {
      this.rjs = new Render(this);
    },
    ready() {
      const { progress, radius, strokeWidth, color, strokeStyle, size } = this.data;
      this.rjs?.pageDraw(progress, radius, strokeWidth, color, strokeStyle, size);
    },
  },

  methods: {},
});
