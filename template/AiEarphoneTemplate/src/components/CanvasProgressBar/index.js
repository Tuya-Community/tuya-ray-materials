import Render from './index.rjs';
import { getSystemInfoSync } from '@ray-js/ray';

// eslint-disable-next-line no-undef
Component({
  properties: {
    // 自定义类名（由 Ray/React 侧 className 传入；勿再声明 externalClasses className）
    className: {
      type: String,
      value: '',
    },
    // 进度百分比，0-100
    percent: {
      type: Number,
      value: 0,
    },
    // 宽度，支持px、%、数字
    width: {
      type: String,
      value: '100%',
    },
    // 高度，单位px
    height: {
      type: Number,
      value: 8,
    },
    // 填充颜色
    fillColor: {
      type: String,
      value: '#3678E3',
    },
    // 轨道颜色
    trackColor: {
      type: String,
      value: 'rgba(54, 120, 227, 0.1)',
    },
    // 圆角半径，单位px
    borderRadius: {
      type: Number,
      value: 16,
    },
    // 自定义内联样式（不可用 style，为框架保留字）
    customStyle: {
      type: String,
      value: '',
    },
  },

  data: {
    canvasWidth: 300, // 默认宽度（用于canvas实际绘制尺寸）
    canvasHeight: 8, // 默认高度
    containerStyle: '',
  },

  observers: {
    percent: function (newVal) {
      this.updateRender();
    },
  },

  lifetimes: {
    attached() {
      this.rjs = new Render(this);
    },
    ready() {
      this.updateContainerStyle();
      this.updateCanvasSize();
      this.initRender();
    },
    detached() {
      if (this.rjs) {
        this.rjs.destroy();
      }
    },
  },

  methods: {
    updateContainerStyle() {
      const { width, height, borderRadius, customStyle } = this.data;
      let containerStyle = '';

      // 设置宽度
      if (width) {
        containerStyle += `width: ${width};`;
      }

      // 设置高度
      if (height) {
        containerStyle += `height: ${height}px;`;
      }

      // 设置圆角（最外层元素圆角）
      if (borderRadius !== undefined) {
        containerStyle += `border-radius: ${borderRadius}px;`;
      }

      // 添加自定义样式
      if (customStyle) {
        containerStyle += customStyle;
      }

      this.setData({
        containerStyle,
      });
    },

    updateCanvasSize() {
      const { width, height } = this.data;

      // 计算canvas实际绘制宽度（用于canvas.width）
      let canvasWidth = 300; // 默认值
      if (typeof width === 'string' && width.endsWith('px')) {
        canvasWidth = parseFloat(width);
      } else if (typeof width === 'number') {
        canvasWidth = width;
      } else if (typeof width === 'string' && width.endsWith('%')) {
        // 百分比宽度，使用默认值或从系统信息获取屏幕宽度
        const systemInfo = getSystemInfoSync();
        const screenWidth = systemInfo?.windowWidth || systemInfo?.screenWidth || 375;
        const percentValue = parseFloat(width) || 100;
        canvasWidth = (screenWidth * percentValue) / 100;
      }

      this.setData({
        canvasWidth,
        canvasHeight: height,
      });
    },

    initRender() {
      // eslint-disable-next-line object-curly-newline
      const { percent, width, height, fillColor, trackColor, borderRadius, canvasWidth } =
        this.data;
      const dpr = getSystemInfoSync().pixelRatio || 1;

      // 使用 nextTick 确保DOM已渲染
      const scheduleRender = callback => {
        // eslint-disable-next-line no-undef
        if (typeof ty !== 'undefined' && ty.nextTick) {
          // eslint-disable-next-line no-undef
          ty.nextTick(callback);
        } else {
          setTimeout(callback, 0);
        }
      };

      scheduleRender(() => {
        this.rjs.init(percent, width, height, fillColor, trackColor, borderRadius);
        this.rjs.pageDraw(dpr, canvasWidth);
      });
    },

    updateRender() {
      if (!this.rjs) return;

      // eslint-disable-next-line object-curly-newline
      const { percent, width, height, fillColor, trackColor, borderRadius, canvasWidth } =
        this.data;

      this.rjs.updateConfig(
        percent,
        width,
        height,
        fillColor,
        trackColor,
        borderRadius,
        canvasWidth
      );
    },
  },
});
