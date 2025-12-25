/*
 * @Author: mjh
 * @Date: 2024-09-14 13:55:50
 * @LastEditors: mjh
 * @LastEditTime: 2024-10-12 09:37:57
 * @Description:
 */

import './index.tyss';
import { createSelectorQuery } from '@ray-js/ray';
import Res from '../../../res';
const curtainImage = Res.point_bg;
const pointColor = Res.point_color;
import { rgb2hsv, hsv2rgb } from './utils';
import { utils } from '@ray-js/panel-sdk';
const { brightKelvin2rgb } = utils;

// 仅需要获取一次即可
const positionCache = {};

// eslint-disable-next-line no-undef
Component({
  properties: {
    mode: {
      type: Number,
      observer() {
        this.modeCheckSelect();
      },
    },
    initWait: {
      type: Number,
    },
    length: {
      type: Number,
    },
    maxSelect: {
      type: Number,
      value: 20,
    },
    contentStyle: {
      type: String,
      value: '',
    },
    className: {
      type: String,
      value: '',
    },
    bright: {
      type: Number,
      value: 100,
    },
    rpx2px: {
      type: Number,
      value: 100,
    },
    lightColorMaps: {
      type: Object,
      value: {},
      observer(newValue, oldValue) {
        if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
        this.setData(
          {
            mapLight: this.transMapList(newValue),
          },
          () => {
            // 不需要灯珠位置了
            // if (newValue.length !== oldValue.length) {
            //   this.getPointPositionDelay();
            // }
          }
        );
      },
    },
    selectList: {
      type: Array,
      value: [],
      observer(newValue, oldValue) {
        if (this.touching || JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
        const selectMap = newValue.reduce((pre, cur) => {
          pre[cur] = true;
          return pre;
        }, {});
        this.setData({
          selectMap,
        });
      },
    },
    eventChannelName: {
      type: String,
      value: '',
    },
    eventSliderMoveName: {
      type: String,
      value: '',
    },
    instanceId: {
      type: String,
      value: '',
    },
    scrollTop: {
      type: Number,
      value: 0,
    },
  },
  data: {
    mapLight: [],
    positionList: [],
    selectMap: {},
    pointColor,
    curtainImage,
  },
  lifetimes: {
    ready() {
      this.modeCheckSelect();
      this.getPointPositionDelay();
    },
  },
  methods: {
    getPointPositionDelay() {
      clearTimeout(this._delayGetPositionId);
      this._delayGetPositionId = setTimeout(() => {
        this.getContainerPosition();
      }, this.data.initWait);
    },
    getContainerPosition() {
      // 获取容器得位置
      createSelectorQuery()
        .select(`#${this.data.instanceId}`)
        .boundingClientRect(rect => {
          this.containerPosition = {
            top: rect.top + this.data.scrollTop,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          };
        })
        .exec();
    },
    async getPointPosition() {
      if (positionCache[this.data.length]) {
        this.setData({
          positionList: positionCache[this.data.length],
        });
        return;
      }
      const positionList = await Promise.all(
        new Array(this.data.length).fill('').map((_, index) => {
          return this.getDomRect(index);
        })
      );
      positionCache[this.data.length] = positionList;
      this.setData({
        positionList,
      });
    },
    getDomRect(index) {
      return new Promise(resolve => {
        createSelectorQuery()
          .select(`#smear-point-item-index${this.data.instanceId}${index}`)
          .boundingClientRect(rect => {
            resolve({
              ...rect,
              // 注意这里要算上 scrollTop
              top: rect.top + this.data.scrollTop,
              bottom: rect.bottom + this.data.scrollTop,
              id: index,
            });
          })
          .exec();
      });
    },
    transMapList(value) {
      // const keys = new Array(this.data.length).fill('').map((_, index) => index);
      // const lastData = value[Object.keys(value).length - 1];
      // const list = [];
      // keys.forEach((key, index) => {
      //   const listIndex = Math.floor(index / 6);
      //   const isRight = listIndex % 2 === 0;
      //   const isLineLast = !((index + 1) % 6);
      //   const item = {
      //     index,
      //     color: value[key] || lastData,
      //     direction: isLineLast ? 'bottom' : isRight ? 'right' : 'left',
      //   };
      //   if (!list[listIndex]) {
      //     list[listIndex] = {
      //       id: listIndex,
      //       list: [],
      //     };
      //   }
      //   const isAllLast = this.data.length - 1 === index;
      //   if (isAllLast) {
      //     item.direction = '';
      //   }
      //   list[listIndex].list.push(item);
      // });
      // return list;

      // 一行 有 6 个 灯珠
      // 可视范围最多显示 4行
      const visibleRow = 4;
      // 上下可加 1 行缓存
      const cacheRow = 1;
      const rowCount = 6;

      const offset = (this._offset || 0) / this.data.rpx2px;

      // 最多行数
      const maxRow = Math.ceil(this.data.length / rowCount);

      const len = this.data.length;
      const list = [];

      // 起始点
      const startY = 0;

      // 每一行的高度
      const rowHeight = 104;

      // 当前可视范围内的 起始行
      let startRow = Math.floor((offset - startY) / rowHeight);
      // 向上 添加缓冲
      startRow = Math.max(0, startRow - cacheRow);

      // 当前可视范围内的 结束行
      const endRow = Math.min(maxRow - 1, startRow + visibleRow + cacheRow);

      for (let listIndex = startRow; listIndex <= endRow; listIndex++) {
        const isRight = listIndex % 2 === 0;
        const rowItem = {
          id: listIndex,
          y: listIndex * rowHeight,
          list: [],
        };

        list[listIndex] = rowItem;

        for (let i = 0; i < 6; i++) {
          // 灯珠编号
          const index = listIndex * rowCount + i;
          if (index >= len) break;
          const isLineLast = !((index + 1) % 6);
          const item = {
            index,
            color: value[index] || value[len - 1],
            direction: isLineLast ? 'bottom' : isRight ? 'right' : 'left',
          };
          const isAllLast = len - 1 === index;
          if (isAllLast) {
            item.direction = '';
          }
          rowItem.list.push(item);
        }
      }

      return list;
    },
    modeCheckSelect() {
      const { mode, length, selectList } = this.data;
      if (mode === 0 && selectList.length !== length) {
        this.triggerEvent(
          'selectchange',
          new Array(length).fill('').map((_, index) => index)
        );
      } else if (mode === 1 && selectList.length !== 0) {
        // 单选时，取消所有选择
        this.triggerEvent('selectchange', []);
      }
    },
    selectChange(pageX, pageY) {
      const id = this.getTouchPoint(pageX, pageY);
      this.touching = true;
      // console.log('get touch point', id, pageX, pageY, this.data.positionList);
      if (id === null || id === undefined || this.data.mode === 0) return;
      const mapList = { ...this.data.selectMap };
      if (this.preId !== id && !mapList[id]) {
        this.preId = id;

        // 不需要，没有选择上限
        if (Object.keys(mapList).filter(key => mapList[key]).length >= this.data.maxSelect) {
          this.triggerEvent('selectmaxchange');
          return;
        }
        mapList[id] = true;
        this.setData({
          selectMap: mapList,
        });
      }
      if (this.preId !== id && mapList[id]) {
        mapList[id] = false;
        this.setData({
          selectMap: mapList,
        });
      }
      this.preId = id;
    },
    selectChangeEnd() {
      this.touching = false;
      this.preId = undefined;
      const keys = Object.keys(this.data.selectMap);
      const selectList = keys.filter(key => this.data.selectMap[key]).map(Number);
      this.triggerEvent('selectchange', selectList);
    },
    getTouchPointLess6(pageX, pageY) {
      const { top, left, width } = this.containerPosition;

      const len = this.data.length;
      const y = (pageY + this.data.scrollTop + (this._offset || 0) - top) / this.data.rpx2px;

      if (y > 60) return;

      const x = (pageX - left) / this.data.rpx2px;

      // 灯珠居中显示
      const ballSize = 60;
      const margin = 44;

      const totalWidth = 60 * len + margin * (len - 1);

      // 计算起始位置
      const startX = (width / this.data.rpx2px - totalWidth) / 2;

      if (x < startX || x > startX + totalWidth) return;

      const dx = x - startX;

      // 计算在哪一列
      const index = Math.floor(dx / (ballSize + margin));

      // 点击在间距范围了
      if (dx > index * (ballSize + margin) + ballSize) return;

      return index;
    },
    getTouchPointMore6(pageX, pageY) {
      const { top, left, width } = this.containerPosition;
      const y = (pageY + this.data.scrollTop + (this._offset || 0) - top) / this.data.rpx2px;
      let x = (pageX - left) / this.data.rpx2px;

      // 计算在哪一列
      const row = Math.floor(y / 104);

      // 在 row * 104 到 row * 104 + 60 之间
      if (y > row * 104 + 60) return null;

      if (row % 2 === 1) {
        // 注意如果是偶数列，则是自右向左
        // 所以转化为 距离父容器右边的距离
        x = width / this.data.rpx2px - x;
      }

      // 计算在哪一列
      const col = Math.floor(x / 104);

      // 判断在灯珠范围内
      if (x > col * 104 + 60) return null;

      const id = row * 6 + col;

      return id;
    },
    getTouchPoint(pageX, pageY) {
      if (!this.containerPosition) return;

      if (this.data.length < 6) {
        return this.getTouchPointLess6(pageX, pageY);
      }
      return this.getTouchPointMore6(pageX, pageY);
      // const touchPoint = this.data.positionList.find(item => {
      //   const { top, right, bottom, left } = item;
      //   // 补上首页的滚动距离
      //   if (pageX >= left && pageX <= right && y >= top && y <= bottom) return true;
      //   return false;
      // });
      // // console.log('get touch point', pageX, pageY, y, touchPoint?.id);
      // return touchPoint?.id;
    },
    eventChannelChange(res) {
      if (this.mode === 2) return;
      const { instanceId, rgba, value } = res;
      if (rgba) {
        const hsv = rgb2hsv(`rgba(${rgba.join(',')})`);
        const color = `rgb(${hsv2rgb(...hsv.slice(0, 2), this.data.bright).join(',')})`;
        const data = this.data.mapLight.map(item => {
          return {
            id: item.id,
            list: item.list.map(itemData => {
              return {
                ...itemData,
                color: this.data.selectList.includes(itemData.index) ? color : itemData.color,
              };
            }),
          };
        });
        this.setData({
          mapLight: data,
        });
        this.triggerEvent('channel', {
          type: 'rgba',
          data: data,
          value: rgba,
        });
      } else if (typeof value === 'number' && instanceId === 'value') {
        const data = this.data.mapLight.map(item => {
          return {
            id: item.id,
            list: item.list.map(itemData => {
              const hsv = rgb2hsv(itemData.color);
              const color = `rgb(${hsv2rgb(...hsv.slice(0, 2), value).join(',')})`;
              return {
                ...itemData,
                color: this.data.selectList.includes(itemData.index) ? color : itemData.color,
              };
            }),
          };
        });
        this.setData({
          mapLight: data,
        });
        this.triggerEvent('channel', {
          type: 'value',
          data: data,
          value,
        });
      } else if (typeof value === 'number' && instanceId === 'temp') {
        const rgb = brightKelvin2rgb(this.data.bright * 10, value);
        const data = this.data.mapLight.map(item => {
          return {
            id: item.id,
            list: item.list.map(itemData => {
              return {
                ...itemData,
                color: this.data.selectList.includes(itemData.index) ? rgb : itemData.color,
              };
            }),
          };
        });
        this.setData({
          mapLight: data,
        });
        this.triggerEvent('channel', {
          type: 'temp',
          data: data,
          value,
        });
      }
    },
    eventSliderMove(res) {
      // 更新当前滑动距离
      this._offset = this.data.rpx2px * res;
      const list = this.transMapList(this.data.lightColorMaps);
      this.setData({
        mapLight: list,
      });
    },
  },
});
