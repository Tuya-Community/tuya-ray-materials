English | [简体中文](./README-zh_CN.md)

# @ray-js/graffiti

[![latest](https://img.shields.io/npm/v/@ray-js/graffiti/latest.svg)](https://www.npmjs.com/package/@ray-js/graffiti) [![download](https://img.shields.io/npm/dt/@ray-js/graffiti.svg)](https://www.npmjs.com/package/@ray-js/graffiti)

> Canvas Graffiti

## Installation

```sh
$ npm install @ray-js/graffiti
# or
$ yarn add @ray-js/graffiti
```

## Develop

```sh
# install deps
yarn

# watch compile demo
yarn start:tuya
```

## Code Demonstration

### Basic usage

- By changing the operation type, you can switch to pencil mode, eraser mode, paint bucket mode
- By changing `penColor`, you can pass in different pen colors
- `needStroke` is `true`, start monitoring each brush data, and get the x, y coordinate path data of each brush stroke through `onStrokeChange`
- Updating the `saveTrigger` value triggers canvas saving, returning the canvas's base64 data and grid color data.
- Updating the `clearTrigger` value triggers canvas clearing.
- The `scale` function allows scaling the canvas.
- `isDragging` disables drawing; the canvas can be dragged when it exceeds the limit.

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
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
        scale={scale}
        isDragging={isDragging}
        onStrokeChange={handleStrokeChange}
        onSaveData={handleSaveData}
      />
      <View className="footer">
        <Button className="btn" type="primary" onClick={reset}>
          Reset
        </Button>
        <Button className="btn" type="primary" onClick={save}>
          Save
        </Button>
      </View>
    <>
  );
}
```
