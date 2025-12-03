import Render from './index.rjs';
import { splitString, binaryToHex, getDeviceRealPx } from '@/utils';

const WIDTH = 353;

Component({
  properties: {
    width: {
      type: Number,
      value: WIDTH, // 画布宽度
    },
    height: {
      type: Number,
      value: WIDTH, // 画布高度
    },
    mode: {
      type: String,
      value: 'grid', // grid 按方格数显示长宽相同, pixel 按像素显示
    },
    gridSize: {
      type: Number,
      value: 32, // 每行每列格子数量
    },
    pixelSize: {
      type: Number,
      value: 10, // 格子大小
    },
    pixelGap: {
      type: Number,
      value: 1, // 格子间距
    },
    pixelShape: {
      type: String,
      value: 'rect', // 格子形状, rect方形, circle圆形
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
            this.render.updateColor(newValue);
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
    saveTick: {
      // 保存标记
      type: Number,
      value: 0,
      observer(newValue) {
        if (newValue && this.render) {
          this.render.save();
        }
      },
    },
    clearTrigger: {
      type: Number,
      value: 0,
      observer(newValue) {
        if (newValue && this.render) {
          this.render.clear();
        }
      },
    },
    needStroke: {
      // 是否需要每一画笔数据
      type: Boolean,
      value: false,
    },
  },
  data: {
    realWidth: WIDTH,
    realHeight: WIDTH,
  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      let { width, height, gridSize, pixelSize, pixelGap, mode } = this.data;
      width = getDeviceRealPx(width);
      height = getDeviceRealPx(height);
      pixelSize = getDeviceRealPx(pixelSize);
      pixelGap = getDeviceRealPx(pixelGap);
      let realPixelSize = pixelSize;
      if (mode === 'grid') {
        realPixelSize = Math.floor((width - pixelGap) / gridSize - pixelGap);
        const gridModeSize = (realPixelSize + pixelGap) * gridSize + pixelGap;
        this.setData({
          realWidth: gridModeSize,
          realHeight: gridModeSize,
        });
      } else {
        this.setData({
          realWidth: width,
          realHeight: height,
        });
      }
      this.render.initPanel({
        width: width,
        height: height,
        mode: this.data.mode,
        gridSize: gridSize,
        pixelSize: realPixelSize,
        pixelGap: pixelGap,
        pixelShape: this.data.pixelShape,
        pixelColor: this.data.pixelColor,
        penColor: this.data.penColor,
      });
    },
  },
  methods: {
    touchend(points) {
      if (!this.data.needStroke) return;
      if (this.data.actionType === 'paint') return;
      let minX = points[0].x;
      let minY = points[0].y;
      let maxX = points[0].x;
      let maxY = points[0].y;
      for (let i = 0; i < points.length; i++) {
        if (minX > points[i].x) minX = points[i].x;
        if (minY > points[i].y) minY = points[i].y;
        if (maxX < points[i].x) maxX = points[i].x;
        if (maxY < points[i].y) maxY = points[i].y;
      }
      const arr = [];
      const rowCount = maxX - minX + 1;
      for (let i = minY; i <= maxY; i++) {
        let row = '';
        for (let j = minX; j <= maxX; j++) {
          const point = points.find(item => item.x === j && item.y === i);
          if (point) {
            row += '1';
          } else {
            row += '0';
          }
        }
        row = row.padEnd(Math.ceil(rowCount / 8) * 8, '0');
        arr.push(...splitString(row));
      }
      const hexArr = [];
      arr.forEach(item => {
        hexArr.push(binaryToHex(item));
      });
      this.triggerEvent('smearChanged', { hexArr, minX, minY, maxX, maxY });
    },
    genImageData(res) {
      this.triggerEvent('getPixelData', res);
    },
  },
});
