const getBrightSvg = color =>
  `<svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="3" fill="${color}"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.25a.75.75 0 0 0-.75.75v.75a.75.75 0 1 0 1.5 0V3A.75.75 0 0 0 9 2.25ZM9 13.5a.75.75 0 0 0-.75.75V15a.75.75 0 0 0 1.5 0v-.75A.75.75 0 0 0 9 13.5ZM13.76 4.214a.732.732 0 0 0-1.035 0l-.555.555a.732.732 0 0 0 0 1.035l.025.026a.732.732 0 0 0 1.035 0l.556-.556a.732.732 0 0 0 0-1.035l-.026-.025Zm-7.955 7.955a.731.731 0 0 0-1.034 0l-.556.556a.732.732 0 0 0 0 1.034l.025.026a.731.731 0 0 0 1.035 0l.556-.556a.732.732 0 0 0 0-1.034l-.026-.026ZM15.75 9a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 .75-.75ZM4.5 9a.75.75 0 0 0-.75-.75H3a.75.75 0 1 0 0 1.5h.75A.75.75 0 0 0 4.5 9ZM13.786 13.76a.731.731 0 0 0 0-1.035l-.556-.556a.732.732 0 0 0-1.034 0l-.026.026a.731.731 0 0 0 0 1.035l.556.555a.731.731 0 0 0 1.034 0l.026-.025ZM5.83 5.805a.731.731 0 0 0 0-1.035l-.556-.556a.731.731 0 0 0-1.034 0l-.026.026a.731.731 0 0 0 0 1.035l.556.555a.731.731 0 0 0 1.034 0l.026-.025Z" fill="${color}"/></svg>`;

const getPlusSvg = (color, borderColor, backgroundColor) =>
  `<svg width="54" height="72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.6 71c-8.96 0-13.441 0-16.864-1.744a16 16 0 0 1-6.992-6.992C1 58.84 1 54.36 1 45.4V26.6c0-8.96 0-13.441 1.744-16.864a16 16 0 0 1 6.992-6.992C13.16 1 17.64 1 26.6 1h.8c8.96 0 13.441 0 16.864 1.744a16 16 0 0 1 6.992 6.992C53 13.16 53 17.64 53 26.6v18.8c0 8.96 0 13.441-1.744 16.864a16 16 0 0 1-6.992 6.992C40.84 71 36.36 71 27.4 71h-.8Z" fill="${backgroundColor}" stroke="${borderColor}"/><path fill-rule="evenodd" clip-rule="evenodd" d="M28.5 29.5a1 1 0 1 0-2 0V35H21a1 1 0 1 0 0 2h5.5v5.5a1 1 0 1 0 2 0V37H34a1 1 0 1 0 0-2h-5.5v-5.5Z" fill="${color}"/></svg>`;

const getSubSvg = (color, borderColor, backgroundColor) =>
  `<svg width="54" height="72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.6 71c-8.96 0-13.441 0-16.864-1.744a16 16 0 0 1-6.992-6.992C1 58.84 1 54.36 1 45.4V26.6c0-8.96 0-13.441 1.744-16.864a16 16 0 0 1 6.992-6.992C13.16 1 17.64 1 26.6 1h.8c8.96 0 13.441 0 16.864 1.744a16 16 0 0 1 6.992 6.992C53 13.16 53 17.64 53 26.6v18.8c0 8.96 0 13.441-1.744 16.864a16 16 0 0 1-6.992 6.992C40.84 71 36.36 71 27.4 71h-.8Z" fill="${backgroundColor}" stroke="${borderColor}"/><rect x="20" y="35" width="15" height="2" rx="1" fill="${color}"/></svg>`;

const getBrightIcon = (creator, ...args) =>
  `url("data:image/svg+xml,${encodeURIComponent(creator(...args))}")`;

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
    // 左滑块初始值
    start: {
      type: Number,
    },
    // 左滑块最小值限制
    startMin: {
      type: Number,
    },
    // 左滑块最大值限制
    startMax: {
      type: Number,
    },
    // 右滑块初始值/单向滑条初始值
    end: {
      type: Number,
    },
    watchStart: {
      type: Number,
    },
    watchEnd: {
      type: Number,
    },
    // 右滑块最小值/单向滑条最小值
    endMin: {
      type: Number,
    },
    // 右滑块最大值/单向滑条最大值
    endMax: {
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
    // 阶段值
    forceStep: {
      type: Number,
    },
    // 滑块样式
    thumbStartStyle: {
      type: String,
    },
    // 滑块样式
    thumbEndStyle: {
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
    // 单向还是双向 range: 双向，normal: 单向
    mode: {
      type: String,
    },
    // 方向 "horizontal" | "vertical"
    direction: {
      type: String,
    },
    // 控制滑动bar的偏移量，用于样式微调
    barPad: {
      type: Number,
    },
    // 隐藏滑块
    hideThumb: {
      type: Boolean,
      value: false,
    },
    showThumb: {
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
      value: false,
    },
    // 使用触摸bar增加偏移
    enableTouchBar: {
      type: Boolean,
      value: false,
    },
    // 使用触摸跳跃
    maxRangeOffset: {
      type: Number,
      value: 0,
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
    showButtons: Boolean,
    textColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.9)',
      observer(value) {
        if (value) {
          this.setData({
            iconSrc: getBrightIcon(getBrightSvg, value),
            iconPlusSrc: getBrightIcon(
              getPlusSvg,
              value,
              this.data.borderColor,
              this.data.buttonBackground
            ),
            iconSubSrc: getBrightIcon(
              getSubSvg,
              value,
              this.data.borderColor,
              this.data.buttonBackground
            ),
          });
        }
      },
    },
    barColor: {
      type: String,
      value: 'linear-gradient(270deg, #7f66ef -14.11%, #fff 100%)',
    },
    trackColor: {
      type: String,
      value: '#e0e0e0',
    },
    buttonBackground: {
      type: String,
      value: '#fff',
      observer(value) {
        if (value) {
          this.setData({
            iconPlusSrc: getBrightIcon(
              getPlusSvg,
              this.data.textColor,
              this.data.borderColor,
              value
            ),
            iconSubSrc: getBrightIcon(getSubSvg, this.data.textColor, this.data.borderColor, value),
          });
        }
      },
    },
    borderColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.1)',
      observer(value) {
        if (value) {
          this.setData({
            iconPlusSrc: getBrightIcon(
              getPlusSvg,
              this.data.textColor,
              value,
              this.data.buttonBackground
            ),
            iconSubSrc: getBrightIcon(
              getSubSvg,
              this.data.textColor,
              value,
              this.data.buttonBackground
            ),
          });
        }
      },
    },
    showIcon: Boolean,
    valueMin: Number,
    width: {
      type: String,
      value: '70px',
    },
    height: {
      type: String,
      value: '200px',
    },
    borderRadius: {
      type: String,
      value: '16px',
    },
    thumbImage: String,
    thumbBorderRadius: String,
    thumbWidth: String,
    thumbHeight: String,
  },
  data: {
    steps: [],
    text: '',
    iconSrc: getBrightIcon(getBrightSvg, 'rgba(0, 0, 0, 0.9)'),
    iconPlusSrc: getBrightIcon(getPlusSvg, 'rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.1)', '#fff'),
    iconSubSrc: getBrightIcon(getSubSvg, 'rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.1)', '#fff'),
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
