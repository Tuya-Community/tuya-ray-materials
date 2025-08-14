[English](./README.md) | 简体中文

# @ray-js/lamp-rect-picker-color

> 照明矩形色盘组件

## 安装

```sh
$ npm install @ray-js/components-ty-lamp
// 或者
$ yarn add @ray-js/components-ty-lamp
```

## 预览

![预览](https://images.tuyacn.com/smart/ui_design_pkg_icon/non-session-user/16729908911f238a2fc43.png)

## 使用

- 属性与方法

```js
type HS = { h: number, s: number };
type TProps = {
  hs: HS, // 矩形色盘颜色值 hsv中的hs[参考链接](https://baike.baidu.com/item/HSV/547122?fr=aladdin)
  thumbRadius?: number, // 矩形色盘thumb的半径
  rectWidth?: number, // 矩形色盘的宽度
  rectHeight?: number, // 矩形色盘的高度
  isShowColorTip?: boolean, // 是否展示颜色文案
  useEventChannel?: boolean, // 是否开启 rjs 事件通道 默认：false
  eventChannelName?: string, // rjs 事件通道名称可选 默认 注意⚠️：基础库版本大于2.18.0, 是否启用事件通道，当多个 rjs 组件同时使用时，用于优化 rjs 间数据传输时的性能问题(lampRectPickerColorEventChannel)
  closed?: boolean, // 关闭状态
  borderRadius?: number, // 圆角值(Fillet value)， 优先级低于 borderRadiusStyle
  borderRadiusStyle?: string, // eg: 12px 12px 0 0; 同浏览器中的 borderRadius 样式设置
  colorTipStyle?: string, // 容器样式 eg: 'color: red; fontSize: 12px;'
  onTouchStart?: (e: HS) => void, // 矩形色盘触摸开始的回调函数
  onTouchMove?: (e: HS) => void, // 矩形色盘触摸移动的回调函数 ⚠️注意：move触发频率过高可添加节流来提升性能
  onTouchEnd?: (e: HS) => void, // 矩形色盘触摸结束的回调函数
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
      borderRadius={16} // 设置圆角 优先级低于 borderRadiusStyle
      borderRadiusStyle="16rpx 16rpx 0 0"
      rectWidth={344}
      rectHeight={200}
      thumbRadius={12}
      closed={closed}
      isShowColorTip
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
    const eventChannelName = 'lampRectPickerColorEventChannel';
    this.instance.eventChannel.on(eventChannelName, e => {
      // 此处可以接收到当颜色变化时传递的颜色数据
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
