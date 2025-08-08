English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-vertical-touch-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-vertical-touch-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-touch-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-vertical-touch-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-touch-slider)

> 照明竖向触摸滑动条

## Installation

```sh
$ npm install @ray-js/lamp-vertical-touch-slider
# or
$ yarn add @ray-js/lamp-vertical-touch-slider
```

## Usage

```tsx
import LampTouchSlider from '@ray-js/lamp-vertical-touch-slider';

const [value1, setValue1] = useState(82);

<LampTouchSlider value={value1} onTouchEnd={setValue1} />;
```
