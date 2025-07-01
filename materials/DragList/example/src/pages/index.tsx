/*
 * @Author: mjh
 * @Date: 2025-05-21 10:01:03
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-20 14:56:11
 * @Description:
 */
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
