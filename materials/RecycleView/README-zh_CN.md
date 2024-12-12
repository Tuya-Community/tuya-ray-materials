[English](./README.md) | 简体中文

# @ray-js/recycle-view

[![latest](https://img.shields.io/npm/v/@ray-js/recycle-view/latest.svg)](https://www.npmjs.com/package/@ray-js/recycle-view) [![download](https://img.shields.io/npm/dt/@ray-js/recycle-view.svg)](https://www.npmjs.com/package/@ray-js/recycle-view)

> Ray 长列表

`RecycleDynamicView` 和 `RecycleDynamicViewList` 组件从 v0.1.0 版本开始支持，在列表项内容高度不确定或动态变化时推荐使用。

## 性能测试

- 前提：创建 270 个数据
- 操作：快速上下滑动，查看性能数据
- 机型表现：
  - 安卓: mi 6（低端机型） 无卡顿问题
  - iOS: iPhone 6s(低端机型) 无卡顿问题
- 性能数据:
  - FPS: 38-60 (均值 40+)
  - MT: 1-40 (均值 10+)

## 安装

```sh
$ npm install @ray-js/recycle-view
// 或者
$ yarn add @ray-js/recycle-view
```

## 使用

### 基础用法

```tsx
import RecycleView, { transformRow1ToRowN } from '@ray-js/recycle-view';

const [data, setData] = useState([]);

const handleScrollToLower = () => {
  const len = Math.floor(data.length / 5);
  if (len > 50) {
    return;
  }
  setTimeout(() => {
    const len = Math.floor(data.length / 5);
    const random = Math.floor(Math.random() * 10) + 10;
    for (let i = 0; i < random; i++) {
      data.push({
        height: 100,
        timeC: Math.floor(i / 5) + len,
        text: `row ${index++}`,
      });
    }
    setData([...data]);
    hideLoading();
  }, 1000);
};

<RecycleView
  overScanCount={20}
  className={styles.recycleView}
  data={data}
  renderItem={item => {
    return (
      <View
        key={item.text}
        style={{
          width: '100%',
          height: `${item.height}px`,
          textAlign: 'center',
          background: '#eee',
          border: '1px solid #ccc',
        }}
      >{`${item.text}`}</View>
    );
  }}
  onScrollToLower={handleScrollToLower}
/>;
```

### 高级用法

#### 不使用默认高度

```tsx
import RecycleView, { transformRow1ToRowN } from '@ray-js/recycle-view';

const [data, setData] = useState([]);
const rowNum = 3;
const rowGroupOffsetTopHeight = 30;

// 高级 tab 数据
const realAdvanceData = useMemo(() => {
  const groupKey = 'timeC';
  return transformRow1ToRowN(data, groupKey, rowNum, rowGroupOffsetTopHeight);
}, [data.length, rowNum, rowGroupOffsetTopHeight]);

const handleScrollToLower = () => {
  const len = Math.floor(data.length / 5);
  if (len > 50) {
    return;
  }
  setTimeout(() => {
    const len = Math.floor(data.length / 5);
    const random = Math.floor(Math.random() * 10) + 10;
    for (let i = 0; i < random; i++) {
      data.push({
        height: 100,
        timeC: Math.floor(i / 5) + len,
        text: `row ${index++}`,
      });
    }
    setData([...data]);
    hideLoading();
  }, 1000);
};

<RecycleView
  overScanCount={20}
  className={styles.recycleView}
  data={realAdvanceData}
  bottomHeight={150}
  renderBottom={() => {
    return (
      <View style={{ height: '150px', backgroundColor: 'yellow' }}>
        {Strings.getLang('footer')}
      </View>
    );
  }}
  renderItem={item => {
    const { groupKey, data } = item;
    return (
      <View
        key={groupKey}
        style={{
          backgroundColor: 'white',
          fontWeight: 'bold',
          color: 'red',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <View
          style={{
            color: 'blue',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#999',
          }}
        >
          key: {groupKey}
        </View>
        <View
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          {data.map(innerItem => {
            return (
              <View
                key={innerItem.text}
                style={{
                  width: '33%',
                  height: `${innerItem.height}px`,
                  textAlign: 'center',
                  background: '#eee',
                  border: '1px solid #ccc',
                }}
              >{`${innerItem.text}`}</View>
            );
          })}
        </View>
      </View>
    );
  }}
  onScrollToLower={handleScrollToLower}
/>;
```

#### 使用默认高度

```tsx
import RecycleView, { transformRow1ToRowN } from '@ray-js/recycle-view';

const [data, setData] = useState([]);
const rowNum = 3;
const rowGroupOffsetTopHeight = 30;

const defaultItemHeight = 200;
// 高级 tab 数据
const realAdvanceData = useMemo(() => {
  const groupKey = 'timeC';
  return transformRow1ToRowN(data, groupKey, rowNum, rowGroupOffsetTopHeight, defaultItemHeight);
}, [data.length, rowNum, rowGroupOffsetTopHeight, defaultItemHeight]);

const handleScrollToLower = () => {
  const len = Math.floor(data.length / 5);
  if (len > 50) {
    return;
  }
  setTimeout(() => {
    const len = Math.floor(data.length / 5);
    const random = Math.floor(Math.random() * 10) + 10;
    for (let i = 0; i < random; i++) {
      data.push({
        // height: 100, // 删除单条高度，使用 defaultItemHeight 默认高度
        timeC: Math.floor(i / 5) + len,
        text: `row ${index++}`,
      });
    }
    setData([...data]);
    hideLoading();
  }, 1000);
};

<RecycleView
  overScanCount={20}
  className={styles.recycleView}
  data={realAdvanceData}
  defaultItemHeight={defaultItemHeight}
  bottomHeight={150}
  renderBottom={() => {
    return (
      <View style={{ height: '150px', backgroundColor: 'yellow' }}>
        {Strings.getLang('footer')}
      </View>
    );
  }}
  renderItem={item => {
    const { groupKey, data } = item;
    return (
      <View
        key={groupKey}
        style={{
          backgroundColor: 'white',
          fontWeight: 'bold',
          color: 'red',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <View
          style={{
            color: 'blue',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#999',
          }}
        >
          key: {groupKey}
        </View>
        <View
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          {data.map(innerItem => {
            return (
              <View
                key={innerItem.text}
                style={{
                  width: '33%',
                  height: `${innerItem.height}px`,
                  textAlign: 'center',
                  background: '#eee',
                  border: '1px solid #ccc',
                }}
              >{`${innerItem.text}`}</View>
            );
          })}
        </View>
      </View>
    );
  }}
  onScrollToLower={handleScrollToLower}
/>;
```

### 动态高度

#### RecycleDynamicViewList

当列表项高度会动态变化时使用 `RecycleDynamicViewList` 组件的方法。

```tsx
import React, { useState, useCallback } from 'react';
import { Button, View } from '@ray-js/ray';
import { RecycleDynamicViewList } from '@ray-js/recycle-view';

const arr = [[111, 60, 300, 160, 200]];

const itemStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  border: '1px solid #000',
};

export default function Demo() {
  const [list, setList] = useState<number[][]>(arr);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    const res = await fetchNewData();
    setList([...list, res]);
  }, [list]);

  const fetchNewData = (): Promise<number[]> => {
    return new Promise(resolve => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const res = new Array(10).fill(0).map(() => Math.floor(Math.random() * 200 + 50));
        resolve(res);
      }, 300);
    });
  };

  const renderItem = (item: number, chunkIndex: number, index: number) => {
    return (
      <View key={`${index}${index}`} style={{ ...itemStyle, height: `${item}px` }}>
        height: {item}
        <Button
          onClick={() => {
            const newList = [...list];
            newList[chunkIndex][index] = item + 50;
            setList(newList);
          }}
        >
          + 50
        </Button>
        <Button
          onClick={() => {
            const newList = [...list];
            newList[chunkIndex].splice(index, 1);
            setList(newList);
          }}
        >
          Delete
        </Button>
      </View>
    );
  };

  const renderBottom = () => {
    return loading ? <View>Loading...</View> : null;
  };

  return (
    <RecycleDynamicViewList
      data={list}
      renderItem={renderItem}
      renderBottom={renderBottom}
      onScrollToLower={loadMore}
      style={{ height: '500px' }}
    />
  );
}
```

#### RecycleDynamicView

`RecycleDynamicViewList` 是基于 `RecycleDynamicView` 组件进行封装的，你也可以直接使用 `RecycleDynamicView` 组件。需要注意的是，`RecycleDynamicView` 组件使用 IntersectionObserver API 实现，监听对象数量过多可能会导致性能问题。示例代码通过构造二维数组以减少监听对象数量。

```tsx
import { ScrollView, View } from '@ray-js/ray';
import { RecycleDynamicView } from '@ray-js/recycle-view';

const RecycleViewList = () => {
  const data = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const renderItem = (item, index) => <View style={{ height: '200px' }}>{item}</View>;

  return (
    <ScrollView scrollY id="recycleWrapper" style={{ height: '300px' }}>
      {data.map((chunk, index) => (
        <RecycleDynamicView key={`chunk_${index}`} chunkId={`chunk_${index}`} rootMargin={100}>
          {chunk.map((item, i) => renderItem(item, i))}
        </RecycleDynamicView>
      ))}
    </ScrollView>
  );
};
```
