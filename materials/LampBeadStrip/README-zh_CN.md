[English](./README.md) | 简体中文

# @ray-js/lamp-bead-strip

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-bead-strip/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-bead-strip) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-bead-strip.svg)](https://www.npmjs.com/package/@ray-js/lamp-bead-strip)

> 动画灯珠条带

直接采用`canvas`绘制动画效果，并且内部防止重复渲染，实现低端机页面同时渲染多个动画不卡顿。

## 安装

```sh
$ npm install @ray-js/lamp-bead-strip
// 或者
$ yarn add @ray-js/lamp-bead-strip
```

## 开发

```sh
# 实时编译组件代码
yarn watch
# 实时编译Demo代码
yarn start:tuya
```

## 使用

### 基础使用

`colors`和`canvasId`是必传项，否则动画无法运行。`canvasId`要保证页面唯一性。当我们传入不同的动画模式`mode`后，组件就会自动播放动画。

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
export default () => (
  <LampBeadStrip
    canvasId="diy-scene"
    speed={80}
    mode={10}
    colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
    contentValue={{ segmented: 1 }}
  />
);
```

### 暂停

`ready`可以设置组件的动画播放还是暂停。

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
export default () => (
  <LampBeadStrip
    canvasId="diy-scene1"
    mode={2}
    ready={false}
    colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
    contentValue={{ segmented: 1, direction: 1 }}
  />
);
```

### 自定义缩放尺寸

由于组件是通过`canvas`绘制，所以内部的尺寸大小都是固定的。组件内部处理了屏幕缩放逻辑，通过`scale`属性来控制。如果你想修改组件的尺寸，可以自定义去设置`scale`属性来达到目的。如下用例希望组件大小是原来的`1.1`倍。

> 需要注意的是组件只在初始化时设置一次 scale 的缩放，所以如果 scale 属性再初始化之后改变或设置将会无效

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
import { getSystemInfoSync } from '@ray-js/ray';

const { windowWidth = 375 } = getSystemInfoSync();
export default () => {
  const scale = (windowWidth / 375) * 1.1;
  return (
    <LampBeadStrip
      containerStyle={`height: ${48 * 1.1}rpx;width:${570 * 1.1}rpx;`}
      mode={16}
      canvasId="template2"
      scale={scale}
      colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
      contentValue={{ expand: 1 }}
    />
  );
};
```

### 设置关灯颜色

`closeColor` 可以设置在动画中没有颜色的灯的颜色，也就是在设备中关灯灯珠的颜色，这样灯带组件可以适配多种背景色，防止关灯的节点颜色和背景色一样。

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';

export default () => {
  return (
    <LampBeadStrip
      mode={16}
      canvasId="template3"
      closeColor="rgba(255,255,255,.6)"
      colors={['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)']}
    />
  );
};
```

### 自定义动画（v1.1.0）

`customAnimationList`: 属性可以用来自定义动画，他是一个动画帧列表，其为一个二维数组。每一个内部的数组都是 20 个颜色组成，相当于此时动画帧组件 20 个灯的颜色，组件内部会自动循环播放这个动画列表。  
`customAnimationChangeTime`: 切换自定义动画的时间，播放速度受此属性控制，代表多少时间切换一针，单位毫秒。

```tsx
import LampBeadStrip from '@ray-js/lamp-bead-strip';
import React, { useMemo } from 'react';

export default () => {
  const customAnimationList = useMemo(() => {
    const colors = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];
    return colors.map(item => new Array(20).fill(item));
  }, []);

  return (
    <LampBeadStrip
      canvasId="template4"
      customAnimationList={customAnimationList}
      customAnimationChangeTime={500}
    />
  );
};
```

### 动画模式

> 一期 6 个 1 渐变 2 跳变 3 呼吸 4 闪烁 10 流水 11 彩虹  
> 二期 10 个 5 流星 6 堆积 7 飘落 8 追光 9 飘动 12 闪现 13 反弹 14 穿梭 15 乱闪 16 开合

| 动画 mode 值 | 描述         | 包含控制类型 contentValue                                           |
| ------------ | ------------ | ------------------------------------------------------------------- |
| 1            | （一期）渐变 | segmented（全段 0/分段 1）                                          |
| 2            | （一期）跳变 | segmented（全段 0/分段 1）                                          |
| 3            | （一期）呼吸 | segmented（全段 0/分段 1）                                          |
| 4            | （一期）闪烁 | segmented（全段 0/分段 1）                                          |
| 10           | （一期）流水 | direction（顺时针 0/逆时针 1）                                      |
| 11           | （一期）彩虹 | direction（顺时针 0/逆时针 1）                                      |
| 5            | （二期）流星 | direction（顺时针 0/逆时针 1） expand（流星 0/流星雨 1/幻彩流星 2） |
| 6            | （二期）堆积 | direction（顺时针 0/逆时针 1） segmented（全段 0/分段 1）           |
| 7            | （二期）飘落 | direction（顺时针 0/逆时针 1） segmented（全段 0/分段 1）           |
| 8            | （二期）追光 | direction（顺时针 0/逆时针 1）                                      |
| 9            | （二期）飘动 | direction（顺时针 0/逆时针 1）                                      |
| 12           | （二期）闪现 | segmented（全段 0/分段 1）                                          |
| 13           | （二期）反弹 | expand（反弹 0/幻彩反弹 1）                                         |
| 14           | （二期）穿梭 | -                                                                   |
| 15           | （二期）乱闪 | -                                                                   |
| 16           | （二期）开合 | expand（同时 0/交错 1）                                             |
