[English](./README.md) | 简体中文

# @ray-js/lamp-color-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-color-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-color-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-slider)

> 照明彩光 Slider

## 安装

```sh
$ npm install @ray-js/components-ty-lamp
// 或者
$ yarn add @ray-js/components-ty-lamp
```

## 使用

```ts
// 属性
export interface IProps {
  /**
   * @description.zh 滑动槽样式
   * @description.en Sliding groove style
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.zh 手指滑块样式
   * @description.en Fingers sliding block style
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
  value: 0,
  onTouchStart: () => null,
  onTouchMove: () => null,
  onTouchEnd: () => null,
};
```

```tsx
import { LampColorSlider } from '@ray-js/components-ty-lamp';

export default () => {
  const [hue, setHue] = useState(100);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      setHue(321);
    }, 3000);
  }, []);

  return (
    <LampColorSlider
      value={hue}
      disable
      onTouchMove={val => {
        setHue(val);
      }}
      onTouchEnd={val => {
        setHue(val);
      }}
    />
  );
};
```
