/*
 * @Author: mjh
 * @Date: 2025-05-21 10:01:03
 * @LastEditors: mjh
 * @LastEditTime: 2025-08-26 15:49:10
 * @Description:
 */
import React, { useState } from 'react';
import { Drag, DragItem } from '@ray-js/drag-list';
import { ScrollView, Text, View } from '@ray-js/ray';
import styles from './index.module.less';
import Strings from '../i18n';
import { DemoBlock } from '../components';

const dataList = [
  { name: 'item1', idx: 'key1' },
  { name: 'item2', idx: 'key2' },
  { name: 'item3', idx: 'key3' },
  { name: 'item4', idx: 'key4' },
  { name: 'item5', idx: 'key5' },
  { name: 'item6', idx: 'key6' },
  { name: 'item7', idx: 'key7' },
  { name: 'item8', idx: 'key8' },
  { name: 'item9', idx: 'key9' },
  { name: 'item10', idx: 'key10' },
];
const DragList = () => {
  const [list, setList] = useState(dataList);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <ScrollView scrollY={scrollEnabled} style={{ height: '100vh' }}>
      <DemoBlock title={Strings.getLang('basicUsage')}>
        <View>{Strings.getLang('topTips')}</View>
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
              console.log(data, '--data');
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
      </DemoBlock>
      <DemoBlock title={Strings.getLang('multiColumnUsage')}>
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
              height: (150 + 20) * 3,
              padding: '0 16px',
            }}
            handleSortEnd={data => {
              console.log(data, '--data');
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
                  onClick={() => console.log('object')}
                >
                  {item.name}
                </View>
              </DragItem>
            ))}
          </Drag>
        </ScrollView>
      </DemoBlock>
    </ScrollView>
  );
};

export default DragList;
