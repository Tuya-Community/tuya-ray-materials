/* eslint-disable no-self-compare */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React, { useRef } from 'react';
import { View } from '@ray-js/ray';
import { useDebugPerf } from '@/hooks/useDebugPerf';

import ColorSelectorCircle from '../color-selector-circle';
import styles from './index.module.less';

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorSelectorIconProps {
  hsv: HSV;
  onChangeHsv: (hsv: HSV) => void;
}

const defaultColorList = [
  { h: 0, s: 0, v: 0 }, // 关闭
  { h: 0, s: 1000, v: 1000 },
  { h: 65, s: 1000, v: 1000 },
  { h: 120, s: 1000, v: 1000 },
  { h: 240, s: 1000, v: 1000 },
];

const ColorSelectorCircleList = (props: ColorSelectorIconProps) => {
  useDebugPerf(ColorSelectorCircleList, props);

  const preValueRef = useRef<number>(1000);

  const { hsv: currentHsv, onChangeHsv } = props;
  return (
    <View className={styles.colorSelectorCircleListWrapper}>
      {defaultColorList.map((item, index) => {
        const isActive = currentHsv?.h === item?.h && currentHsv.s === item.s;
        return (
          <ColorSelectorCircle
            key={index}
            colorData={item}
            isSelected={isActive}
            onClick={() => {
              if (currentHsv.v) {
                preValueRef.current = currentHsv.v;
              }
              onChangeHsv &&
                onChangeHsv({ ...item, v: item.v === 0 ? 0 : currentHsv.v || preValueRef.current });
            }}
          >
            {index === 0 && <View className={styles.line} />}
          </ColorSelectorCircle>
        );
      })}
    </View>
  );
};

export default ColorSelectorCircleList;
