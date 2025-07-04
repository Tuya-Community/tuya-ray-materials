English | [简体中文](./README-zh_CN.md)

# @ray-js/components-ty-slider

[![latest](https://img.shields.io/npm/v/@ray-js/components-ty-slider/latest.svg)](https://www.npmjs.com/package/@ray-js/components-ty-slider) [![download](https://img.shields.io/npm/dt/@ray-js/components-ty-slider.svg)](https://www.npmjs.com/package/@ray-js/components-ty-slider)

> 涂鸦风格滑动条

## Installation

```sh
$ npm install @ray-js/components-ty-slider
# or
$ yarn add @ray-js/components-ty-slider
```

## Usage

### NormalSlider

```tsx
<Slider />
```

### NormalSlider Custom Style & Props

```tsx
<Slider
  step={25}
  isShowTicks
  maxTrackHeight="8px"
  maxTrackRadius="8px"
  minTrackHeight="8px"
  minTrackColor="linear-gradient(to right, #158CFB, orange)"
  maxTrackTickHeight="4px"
  maxTrackTickWidth="4px"
  maxTrackTickRadius="2px"
  minTrackTickHeight="4px"
  minTrackTickWidth="4px"
  minTrackTickRadius="2px"
/>
```

### NormalSlider showValue

```tsx
<View style={{ display: 'flex', alignItems: 'center' }}>
  <Slider value={value} onChange={onChange} maxTrackColor="orange" />
  <View style={{ marginLeft: '4px' }}>
    <Text>{value}</Text>
  </View>
</View>
```

### PrettoSlider

```tsx
<Slider
  maxTrackHeight="26px"
  maxTrackRadius="26px"
  minTrackHeight="22px"
  minTrackWidth="22px"
  thumbWidth="18px"
  thumbHeight="18px"
/>
```

### PrettoSlider Custom Style & Props

```tsx
<Slider
  maxTrackHeight="26px"
  maxTrackRadius="6px"
  minTrackHeight="22px"
  minTrackWidth="10px"
  thumbWidth="3px"
  thumbHeight="16px"
  thumbRadius="1.5px"
/>
```

### ScaleSlider

```tsx
<Slider
  isShowTicks
  step={25}
  maxTrackHeight="40px"
  maxTrackRadius="16px"
  minTrackWidth="40px"
  minTrackHeight="40px"
  thumbWidth="0px"
/>
```

### Vertical Slider

```tsx
// NormalSlider
<Slider
  isVertical
  maxTrackWidth="4px"
  maxTrackHeight="200px"
  minTrackWidth="4px"
  minTrackHeight="28px"
  style={{ marginRight: '30px' }}
/>
// PrettoSlider
<Slider
  isVertical
  maxTrackWidth="26px"
  maxTrackHeight="200px"
  maxTrackRadius="26px"
  minTrackWidth="22px"
  minTrackHeight="22px"
  thumbWidth="18px"
  thumbHeight="18px"
  style={{ marginRight: '30px' }}
/>
// ScaleSlider
<Slider
  isVertical
  isShowTicks
  step={25}
  maxTrackWidth="40px"
  maxTrackHeight="200px"
  maxTrackRadius="16px"
  minTrackWidth="40px"
  minTrackHeight="40px"
  thumbWidth="0px"
  maxTrackTickWidth="12px"
  maxTrackTickHeight="4px"
  minTrackTickWidth="12px"
  minTrackTickHeight="4px"
/>
```

### Prevent Page Scroll

If you need to prevent the page from scrolling, you can use ScrollView as the root node.

```tsx
const [value, setValue] = React.useState(0);
const [isScrollY, setIsScrollY] = React.useState(true);

const onChange = (event: number) => {
  setValue(event);
};
const onBeforeChange = () => {
  setIsScrollY(false);
};
const onAfterChange = () => {
  setIsScrollY(true);
};
<ScrollView className={{ width: '100%', height: '100vh' }} scrollY={isScrollY}>
  <Slider
    value={value}
    onChange={onChange}
    onBeforeChange={onBeforeChange}
    onAfterChange={onAfterChange}
  />
</ScrollView>;
```

### Sjs Slider

```tsx
import SjsSlider from '@ray-js/components-ty-slider/lib/slider';

<SjsSlider
  reverse
  direction="vertical"
  barPad={-4}
  step={1}
  end={value}
  bind:onChange={event => {
    setValue(event.detail.end);
    console.log('onChange', event.detail);
  }}
  bind:onEnd={event => {
    setValue(event.detail.end);
    console.log('onEnd', event.detail);
  }}
  bind:onStart={event => {
    setValue(event.detail.end);
    console.log('onStart', event.detail);
  }}
/>
```


### Frequently Asked Questions

When the slider is dragged, it stutters and shakes. Please check if it's written as an uncontrolled component. Try to use `onAfterChange` to update `value`. The recommended way to write it is as follows:

```tsx
export default () => {
  const [value, setValue] = useState(10) // onAfterChange Update after dragging ends
  const [showValue, setShowValue] = useState(10) // For real-time demonstration purposes only

  return (
    <>
      <View>Current value:{showValue}</View>
      <Slider
        value={value}
        onChange={(newValue) => {
          setShowValue(newValue)
        }}
        onAfterChange={setValue} // Triggered when the slider is released
      />
    </>
  )
}
```
