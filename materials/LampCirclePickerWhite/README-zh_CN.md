[English](./README.md) | 简体中文

# @ray-js/lamp-circle-picker-white

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-circle-picker-white/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-circle-picker-white) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-circle-picker-white.svg)](https://www.npmjs.com/package/@ray-js/lamp-circle-picker-white)

> 照明圆形白光色盘组件

## 安装

```sh
$ npm install @ray-js/components-ty-lamp
// 或者
$ yarn add @ray-js/components-ty-lamp
```

## 使用

```tsx
import { LampCirclePickerWhite } from '@ray-js/components-ty-lamp';

const [temp, setTemp] = useState(100);

<LampCirclePickerWhite
  thumbRadius={15}
  temperature={temp}
  radius={150}
  onTouchStart={setTemp}
  onTouchEnd={setTemp}
  canvasId="white_picker_1"
/>;
```
