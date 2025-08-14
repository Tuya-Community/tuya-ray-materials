import React, { useState } from 'react';
import { View, Text } from '@ray-js/ray';
import LampColorCollection from '@ray-js/lamp-color-collection';
import styles from './index.module.less';
import i18n from '../i18n';

const { ColorCollectInnerDelete } = LampColorCollection;

const DemoBlock = ({ title, children, style = {} }) => (
  <View className={styles.demoBlock} style={style}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const defaultColorList = [
    { h: 200, s: 1000, v: 1000 },
    { h: 200, s: 1000, v: 500 },
    { h: 200, s: 1000, v: 10 },
    { b: 10, t: 670 },
    { b: 500, t: 670 },
    { b: 1000, t: 670 },
  ];

  const [colorList, setColorList] = useState(defaultColorList);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleAdd = () => {
    setColorList([
      ...colorList,
      {
        h: Math.round(Math.random() * 360),
        s: Math.round(Math.random() * 1000),
        v: Math.round(Math.random() * 10),
      },
    ]);
  };

  const handleDelete = (_colorList, _activeIndex, deletedIndex) => {
    setColorList([..._colorList]);
    console.warn(deletedIndex, 'deletedIndexdeletedIndex');
    setActiveIndex(_activeIndex);
  };

  const handleChecked = (colorItem, _activeIndex: number) => {
    setActiveIndex(_activeIndex);
  };

  return (
    <View className={styles.view}>
      <DemoBlock
        title={i18n.getLang('basicUsage')}
        style={{
          backgroundColor: '#ddd',
          marginBottom: 20,
          borderRadius: 20,
        }}
      >
        <LampColorCollection
          disableDelete={colorList.length > 2}
          theme="dark"
          activeIndex={activeIndex}
          colorList={colorList}
          circleSize={46}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onChecked={handleChecked}
        />
      </DemoBlock>
      <DemoBlock
        title={`${i18n.getLang('advancedUsage_1')}`}
        style={{
          backgroundColor: '#ddd',
          marginBottom: 20,
          borderRadius: 20,
        }}
      >
        <ColorCollectInnerDelete
          disableDelete={colorList.length > 2}
          theme="dark"
          addButtonPos="head"
          limit={10}
          className="containerClassName1"
          contentClassName="contentClassName2"
          activeIndex={activeIndex}
          circleSize={46}
          colorList={colorList}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onChecked={handleChecked}
        />
      </DemoBlock>

      <DemoBlock
        title={`${i18n.getLang('advancedUsage_2')}`}
        style={{ backgroundColor: '#ddd', marginBottom: 20, borderRadius: 20 }}
      >
        <ColorCollectInnerDelete
          disableDelete={colorList.length > 2}
          theme="dark"
          addButtonPos="tail"
          activeIndex={activeIndex}
          colorList={colorList}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onChecked={handleChecked}
          renderDeleteElement={() => (
            <View
              style={{
                position: 'absolute',
                top: '50%',
                right: '50%',
                transform: 'translateY(-50%) translateX(50%)',
                width: 40,
                height: 4,
                borderRadius: 10,
                backgroundColor: 'red',
                zIndex: 10,
              }}
            />
          )}
        />
      </DemoBlock>

      <DemoBlock
        title={i18n.getLang('advancedUsage_3')}
        style={{
          backgroundColor: '#ddd',
          marginBottom: 20,
          borderRadius: 20,
        }}
      >
        <LampColorCollection
          disableDelete={colorList.length > 2}
          theme={{
            background: 'rgba(0, 0, 0, 0.5)',
            addBgColor: 'rgba(0, 0, 0, 0.1)',
          }}
          iconDeleteColorStyle={{
            activeColor: 'rgb(11, 40, 228)',
            disabledColor: 'rgba(55, 91, 148, 0.5)',
          }}
          activeIndex={activeIndex}
          colorList={colorList}
          circleSize={46}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onChecked={handleChecked}
        />
      </DemoBlock>
    </View>
  );
}
