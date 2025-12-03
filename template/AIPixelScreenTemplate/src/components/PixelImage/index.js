import Render from './index.rjs';

Component({
  properties: {
    width: {
      type: Number,
      value: 32, // 画布宽度
    },
    height: {
      type: Number,
      value: 32, // 画布高度
    },
    path: {
      type: String,
      value: '', // 图片路径
      observer(newValue) {
        let timer = null;
        if (!newValue) {
          return;
        }
        if (!this.render) {
          timer && clearInterval(timer);
          timer = setInterval(() => {
            if (this.render) {
              this.render.draw({
                imgSrc: newValue,
                width: this.data.width,
                height: this.data.height,
              });
              timer && clearInterval(timer);
            }
          }, 30);
        } else {
          this.render.draw({
            imgSrc: newValue,
            width: this.data.width,
            height: this.data.height,
          });
        }
      },
    },
  },
  data: {},
  lifetimes: {
    ready: function (e) {
      this.render = new Render(this);
    },
  },
  methods: {
    genImageData(res) {
      this.triggerEvent('getPixelData', res);
    },
  },
});
