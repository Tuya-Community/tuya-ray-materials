[English](./README.md) | 简体中文

# @ray-js/lamp-rect-white-picker

> 照明矩形色盘组件

## 安装

```sh
$ npm install @ray-js/components-ty-lamp
// 或者
$ yarn add @ray-js/components-ty-lamp
```

## 使用

- 属性与方法

```js
type TProps = {
  temp: number, // 色温
  thumbRadius?: number, // 矩形色盘thumb的半径
  rectWidth?: number, // 矩形色盘的宽度
  rectHeight?: number, // 矩形色盘的高度
  isShowTip?: boolean, // 是否展示颜色文案
  closed?: boolean, // 关闭状态
  borderRadius?: number, // 圆角值(Fillet value)， 优先级低于 borderRadiusStyle
  borderRadiusStyle?: string, // eg: 12px 12px 0 0; 同浏览器中的 borderRadius 样式设置
  colorTipStyle?: string, // 容器样式 eg: 'color: red; fontSize: 12px;'
  useEventChannel?: boolean // 是否开启事件通道
  eventChannelName?: string; // 事件通道名称
  onTouchStart?: (temp: number) => void, // 矩形色盘触摸开始的回调函数
  onTouchMove?: (temp: number) => void, // 矩形色盘触摸移动的回调函数 ⚠️注意：move触发频率过高可添加节流来提升性能
  onTouchEnd?: (temp: number) => void, // 矩形色盘触摸结束的回调函数
};
```

```tsx
import { LampRectWhitePicker } from '@ray-js/components-ty-lamp';

const Main = () => {
  const [temp, setTemp] = useState(100);
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
    <LampRectWhitePicker
      temp={temp}
      borderRadius={16} // 设置圆角 优先级低于 borderRadiusStyle
      // borderRadiusStyle="62rpx 62rpx 0 0"
      rectWidth={340}
      rectHeight={200}
      thumbRadius={16}
      isShowTip
      closed={closed}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};
```

```js
// 开启了 useEventChannel 属性，可以在其他 Rjs 组件中使用
Render({
  // 其他xxx
  renderChannel() {
    const eventChannelName = 'lampRectPickerWhiteEventChannel';
    this.instance.eventChannel.on(eventChannelName, e => {
      // 此处可以接收到当颜色变化时传递的颜色数据
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
