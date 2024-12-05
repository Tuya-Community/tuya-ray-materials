/* eslint-disable import/no-unresolved */
import React from 'react';
import { View, Text } from '@ray-js/components';
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
  const [value, setValue] = React.useState(30);

  const onChange = (event: number) => {
    setValue(event);
  };
  const onStart = () => {
    //
  };
  const onEnd = val => {
    setValue(val);
  };

  return (
    <View className={styles.view}>
      <DemoBlock title="NormalSlider 自定义样式">
        <Slider
          moveEventName="sliderMove2"
          step={10}
          isShowTicks
          maxTrackHeight="8px"
          maxTrackRadius="8px"
          minTrackHeight="8px"
          minTrackRadius="8px"
          minTrackColor="linear-gradient(to right, #158CFB, orange)"
          tickHeight="4px"
          tickWidth="4px"
          tickRadius="2px"
          value={value}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="NormalSlider">
        <Slider
          moveEventName="sliderMove"
          enableTouch={false}
          minTrackRadius="4px"
          maxTrackHeight="4px"
          minTrackHeight="4px"
          max={12}
          min={1}
          step={0.5}
          value={value}
          onBeforeChange={onStart}
          onChange={e => {
            console.log(e);
          }}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="NormalSlider 50~400">
        <Slider
          moveEventName="sliderMove"
          enableTouch={false}
          minTrackRadius="4px"
          maxTrackHeight="4px"
          minTrackHeight="4px"
          max={400}
          min={50}
          step={5}
          value={value}
          onBeforeChange={onStart}
          onChange={e => {
            console.log(e);
          }}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="NormalSlider Step">
        <Slider
          moveEventName="sliderMove"
          enableTouch={false}
          minTrackRadius="4px"
          maxTrackHeight="4px"
          minTrackHeight="4px"
          max={9}
          min={-9}
          step={1}
          value={value}
          onBeforeChange={onStart}
          onChange={console.log}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="NormalSlider 自定义样式">
        <Slider
          moveEventName="sliderMove2"
          step={10}
          isShowTicks
          maxTrackHeight="8px"
          maxTrackRadius="8px"
          minTrackHeight="8px"
          minTrackRadius="8px"
          minTrackColor="linear-gradient(to right, #158CFB, orange)"
          tickHeight="4px"
          tickWidth="4px"
          tickRadius="2px"
          value={value}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="Parcel Slider">
        <Slider
          instanceId="parcel_slider"
          parcel
          parcelMargin={2}
          minTrackRadius="13px"
          minTrackHeight="22px"
          maxTrackRadius="13px"
          maxTrackHeight="26px"
          onBeforeChange={e => console.log('onBeforeChange', e)}
          onAfterChange={e => console.log('onAfterChange', e)}
          onChange={e => console.log('onChange', e)}
          thumbWidth={18}
          thumbHeight={18}
        />
      </DemoBlock>
      <DemoBlock title="Custom Thumb">
        <Slider
          minTrackRadius="8px"
          minTrackHeight="45px"
          maxTrackRadius="8px"
          maxTrackHeight="45px"
          value={value}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
          thumbWidth={15}
          thumbHeight={50}
          thumbRadius={2}
          thumbStyle={{
            background: '#BBC5D4',
            border: '2px solid #FFFFFF',
            boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.5)',
          }}
        />
      </DemoBlock>
      <DemoBlock title="NormalSlider disabled">
        <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Slider
            maxTrackHeight="4px"
            disabled
            minTrackHeight="4px"
            style={{ width: '400rpx' }}
            maxTrackColor="orange"
            value={value}
            onBeforeChange={onStart}
            onAfterChange={onEnd}
            minTrackRadius="4px"
          />
          <View style={{ marginLeft: '4px' }}>
            <Text>{value}</Text>
          </View>
        </View>
      </DemoBlock>
      <DemoBlock title="ScaleSlider">
        <Slider
          isShowTicks
          step={30}
          min={0}
          max={90}
          maxTrackHeight="40px"
          maxTrackRadius="16px"
          minTrackWidth="40px"
          minTrackHeight="40px"
          minTrackRadius="16px"
          tickWidth="4px"
          tickHeight="12px"
          tickRadius="4px"
          hideThumbButton
          value={value}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="垂直方向">
        <View style={{ display: 'flex', padding: '0 10px' }}>
          <Slider
            isVertical
            maxTrackWidth="4px"
            maxTrackHeight="200px"
            minTrackWidth="4px"
            minTrackHeight="28px"
            minTrackRadius="4px"
            style={{ marginRight: '30px' }}
            value={value}
            onBeforeChange={onStart}
            onAfterChange={onEnd}
          />
          <Slider
            instanceId="parcel_slider2"
            parcel
            parcelMargin={2}
            isVertical
            minTrackRadius="13px"
            minTrackWidth="22px"
            maxTrackRadius="13px"
            maxTrackWidth="26px"
            maxTrackHeight="200px"
            value={value}
            onBeforeChange={onStart}
            onAfterChange={onEnd}
            thumbWidth={18}
            thumbHeight={18}
            style={{ marginRight: '30px' }}
          />
          <Slider
            isVertical
            isShowTicks
            hideThumbButton
            step={25}
            min={0}
            max={100}
            maxTrackWidth="40px"
            maxTrackHeight="200px"
            maxTrackRadius="16px"
            minTrackWidth="40px"
            minTrackHeight="40px"
            minTrackRadius="16px"
            tickWidth="12px"
            tickHeight="4px"
            tickRadius="4px"
            value={value}
            onBeforeChange={onStart}
            onAfterChange={onEnd}
          />
        </View>
      </DemoBlock>
      <DemoBlock title="Sjs 支持 Hsv 渲染">
        <Slider
          value={value}
          min={0}
          max={1000}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
          thumbStyleRenderValueScale={0.1}
          thumbStyleRenderFormatter={{
            background: 'hsl(0deg 0% value%)',
          }}
          trackStyle={{
            background:
              'linear-gradient(270deg, rgb(255, 255, 255) 2.57%, rgba(255, 255, 255, 0) 100.64%)',
          }}
          style={{ background: 'black' }}
          barStyle={{
            background: 'transparent',
          }}
        />
        <Slider
          value={value}
          min={0}
          max={100}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
          thumbStyleRenderValueScale={0.5}
          thumbStyleRenderFormatter={{
            background: 'hsl(0deg 100% value%)',
          }}
          trackStyle={{
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0), rgb(255, 0, 0))',
          }}
          style={{ background: 'black', marginTop: 48 }}
          barStyle={{
            background: 'transparent',
          }}
        />
        <Slider
          value={value}
          min={0}
          max={360}
          trackStyle={{
            background:
              'linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), linear-gradient(90.01deg, rgb(255, 0, 0) 0.01%, rgb(248, 203, 14) 12.14%, rgb(128, 254, 6) 21.83%, rgb(8, 251, 43) 32.75%, rgb(4, 250, 252) 46.38%, rgb(2, 67, 252) 58.38%, rgb(135, 0, 249) 70.04%, rgb(252, 0, 239) 80.06%, rgb(240, 10, 91) 89.92%, rgb(255, 0, 0) 99.99%)',
          }}
          style={{ background: 'black', marginTop: 48 }}
          barStyle={{
            background: 'transparent',
          }}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
          thumbStyleRenderFormatter={{
            background: 'hsl(valuedeg 100% 50%)',
          }}
        />
        <Slider
          value={value}
          min={0}
          max={1000}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
          thumbStyleRenderValueScale={0.05}
          thumbStyleRenderValueStart={50}
          thumbStyleRenderFormatter={{
            background: 'hsl(20deg 100% value%)',
          }}
          thumbStyleRenderValueReverse
          trackStyle={{
            background:
              'linear-gradient(to right, rgba(255, 85, 0, 0.01) 0%, rgb(255, 85, 0) 100%)',
          }}
          style={{ marginTop: 48 }}
          barStyle={{
            background: 'transparent',
          }}
        />
        <Slider
          thumbStyle={{
            border: '4px solid #fff',
            backgroundColor: '#C2C2C2',
            width: '68rpx',
            height: '68rpx',
          }}
          maxTrackColor="linear-gradient(to left, rgba(255, 255, 255, 1) 3%, rgba(255, 255, 255, 0) 100%)"
          minTrackColor="transparent"
          maxTrackHeight="70rpx"
          minTrackHeight="70rpx"
          maxTrackRadius="35rpx"
          minTrackRadius="35rpx"
          min={0}
          max={360}
          moveEventName="ColorSliderMove"
          trackStyle={{
            background:
              'linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), linear-gradient(90.01deg, rgb(255, 0, 0) 0.01%, rgb(248, 203, 14) 12.14%, rgb(128, 254, 6) 21.83%, rgb(8, 251, 43) 32.75%, rgb(4, 250, 252) 46.38%, rgb(2, 67, 252) 58.38%, rgb(135, 0, 249) 70.04%, rgb(252, 0, 239) 80.06%, rgb(240, 10, 91) 89.92%, rgb(255, 0, 0) 99.99%)',
          }}
          barStyle={{
            background: 'transparent',
          }}
          thumbStyleRenderFormatter={{
            background: `hsl(valuedeg 100% 50%)`,
          }}
          style={{ marginTop: 48 }}
        />
      </DemoBlock>
    </View>
  );
}
