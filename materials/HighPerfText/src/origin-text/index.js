// @ts-ignore
// eslint-disable-next-line no-undef
Component({
  properties: {
    instanceId: String,
    eventName: String,
    className: String,
    valueStart: {
      type: Number,
      value: 0,
    },
    valueScale: {
      type: Number,
      value: 1,
    },
    defaultValue: {
      type: String,
      value: '',
    },
    textStyle: {
      type: null,
    },
    fixNum: {
      type: Number,
      value: null,
    },
    checkEventInstanceId: Boolean,
    min: { type: Number, value: -Number.MAX_SAFE_INTEGER },
    max: { type: Number, value: Number.MAX_SAFE_INTEGER },
  },
});
