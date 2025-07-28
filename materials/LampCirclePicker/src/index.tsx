import React, { useMemo } from 'react';
import { View, Text } from '@ray-js/components';
import clsx from 'clsx';

import Strings from './i18n';
import AnnulusPickerColor from './component';
import styled from './index.module.less';
import { IProps } from './props';

const LampCirclePicker = (props: IProps) => {
  const {
    value,
    hideThumb,
    temperature,
    radius,
    innerRingRadius,
    colorList,
    useEventChannel,
    eventChannelName,
    lineCap,
    titleStyle,
    descStyle,
    descText,
    showInnerCircle = true,
    touchCircleLineWidth = 0,
    touchCircleStrokeStyle = '',
    innerBorderStyle = {
      width: 5,
      color: '#eee',
    },
    style,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = props;

  const innerImgRadius = innerRingRadius * 4 * 0.8;
  const _value = value ?? temperature;
  const canvasId = useMemo(() => {
    return `canvasId_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`;
  }, []);

  const borderWidth = innerBorderStyle?.width;
  const borderColor = innerBorderStyle?.color;

  const _colorList = useMemo(() => {
    return colorList.map(i => {
      return {
        ...i,
        offset: i.offset * 0.75,
      };
    });
  }, [colorList]);
  return (
    <View className={clsx(styled.container, styled.flexCenter)} style={style}>
      <AnnulusPickerColor
        canvasId={canvasId}
        hideThumb={hideThumb}
        value={_value}
        radius={radius}
        touchCircleLineWidth={touchCircleLineWidth}
        touchCircleStrokeStyle={touchCircleStrokeStyle}
        innerRingRadius={innerRingRadius}
        colorList={_colorList}
        lineCap={lineCap}
        useEventChannel={useEventChannel || false}
        eventChannelName={eventChannelName}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      <View className={clsx(styled.innerBox, styled.flexCenter)}>
        {showInnerCircle && (
          <View
            className={styled.ringIcon}
            style={{
              width: innerImgRadius,
              height: innerImgRadius,
              borderRadius: innerImgRadius,
              border: `${borderWidth}px solid ${borderColor}`,
            }}
          />
        )}
        <View className={clsx(styled.textBox, styled.flexCenter)}>
          <Text className={styled.title} style={titleStyle}>
            {Math.trunc(_value / 10)}%
          </Text>
          <Text className={styled.desc} style={descStyle}>
            {descText ?? Strings.getLang('temperature')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const nilFn = () => null;
LampCirclePicker.defaultProps = {
  radius: 140,
  innerRingRadius: 80,
  colorList: [
    {
      offset: 0,
      color: '#FFCD65',
    },
    {
      offset: 0.5,
      color: '#FEECAB',
    },
    {
      offset: 1,
      color: '#CEEDFF',
    },
  ],
  useEventChannel: false,
  eventChannelName: 'lampCirclePickerEventChannel',
  titleStyle: {},
  descStyle: {},
  style: {},
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
};

export default LampCirclePicker;
