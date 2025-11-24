import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/components';
import DemoBlock from '../components/DemoBlock';
import RayCircleProgress from '../../../src/index';
import i18n from '../i18n';
import styles from './index.module.less';

export default function Home() {
  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [value4, setValue4] = useState(0);
  const [value5, setValue5] = useState(0);

  const handleTouchStart = (v: number) => {
    console.warn('handleTouchStart', v);
    setValue(v);
  };

  const handleMove = (v: number) => {
    console.warn('handleMove', v);
    setValue(v);
  };

  const handleEnd = (v: number) => {
    console.warn('handleEnd', v);
    setValue(v);
  };

  const handleAdd = () => {
    const v = Math.min(value + 1, 100);
    setValue(v);
  };

  const handleSub = () => {
    const v = Math.max(value - 1, 0);
    setValue(v);
  };

  useEffect(() => {
    setTimeout(() => {
      setValue(50);
    }, 1000);
    // 测试小范围跳动效果
    setTimeout(() => {
      setValue(51);
    }, 1500);
    setTimeout(() => {
      setValue1(50);
    }, 1000);
  }, []);

  const handleMove1 = (v: number) => {
    console.warn('handleMove1', v);
    setValue1(v);
  };

  const handleEnd1 = (v: number) => {
    console.warn('handleEnd1', v);
    setValue1(v);
  };

  const handleMove2 = (v: number) => {
    console.warn('handleMove2', v);
    setValue2(v);
  };

  const handleEnd2 = (v: number) => {
    console.warn('handleEnd2', v);
    setValue2(v);
  };

  const handleMove3 = (v: number) => {
    console.warn('handleMove3', v);
    setValue3(v);
  };

  const handleEnd3 = (v: number) => {
    console.warn('handleEnd3', v);
    setValue3(v);
  };
  const handleMove4 = (v: number) => {
    console.warn('handleMove4', v);
    setValue4(v);
  };

  const handleEnd4 = (v: number) => {
    console.warn('handleEnd4', v);
    setValue4(v);
  };

  const handleMove5 = (v: number) => {
    console.warn('handleMove5', v);
    setValue5(v);
  };

  const handleEnd5 = (v: number) => {
    console.warn('handleEnd5', v);
    setValue5(v);
  };

  return (
    <View className={styles.view}>
      <DemoBlock
        title={i18n.getLang('basicUsage')}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value}
          ringRadius={135}
          innerRingRadius={111}
          colorList={[
            { offset: 0, color: '#295bdd' },
            { offset: 0.5, color: '#6A53D1' },
            { offset: 1, color: '#f65028' },
          ]}
          startDegree={135}
          offsetDegree={270}
          touchCircleStrokeStyle="rgba(0, 0, 0, 0.4)"
          thumbBorderWidth={4}
          onTouchStart={handleTouchStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              width: 150,
              height: 60,
              backgroundColor: '#ddd',
              textAlign: 'center',
              borderRadius: 30,
            }}
            onClick={handleAdd}
          >
            +
          </View>
          <View>Current Value: {value}</View>
          <View
            style={{
              width: 150,
              height: 60,
              backgroundColor: '#ccc',
              textAlign: 'center',
              borderRadius: 30,
            }}
            onClick={handleSub}
          >
            -
          </View>
        </View>
      </DemoBlock>
      <DemoBlock
        title={`${i18n.getLang('advancedUsage_1')}`}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value1}
          innerRingRadius={84}
          ringRadius={120}
          ringBorderColor="rgba(255, 255, 255, 1)"
          colorList={[
            { offset: 0, color: '#fbebaf' },
            { offset: 0.25, color: '#efb4a3' },
            { offset: 0.5, color: '#ee7a79' },
            { offset: 1, color: '#ec80a7' },
          ]}
          startDegree={180}
          offsetDegree={180}
          onTouchMove={handleMove1}
          onTouchEnd={handleEnd1}
        />
      </DemoBlock>
      <DemoBlock
        title={`${i18n.getLang('advancedUsage_2')}`}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value2}
          innerRingRadius={84}
          ringRadius={100}
          startDegree={300}
          offsetDegree={300}
          colorList={[
            { offset: 0, color: '#eced77' },
            { offset: 0.5, color: '#ef865b' },
            { offset: 1, color: '#7be0f8' },
          ]}
          onTouchMove={handleMove2}
          onTouchEnd={handleEnd2}
        />
      </DemoBlock>
      <DemoBlock
        title={`${i18n.getLang('advancedUsage_3')}`}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value3}
          innerRingRadius={84}
          ringRadius={100}
          startDegree={0}
          colorList={[
            { offset: 0, color: '#e8a989' },
            { offset: 0.5, color: '#efce85' },
            { offset: 1, color: '#d66e6b' },
          ]}
          offsetDegree={180}
          onTouchMove={handleMove3}
          onTouchEnd={handleEnd3}
        />
      </DemoBlock>
      <DemoBlock
        title={`${i18n.getLang('advancedUsage_4')}`}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value4}
          startDegree={90}
          offsetDegree={360}
          colorList={[
            { offset: 0, color: '#e8a989' },
            { offset: 0.5, color: '#efce85' },
            { offset: 1, color: '#d66e6b' },
          ]}
          onTouchMove={handleMove4}
          onTouchEnd={handleEnd4}
        />
      </DemoBlock>
      <DemoBlock
        title={`${i18n.getLang('advancedUsage_5')}`}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value4}
          startDegree={45}
          offsetDegree={315}
          touchCircleStrokeStyle="red"
          thumbBorderWidth={3}
          thumbBorderColor="blue"
          colorList={[
            { offset: 0, color: '#e8a989' },
            { offset: 0.5, color: '#efce85' },
            { offset: 1, color: '#d66e6b' },
          ]}
          renderInnerCircle={() => (
            <View
              style={{
                width: 160,
                height: 160,
                backgroundColor: '#d66e6b',
                borderRadius: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 自定义内容: */}
              <Text>
                {i18n.getLang('custom')}:{value5}
              </Text>
            </View>
          )}
          onTouchMove={handleMove5}
          onTouchEnd={handleEnd5}
        />
      </DemoBlock>

      <DemoBlock
        title={i18n.getLang('advancedUsage_6')}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value}
          ringRadius={135}
          thumbRadius={30}
          innerRingRadius={130}
          colorList={[
            { offset: 0, color: '#295bdd' },
            { offset: 0.5, color: '#6A53D1' },
            { offset: 1, color: '#f65028' },
          ]}
          thumbOffset={20}
          startDegree={135}
          offsetDegree={270}
          touchCircleStrokeStyle="rgba(0, 0, 0, 0.4)"
          thumbBorderWidth={0}
          onTouchStart={handleTouchStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </DemoBlock>

      <DemoBlock
        title={i18n.getLang('advancedUsage_7')}
        style={{
          color: 'black',
        }}
      >
        <RayCircleProgress
          value={value}
          trackColor="#ef7e85"
          colorList={[
            { offset: 0, color: '#1a202c' },
            { offset: 1, color: '#7eb4fe' },
          ]}
          compatibleMode
          thumbColor="#ffffff"
          startDegree={135}
          offsetDegree={270}
          touchCircleStrokeStyle="rgba(0, 0, 0, 0.4)"
          thumbBorderWidth={0}
          onTouchStart={handleTouchStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </DemoBlock>
    </View>
  );
}
