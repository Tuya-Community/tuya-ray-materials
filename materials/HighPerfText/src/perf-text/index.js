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
    // round | ceil | floor
    mathType: {
      type: String,
      value: "round"
    },
    checkEventInstanceId: Boolean,
  },
});
