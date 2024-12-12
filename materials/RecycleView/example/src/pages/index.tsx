import React, { useState, useMemo } from 'react';
import { View, Text, Button, showLoading, hideLoading } from '@ray-js/ray';
import RecycleView, { transformRow1ToRowN } from '@ray-js/recycle-view';
import styles from './index.module.less';
import Strings from '../i18n';
import DynamicTab from './DynamicTab';
import { DemoBlock } from '../components/DemoBlock';

let index = 0;
// mock 数据
const mockData: { height?: number; [key: string]: any }[] = [];
for (let i = 1; i < 21; i++) {
  mockData.push({
    timeC: Math.floor(i / 5),
    text: `row ${index++}`,
  });
}

enum Type {
  base = 'base',
  advanced = 'advanced',
  dynamic = 'dynamic',
}

const TABS: Type[] = [Type.base, Type.advanced, Type.dynamic];

export default function Home() {
  const [tab, setTab] = useState(Type.base);
  const [data, setData] = useState(mockData);
  const rowNum = 3;
  const rowGroupOffsetTopHeight = 30;

  // 基础 tab 数据
  const realBaseData = useMemo(() => {
    return data;
  }, [data.length]);

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
    showLoading({
      title: '',
      mask: true,
    });
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

  // 基础单列用法
  const renderBaseTab = () => {
    return (
      <DemoBlock title={Strings.getLang('base')}>
        <RecycleView
          overScanCount={20}
          className={styles.recycleView}
          data={realBaseData}
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
        />
      </DemoBlock>
    );
  };

  // 高级多列用法
  const renderAdvancedTab = () => {
    return (
      <DemoBlock title={Strings.getLang('advanced')}>
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
        />
      </DemoBlock>
    );
  };

  return (
    <View className={styles.app}>
      <View className={styles.buttonWrapper}>
        {TABS.map(tabItem => (
          <Button
            key={tabItem}
            type={tab === tabItem ? 'primary' : 'default'}
            onClick={() => setTab(tabItem)}
          >
            {Strings.getLang(tabItem)}
          </Button>
        ))}
      </View>
      {tab === Type.base && renderBaseTab()}
      {tab === Type.advanced && renderAdvancedTab()}
      {tab === Type.dynamic && <DynamicTab />}
    </View>
  );
}
