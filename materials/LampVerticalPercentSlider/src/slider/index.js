const getSvg = color =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75C11.4477 3.75 11 4.19772 11 4.75V5.75C11 6.30228 11.4477 6.75 12 6.75C12.5523 6.75 13 6.30228 13 5.75V4.75C13 4.19772 12.5523 3.75 12 3.75ZM12 17.25C11.4477 17.25 11 17.6977 11 18.25V19.25C11 19.8023 11.4477 20.25 12 20.25C12.5523 20.25 13 19.8023 13 19.25V18.25C13 17.6977 12.5523 17.25 12 17.25ZM16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM16.4194 6.1664C16.8099 5.77587 17.443 5.77587 17.8336 6.1664C18.2241 6.55692 18.2241 7.19009 17.8336 7.58061L17.1265 8.28772C16.7359 8.67824 16.1028 8.67824 15.7123 8.28772C15.3217 7.89719 15.3217 7.26403 15.7123 6.8735L16.4194 6.1664ZM6.87342 15.7123C7.26394 15.3218 7.89711 15.3218 8.28763 15.7123C8.67815 16.1029 8.67815 16.736 8.28763 17.1266L7.58052 17.8337C7.19 18.2242 6.55683 18.2242 6.16631 17.8337C5.77579 17.4431 5.77579 16.81 6.16631 16.4194L6.87342 15.7123ZM20.25 12C20.25 11.4477 19.8023 11 19.25 11H18.25C17.6977 11 17.25 11.4477 17.25 12C17.25 12.5523 17.6977 13 18.25 13H19.25C19.8023 13 20.25 12.5523 20.25 12ZM6.75 12C6.75 11.4477 6.30229 11 5.75 11H4.75C4.19772 11 3.75 11.4477 3.75 12C3.75 12.5523 4.19772 13 4.75 13H5.75C6.30228 13 6.75 12.5523 6.75 12ZM17.1266 15.7123L17.8337 16.4194C18.2242 16.8099 18.2242 17.4431 17.8337 17.8336C17.4431 18.2242 16.81 18.2242 16.4195 17.8336L15.7123 17.1265C15.3218 16.736 15.3218 16.1028 15.7123 15.7123C16.1029 15.3218 16.736 15.3218 17.1266 15.7123ZM8.28772 6.87348C8.67825 7.264 8.67825 7.89717 8.28772 8.28769C7.8972 8.67822 7.26403 8.67822 6.87351 8.28769L6.1664 7.58058C5.77588 7.19006 5.77588 6.5569 6.1664 6.16637C6.55693 5.77585 7.19009 5.77585 7.58062 6.16637L8.28772 6.87348Z" fill="${color}"/></svg>`;

const getLeftIcon = color => `url("data:image/svg+xml,${encodeURIComponent(getSvg(color))}")`;

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
    },
    // 滑块样式
    thumbStyle: {
      type: String,
    },
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
    showIcon: Boolean,
    iconColor: {
      type: String,
      observer(val) {
        this.setData({
          iconSrc: getLeftIcon(val),
        });
      },
    },
    textColor: String,
  },
  data: {
    steps: [],
    text: '',
    iconSrc: getLeftIcon('rgba(0,0,0,0.9)'),
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
