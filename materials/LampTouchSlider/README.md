English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-touch-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-touch-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-touch-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-touch-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-touch-slider)

> 照明触摸滑动条

## Installation

```sh
$ npm install @ray-js/lamp-touch-slider
# or
$ yarn add @ray-js/lamp-touch-slider
```

## Usage

```tsx
import TouchSlider from '@ray-js/lamp-touch-slider';

const [value1, setValue1] = useState(82);

<TouchSlider value={value1} onTouchEnd={setValue1} />;
```
