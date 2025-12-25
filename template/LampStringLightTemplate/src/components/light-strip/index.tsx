/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Image } from '@ray-js/ray';
// import { isEqual } from 'lodash-es';
import {
  useActions,
  useProps,
  useStructuredActions,
  useStructuredProps,
  utils,
} from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { WORK_MODE } from '@/types';
import { actions, useAppDispatch, useSelector } from '@/redux';

import { getLightEle } from './ele';
import styles from './index.module.less';
import iconStart from './res/icon-start.png';

function rgbStr2rgb(rgbString: string) {
  const r = /\((\S+)\)/g;
  const [_, rgbStr] = r.exec(rgbString) || [];
  if (!rgbStr) {
    return { r: 0, g: 0, b: 0 };
  }
  // 分割逗号
  const rgbValues = rgbStr.replaceAll(' ', '').split(',');
  // 将每个值转换为数字
  const rgbObject = {
    r: rgbValues[0],
    g: rgbValues[1],
    b: rgbValues[2],
  };
  return rgbObject;
}

const { hsv2rgbString, rgb2hsv } = utils;

const rgbStr2hsv = (rgbStr: string) => {
  const { r, g, b } = rgbStr2rgb(rgbStr.replaceAll(' ', ''));
  const [h, s, v] = rgb2hsv(r, g, b);
  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
};

// @ts-nocheck
type LightStripProps = {
  isMoving?: boolean;
  data: any[];
  ledNumber?: number;
  mode?: WORK_MODE;
};

// 关闭时灯珠颜色
const offColor = 'rgb(0,0,0)';
const gradientOffColor = [offColor, offColor];

const layerList = [6, 7, 7];

