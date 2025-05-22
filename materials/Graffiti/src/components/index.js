import Render from './index.rjs';
import { getSystemInfoSync } from '@ray-js/ray';

let _systemInfoResult = null;
export const getSystemInfoResult = () => {
  if (_systemInfoResult) {
    return _systemInfoResult;
  }
  try {
    const info = getSystemInfoSync();
    _systemInfoResult = info;
    return _systemInfoResult;
  } catch (err) {
    return {
      windowHeight: 667,
      windowWidth: 375,
      pixelRatio: 2,
    };
  }
};

// 获取真实的px
export const getDeviceRealPx = px => {
  const info = getSystemInfoResult();
  return Math.round(px * (info.windowWidth / 375));
};

const WIDTH = 353;
const HEIGHT = 353;

// eslint-disable-next-line no-undef
Component({
  properties: {
    canvasIdPrefix: {
      type: String,
      value: 'ray-graffiti', // canvas
    },
    width: {
      type: Number,
      value: WIDTH, // 画布宽度
    },
    height: {
      type: Number,
      value: HEIGHT, // 画布高度
    },
    mode: {
      type: String,
      value: 'grid', // grid 按方格数显示长宽相同, pixel 按像素显示
    },
    gridSizeX: {
      type: Number,
      value: 32, // 每行格子数量
    },
    gridSizeY: {
      type: Number,
      value: 32, // 每列格子数量
    },
    pixelSizeX: {
      type: Number,
      value: 10, // 格子宽度
    },
    pixelSizeY: {
      type: Number,
      value: 10, // 格子高度
    },
    pixelGap: {
      type: Number,
      value: 1, // 格子间距
    },
    pixelShape: {
      type: String,
      value: 'square', // 格子形状, square方形, circle圆形
    },
    pixelColor: {
      type: String,
      value: 'rgba(255, 255, 255, 0.15)', // 格子颜色
    },
    penColor: {
      // 画笔颜色
      type: String,
      value: 'rgb(255, 255, 255)',
      observer(newValue) {
        if (newValue && this.render) {
          if (this.data.actionType === 'pencil') {
            this.render.updateColor(newValue);
          } else if (this.data.actionType === 'paint') {
            this.render.changeBg(newValue);
          }
        }
      },
    },
    actionType: {
      // 操作类型 pencil画笔, eraser橡皮擦, paint油漆桶
      type: String,
      value: 'pencil',
      observer(newValue) {
        if (newValue && this.render) {
          if (newValue === 'eraser') {
            this.render.updateColor(this.data.pixelColor);
          } else if (newValue === 'pencil') {
            this.render.updateColor(this.data.penColor);
          } else if (newValue === 'paint') {
            this.render.changeBg(this.data.penColor);
          }
        }
      },
    },
    needStroke: {
      // 是否需要每一画笔数据
      type: Boolean,
      value: false,
    },
    saveTrigger: {
      // 保存标识
      type: Number,
      value: 0,
      observer(newValue) {
        if (newValue && this.render) {
          this.render.save();
        }
      },
    },
    clearTrigger: {
      // 清空标识
      type: Number,
      value: 0,
      observer(newValue) {
        if (newValue && this.render) {
          this.render.clear();
        }
      },
    },
  },
  data: {
    realWidth: WIDTH,
    realHeight: HEIGHT,
  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      let {
        canvasIdPrefix,
        width,
        height,
        gridSizeX,
        gridSizeY,
        pixelSizeX,
        pixelSizeY,
        pixelGap,
        mode,
      } = this.data;
      width = getDeviceRealPx(width);
      height = getDeviceRealPx(height);
      pixelSizeX = getDeviceRealPx(pixelSizeX);
      pixelSizeY = getDeviceRealPx(pixelSizeY);
      pixelGap = getDeviceRealPx(pixelGap);
      let realPixelSizeX = pixelSizeX;
      let realPixelSizeY = pixelSizeY;
      if (mode === 'grid') {
        realPixelSizeX = Math.floor((width - pixelGap) / gridSizeX - pixelGap);
        const gridModeSizeX = (realPixelSizeX + pixelGap) * gridSizeX + pixelGap;

        realPixelSizeY = Math.floor((height - pixelGap) / gridSizeY - pixelGap);
        const gridModeSizeY = (realPixelSizeY + pixelGap) * gridSizeY + pixelGap;
        this.setData({
          realWidth: gridModeSizeX,
          realHeight: gridModeSizeY,
        });
      } else {
        this.setData({
          realWidth: width,
          realHeight: height,
        });
      }
      this.render.initPanel({
        canvasIdPrefix: canvasIdPrefix,
        width: width,
        height: height,
        mode: this.data.mode,
        gridSizeX: gridSizeX,
        gridSizeY: gridSizeY,
        pixelSizeX: realPixelSizeX,
        pixelSizeY: realPixelSizeY,
        pixelGap: pixelGap,
        pixelShape: this.data.pixelShape,
        pixelColor: this.data.pixelColor,
        penColor: this.data.penColor,
      });
    },
  },
  methods: {
    touchend(data) {
      if (!this.data.needStroke) return;
      if (this.data.actionType === 'paint') return;
      this.triggerEvent('strokeChange', data);
    },
    genImageData(data) {
      this.triggerEvent('saveData', data);
    },
  },
});
