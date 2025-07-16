English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-circle-picker-white

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-circle-picker-white/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-circle-picker-white) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-circle-picker-white.svg)](https://www.npmjs.com/package/@ray-js/lamp-circle-picker-white)

> LampCirclePickerWhite

## Installation

```sh
$ npm install @ray-js/components-ty-lamp
// or
$ yarn add @ray-js/components-ty-lamp
```

## Usage

```tsx
import { LampCirclePickerWhite } from '@ray-js/components-ty-lamp';

const [temp, setTemp] = useState(100);

<LampCirclePickerColor
  thumbRadius={15}
  temperature={temp}
  radius={100}
  onTouchStart={setTemp}
  onTouchEnd={setTemp}
  canvasId="white_picker_1"
/>;
```
