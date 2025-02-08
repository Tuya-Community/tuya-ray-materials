/*
 * @Author: mjh
 * @Date: 2024-09-02 11:42:04
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-16 17:37:37
 * @Description:
 */
import Render from './index.rjs';
// eslint-disable-next-line no-undef
Component({
  properties: {
    /** {
      scale: Number,
      mode: String,
      ready: Boolean,
      colors: Array,
      canvasId: String,
      contentValue: Object,
      containerStyle: String,
      canvasStyle: String,
      closeColor: String
    } */
    prop: Object,
  },
  data() {
    return {
      pre: {},
      isReady: false,
    };
  },
  lifetimes: {
    attached() {
      this.render = new Render(this);
    },
    ready() {
      if (!this.render) {
        this.render = new Render(this);
      }
      this.pre = this.data.prop;
      this.render.renderLight(this.data.prop);
      this.isReady = true;
    },
    detached() {
      this.render.stopLight();
    },
  },
  observers: {
    prop(res) {
      // canvas元素加载完成后再渲染
      if (!this.isReady || JSON.stringify(res) === JSON.stringify(this.pre || {})) {
        return;
      }
      this.render.renderLight(res);
      this.pre = res;
    },
  },
  methods: {},
});
