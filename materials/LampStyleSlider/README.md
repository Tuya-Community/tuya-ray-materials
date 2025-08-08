English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-style-slider

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-style-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-style-slider) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-style-slider.svg)](https://www.npmjs.com/package/@ray-js/lamp-style-slider)

> Basic sliding bars of lighting styles

## Installation

```sh
$ npm install @ray-js/lamp-style-slider
# or
$ yarn add @ray-js/lamp-style-slider
```

## Usage

### 1. Color temperature slider

```tsx
import OpacitySlider from '@ray-js/lamp-style-slider';

const [value, setValue] = useState(1000);
const handleMove = v => {
  // console.log('move====', v);
};

<OpacitySlider
  style={{
    paddingLeft: 16,
  }}
  label="色温"
  valueStyle={{ color: 'blue' }}
  disable={false}
  value={value}
  onTouchMove={handleMove}
  trackBackgroundColor="linear-gradient(270deg, #CDECFE 1.22%, #FFFFFF 45.36%, #FFFFFF 53.27%, #FFCA5C 98.32%)"
/>
```

### 2. Brightness slider

```tsx
import OpacitySlider from '@ray-js/lamp-style-slider';

const [value, setValue] = useState(1000);
const handleMove = v => {
  // console.log('move====', v);
};

<OpacitySlider
  style={{
    paddingLeft: 16,
  }}
  label="亮度"
  valueStyle={{ color: 'blue' }}
  min={1}
  disable={false}
  value={value}
  onTouchMove={handleMove}
  trackBackgroundColor="linear-gradient(270deg, #FFFFFF 2.57%, rgba(255, 255, 255, 0) 100.64%)"
  thumbColorFormatterConfig={{
    formatter: 'hsl(0deg 0% value%)',
    scale: 0.1,
  }}
/>
```

### 3. Hue slider

```tsx
import OpacitySlider from '@ray-js/lamp-style-slider';

const [value, setValue] = useState(1000);
const handleMove = v => {
  // console.log('move====', v);
};

<OpacitySlider
  style={{
    paddingLeft: 16,
  }}
  label="hue"
  valueStyle={{ color: 'blue' }}
  trackStyle={{ height: '100rpx' }}
  thumbStyle={{
    height: '100rpx',
    borderRadius: '20rpx',
    width: '40rpx',
    boxShadow: 'rgb(0 0 0 / 53%) 0px 1px 7px',
  }}
  min={0}
  max={360}
  disable={false}
  value={value}
  onTouchMove={handleMove}
  trackBackgroundColor="linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), linear-gradient(90.01deg, #FF0000 0.01%, #F8CB0E 12.14%, #80FE06 21.83%, #08FB2B 32.75%, #04FAFC 46.38%, #0243FC 58.38%, #8700F9 70.04%, #FC00EF 80.06%, #F00A5B 89.92%, #FF0000 99.99%)"
  thumbColorFormatterConfig={{
    formatter: 'hsl(valuedeg 100% 50%)',
  }}
/>
```
### 4. Saturation slider

```tsx
import OpacitySlider from '@ray-js/lamp-style-slider';

const [value, setValue] = useState(1000);
const handleMove = v => {
  // console.log('move====', v);
};

<OpacitySlider
  style={{
    paddingLeft: 16,
  }}
  label="saturation"
  valueStyle={{ color: 'blue' }}
  min={0}
  max={100}
  disable={false}
  value={value}
  onTouchMove={handleMove}
  trackBackgroundColor={`linear-gradient(90deg, rgba(255, 255, 255, 0), ${hsv2rgbString(
    0,
    100,
    100
  )})`}
  thumbColorFormatterConfig={{
    formatter: 'hsl(0deg 100% value%)',
    scale: 0.5,
  }}
/>
```