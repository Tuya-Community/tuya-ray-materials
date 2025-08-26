/*
 * @Author: mjh
 * @Date: 2025-06-03 10:05:28
 * @LastEditors: mjh
 * @LastEditTime: 2025-08-19 18:23:14
 * @Description:
 */
/* eslint-disable no-undef */
import { getRect, styleTools } from './utils';
Component({
  relations: {
    '../drag/index': {
      type: 'parent', // 指定父组件关系
      linked(target) {
        // 可以从父组件处获取初始共享数据
        this.updateData(target.data.list);
      },
    },
  },
  behaviors: [
    Behavior({
      // @ts-ignore
      created() {
        Object.defineProperty(this, 'parent', {
          get: () => this.getRelationNodes('../drag/index')[0],
        });

        Object.defineProperty(this, 'index', {
          // @ts-ignore
          get: () => this.parent?.children?.indexOf(this),
        });
      },
    }),
  ],
  properties: {
    item: {
      type: Object,
      value: {},
    },
    instanceId: {
      type: String,
      value: '',
    },
    midOffset: {
      type: null,
      value: 0,
    },
  },
  lifetimes: {
    attached() {
      //
    },
  },
  data: {
    list: [],
    keyId: '',
    styleData: '',
    activeClassName: '',
    dargStartDelay: 0,
    bodyDrag: false,
    multipleCol: false,
    fatherId: '',
  },
  observers: {},
  methods: {
    async getRect() {
      const rect = await getRect(this, '.ray-drag-list-item');
      return rect;
    },
    async updateStyle(style) {
      const str = styleTools(style);
      this.setData({
        styleData: str,
      });
    },
    updateData(data) {
      this.setData({ ...data, styleData: '' });
    },
    handleTouchStart() {
      this.setData({
        activeClassName: this.parent?.data.activeClassName ?? '',
      });
      this.parent?.moveStart();
    },
    moveEnd(e) {
      const list = [...e];
      this.setData({
        list,
      });
      this.setData({
        activeClassName: '',
      });
      this.parent?.moveEnd(list);
    },
    moveCanceled() {
      this.triggerEvent('handleSortEnd', false);
    },
    movingChangeSort(data) {
      this.parent?.movingChangeSort(data);
    },
    handleVibrateShort(type) {
      ty.vibrateShort({
        type,
      });
    },
  },
});
