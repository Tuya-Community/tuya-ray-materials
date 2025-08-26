/* eslint-disable no-param-reassign */
/*
 * @Author: mjh
 * @Date: 2025-06-03 10:39:13
 * @LastEditors: mjh
 * @LastEditTime: 2025-08-06 17:37:42
 * @Description:
 */

Component({
  relations: {
    '../drag-item/index': {
      type: 'child', // 指定子组件关系
      linked(_this) {
        // console.log(_this, '--linked');
        if (!this.data.isInit) return;
        setTimeout(() => {
          this.getChildRect();
        }, 100);
      },
      linkChanged(_this) {
        // console.log(_this, '--linkChanged');
      },
      unlinked(_this) {
        // console.log(_this, '--unlinked');
      },
    },
  },
  behaviors: [
    Behavior({
      // @ts-ignore
      created() {
        Object.defineProperty(this, 'children', {
          get: () => this.getRelationNodes('../drag-item/index') || [],
        });
      },
    }),
  ],
  properties: {
    list: {
      type: Array,
      value: [],
    },
    customStyle: {
      type: String,
      value: '',
    },
    dargStartDelay: {
      type: Number,
      value: 300,
    },
    activeClassName: {
      type: String,
      value: '',
    },
    midOffset: {
      type: null,
      value: 0,
    },
    bodyDrag: {
      type: Boolean,
      value: false,
    },
    className: {
      type: String,
      value: '',
    },
    multipleCol: {
      type: Boolean,
      value: false,
    },
    keyId: {
      type: String,
      value: '',
    },
  },
  data: {
    isInit: false,
  },
  lifetimes: {
    attached() {
      //
    },
    ready() {
      this.setData({
        isInit: true,
        fatherId: Math.random().toString(36).substring(2, 15) + new Date().getTime(),
      });
      this.getChildRect(this.data.list, true);
    },
  },
  observers: {
    'list.**': function (newList) {
      if (!this.data.isInit) return;
      setTimeout(() => {
        this.getChildRect(newList);
      }, 100);
    },
  },
  methods: {
    movingChangeSort(data) {
      const currChildren = this.children.find(child => child.id === data[this.data.keyId]);
      currChildren?.updateStyle(data.style);
    },
    moveStart() {
      this.triggerEvent('touchStart');
    },
    moveEnd(e) {
      setTimeout(() => {
        this.triggerEvent('handleSortEnd', [...e]);
      }, 100);
    },
    moveCanceled() {
      this.triggerEvent('handleSortEnd', false);
    },
    async getChildRect(newList = this.data.list, isReady) {
      if (!this.children.length) return;
      const { children } = this;
      const list = [...newList];
      // 通知子组件更新数据
      await Promise.all(
        list.map(async item => {
          const child = children.find(child => item[this.data.keyId] === child.id);
          const rect = await child?.getRect();
          if (!rect) return {};
          item.rect = {
            top: rect.top,
            bottom: rect.bottom,
            height: rect.bottom - rect.top,
            left: rect.left,
            right: rect.right,
            width: rect.right - rect.left,
            offsetY: 0,
            offsetX: 0,
          };
          return rect;
        })
      );
      this.children.forEach(child => {
        const data = {
          list,
          keyId: this.data.keyId,
          dargStartDelay: this.data.dargStartDelay,
          bodyDrag: this.data.bodyDrag,
          multipleCol: this.data.multipleCol,
          fatherId: this.data.fatherId,
        };
        child.updateData(data);
      });
    },
  },
});
