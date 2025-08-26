English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-percent-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-percent-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-percent-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-percent-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-percent-slider)

> Percent Slider

## Installation

```sh
$ npm install @ray-js/lamp-percent-slider
# or
$ yarn add @ray-js/lamp-percent-slider
```

## Usage

```tsx
import PercentSlider from '@ray-js/lamp-percent-slider';

const [value, onChange] = useState(30);

<PercentSlider value={value} onTouchEnd={onChange} />;
```
