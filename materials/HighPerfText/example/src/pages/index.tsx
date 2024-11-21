import React from 'react';
import { View, Text } from '@ray-js/ray';
import PerfText from '@ray-js/components-ty-perf-text';
import Slider from '@ray-js/components-ty-slider';
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
  const [val, setVal] = React.useState(35);

  React.useEffect(() => {
    setTimeout(() => {
      setVal(60);
    }, 3000);
  }, []);

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <View style={{ marginBottom: 48 }}>
          数值展示：
          <PerfText defaultValue={val} valueScale={1 / 10} eventName="sliderMove1" />%
        </View>
        <Slider value={val} onAfterChange={setVal} moveEventName="sliderMove1" />
      </DemoBlock>
      <DemoBlock title="自定义样式">
        <View style={{ marginBottom: 48 }}>
          数值展示：
          <PerfText
            eventName="sliderMove2"
            style={{
              color: 'green',
              fontSize: '24px',
              fontWeight: '600',
              marginRight: '2px',
            }}
          />
          %
        </View>
        <Slider moveEventName="sliderMove2" />
      </DemoBlock>
      <DemoBlock title="数值缩放">
        <View style={{ marginBottom: 48 }}>
          数值展示：
          <PerfText
            eventName="sliderMove3"
            style={{
              color: 'green',
              fontSize: '24px',
              fontWeight: '600',
              marginRight: '2px',
            }}
            valueScale={1 / 10}
          />
          %
        </View>
        <Slider min={10} max={1000} moveEventName="sliderMove3" onChange={console.log} />
      </DemoBlock>
    </View>
  );
}
