English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-circle-picker-color

> lamp-circle-picker-color

## Preview

<img width="200" style="width: 200px;" src="https://images.tuyacn.com/smart/ui_design_pkg_icon/non-session-user/166001761114a2dc2f8e2.png">

## install

```sh
$ npm install @ray-js/components-ty-lamp
// or
$ yarn add @ray-js/components-ty-lamp
```

## Usage

- Props And Methods

```js
type HS = {
  h: number, // 0 - 359
  s: number, // 0- 1000
};
type Props = {
  hs: HS, // Circle plate color values [reference linking](https://baike.baidu.com/item/HSV/547122?fr=aladdin)
  thumbRadius?: number, // The width of the circle color plate of thumb，Recommended range of 10 to 25
  radius?: number, // The radius of the circle color wheel
  whiteRange?: number, // Center of the white light rendering range ( 0.1-0.5)
  useEventChannel?: boolean // Whether to enable the event channel
  eventChannelName?: string; // Event channel name
  onTouchStart?: (hs: HS) => void, // circle color wheel touch the start of the callback function
  onTouchMove?: (hs: HS) => void, // circle color wheel touch mobile callback function ⚠ ️ note: move trigger high frequency can add throttling to improve performance
  onTouchEnd?: (hs: HS) => void, // circle color wheel touch the end of the callback function
};
```

```tsx
import { LampCirclePickerColor } from '@ray-js/components-ty-lamp';

const Main = () => {
  const [hs, setHS] = useState({ h: 36, s: 500 });

  useEffect(() => {
    setTimeout(() => {
      setHS({
        h: 100,
        s: 1000,
      });
    }, 1000);
  }, []);

  const handleTouchStart = (hsRes: HS) => {
    setHS(hsRes);
  };
  const handleTouchMove = (hsRes: HS) => {
    console.log(hsRes, 'handleTouchMove');
    // setHS(hsRes);
  };
  const handleTouchEnd = (hsRes: HS) => {
    // console.log(hsRes, 'handleTouchEnd');
    setHS(hsRes);
  };
  return (
    <LampCirclePickerColor
      hs={hs}
      thumbRadius={15}
      radius={140}
      whiteRange={0.15}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    />
  );
};
```

```js
// Turns on the use event channel property, which can be used in other rjs components
Render({
  // other xxx
  renderChannel() {
    const eventChannelName = 'lampCirclePickerColorEventChannel';
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
