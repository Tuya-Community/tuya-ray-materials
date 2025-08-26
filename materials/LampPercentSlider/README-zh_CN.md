[English](./README.md) | 简体中文

# @ray-js/lamp-percent-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-percent-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-percent-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-percent-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-percent-slider)

> 百分比滑动条

## 安装

```sh
$ npm install @ray-js/lamp-percent-slider
// 或者
$ yarn add @ray-js/lamp-percent-slider
```

## 使用

```tsx
import PercentSlider from '@ray-js/lamp-percent-slider';

const [value, onChange] = useState(30);

<PercentSlider value={value} onTouchEnd={onChange} />;
```
