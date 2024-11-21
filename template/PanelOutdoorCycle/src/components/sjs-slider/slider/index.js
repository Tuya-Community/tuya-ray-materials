// eslint-disable-next-line no-undef
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    currentDpValue: {
      type: Boolean,
      value: false,
      observer(newVal) {
        // console.log('当前收到dp值 :>> ', newVal);
      },
    },
    className: {
      type: String,
      value: '',
    },
    disable: {
      type: Boolean,
      value: false,
    },
    // 右滑块初始值/单向滑条初始值
    end: {
      type: Number,
      observer(newVal) {
        // console.log('滑块值 :>> ', newVal);
      },
    },
    // 最小值
    min: {
      type: Number,
      value: 0,
    },
    // 最大值
    max: {
      type: Number,
      value: 100,
    },
    // 阶段值
    step: {
      type: Number,
      value: 1,
    },
    // 滑块样式
    thumbStyle: {
      type: String,
    },
    /* thumbWrapStyle: {
      type: Object,
      value: {},
    }, */
    // 轨道样式
    trackStyle: {
      type: String,
    },
    // 滑条样式
    barStyle: {
      type: String,
    },
    // step样式
    stepStyle: {
      type: String,
    },
    // step样式
    activeStepStyle: {
      type: String,
    },
    // 方向 "horizontal" | "vertical"
    direction: {
      type: String,
    },
    // 隐藏滑块
    hideThumb: {
      type: Boolean,
      value: false,
    },
    // 显示阶段提示
    showSteps: {
      type: Boolean,
      value: false,
    },
    // 反转
    reverse: {
      type: Boolean,
      value: false,
    },
    // 使用触摸跳跃
    enableTouch: {
      type: Boolean,
      value: true,
    },
    // 使用触摸bar增加偏移
    enableTouchBar: {
      type: Boolean,
      value: false,
    },
    // 唯一ID
    instanceId: {
      type: String,
    },
    // 在bar上显示文本
    showText: {
      type: Boolean,
    },
    // bar文本样式
    textStyle: {
      type: String,
    },
    // 文本格式化，例如 textTemplate="比率 {{text}} %"
    textTemplate: {
      type: String,
    },
    // 动态计算thumb样式，如 { background: "rgba(0,0,0, {{text}}/100)" }
    thumbStyleCalc: {
      type: Object,
    },
    // 首次渲染时隐藏bar
    hideBarOnFirstRender: {
      type: Boolean,
      value: false,
    },
    // 点击热区样式
    hotAreaStyle: {
      type: String,
    },
    hideThumbButton: {
      type: Boolean,
      value: false,
    },
    /* thumbStyleRenderFormatter: {
      type: Object,
    }, */
    thumbStyleRenderValueScale: {
      type: Number,
      value: 1,
    },
    thumbStyleRenderValueStart: {
      type: Number,
      value: 1,
    },
    thumbStyleRenderValueReverse: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    steps: [],
    text: '',
    closeLock:
      '%3Csvg%20t%3D%221703741326227%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%222875%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cpath%20d%3D%22M766.208%2042.666667c32.554667%200%2063.914667%206.101333%2094.08%2018.304%2030.165333%2012.202667%2056.917333%2029.013333%2080.341333%2050.346666%2023.381333%2021.333333%2042.197333%2046.250667%2056.405334%2074.709334%2014.250667%2028.501333%2021.333333%2059.008%2021.333333%2091.52v150.528h-123.008v-122.026667c0-42.709333-12.032-75.946667-36.096-99.669333-24.064-23.722667-56.448-35.584-97.109333-35.584-36.608%200-66.133333%2011.861333-88.448%2035.584-22.4%2023.722667-33.578667%2056.96-33.578667%2099.669333v124.032H512V277.546667c0-32.512%206.442667-63.018667%2019.328-91.52a233.898667%20233.898667%200%200%201%2053.376-74.709334c22.698667-21.333333%2049.493333-38.144%2080.341333-50.346666A272.64%20272.64%200%200%201%20766.208%2042.666667z%20m-3.541333%20768.512v-267.434667c0-18.944-6.442667-34.901333-19.328-47.786667a64.938667%2064.938667%200%200%200-47.786667-19.328H66.090667c-17.621333%200-33.024%206.442667-46.250667%2019.328-13.226667%2012.885333-19.84%2028.8-19.84%2047.786667v323.413333c0%2016.896%202.901333%2032.853333%208.661333%2047.786667%205.76%2014.890667%2014.08%2027.946667%2024.917334%2039.125333%2010.837333%2011.178667%2023.722667%2020.010667%2038.613333%2026.453334%2014.933333%206.4%2031.530667%209.642667%2049.834667%209.642666h514.56c18.304%200%2035.072-3.413333%2050.346666-10.154666a125.866667%20125.866667%200%200%200%2039.637334-27.477334c11.178667-11.52%2019.968-25.386667%2026.453333-41.685333%206.4-16.256%209.642667-33.536%209.642667-51.84v-47.786667z%22%20fill%3D%22%2336D100%22%20p-id%3D%222876%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    openLock:
      '%3Csvg%20t%3D%221703672562538%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%223112%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cpath%20d%3D%22M510.208%2042.666667c32.554667%200%2063.914667%206.101333%2094.08%2018.304%2030.165333%2012.202667%2056.96%2029.013333%2080.341333%2050.346666%2023.381333%2021.333333%2042.197333%2046.250667%2056.405334%2074.709334%2014.250667%2028.501333%2021.333333%2059.008%2021.333333%2091.52v150.528h-123.008v-122.026667c0-42.709333-12.032-75.946667-36.096-99.669333-24.064-23.722667-56.448-35.584-97.109333-35.584-36.608%200-66.133333%2011.861333-88.448%2035.584-22.4%2023.722667-33.578667%2056.96-33.578667%2099.669333v124.032H256V277.546667c0-32.512%206.442667-63.018667%2019.328-91.52A233.984%20233.984%200%200%201%20328.704%20111.36c22.698667-21.333333%2049.493333-38.144%2080.341333-50.346667A272.64%20272.64%200%200%201%20510.208%2042.666667z%20m380.458667%20768.512v-267.434667c0-18.944-6.442667-34.901333-19.328-47.786667a64.938667%2064.938667%200%200%200-47.786667-19.328H194.090667c-17.621333%200-33.024%206.442667-46.250667%2019.328-13.226667%2012.885333-19.84%2028.8-19.84%2047.786667v323.413333c0%2016.896%202.901333%2032.853333%208.661333%2047.786667%205.76%2014.890667%2014.08%2027.946667%2024.917334%2039.125333%2010.837333%2011.178667%2023.722667%2020.010667%2038.613333%2026.453334%2014.933333%206.4%2031.530667%209.642667%2049.834667%209.642666h514.56c18.304%200%2035.072-3.413333%2050.346666-10.154666%2015.232-6.826667%2028.458667-15.957333%2039.637334-27.477334s19.968-25.386667%2026.453333-41.685333c6.4-16.256%209.642667-33.536%209.642667-51.84v-47.786667z%22%20fill%3D%22%2336D100%22%20p-id%3D%223113%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
  },
  lifetimes: {
    /**
     * 组件的方法列表
     */
    ready() {
      const isNumber = n => /\d+/.test(n);
      const getNumber = (n, def) => (isNumber(n) ? n : def);

      if (!this.data.showSteps) return;
      const stepCount = this.data.step || this.data.forceStep;
      const max = getNumber(this.data.max, 100);
      const min = getNumber(this.data.min, 0);
      const steps = new Array(parseInt(String((max - min) / stepCount), 10))
        .fill(0)
        .map((_, i) => i)
        .concat(-1);
      this.setData({
        steps,
      });
    },
  },
  methods: {
    setText({ instanceId, content }) {
      if (!this.data.showText) return;
      if (instanceId !== this.data.instanceId) return;
      this.setData({
        text: content,
      });
    },
  },
});
