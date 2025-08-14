English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-color-card

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-color-card/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-card) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-color-card.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-card)

> LampColorCard

## Installation

```sh
$ npm install @ray-js/components-ty-lamp
# or
$ yarn add @ray-js/components-ty-lamp
```

## Usage

```tsx
interface IProps {
  /**
   * @description.zh hs颜色
   * @description.en HS color
   * @default {h:0,s:1000}
   */
  hs?: { h: number; s: number };

  /**
   * @description.zh 彩光色卡宽度
   * @description.en Color card width
   * @default 319
   */
  rectWidth?: number;
  /**
   * @description.zh 彩光色卡高度
   * @description.en Color card height
   * @default 133
   */
  rectHeight?: number;
  /**
   * @description.zh 选中按钮边框宽度
   * @description.en Select button border width
   * @default 2
   */
  thumbBorderWidth?: number;
  /**
   * @description.zh 选中按钮圆角
   * @description.en Select the button rounded corner
   * @default 4
   */
  thumbBorderRadius?: number;
  /**
   * @description.zh 选中按钮边框颜色
   * @description.en Select button border color
   * @default '#fff'
   */
  thumbBorderColor?: string;
  /**
   * @description.zh 点击结束事件
   * @description.en Click on the end event
   * callback function
   * @default '''
   */
  onTouchEnd?: (e: { h: number; s: number }) => void;
  /**
   * @description.zh 彩光色卡样式
   * @description.en Color card style
   * @default '''
   */
  rectStyle?: any;
  /**
   * @description.zh 容器样式
   * @description.en Container style
   * @default '''
   */
  containerStyle?: any;
}
```

```tsx
import { LampColorCard } from '@ray-js/components-ty-lamp';
export default () => {
  const [hsColor, setHsColor] = React.useState({ h: 0, s: 1000 });
  const handleEnd = (e: { h: number; s: number }) => {
    setHsColor(e);
  };

  return (
    <LampColorCard
      hs={hsColor}
      thumbBorderWidth={2}
      thumbBorderColor="#fff"
      thumbBorderRadius={4}
      onTouchEnd={handleEnd}
    />
  );
};
```
