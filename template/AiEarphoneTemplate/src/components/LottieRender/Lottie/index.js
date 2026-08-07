import Render from './index.rjs';

Component({
  render: null,
  properties: {
    lottieData: {
      type: null,
    },
    canvasId: {
      type: String,
      value: 'canvas-lottie',
    },
    width: {
      type: String,
      value: '100%',
    },
    height: {
      type: String,
    },
    status: {
      type: String,
      value: 'play',
      observer(newVal, oldVal) {
        if (!this.render) return;
        if (newVal === 'stop') {
          this.render.stop();
        } else {
          this.render.play();
        }
      },
    },
  },
  data: {},
  lifetimes: {
    ready() {
      this.render = new Render(this);
      const { canvasId, lottieData, status } = this.properties;
      this.render.renderLottie(canvasId, lottieData, status === 'stop' ? false : true);
    },
  },
});
