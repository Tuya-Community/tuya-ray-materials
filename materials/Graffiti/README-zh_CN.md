[English](./README.md) | 简体中文

# @ray-js/graffiti

[![latest](https://img.shields.io/npm/v/@ray-js/graffiti/latest.svg)](https://www.npmjs.com/package/@ray-js/graffiti) [![download](https://img.shields.io/npm/dt/@ray-js/graffiti.svg)](https://www.npmjs.com/package/@ray-js/graffiti)

> 画布涂鸦组件

## 安装

```sh
$ npm install @ray-js/graffiti
// 或者
$ yarn add @ray-js/graffiti
```

## 开发

```sh
# 安装依赖
yarn

# 实时编译Demo代码
yarn start:tuya
```

## 代码演示

### 基础使用

- 通过改变操作类型可以切换为, pencil 画笔模式, eraser 橡皮擦模式, paint 油漆桶模式
- 通过改变 `penColor`, 可以传入不同的画笔颜色
- `needStroke` 为 `true`, 开启监听每一画笔数据, 可以通过 `onStrokeChange` 获取每一笔画笔经过的 x,y 坐标路径数据
- 通过更新`saveTrigger`的值可以触发画布保存, 返回画布的 base64 数据
- 通过更新`clearTrigger`的值可以触发画布清除

```tsx
import React, { useState } from 'react';
import { View } from '@ray-js/ray';
import Graffiti from '@ray-js/graffiti';

type IStrokeData = {
  points: Array<{ x: number; y: number }>;
};

type IData = {
  base64: string;
};

export function Home() {
  const [actionType, setActiontype] = useState<'pencil' | 'eraser' | 'paint'>('pencil');
  const [color, setColor] = useState('rgba(255, 0, 0, 1)');
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);

  const reset = () => {
    setClearTrigger(clearTrigger + 1);
  };

  const save = () => {
    setSaveTrigger(saveTrigger + 1);
  };

  const handleStrokeChange = (data: IPoints) => {
    console.log('handleStrokeChange', data);
  };

  const handleSaveData = (data: IData) => {
    console.log('handleSaveData', data);
  };

  return (
    <>
      <Graffiti
        needStroke
        penColor={color}
        actionType={actionType}
        saveTrigger={saveTrigger}
        clearTrigger={clearTrigger}
        onStrokeChange={handleStrokeChange}
        onSaveData={handleSaveData}
      />
      <View className="footer">
        <Button className="btn" type="primary" onClick={reset}>
          清空
        </Button>
        <Button className="btn" type="primary" onClick={save}>
          保存
        </Button>
      </View>
    <>
  );
}
```
