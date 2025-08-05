English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-color-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-color-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-color-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-color-slider)

> Lighting Color Light Slider

## Installation

```sh
$ npm install @ray-js/components-ty-lamp
# or
$ yarn add @ray-js/components-ty-lamp
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
   * @description.zh Sliding slide style
   * @description.en Sliding groove style
   * @default {}
   */
  trackStyle?: React.CSSProperties;
  /**
   * @description.zh Finger slider style
   * @description.en Fingers sliding block style
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
    // Simulation DP report
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
