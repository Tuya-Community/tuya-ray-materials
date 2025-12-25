/* eslint-disable no-self-compare */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React from 'react';
import { View } from '@ray-js/ray';

import { brightKelvin2rgba, hsvToRgb } from '@/utils/color';
import { useDebugPerf } from '@/hooks/useDebugPerf';

import style from './index.module.less';

interface HSV {
  h: number;
  s: number;
  v: number;
}
interface BT {
  b: number;
  t: number;
}
export type IColor = HSV | BT;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorSelectorIconProps {
  colorData: IColor;
  isSelected: boolean;
  colorItemStyle?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

const ColorSelectorCircle = (props: ColorSelectorIconProps) => {
  useDebugPerf(ColorSelectorCircle, props);

  const { colorData, colorItemStyle = {}, isSelected, children, onClick } = props;
  const { h, s, v } = colorData as HSV;
  const { b, t } = colorData as BT;
  // 矫正value过低时，颜色为黑色
  let colorObj: RGB = null;
  let colorStr = 'transparent';
  if (b !== undefined && t !== undefined) {
    colorObj = brightKelvin2rgba(b, t);
    colorStr = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, ${colorObj.a})`;
  } else {
    colorObj = hsvToRgb(h, s, 200 + 800 * (v / 1000));
    colorStr = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
  }

  const scaleValue = isSelected ? 0.75 : 1;
  return (
    <View
      className={style.colorSelectorCircleContainer}
      hoverClassName="button-hover"
      onClick={() => {
        onClick();
      }}
    >
      <View
        className={style.colorSelectorCircle}
        style={{ transform: `scale(${scaleValue})`, ...colorItemStyle }}
      >
        <View
          className={style.colorselectorcirclecolor}
          style={{ backgroundColor: `${colorStr}` }}
        />
      </View>
      {children}
      {isSelected && (
        <View className={style.colorSelectorCircleBorder} style={{ borderColor: `${colorStr}` }} />
      )}
    </View>
  );
};

const nilFn = () => null;

ColorSelectorCircle.defaultProps = {
  onClick: nilFn,
  colorItemStyle: {},
};

export default ColorSelectorCircle;
