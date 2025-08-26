import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/ray';
import PercentSlider from '@ray-js/lamp-percent-slider';
import styles from './index.module.less';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const [value, onChange] = useState(30);

  useEffect(() => {
    // 模拟dp上报
    setTimeout(() => {
      onChange(72);
    }, 1000);
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <PercentSlider value={value} onTouchEnd={onChange} />
      </DemoBlock>
      <DemoBlock title="只显示数值">
        <PercentSlider showIcon={false} value={value} onTouchEnd={onChange} />
      </DemoBlock>
      <DemoBlock title="只显示图标">
        <PercentSlider showText={false} value={value} onTouchEnd={onChange} />
      </DemoBlock>
      <DemoBlock title="隐藏图标和数值">
        <PercentSlider showIcon={false} showText={false} value={value} onTouchEnd={onChange} />
      </DemoBlock>
      <DemoBlock title="自定义最大值">
        <PercentSlider max={1000} />
      </DemoBlock>
      <DemoBlock title="自定义最小值">
        <PercentSlider
          instanceId="cusmin"
          min={20}
          max={100}
          value={value}
          onTouchEnd={end => {
            onChange(end);
          }}
        />
      </DemoBlock>
      <DemoBlock title="自定义按钮">
        <PercentSlider
          min={20}
          max={100}
          value={value}
          onTouchEnd={end => {
            onChange(end);
          }}
          thumbStyle={{
            width: 10,
            position: 'relative',
            backgroundSize: '10px 26px',
            borderRadius: '0px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left',
            boxShadow: 'none',
            backgroundImage:
              'url(https://images.tuyacn.com/rms-static/02eda960-8838-11ee-8bb1-51351f353ef3-1700548464374.png?tyName=txp-percent-slider.png)',
          }}
        />
      </DemoBlock>
      <DemoBlock title="自定义滑槽">
        <PercentSlider
          min={20}
          max={100}
          value={value}
          showIcon={false}
          showText={false}
          onTouchEnd={end => {
            onChange(end);
          }}
          thumbStyle={{
            width: 10,
            position: 'relative',
            backgroundSize: '10px 26px',
            borderRadius: '0px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left',
            boxShadow: 'none',
            backgroundImage:
              'url(https://images.tuyacn.com/rms-static/02eda960-8838-11ee-8bb1-51351f353ef3-1700548464374.png?tyName=txp-percent-slider.png)',
          }}
          barStyle={{
            height: '16px',
          }}
          trackStyle={{
            height: '16px',
            background:
              'linear-gradient(to right, #E8F4FD 0%, #E8F4FD 33%, #B3D9F4 33%, #B3D9F4 66%, #94C3E5 66%, #94C3E5 100%)',
          }}
        />
      </DemoBlock>
    </View>
  );
}
