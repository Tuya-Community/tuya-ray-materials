English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-bright-slider

> Lighting Slider

## Installation

```sh
$ npm install @ray-js/lamp-bright-slider
# or
$ yarn add @ray-js/lamp-bright-slider
```

## Usage

```ts
// property
export interface IProps {
  /**
   * @description.zh Prohibit sliding
   * @description.en Ban sliding
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh The status of the slider when the light is turned off
   * @description.en The state of the slider when the light is off
   * @default false
   */
  closed?: boolean;
  /**
   * @description.zh Sliding slide style
   * @description.en Sliding groove style
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.zh Sliding block style
   * @description.en Sliding block style
   * @default {}
   */
  thumbStyle?: React.CSSProperties;
  /**
   * @description.zh Slider value
   * @description.en slider value
   * @default 0
   */
  value: number;
  /**
   * @description.zh slider Triggered when you click your finger
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh slider Triggered when the finger is dragged
   * @description.en slider Value changes
   * @default () => {}
   */
  onTouchMove?: (value: number) => void;
  /**
   * @description.zh slider Triggered when your fingers leave
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
    // Simulation DP report
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