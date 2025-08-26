[English](./README.md) | 简体中文

# @ray-js/drag-list

[![latest](https://img.shields.io/npm/v/@ray-js/drag-list/latest.svg)](https://www.npmjs.com/package/@ray-js/drag-list) [![download](https://img.shields.io/npm/dt/@ray-js/drag-list.svg)](https://www.npmjs.com/package/@ray-js/drag-list)

> 拖拽排序列表

## 安装

```sh
$ npm install @ray-js/drag-list
// 或者
$ yarn add @ray-js/drag-list
```

## 使用

使用此组件需要禁用小程序默认的页面滚动，在 `index.config.ts` 内增加 `disableScroll: true`

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

### 基础用法 `v2.0.0`

插槽插入 `dragIconNode` 为拖拽节点，只有手指交互再此节点上才能触发拖拽

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

### 多列用法 `2.1.0`

`multipleCol` 属性开启多列用法，内部会采用 flex 布局进行多列排布;也可以配合 `bodyDrag` 属性实现整个节点都可以触发拖拽。

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
