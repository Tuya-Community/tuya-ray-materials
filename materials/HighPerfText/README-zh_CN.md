[English](./README.md) | 简体中文

# @ray-js/components-ty-perf-text

[![latest](https://img.shields.io/npm/v/@ray-js/components-ty-perf-text/latest.svg)](https://www.npmjs.com/package/@ray-js/components-ty-perf-text) [![download](https://img.shields.io/npm/dt/@ray-js/components-ty-perf-text.svg)](https://www.npmjs.com/package/@ray-js/components-ty-perf-text)

> 用于 Slider 实时拖动显示数值

## 安装

```sh
$ npm install @ray-js/components-ty-perf-text
// 或者
$ yarn add @ray-js/components-ty-perf-text
```

## 开发

```sh
# 实时编译组件代码
yarn watch
# 实时编译Demo代码
yarn start:tuya
```

## 使用

```tsx
import PerfText from '@ray-js/components-ty-perf-text';
import Slider from '@ray-js/components-ty-slider';

function App() {
  return (
    <View>
      <View style={{ marginBottom: 48 }}>
        数值展示：
        <PerfText eventName="sliderMove" />%
      </View>
      <Slider moveEventName="sliderMove" />
    </View>
  );
}
```
