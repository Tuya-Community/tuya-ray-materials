import Render from './index.rjs';
Component({
  properties: {
    width: {
      type: Number,
      value: 128,
    },
    recordState: {
      type: Number,
      value: 0, // -1无录音任务 0未知，1录音中，2暂停
      observer(newValue, oldValue) {
        switch (newValue) {
          case 1:
            this.playAnim();
            break;
          case 2:
            this.stopAnim();
            break;
          default:
            break;
        }
      },
    },
    devId: {
      type: String,
      value: '',
    },
  },
  lifetimes: {
    attached() {
      this.rjs = new Render(this);
    },
    ready: function () {
      this.rjs.init(this.data.width);
      this.rjs.pageDraw();
      // 根据录音振幅事件更新渲染
      ty.wear.onRecordTransferAmplitudeUpdateEvent(d => {
        const { amplitude = 0, deviceId } = d;
        if (this.data.devId !== deviceId) return;
        const value = +amplitude * 10;
        this.rjs.updateBar(value);
      });
    },
    detached: function () {},
  },
  methods: {
    // updateData: function (e) {
    //   // this.rjs.updateBar(e.detail.value);
    // },
    playAnim: function () {
      setTimeout(() => {
        this.rjs.updateSpeedValue(0.5);
      }, 100);
    },
    stopAnim: function () {
      setTimeout(() => {
        this.rjs.updateSpeedValue(0);
      }, 100);
    },
  },
});
