/* eslint-disable no-console */
/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
// 灯带涂抹
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './index.less';
import { defaultProps, IProps } from './props';

import DimmerStripCom from './DimmerStrip';

import { getSharpPathData, hsv2rgbString as _hsv2rgbString, getSystemInfoRes } from './utils';

const classPrefix = 'lamp-strip-light-smear';

enum SmearMode {
  all,
  single,
  clear,
}
const stripLightNumber = 20;

const { windowWidth = 375 } = getSystemInfoRes();
const stripPos = {
  x: windowWidth / 2 + 16, // 绘制的灯带 X 位置
  y: 18, // 绘制的灯带 Y 位置
};

const LampStripLightSmear = (props: IProps) => {
  const {
    width = windowWidth,
    height = 330,
    className,
    smearedColor,
    disabled = false,
    lightColorMaps: initCheckedMapColor,
    type: smearType,
    gradient,
    onLightChange,
    onLightEnd,
  } = props;

  const canvasId = useRef<string>(`canvas_${Math.random().toString(36).slice(-8)}`);

  const isAll = smearType === SmearMode.all;
  const [lightColorMaps, setLightColorMaps] = useState(initCheckedMapColor);

  const checkedSetRef = useRef(new Set<number>());
  const checkedSet = checkedSetRef.current;

  useEffect(() => {
    setLightColorMaps(initCheckedMapColor);
  }, [initCheckedMapColor]);

  const power = !disabled;
  const sharpPathData = useMemo(() => {
    const initData = {
      checkedSet,
      lightColorMaps,
      power,
      isGradient: gradient,
      ...stripPos,
    };
    const data = getSharpPathData(stripLightNumber, initData);
    return data;
  }, [smearType, lightColorMaps, power, checkedSet, gradient]);

  // 处理切换选中逻辑，防止moving情况下会一直反复切换
  const isMoving = useRef(false);
  const preCheckedSet = useRef(checkedSet);
  useEffect(() => {
    if (!isMoving.current) {
      // 记录非moving时的checkedSet
      preCheckedSet.current = checkedSet;
    }
  }, [checkedSet]);

  const onTouchMove = useCallback(
    ({ detail }) => {
      // 关灯时不允许操作灯珠
      if (!power) {
        console.warn('关灯时不允许操作灯珠');
        return;
      }
      // 全选时不允许操作灯珠
      if (isAll) {
        console.warn('全选时不允许操作灯珠');
        return;
      }
      const { index } = detail;
      if (!smearedColor) {
        console.warn('没有设置涂抹颜色');
        return;
      }
      isMoving.current = true;
      const color = smearedColor;
      // 橡皮擦
      let colorRgba = _hsv2rgbString(color.h, color.s / 10, color.v / 10);
      if (smearType === 2) {
        colorRgba = 'rgba(0 ,0 ,0, 1)';
      }
      setLightColorMaps({
        ...lightColorMaps,
        [index]: colorRgba,
      });
      checkedSet.add(index);
      onLightChange(checkedSet);
    },
    [power, isAll, smearedColor, checkedSet, lightColorMaps, smearType]
  );

  const onTouchEnd = useCallback(
    ({ detail }) => {
      isMoving.current = false;
      checkedSetRef.current = new Set<number>();
      // 关灯时不允许操作灯珠
      if (!power) {
        console.warn('关灯时不允许操作灯珠');
        return;
      }
      // 全选时不允许操作灯珠
      if (isAll) {
        console.warn('全选时不允许操作灯珠');
        return;
      }
      const { index } = detail;
      if (index === -1) {
        return;
      }
      if (!smearedColor) {
        console.warn('没有设置涂抹颜色');
        return;
      }
      const color = smearedColor;
      const colorRgba = _hsv2rgbString(color.h, color.s / 10, color.v / 10);
      setLightColorMaps({
        ...lightColorMaps,
        [index]: colorRgba,
      });
      checkedSet.add(index);
      onLightEnd(checkedSet);
    },
    [power, isAll, smearedColor, lightColorMaps, checkedSet]
  );
  const mergedClassName = `${classPrefix} ${className}`;
  return (
    <view className={mergedClassName}>
      <DimmerStripCom
        width={width}
        height={height}
        data={sharpPathData}
        gradient={gradient}
        stripLightNumber={stripLightNumber}
        canvasId={canvasId.current}
        bindend={onTouchEnd}
        bindmove={onTouchMove}
      />
    </view>
  );
};

LampStripLightSmear.defaultProps = defaultProps;
LampStripLightSmear.displayName = classPrefix;
export const hsv2rgbString = _hsv2rgbString;

export default LampStripLightSmear;
