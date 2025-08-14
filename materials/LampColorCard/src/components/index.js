/* eslint-disable prettier/prettier */
import Render from './index.rjs';
import { hsColorSource } from './config';
import { hsv2rgb } from './utils';

// eslint-disable-next-line no-undef
Component({
  properties: {
    containerStyle: String,
    rectStyle: String,
    rectWidth: Number,
    rectHeight: Number,
    borderRadius: String,
    thumbBorderColor: String,
    thumbBorderRadius: Number,
    thumbWidth: {
      type: Number,
      value: 28,
    },
    hs: {
      type: Object,
    },
    thumbBorderWidth: {
      type: Number,
      value: 2,
    },
  },
  data: {
    render: null,
    thumbPosition: {
      position: 'absolute',
      zIndex: 999,
      right: 'auto',
      left: 0,
      top: 0,
    },
    canvasId: `lampColorCard_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`,
  },
  observers: {
    'hs.**'(hs) {
      this.updateThumb(hs);
    },
  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      const { canvasId, rectWidth, rectHeight } = this.data;

      canvasId && this.render.renderRectColor(canvasId, rectWidth, rectHeight);
    },
    detached() {
      this.render?.removeEventListeners();
    },
  },
  methods: {
    _getColor(dataRes) {
      this.triggerEvent('onTouchEnd', dataRes);
    },
    updateThumb(hsColor) {
      let xyPosition = { x: 0, y: 0 };
      let hsvColor = '';
      hsColorSource.forEach((lineColors, lineIndex) => {
        lineColors.forEach((colors, index) => {
          if (hsColor.h === colors.h && hsColor.s / 10 === colors.s) {
            xyPosition = { x: index, y: lineIndex };
            hsvColor = hsv2rgb(colors.h, colors.s, colors.v);
          }
        });
      });
      const width = this.data.rectWidth / hsColorSource[0].length;
      const height = this.data.rectHeight / hsColorSource.length;
      if (hsvColor !== '') {
        this.setData({
          thumbPosition: {
            ...this.data.thumbPosition,
            left: `${(-this.data.thumbBorderWidth + width * xyPosition.x) * 2}rpx`,
            top: `${(-this.data.thumbBorderWidth + height * xyPosition.y) * 2}rpx`,
            right: 'auto',
            width: `${(width + this.data.thumbBorderWidth * 2) * 2}rpx`,
            backgroundColor: hsvColor,
            height: `${(height + this.data.thumbBorderWidth * 2) * 2}rpx`,
            borderWidth: `${this.data.thumbBorderWidth * 2}rpx`,
            borderColor: this.data.thumbBorderColor,
            borderRadius: `${this.data.thumbBorderRadius * 2}rpx`,
            borderStyle: 'solid',
          },
        });
        return;
      }
      this.setData({
        thumbPosition: {
          ...this.data.thumbPosition,
          height: 0,
          width: 0,
          borderStyle: 'none',
        },
      });
    },
  },
});
