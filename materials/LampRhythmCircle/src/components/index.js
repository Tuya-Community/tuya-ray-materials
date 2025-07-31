import { nanoid } from 'nanoid/non-secure';
// eslint-disable-next-line no-undef
Component({
  properties: {
    disable: Boolean,
    canvasId: String,
    canvasStyle: String,
    innerRing: String,
    isDarkTheme: {
      type: Boolean,
      value: true,
    },
    iconSize: {
      type: Number,
      value: 30,
    },
    padding: {
      type: Number,
      value: 2
    },
    radius: {
      type: Number,
      value: 100,
    },
    innerRingRadius: {
      type: Number,
      value: 50,
    },
    data: {
      type: Array,
      value: [],
    },
    iconList: {
      type: Array,
      value: [],
    },
    timeOffset: {
      type: Number,
      value: 15,
    },
  },
  data: {
    render: null,
    isTouch: false,
    touchType: '',
    instanceId: nanoid(),
  },
  observers: {
    'data.**'() {
      //
    },
  },
  lifetimes: {
    ready() {
      //
    },
    detached() {
      //
    },
  },
  methods: {
    getAnnulusImageData(dataRes) {
      const { touchType, data, activeIndex } = dataRes;
      const { disable } = this.data;
      this.touchType = touchType;
      if (disable || !data) return;
      const sendData = {
        value: data,
        activeIndex,
      };
      if (touchType === 'start') {
        this.triggerEvent('start', sendData);
      } else if (touchType === 'move') {
        this.triggerEvent('move', sendData);
      } else if (touchType === 'end') {
        this.triggerEvent('end', sendData);
      }
    },
    handleVibrateShort(type) {
      // eslint-disable-next-line no-undef
      ty?.vibrateShort({
        type,
      });
    },
  },
});
