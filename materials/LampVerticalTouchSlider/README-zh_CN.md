[English](./README.md) | 简体中文

# @ray-js/lamp-vertical-touch-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-vertical-touch-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-touch-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-vertical-touch-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-touch-slider)

> 照明竖向触摸滑动条

## 安装

```sh
$ npm install @ray-js/lamp-vertical-touch-slider
// 或者
$ yarn add @ray-js/lamp-vertical-touch-slider
```

## 使用

```tsx
import LampTouchSlider from '@ray-js/lamp-vertical-touch-slider';

const [value1, setValue1] = useState(82);

<LampTouchSlider value={value1} onTouchEnd={setValue1} />;
```
