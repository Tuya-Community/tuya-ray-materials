English | [简体中文](./README-zh_CN.md)

# @ray-js/drag-list

[![latest](https://img.shields.io/npm/v/@ray-js/drag-list/latest.svg)](https://www.npmjs.com/package/@ray-js/drag-list) [![download](https://img.shields.io/npm/dt/@ray-js/drag-list.svg)](https://www.npmjs.com/package/@ray-js/drag-list)

> Drag and sort list

## Installation

```sh
$ npm install @ray-js/drag-list
// Or
$ yarn add @ray-js/drag-list
```

## Usage

To use this component, you need to disable the default page scroll of the mini program by adding `disableScroll: true` in `index.config.ts`.

```ts
export default {
  backgroundColor: '@bgColor',
  navigationBarBackgroundColor: '@navBgColor',
  navigationBarTextStyle: 'white',
  navigationBarTitleText: 'Home',
  navigationStyle: 'custom',
  disableScroll: true,
};
```

### Basic Usage `v2.0.0`

Insert slot `dragIconNode` as a drag node, only finger interaction on this node can trigger dragging

```tsx
import React, { useState } from 'react';
import { Drag, DragItem } from '@ray-js/drag-list';
import { ScrollView, Text, View } from '@ray-js/ray';
import styles from './index.module.less';

const dataList = [
  { name: 'item1', idx: 'key1' },
  { name: 'item2', idx: 'key2' },
  { name: 'item3', idx: 'key3' },
  { name: 'item4', idx: 'key4' },
  { name: 'item5', idx: 'key5' },
  { name: 'item6', idx: 'key6' },
];
const DragList = () => {
  const [list, setList] = useState(dataList);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <ScrollView
      scrollY={scrollEnabled}
      style={{
        display: 'flex',
        width: '100%',
        height: '300px',
        flexDirection: 'column',
        background: 'rgba(244, 244, 246)',
      }}
    >
      <Drag
        list={list}
        touchStart={() => {
          setScrollEnabled(false);
        }}
        activeClassName={styles.active}
        keyId="idx"
        dargStartDelay={300}
        style={{
          height: (108 + 20) * list.length,
          padding: '0 16px',
        }}
        handleSortEnd={data => {
          setScrollEnabled(true);
          data?.detail && setList([...data.detail] as typeof dataList);
        }}
      >
        {list.map(item => (
          <DragItem
            item={item}
            key={item.idx}
            id={item.idx}
            dragIconNode={
              <View
                style={{
                  backgroundColor: 'red',
                  width: '20px',
                  height: '20px',
                }}
              />
            }
          >
            <View
              style={{
                height: 108,
                width: '100%',
                background: 'white',
                borderRadius: 32,
                marginBottom: 20,
                display: 'flex',
                paddingLeft: 24,
                alignItems: 'center',
                color: 'black',
              }}
            >
              <Text>{item.name}</Text>
            </View>
          </DragItem>
        ))}
      </Drag>
    </ScrollView>
  );
};
export default DragList;
```

### Multi-column Usage `2.1.0`

The `multipleCol` attribute enables multi-column usage, and the internal flex layout is used for multi-column arrangement; it can also be combined with the `bodyDrag` attribute to allow the entire node to trigger dragging.

```tsx
import React, { useState } from 'react';
import { Drag, DragItem } from '@ray-js/drag-list';
import { ScrollView, Text, View } from '@ray-js/ray';
import styles from './index.module.less';

const dataList = [
  { name: 'item1', idx: 'key1' },
  { name: 'item2', idx: 'key2' },
  { name: 'item3', idx: 'key3' },
  { name: 'item4', idx: 'key4' },
  { name: 'item5', idx: 'key5' },
  { name: 'item6', idx: 'key6' },
];
const DragList = () => {
  const [list, setList] = useState(dataList);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <ScrollView
      scrollY={scrollEnabled}
      style={{
        display: 'flex',
        width: '100%',
        height: 500,
        flexDirection: 'column',
        background: 'rgba(244, 244, 246)',
      }}
    >
      <Drag
        list={list}
        touchStart={() => {
          setScrollEnabled(false);
        }}
        bodyDrag
        dargStartDelay={100}
        multipleCol
        activeClassName={styles.active}
        keyId="idx"
        style={{
          height: (150 + 20) * 2,
          padding: '0 16px',
        }}
        handleSortEnd={data => {
          setScrollEnabled(true);
          data?.detail && setList([...data.detail] as typeof dataList);
        }}
      >
        {list.map(item => (
          <DragItem item={item} key={item.idx} id={item.idx}>
            <View
              style={{
                height: 150,
                width: 200,
                background: 'white',
                borderRadius: 32,
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'black',
              }}
            >
              {item.name}
            </View>
          </DragItem>
        ))}
      </Drag>
    </ScrollView>
  );
};
export default DragList;
```
