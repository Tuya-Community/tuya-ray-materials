English | [简体中文](./README-zh_CN.md)

# @ray-js/components-ty-perf-text

[![latest](https://img.shields.io/npm/v/@ray-js/components-ty-perf-text/latest.svg)](https://www.npmjs.com/package/@ray-js/components-ty-perf-text) [![download](https://img.shields.io/npm/dt/@ray-js/components-ty-perf-text.svg)](https://www.npmjs.com/package/@ray-js/components-ty-perf-text)

> Used for slider real -time drag display value

Introduce articles：https://www.tuyaos.com/viewtopic.php?t=3413

## Installation

```sh
$ npm install @ray-js/components-ty-perf-text
# or
$ yarn add @ray-js/components-ty-perf-text
```

## Develop

```sh
# watch compile component code
yarn watch
# watch compile demo
yarn start:tuya
```

## Usage

```tsx
import PerfText from '@ray-js/components-ty-perf-text';
import Slider from '@ray-js/components-ty-slider';

function App() {
  return (
    <View>
      <View style={{ marginBottom: 48 }}>
        Value：
        <PerfText eventName="sliderMove" />%
      </View>
      <Slider moveEventName="sliderMove" />
    </View>
  );
}
```