const LightStrip = (props: LightStripProps) => {
  const { data, ledNumber } = props;
  const lightNum = ledNumber;

  const paintColorData = useStructuredProps(p => p.paint_colour_1);
  const checkedIdList = useSelector(state => state.common.checkedIdList);
  const checkedSet = new Set(checkedIdList);
  const currentLightStripDataList = data;

  const { hue = 0, saturation = 1000, value = 1000 } = paintColorData;
  const defaultColor = hsv2rgbString(hue, Math.round(saturation / 10), Math.round(value / 10));
  const gradientDefaultColor = [defaultColor, defaultColor, defaultColor];
  const power = useProps(p => p.switch_led);

  const dispatch = useAppDispatch();

  // 当前项目不需要, 给个空数据即可
  const currentGradientLightStripDataList = [];
  // 带渐变色的灯珠颜色数据
  // const currentGradientLightStripDataList = useMemo(() => {
  //   if (!currentLightStripDataList?.length) {
  //     return [];
  //   }
  //   const isGradient = paintColorData.effect === 1;
  //   if (!isGradient) {
  //     return [];
  //   }
  //   const newLightStripDataList = currentLightStripDataList.map((_, index) => {
  //     const currentColor = currentLightStripDataList[index];
  //     const preColor = currentLightStripDataList[index - 1] || currentColor;
  //     const nextColor = currentLightStripDataList[index + 1] || currentColor;
  //     return [preColor, currentColor, nextColor];
  //   });
  //   return newLightStripDataList;
  // }, [currentLightStripDataList, paintColorData.effect]);

  const onClick = useCallback(
    (checked: boolean, index: number) => {
      if (!checked) {
        checkedSet.delete(index);
      } else {
        checkedSet.add(index);
      }
      const newCheckedSet = new Set(checkedSet);
      dispatch(actions.common.updateCheckedIdList(Array.from(newCheckedSet)));
    },
    [checkedSet]
  );

  const [checkAllBool, setCheckAllBool] = useState(checkedSet.size === lightNum && lightNum > 0);

  useEffect(() => {
    setCheckAllBool(checkedSet.size === lightNum && lightNum > 0);
  }, [checkedSet, lightNum]);

  useEffect(() => {
    dispatch(actions.common.updateStripCheckAll(checkAllBool));
  }, [checkAllBool]);

  const handleCheckAll = () => {
    // 全选
    if (!checkAllBool) {
      const newSet = new Set<number>();
      new Array(lightNum).fill(0).map((_, i) => newSet.add(i));
      dispatch(actions.common.updateCheckedIdList(Array.from(newSet)));
    } else {
      const newArr = [];
      dispatch(actions.common.updateCheckedIdList(newArr));
    }
  };

  const lightEleList = useMemo(() => {
    const isGradient = paintColorData.effect === 1;
    return (
      <View className={styles.lightEleWrapper}>
        <View className={styles.lightEleTopContainer}>
          <View className={styles.checkWrapper} onClick={handleCheckAll}>
            <View className={styles.checkTextWrapper}>
              <View
                className={styles.checkText}
                style={{
                  background: !checkAllBool ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                  color: !checkAllBool ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
                }}
              >
                {Strings.getLang('checkedAll')}
              </View>
            </View>
            <Image src={iconStart} className={styles.iconStart} />
          </View>
          {new Array(Math.min(lightNum, layerList[0])).fill(0).map((_, i) => {
            const realIdx = i;
            const _defaultColor = isGradient ? gradientDefaultColor : defaultColor;
            const bc =
              (!isGradient
                ? currentLightStripDataList[realIdx]
                : currentGradientLightStripDataList[realIdx]) || _defaultColor;
            const _currentColor = isGradient ? bc[1] : bc;
            const bt = rgbStr2hsv(_currentColor).v;
            const _offColor = isGradient ? gradientOffColor : offColor;
            const isOn = _currentColor?.replaceAll(' ', '') !== offColor.replaceAll(' ', '');
            const item = {
              onOff: isOn,
              idx: realIdx,
              brightness: bt || 0,
              onClick,
              checked: checkedSet.has(realIdx),
              bgColor: power ? bc : _offColor,
            };
            return getLightEle(realIdx, item, isGradient, lightNum);
          })}
        </View>
        {lightNum > layerList[0] && (
          <View className={styles.lightEleMiddleContainer}>
            {new Array(Math.min(lightNum - layerList[0], layerList[1])).fill(0).map((_, i) => {
              const realIdx = i + layerList[0];
              const _defaultColor = isGradient ? gradientDefaultColor : defaultColor;
              const bc =
                (!isGradient
                  ? currentLightStripDataList[realIdx]
                  : currentGradientLightStripDataList[realIdx]) || _defaultColor;
              const _currentColor = isGradient ? bc[1] : bc;
              const bt = rgbStr2hsv(_currentColor).v;
              const _offColor = isGradient ? gradientOffColor : offColor;
              const isOn = _currentColor?.replaceAll(' ', '') !== offColor.replaceAll(' ', '');
              const item = {
                onOff: isOn,
                idx: realIdx,
                brightness: bt || 0,
                onClick,
                checked: checkedSet.has(realIdx),
                bgColor: power ? bc : _offColor,
              };
              return getLightEle(realIdx, item, isGradient, lightNum);
            })}
          </View>
        )}
        {lightNum > layerList[0] + layerList[1] && (
          <View className={styles.lightEleBottomContainer}>
            {new Array(lightNum - layerList[0] - layerList[1]).fill(0).map((_, i) => {
              const realIdx = i + layerList[0] + layerList[1];
              const _defaultColor = isGradient ? gradientDefaultColor : defaultColor;
              const bc =
                (!isGradient
                  ? currentLightStripDataList[realIdx]
                  : currentGradientLightStripDataList[realIdx]) || _defaultColor;
              const _currentColor = isGradient ? bc[1] : bc;
              const bt = rgbStr2hsv(_currentColor).v;
              const _offColor = isGradient ? gradientOffColor : offColor;
              const isOn = _currentColor?.replaceAll(' ', '') !== offColor.replaceAll(' ', '');
              const item = {
                onOff: isOn,
                idx: realIdx,
                brightness: bt || 0,
                onClick,
                checked: checkedSet.has(realIdx),
                bgColor: power ? bc : _offColor,
              };
              return getLightEle(realIdx, item, isGradient, lightNum);
            })}
          </View>
        )}
      </View>
    );
  }, [
    checkAllBool,
    lightNum,
    JSON.stringify(currentLightStripDataList),
    checkedSet,
    power,
    paintColorData.effect,
  ]);

  // 如果没有灯珠数据直接返回
  if (!lightNum) {
    return <View />;
  }

  const contentHeight = (_lightNum: number) => {
    if (_lightNum <= layerList[0]) {
      return '118px';
    }
    if (_lightNum <= layerList[0] + layerList[1]) {
      return '184px';
    }
    return '250px';
  };
  return (
    <View className={styles.lightStripWrapper}>
      <View
        className={`${styles.lightStripContainer}`}
        style={{
          height: contentHeight(lightNum),
        }}
      >
        {lightEleList}
      </View>
    </View>
  );
};

export default LightStrip;
