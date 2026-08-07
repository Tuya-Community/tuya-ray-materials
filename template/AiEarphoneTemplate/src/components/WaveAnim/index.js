import Render from './index.rjs';
import { getSystemInfoSync } from '@ray-js/ray';
// eslint-disable-next-line no-undef
const WaveAnimComponent = Component({
  properties: {
    width: {
      type: Number,
      value: 375,
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
          case 3:
            this.destroyWave();
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
    duration: {
      type: Number,
      value: 0, // 当前录音持续时间（毫秒）
      observer(newVal, oldVal) {
        if (
          newVal !== oldVal &&
          this.rjs &&
          typeof this.rjs.syncDuration === 'function' &&
          (this.data.recordState === 1 || this.data.recordState === 2)
        ) {
          this.rjs.syncDuration(newVal, false);
        }
      },
    },
    // 外部传入目标时长，用于强制同步时对齐中心线时间与计时器
    syncDurationValue: {
      type: Number,
      value: 0,
    },
    // 外部触发器，每次变化都按 syncDurationValue 强制对齐一次
    syncDurationTrigger: {
      type: Number,
      value: 0,
      observer(newVal) {
        if (newVal != null && this.rjs && typeof this.rjs.syncDuration === 'function') {
          this.rjs.syncDuration(this.data.syncDurationValue, true);
        }
      },
    },
  },
  lifetimes: {
    attached() {
      this.rjs = new Render(this);
    },
    ready: function () {
      const dpr = getSystemInfoSync().pixelRatio || 1;
      this.rjs.destroy();
      this.rjs.init(this.data.width, this.data.duration);
      this.rjs.pageDraw(dpr);
      // 先反注册上一次 ready 残留的监听（每次 ready 都会新建闭包，
      // 用旧引用 off 才能真正移除，避免重复进入录音页时监听累积导致内存泄漏）
      if (this.amplitudeUpdateHandler) {
        // eslint-disable-next-line no-undef
        ty.wear.offRecordTransferAmplitudeUpdateEvent(this.amplitudeUpdateHandler);
      }
      // 把回调挂到组件实例上，detached 时用同一引用反注册
      this.amplitudeUpdateHandler = d => {
        const { amplitude = 0, deviceId } = d;
        if (this.data.devId !== deviceId) return;
        const value = +amplitude * 3;
        this.rjs.updateBar(value);
      };
      // 根据录音振幅事件更新渲染
      // eslint-disable-next-line no-undef
      ty.wear.onRecordTransferAmplitudeUpdateEvent(this.amplitudeUpdateHandler);
    },
    detached: function () {
      this.destroyWave();
    },
  },
  methods: {
    // 统一清理：反注册振幅监听并销毁 RJS 资源
    destroyWave: function () {
      if (this.amplitudeUpdateHandler) {
        // eslint-disable-next-line no-undef
        ty.wear.offRecordTransferAmplitudeUpdateEvent(this.amplitudeUpdateHandler);
        this.amplitudeUpdateHandler = null;
      }
      if (this.rjs) {
        this.rjs.destroy();
      }
    },
    playAnim: function () {
      setTimeout(() => {
        this.rjs.updateSpeedValue(1);
      }, 100);
    },
    stopAnim: function () {
      setTimeout(() => {
        this.rjs.updateSpeedValue(0);
      }, 100);
    },
  },
});
export default WaveAnimComponent;
