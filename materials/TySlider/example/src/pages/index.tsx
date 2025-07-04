/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { View, Text } from '@ray-js/components';
import Slider from '@ray-js/components-ty-slider';
import LampCirclePickerColor from '@ray-js/lamp-circle-picker-color';
import { Popup } from '@ray-js/smart-ui/lib/popup';
import { Cell } from '@ray-js/smart-ui/lib/cell';
import styles from './index.module.less';
import CustomBar from './custom-bar';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const [value, setValue] = React.useState(70);
  const [value2, setValue2] = React.useState(70);
  const [showSliderValue, setShowSliderValue] = useState(70);

  const [hue, setHue] = useState(70);
  const [sat, setSat] = useState(70);

  const [colorValue, setColorValue] = React.useState(30);
  const [tempValue, setTempValue] = React.useState(30);
  const [type, setType] = useState<'color' | 'white'>('color');

  const [show, setShow] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const showBasic = () => setShow(true);
  const hideBasic = () => setShow(false);
  const handleChange = value => {
    setValue2(value);
  };

  const onChange = (event: number) => {
    console.log('onChange:', event);
    setShowSliderValue(event);
  };
  const onStart = val => {
    console.log('onStart:', val);
    //
  };
  const onEnd = val => {
    console.log('onEnd:', val);
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
          trackBackgroundColorRenderMode="track"
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
          <View
            style={{
              padding: 24,
              background: 'gray',
            }}
          >
            <View
              style={{
                marginBottom: 24,
                color: '#fff',
              }}
            >
              {showSliderValue}
            </View>
            <Slider
              isVertical
              value={value}
              step={5}
              min={50}
              max={700}
              parcel
              parcelMargin={6}
              useParcelPadding={false}
              thumbWidth={40}
              thumbHeight={10}
              thumbRadius={10}
              maxTrackWidth="217rpx"
              maxTrackHeight="651rpx"
              maxTrackRadius="20rpx"
              minTrackWidth="217rpx"
              minTrackHeight="20rpx"
              maxTrackColor="rgba(255, 255, 255, 0.16)"
              minTrackColor="whitesmoke"
              onChange={newValue => {
                setShowSliderValue(newValue);
              }}
              onAfterChange={setValue} // 松开滑块时触发
              thumbStyle={{
                // backgroundColor: thumbColor,
                borderRadius: '10px',
                width: '60rpx',
                height: '10rpx',
                // top: '-50rpx',
                // transform: 'translateY(-50%)', // 垂直居中
              }}
            />
          </View>
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
      <DemoBlock title="在Tab中切换">
        <View className={styles.tabs}>
          <View
            className={styles.tab}
            style={{
              background: type === 'color' ? '#bcffff' : '#fff',
            }}
            onClick={() => setType('color')}
          >
            彩光
          </View>
          <View
            className={styles.tab}
            style={{
              background: type === 'white' ? '#bcffff' : '#fff',
            }}
            onClick={() => setType('white')}
          >
            色温
          </View>
        </View>
        <View className={styles.tabContent}>
          {type === 'color' && (
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
              instanceId="color_slider"
              value={colorValue}
              onAfterChange={setColorValue}
            />
          )}
          {type === 'white' && (
            <Slider
              thumbStyle={{
                border: '4px solid #fff',
                backgroundColor: '#C2C2C2',
                width: '68rpx',
                height: '68rpx',
              }}
              thumbWrapStyle={{
                borderRadius: '50%',
              }}
              inferThumbBgColorFromTrackBgColor
              maxTrackColor="linear-gradient(to left, #CEECFE 0%, #FFFFFF 50%, #FBCA5C 100%)"
              minTrackColor="transparent"
              maxTrackHeight="32rpx"
              minTrackHeight="32rpx"
              maxTrackRadius="32rpx"
              minTrackRadius="32rpx"
              instanceId="temp_slider"
              value={tempValue}
              onAfterChange={setTempValue}
            />
          )}
        </View>
      </DemoBlock>
      <DemoBlock title="联动">
        <Slider
          value={hue}
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
          onAfterChange={setHue}
          moveEventName="hueSliderChange"
          thumbStyleRenderFormatter={{
            background: 'hsl(valuedeg 100% 50%)',
          }}
        />
        <Slider
          value={sat}
          min={0}
          instanceId="hueTest"
          max={1000}
          onAfterChange={setSat}
          thumbStyleRenderValueScale={0.05}
          trackBackgroundColorHueEventName="hueSliderChange"
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
      </DemoBlock>
      <DemoBlock title="Step间隔">
        <View>值：{showSliderValue}</View>
        <Slider
          isShowTicks
          step={30}
          forceStep={10}
          min={0}
          max={120}
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
          onChange={onChange}
          onAfterChange={onEnd}
        />
        <Slider
          isShowTicks
          step={2}
          forceStep={4}
          max={50}
          min={10}
          style={{ marginTop: 16 }}
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
          onChange={onChange}
          onAfterChange={onEnd}
        />
      </DemoBlock>
      <DemoBlock title="和 ColorPicker 联动">
        <Slider
          value={sat}
          min={0}
          instanceId="hueTest2"
          max={1000}
          onAfterChange={setSat}
          thumbStyleRenderValueScale={0.05}
          trackBackgroundColorHueEventName="lampCirclePickerColorEventChannel"
          trackBackgroundColorHueEventNameTemplate="linear-gradient(90deg, hsl($hue 100% 50%) 5%, #FFFFFF 154%)"
          trackBackgroundColorHueEventNameEnableItems="bar"
          thumbStyleRenderValueStart={50}
          thumbStyleRenderFormatter={{
            background: 'hsl(20deg 100% value%)',
          }}
          thumbStyleRenderValueReverse
          trackStyle={{
            background: 'transparent',
          }}
          style={{ marginTop: 48, marginBottom: 60 }}
        />
        <LampCirclePickerColor
          thumbRadius={15}
          radius={140}
          whiteRange={0.15}
          useEventChannel
          eventChannelName="lampCirclePickerColorEventChannel"
        />
      </DemoBlock>
      <DemoBlock title="Bar插槽">
        <Slider
          moveEventName="sliderMove2"
          step={10}
          isShowTicks
          maxTrackHeight="8px"
          maxTrackRadius="8px"
          minTrackHeight="8px"
          minTrackRadius="8px"
          minTrackColor="transparent"
          tickHeight="4px"
          tickWidth="4px"
          tickRadius="2px"
          value={value}
          onBeforeChange={onStart}
          onAfterChange={onEnd}
          slot={{
            bar: <CustomBar />,
          }}
        />
      </DemoBlock>
      <DemoBlock title="thumb插槽">
        <Slider
          moveEventName="sliderMove2"
          parcel
          parcelMargin={2}
          minTrackRadius="13px"
          minTrackHeight="22px"
          maxTrackRadius="13px"
          maxTrackHeight="26px"
          thumbWidth={18}
          style={{
            marginTop: '12px',
          }}
          thumbHeight={18}
          value={value}
          onBeforeChange={onStart}
          onChange={onChange}
          onAfterChange={onEnd}
          thumbStyle={{
            background: 'transparent',
            boxShadow: 'none',
            opacity: 1,
          }}
          slot={{
            thumb: (
              <View
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#9f9f9f',
                    borderRadius: '8px',
                    padding: '2px 4px',
                    color: '#fff',
                  }}
                >
                  {showSliderValue}
                </View>
              </View>
            ),
          }}
        />
      </DemoBlock>
      <DemoBlock title="thumb插槽">
        <Cell title="展示弹出层" isLink onClick={showBasic} />
        <Popup
          show={show}
          position="bottom"
          onClose={hideBasic}
          onAfterEnter={() => setIsReady(true)}
        >
          <View style={{ padding: '32px', position: 'relative' }}>
            <View style={{ height: 100, background: '#efefef' }}>上方内容</View>
            <Slider
              style={{ margin: '24px 0' }}
              value={value2}
              max={100}
              min={0}
              onAfterChange={handleChange}
              deps={[show]}
            />
            <View style={{ height: 100, background: '#efefef' }}>下方内容</View>
          </View>
        </Popup>
      </DemoBlock>
    </View>
  );
}
