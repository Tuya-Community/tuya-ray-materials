/*
 * @Author: mjh
 * @Date: 2024-12-31 17:48:21
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-03 09:41:07
 * @Description:
 */
/* eslint-disable no-undef */
import Render from './index.rjs';

Component({
  properties: {
    canvasId: {
      type: String,
      value: 'image-color-picking-canvas',
    },
    path: {
      type: String,
      value: '', // 图片路径
    },
    base64: {
      type: String,
      value: '',
    },
    pickNum: {
      type: Number,
      value: 5,
    },
    isPrimary: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    prePath: '',
    preBase64: '',
    isReady: false,
    callback: () => {},
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
    },
    ready() {
      if (!this.render) {
        this.render = new Render(this);
      }
      this.isReady = true;
      this.getImgBase64(this.data.path);
      this.prePath = this.data.path;
      this.preBase64 = this.data.base64;
    },
  },
  observers: {
    path(res) {
      // canvas元素加载完成后再渲染
      if (!this.isReady || this.prePath === res || !res) {
        return;
      }
      this.getImgBase64(this.data.path);
      this.prePath = this.data.path;
    },
    base64(res) {
      // canvas元素加载完成后再渲染
      if (!this.isReady || !res || this.preBase64 === res) {
        return;
      }
      const { canvasId } = this.data;
      this.render.renderLight({
        src: res,
        canvasId,
        pickNum: this.data.pickNum,
        isPrimary: this.data.isPrimary,
      });
      this.preBase64 = res;
    },
  },
  methods: {
    getImgBase64(path) {
      if (!path) return;
      const { canvasId, pickNum, isPrimary } = this.data;
      const manager = ty.getFileSystemManager();
      manager.readFile({
        filePath: path,
        encoding: 'base64',
        success: res => {
          const base64 = `data:image/${path.split('.').slice(-1)[0]};base64,${res.data}`;
          this.render.renderLight({
            src: base64,
            canvasId,
            pickNum,
            isPrimary,
          });
        },
        fail: error => {
          console.log(error);
        },
      });
    },
    getColors(res) {
      this.triggerEvent('getColors', res);
      const { callback } = this.data;
      if (callback) {
        callback(res);
      }
    },
  },
});
