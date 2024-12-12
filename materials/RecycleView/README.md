English | [简体中文](./README-zh_CN.md)

# @ray-js/recycle-view

[![latest](https://img.shields.io/npm/v/@ray-js/recycle-view/latest.svg)](https://www.npmjs.com/package/@ray-js/recycle-view) [![download](https://img.shields.io/npm/dt/@ray-js/recycle-view.svg)](https://www.npmjs.com/package/@ray-js/recycle-view)

> Ray recycle list

The `RecycleDynamicView` and `RecycleDynamicViewList` components have been supported since version v0.1.0, and are recommended for use when the height of list item content is uncertain or changes dynamically.

## Performance testing

- Advantage: create 270 element points
- operation: swiftly slide up and down, view performance data
- The performance of the aircraft:
  - Android: mi 6 (low end model) No cartoon problem
  - iOS: iPhone 6s (lower end device) No cartoon issue
- Performance data:
  - FPS: 38-60 (average value is 40+)
  - MT: 1-40 (mean value 10+)

## Installation

```sh
$ npm install @ray-js/recycle-view
# or
$ yarn add @ray-js/recycle-view
```

## Usage

### Basic Usage

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

### Advanced Usage

#### no default item height data

```tsx
import RecycleView, { transformRow1ToRowN } from '@ray-js/recycle-view';

const [data, setData] = useState([]);
const rowNum = 3;
const rowGroupOffsetTopHeight = 30;

// Advanced tab data
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

#### use default item height data

```tsx
import RecycleView, { transformRow1ToRowN } from '@ray-js/recycle-view';

const [data, setData] = useState([]);
const rowNum = 3;
const rowGroupOffsetTopHeight = 30;

const defaultItemHeight = 200;
// advance tab data
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

### Dynamic height

#### RecycleDynamicViewList

The method to use the `RecycleDynamicViewList` component when the height of list items changes dynamically.

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

`RecycleDynamicViewList` is encapsulated based on the `RecycleDynamicView` component, and you can also use the `RecycleDynamicView` component directly. It should be noted that the `RecycleDynamicView` component uses the IntersectionObserver API, and having too many observed objects may lead to performance issues. The example code constructs a two-dimensional array to reduce the number of observed objects.

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
