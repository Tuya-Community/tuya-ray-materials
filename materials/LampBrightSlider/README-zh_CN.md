[English](./README.md) | 简体中文

# @ray-js/lamp-bright-slider

> 照明亮度 Slider

## 安装

```sh
$ npm install @ray-js/lamp-bright-slider
// 或者
$ yarn add @ray-js/lamp-bright-slider
```

## 使用

```ts
// 属性
export interface IProps {
  /**
   * @description.zh 禁止滑动
   * @description.en Ban sliding
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh 灯关闭时 slider的状态
   * @description.en The state of the slider when the light is off
   * @default false
   */
  closed?: boolean;
  /**
   * @description.zh 滑动槽样式
   * @description.en
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.zh 滑动块样式
   * @description.en Sliding block style
   * @default {}
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.zh slider值
   * @description.en slider value
   * @default 0
   */
  value: number;
  /**
   * @description.zh slider 手指点击时触发
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh slider 手指拖动时触发
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchMove?: (value: number) => void;
  /**
   * @description.zh slider 手指离开时触发
   * @description.en Values change after the trigger
   * @default () => {}
   */
  onTouchEnd?: (value: number) => void;
}

export const defaultProps: IProps = {
  value: 1,
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
};
```

```tsx
import { View, Text } from '@ray-js/components';
import React, { useState, useEffect } from 'react';
import { LampBrightSlider } from '@ray-js/components-ty-lamp';

export default () => {
  const [bright, setBright] = useState(100);
  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      setBright(890);
    }, 1000);
  }, []);
  return (
    <LampBrightSlider
      value={bright}
      onTouchEnd={val => {
        setBright(val);
      }}
    />
  );
};
```
