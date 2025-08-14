/* eslint-disable no-self-compare */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React from 'react';
import { View } from '@ray-js/ray';
import { utils } from '@ray-js/panel-sdk';

import { classPrefix } from '../constant';
import './index.less';

const { brightKelvin2rgb, hsv2rgb } = utils;

export interface IColor {
  h?: number;
  s?: number;
  v?: number;
  b?: number;
  t?: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorSelectorIconProps {
  circleSize: number;
  colorData: IColor;
  isSelected: boolean;
  isShowDelete?: boolean;
  colorItemStyle?: React.CSSProperties;
  onClick?: () => void;
  onLongPress?: () => void;
  renderDeleteElement?: null | (() => React.ReactNode);
}

export const calcPosition = (value, min, max, newMin, newMax) => {
  return Math.round(((value - min) * (newMax - newMin)) / (max - min) + newMin);
};

const ColorSelectorCircle = (props: ColorSelectorIconProps) => {
  const {
    circleSize = 48,
    colorData,
    colorItemStyle = {},
    isSelected,
    onClick,
    onLongPress,
    isShowDelete,
    renderDeleteElement,
  } = props;
  const { h, s, v, b, t } = colorData;
  // 矫正value过低时，颜色为黑色
  let colorStr = 'transparent';
  if (b !== undefined && t !== undefined) {
    colorStr = brightKelvin2rgb(200 + 800 * (b / 1000), t);
  } else {
    const newV = calcPosition(v, 10, 1000, 10, 100);
    const [_r, _g, _b] = hsv2rgb(h, Math.round(s / 10), newV);
    colorStr = `rgb(${_r}, ${_g}, ${_b})`;
  }

  const scaleValue = isSelected ? 0.75 : 1;

  const handleLongPress = () => {
    onLongPress && onLongPress();
  };

  const handleClick = () => {
    onClick && onClick();
  };

  const isCustomRenderDelete = renderDeleteElement && typeof renderDeleteElement === 'function';
  return (
    <View
      className={`${classPrefix}__circle--wrapper`}
      style={{
        width: `${circleSize * 2}rpx`,
        height: `${circleSize * 2}rpx`,
      }}
      onClick={handleClick}
      // View 内部无此 onLongPress ts 提示， 实际存在
      onLongPress={handleLongPress}
    >
      <View
        className={`${classPrefix}__circle`}
        style={{ transform: `scale(${scaleValue})`, ...colorItemStyle }}
      >
        <View
          className={`${classPrefix}__circle--color`}
          style={{ backgroundColor: `${colorStr}` }}
        />
      </View>

      {isSelected && (
        <View className={`${classPrefix}__circle--border`} style={{ borderColor: `${colorStr}` }} />
      )}
      {isCustomRenderDelete && isSelected && isShowDelete && renderDeleteElement()}
      {!isCustomRenderDelete && isSelected && isShowDelete && (
        <View className={`${classPrefix}__circle--delete`} />
      )}
    </View>
  );
};

const nilFn = () => null;

ColorSelectorCircle.defaultProps = {
  colorItemStyle: {},
  isShowDelete: false,
  onClick: nilFn,
  onLongPress: nilFn,
  renderDeleteElement: null,
};

export default ColorSelectorCircle;
