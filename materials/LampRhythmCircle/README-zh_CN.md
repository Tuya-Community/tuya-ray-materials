[English](./README.md) | 简体中文

# @ray-js/lamp-rhythm-circle

[![latest](https://img.shields.io/npm/v/@ray-js/lamp-rhythm-circle/latest.svg)](https://www.npmjs.com/package/@ray-js/lamp-rhythm-circle) [![download](https://img.shields.io/npm/dt/@ray-js/lamp-rhythm-circle.svg)](https://www.npmjs.com/package/@ray-js/lamp-rhythm-circle)

> 照明生物节律色环

## 安装

```sh
$ npm install @ray-js/lamp-rhythm-circle
// 或者
$ yarn add @ray-js/lamp-rhythm-circle
```

## 使用

```tsx
import { useState } from 'react';
import RhythmCircle from '@ray-js/lamp-rhythm-circle';
import res from '../res';
import styles from './index.module.less';

export default function Home() {
  const [rhythmNode, setRhythmNode] = useState([
    {
      activeColor: '#CEECFE',
      time: 280,
      valid: true,
    },
    {
      activeColor: '#CE8040',
      time: 390,
      valid: true,
    },

    {
      activeColor: '#B3ABA8',
      time: 1020,
      valid: true,
    },
    {
      activeColor: '#1E272C',
      time: 1260,
      valid: true,
    },
  ]);

  const handleRelease = v => {
    const { value } = v;
    console.log(value, '--value');
    setRhythmNode([...value].sort((a, b) => a.time - b.time));
  };
  return (
    <View className={styles.view}>
      <RhythmsCircle
        innerRadius={110}
        radius={150}
        timeOffset={30}
        data={rhythmNode}
        iconList={[res.icon1_colour, res.icon2_colour, res.icon3_colour, res.icon4_colour]}
        onRelease={handleRelease}
      />
    </View>
  );
}
```
