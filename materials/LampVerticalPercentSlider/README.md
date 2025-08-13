English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-vertical-percent-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-vertical-percent-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-percent-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-vertical-percent-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-vertical-percent-slider)

> Lighting vertical percentage sliding bar

## Installation

```sh
$ npm install @ray-js/lamp-vertical-percent-slider
# or
$ yarn add @ray-js/lamp-vertical-percent-slider
```

## Usage

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
