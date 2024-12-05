import Render from './index.rjs';

// eslint-disable-next-line no-undef
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
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
      observer() {
        this.initSteps();
      },
    },
    // 滑块样式
    thumbStyle: {
      type: String,
    },
    thumbWrapStyle: {
      type: null,
    },
    // 轨道样式
    trackStyle: {
      type: String,
    },
    trackBgColor: {
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
      type: null,
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
    thumbStyleRenderFormatter: {
      type: null,
    },
    thumbStyleRenderValueScale: {
      type: Number,
      value: 1,
    },
    thumbStyleRenderValueStart: {
      type: Number,
      value: 1,
    },
    thumbWidth: Number,
    thumbHeight: Number,
    thumbStyleRenderValueReverse: {
      type: Boolean,
      value: false,
    },
    hidden: Boolean,
    parcel: Boolean,
    parcelThumbWidth: Number,
    parcelThumbHeight: Number,
    parcelMargin: {
      type: Number,
      value: 0,
    },
    startEventName: {
      type: String,
    },
    moveEventName: {
      type: String,
    },
    endEventName: {
      type: String,
    },
  },
  data: {
    steps: [],
    text: '',
    stepsInited: false,
  },
  lifetimes: {
    /**
     * 组件的方法列表
     */
    ready() {
      this.render = new Render(this);
      this.initSteps();
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

    initSteps() {
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
      if (this.render) {
        this.render.emit(`slider-${this.data.instanceId}-steps-init`, {});
      }
    },

    initStepsPadding() {
      this.setData({
        stepsInited: true,
      });
    },
  },
});
