English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-saturation-slider

> Lamp saturation Slider

## Installation

```sh
$ npm install @ray-js/components-ty-lamp
# or
$ yarn add @ray-js/components-ty-lamp
```

## Usage

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
   * @description.zh 滑动槽样式
   * @description.en
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.zh slider值
   * @description.en slider value
   * @default 0
   */
  value: number;
  /**
   * @description.zh slider 展示的颜色值 对应hsv的hue
   * @description.en slider value
   * @default 0
   */
  hue: number; // 0 - 359
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
  value: 0,
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
};
```

```tsx
import { LampSaturationSlider } from '@ray-js/components-ty-lamp';

export default () => {
  const [saturation, setSaturation] = useState(100);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      setSaturation(321);
    }, 3000);
  }, []);

  return (
    <LampSaturationSlider
      hue={100}
      value={saturation}
      onTouchEnd={val => {
        setSaturation(val);
      }}
    />
  );
};
```
