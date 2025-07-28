English | [简体中文](./README-zh_CN.md)

# @ray-js/lamp-circle-picker

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-circle-picker/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-circle-picker) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-circle-picker.svg)](https://www.npmjs.com/package/@ray-js/lamp-circle-picker)

> LampCirclePicker

## Preview

![avatar](https://images.tuyacn.com/smart/ui_design_pkg_icon/non-session-user/1667468836c2ddbd9815e.png)

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
   * @description.zh 默认数值 色温值
   * @description.en default value
   * @default
   */
  value: number;
  /**
   * @description.zh 色盘渐变颜色列表
   * @description.en Color plate gradient color list
   */
  colorList?: {
    offset: number;
    color: string;
  }[];
  /**
   * @description.zh 内部色环宽度
   * @description.en The width of inner color ring
   * @default 80
   */
  innerRingRadius?: number;
  /**
   * @description.zh 色盘宽度
   * @description.en The width of color ring
   * @default 140
   */
  radius?: number;
  /**
   * @description.zh 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题
   * @description.en Note ⚠️ : The base library version is greater than 2.18.0， Whether to enable event channels to optimize the performance of data transfer between rjs when multiple rjs components are used simultaneously
   * @default false
   */
  useEventChannel?: boolean;

  /**
   * @description.zh 事件通道名称
   * @description.en Event channel name
   * @default 'lampCirclePickerEventChannel'
   */
  eventChannelName?: string;

  /**
   * @description.en showInnerCircle
   * @description.zh 展示数值圆环
   * @default true
   */
  showInnerCircle?: boolean;
  /**
   * @description.en descText
   * @description.zh 色环内部文字
   * @default null
   */
  descText?: string;
  /**
   * @description.en innerBorderStyle
   * @description.zh 内部圆环描边
   * @default null
   */
  innerBorderStyle?: {
    color: string;
    width: number;
  };

  /**
   * @description.en touchCircleStrokeStyle
   * @description.zh 触摸圆环描边颜色与 ctx.shadowColor 值相同
   * @default ''
   */
  touchCircleStrokeStyle?: string;
  /**
   * @description.en touchCircleLineWidth
   * @description.zh 触摸圆环描边宽度与 ctx.shadowBlur 值相同
   * @default 0
   */
  touchCircleLineWidth?: number;
  /**
   * @description.zh 手指按下时的回调函数
   * @description.en Finger press when the callback function
   * @default ''
   */
  onTouchStart?: (value: number) => void;
  /**
   * @description.zh 手指按下拖动时的回调函数
   * @description.en Finger to press the drag of the callback function
   * @default ''
   */
  onTouchMove?: (value: number) => void;
  /**
   * @description.zh 手指按下结束时的回调函数
   * @description.en Finger press at the end of the callback function
   * @default ''
   */
  onTouchEnd?: (value: number) => void;
}
```

```tsx
// Basic usage
import { LampCirclePicker } from '@ray-js/components-ty-lamp';

export default () => {
  const [temperature, setTemperature] = useState(20);
  const handleEnd = (v: number) => {
    setTemperature(v);
  };
  return <LampCirclePicker value={temperature} innerRingRadius={80} onTouchEnd={handleEnd} />;
};
```

```tsx
// Advanced usage
import { LampCirclePicker } from '@ray-js/components-ty-lamp';

export default () => {
  const [temperature, setTemperature] = useState(20);
  const handleMove = (v: number) => {
    setTemperature(v);
  };
  const handleEnd = (v: number) => {
    setTemperature(v);
  };
  return (
    <LampCirclePicker
      value={temperature}
      innerRingRadius={80}
      // custom color(optional)
      colorList={[
        { offset: 0, color: '#ff0000' },
        { offset: 0.5, color: '#00ff00' },
        { offset: 1, color: '#0000ff' },
      ]}
      style={{
        background: '#222',
      }}
      innerBorderStyle={{
        width: 2,
        color: 'pink',
      }}
      descText="temp"
      descStyle={{
        color: 'red',
      }}
      titleStyle={{
        color: 'blue',
      }}
      useEventChannel
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
};
```

```js
// Turns on the use event channel property, which can be used in other rjs components
Render({
  // other xxx
  renderChannel() {
    const eventChannelName = 'lampCirclePickerEventChannel';
    this.instance.eventChannel.on(eventChannelName, e => {
      // Here you can receive the color data that is passed when the color changes
      const {
        data, // temp
        touchType, // : 'start' | 'move' | 'end'
        pos,
      } = e;
      console.log('eventChannel get', e);
    });
  },
});
```
