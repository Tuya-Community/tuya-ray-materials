import React, { useState, useCallback } from 'react';
import { Button, View } from '@ray-js/ray';
import { RecycleDynamicViewList } from '@ray-js/recycle-view';
import Strings from '../../i18n';
import { DemoBlock } from '../../components/DemoBlock';

const arr = [[111, 60, 300, 160, 200]];

const itemStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  border: '1px solid #000',
  color: '#000',
};

export default function DynamicTab() {
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
    <DemoBlock title={Strings.getLang('dynamic')}>
      <RecycleDynamicViewList
        debug
        data={list}
        renderItem={renderItem}
        renderBottom={renderBottom}
        onScrollToLower={loadMore}
        style={{ height: '450px' }}
      />
    </DemoBlock>
  );
}
