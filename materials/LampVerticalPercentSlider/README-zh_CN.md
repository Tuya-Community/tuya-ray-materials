[English](./README.md) | 简体中文

# @ray-js/lamp-vertical-percent-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-vertical-percent-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-percent-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-vertical-percent-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-percent-slider)

> 照明竖向百分比滑动条

## 安装

```sh
$ npm install @ray-js/lamp-vertical-percent-slider
// 或者
$ yarn add @ray-js/lamp-vertical-percent-slider
```

## 使用

```tsx
import Foo from '@ray-js/lamp-vertical-percent-slider';
export default () => (
  <PercentSlider
    barColor="red"
    trackColor="blue"
    max={1000}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  />
);
```
