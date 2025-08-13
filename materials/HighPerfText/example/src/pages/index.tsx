import React from 'react';
import { View, Text, Button, usePageInstance } from '@ray-js/ray';
import PerfText from '@ray-js/components-ty-perf-text';
import { Slider as SmartSlider } from '@ray-js/smart-ui';
import Slider from '@ray-js/components-ty-slider';
import styles from './index.module.less';

const { RangeSlider } = SmartSlider;

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
  const [val2, setVal2] = React.useState(0.8);

  React.useEffect(() => {
    setTimeout(() => {
      setVal(60);
    }, 3000);
  }, []);

  const instance = usePageInstance();
  const channel = instance.getOpenerEventChannel();

  return (
    <View className={styles.view}>
      <DemoBlock title="基础用法">
        <View style={{ marginBottom: 48 }}>
          数值展示1:
          <PerfText
            defaultValue={val}
            fixNum={0}
            valueScale={0.1}
            type="origin"
            eventName="sliderMove1"
          />
          %
        </View>
        <Slider
          min={10}
          max={1000}
          value={val}
          onAfterChange={setVal}
          moveEventName="sliderMove1"
        />
      </DemoBlock>
      <DemoBlock title="基础用法">
        <View style={{ marginBottom: 48 }}>
          数值展示2:
          <PerfText defaultValue={val} valueScale={0.1} type="perf" eventName="sliderMove11" />%
        </View>
        <Slider
          min={10}
          max={1000}
          value={val}
          onAfterChange={setVal}
          moveEventName="sliderMove11"
        />
      </DemoBlock>
      <DemoBlock title="负值">
        <View style={{ marginBottom: 48 }}>
          数值展示:
          <PerfText valueScale={1 / 10} eventName="sliderMoveN1" />%
        </View>
        <Slider max={300} min={10} moveEventName="sliderMoveN1" />
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
      <DemoBlock title="最小最大值">
        <View style={{ marginBottom: 48 }}>
          数值展示：
          <PerfText
            min={20}
            max={50}
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
      <DemoBlock title="小数">
        <View style={{ marginBottom: 48, display: 'flex' }}>
          <Button
            onClick={() => {
              setVal2(Math.max(Math.min(val2 - 0.1, 9), -9));
            }}
          >
            减少值
          </Button>
          <Button
            style={{ marginLeft: 24 }}
            onClick={() => {
              setVal2(Math.max(Math.min(val2 + 0.1, 9), -9));
            }}
          >
            增加值
          </Button>
        </View>
        <View style={{ marginBottom: 48 }}>
          <View>
            原始值：
            {Number(val2).toFixed(1)}%
          </View>
          <View>
            数值展示：
            <PerfText
              eventName="sliderMove4"
              style={{
                color: 'green',
                fontSize: '24px',
                fontWeight: '600',
                marginRight: '2px',
              }}
              valueScaleMathType="fix"
              fixNum={1}
            />
            %
          </View>
        </View>
        <Slider
          moveEventName="sliderMove4"
          value={val2}
          min={-9}
          step={0.1}
          max={9}
          onChange={val => {
            console.log('🚀 ~ onChange ~ val:', val);
          }}
          onAfterChange={val => {
            console.log('🚀 ~ onAfterChange ~ val:', val);
            setVal2(val);
          }}
        />
      </DemoBlock>
    </View>
  );
}
