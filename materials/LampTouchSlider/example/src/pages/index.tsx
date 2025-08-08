/* eslint-disable no-restricted-syntax */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { View, Text, Button } from '@ray-js/ray';
import TouchSlider from '@ray-js/lamp-touch-slider';
import styles from './index.module.less';
import Strings from '../i18n';

const DemoBlock = ({
  title,
  children,
  style,
}: {
  title: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <View className={styles.demoBlock} style={style}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const [value1, setValue1] = useState(82);
  console.log('value1:', value1);
  const [value2, setValue2] = useState(860);
  const [value3, setValue3] = useState(40);

  const [displayType, setDisplayType] = useState<'icon' | 'text'>('icon');

  // console.log('value2:', value2);
  return (
    <View className={styles.view}>
      <DemoBlock title={Strings.getLang('basic')}>
        <TouchSlider value={value1} min={20} max={100} onTouchEnd={setValue1} />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('show')}>
        <TouchSlider
          showButtons
          step={10}
          min={100}
          max={1000}
          value={value2}
          onTouchEnd={setValue2}
        />
      </DemoBlock>
      <View style={{ display: 'flex' }}>
        <Button onClick={() => setDisplayType('text')}>{Strings.getLang('hideIcon')}</Button>
        <Button onClick={() => setDisplayType('icon')}>{Strings.getLang('showIcon')}</Button>
      </View>
      <DemoBlock
        title={Strings.getLang('hideIcon')}
        style={{ display: displayType === 'text' ? 'none' : 'block' }}
      >
        <TouchSlider
          instanceId="slider11"
          debug
          showIcon={false}
          value={value1}
          onTouchEnd={setValue1}
          hidden={displayType === 'text'}
        />
      </DemoBlock>
      <DemoBlock
        title={Strings.getLang('showIcon')}
        style={{ display: displayType !== 'text' ? 'none' : 'block' }}
      >
        <TouchSlider
          hidden={displayType === 'icon'}
          instanceId="slider12"
          debug
          value={value3}
          onTouchEnd={setValue3}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('hideText')}>
        <TouchSlider showText={false} value={value1} onTouchEnd={setValue2} />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('customMin')}>
        <TouchSlider min={20} value={value2} onTouchEnd={setValue2} />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('customHigh')}>
        <TouchSlider
          min={20}
          value={value2}
          onTouchEnd={setValue2}
          trackStyle={{ height: '40px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}
          barStyle={{
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
          }}
          textColor="white"
          bgTextColor="black"
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('numericScaling')}>
        <TouchSlider
          step={10}
          min={100}
          max={1000}
          textValueScale={0.1}
          value={value2}
          onTouchEnd={setValue2}
        />
      </DemoBlock>
    </View>
  );
}
