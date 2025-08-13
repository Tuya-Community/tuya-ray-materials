import React from 'react';
import { View, Image, Text } from '@ray-js/components';
import clsx from 'clsx';

import Strings from './i18n';
import { formatColorText } from './utils';
import AnnulusPickerColor from './component';
import styled from './index.module.less';
import res from './res';
import { IProps } from './props';

const { ring } = res;

const ColorRing = (props: IProps) => {
  const {
    value,
    innerRingRadius,
    isShowColorTip,
    isShowAngleTip,
    angleTipText,
    colorTipText,
    radius,
    useEventChannel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = props;
  const renderColor = () => {
    if (!isShowColorTip) {
      return null;
    }
    if (colorTipText) {
      return <Text className={styled.title}>{colorTipText}</Text>;
    }
    return <Text className={styled.title}>{formatColorText(value)}</Text>;
  };
  const renderAngle = () => {
    if (!isShowAngleTip) {
      return null;
    }
    if (angleTipText) {
      return <Text className={styled.desc}>{angleTipText}</Text>;
    }
    return (
      <Text className={styled.desc}>
        {Strings.getLang('angle')}:{value}°
      </Text>
    );
  };
  const renderInner = () => {
    if (!isShowAngleTip && !isShowColorTip) {
      return null;
    }
    return (
      <View className={clsx(styled.innerBox, styled.flexCenter)}>
        <Image src={ring} className={styled.ringIcon} />
        <View className={clsx(styled.textBox, styled.flexCenter)}>
          {renderColor()}
          {renderAngle()}
        </View>
      </View>
    );
  };
  return (
    <View className={clsx(styled.container, styled.flexCenter)}>
      <AnnulusPickerColor
        value={value}
        radius={radius}
        innerRingRadius={innerRingRadius}
        useEventChannel={useEventChannel || false}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
      {renderInner()}
    </View>
  );
};

const nilFn = () => null;

ColorRing.defaultProps = {
  radius: 140,
  isShowAngleTip: true,
  isShowColorTip: true,
  innerRingRadius: 80,
  onTouchStart: nilFn,
  onTouchMove: nilFn,
  onTouchEnd: nilFn,
};

export default ColorRing;
