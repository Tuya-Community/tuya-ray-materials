/* eslint-disable no-empty */
/* eslint-disable no-console */
// eslint-disable-next-line no-undef
Component({
  data: {
    height: 0, // 卡片高度
    showChunk: true, // 控制是否显示当前的chunk内容
  },
  properties: {
    _chunkPrefix: {
      type: String,
      value: 'rv' + Math.random().toString(36).slice(-8),
    },
    chunkId: {
      type: String,
      value: '',
    },
    chunkObserveHeight: {
      type: Number,
      value: 2000,
    },
    showLogInfo: {
      type: Boolean,
      value: false,
    },
  },
  lifetimes: {
    detached() {},
    attached() {
      this.startObserverChunk();
    },
  },
  methods: {
    startObserverChunk() {
      try {
      } catch (error) {
        console.log('error', error);
      }
    },
  },
});
