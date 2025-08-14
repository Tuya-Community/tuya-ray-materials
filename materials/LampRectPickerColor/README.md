English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-rect-picker-color

> lamp-rect-picker-color

## install

```sh
$ npm install @ray-js/components-ty-lamp
// or
$ yarn add @ray-js/components-ty-lamp
```

## Preview

![预览](https://images.tuyacn.com/smart/ui_design_pkg_icon/non-session-user/16729908911f238a2fc43.png)

## Usage

- Props And Methods

```js
type HS = { h: number, s: number };
type Props = {
  hs: HS, // Rectangular plate color values [reference linking](https://baike.baidu.com/item/HSV/547122?fr=aladdin)
  thumbRadius?: number, // The width of the rectangle color plate of thumb
  rectWidth?: number, // The width of the rectangle color wheel
  rectHeight?: number, // The height of the rectangular color wheel
  colorTipStyle?: string, // The prompt style
  borderRadius?: number, // Fillet value， The priority is lower than border radius style
  borderRadiusStyle?: string, // eg: 12px 12px 0 0; Same as border radius style Settings in the browser
  isShowColorTip?: boolean, // Whether to show color copy
  closed?: boolean, // Off state
  onTouchStart?: (hs: HS) => void, // Rectangular color wheel touch the start of the callback function
  onTouchMove?: (hs: HS) => void, // Rectangular color wheel touch mobile callback function ⚠ ️ note: move trigger high frequency can add throttling to improve performance
  onTouchEnd?: (hs: HS) => void, // Rectangular color wheel touch the end of the callback function
};
```

```tsx
import { LampRectPickerColor } from '@ray-js/components-ty-lamp';

const Main = () => {
  const [hs, setHS] = useState({
    h: 0,
    s: 1000,
  });
  const [closed, setClosed] = useState(false);
  const handleTouchStart = e => {
    console.log(e, 'handleTouchStart');
  };
  const handleTouchMove = e => {
    console.log(e, 'handleTouchMove');
  };
  const handleTouchEnd = e => {
    console.log(e, 'handleTouchEnd');
  };
  return (
    <LampRectPickerColor
      hs={hs}
      borderRadius={16} // Set the priority of rounded corners to be lower than border radius style
      borderRadiusStyle="16rpx 16rpx 0 0"
      rectWidth={344}
      rectHeight={200}
      thumbRadius={12}
      isShowColorTip
      closed={closed}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};
```

```js
// Turns on the use event channel property, which can be used in other rjs components
Render({
  // other xxx
  renderChannel() {
    const eventChannelName = 'lampRectPickerColorEventChannel';
    this.instance.eventChannel.on(eventChannelName, e => {
      // Here you can receive the color data that is passed when the color changes
      const {
        rgba, // [r, g , b, a]
        touchType, // : 'start' | 'move' | 'end'
        pos,
      } = e;
      console.log('eventChannel get', e);
    });
  },
});
```
