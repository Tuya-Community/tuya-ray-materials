/* eslint-disable radix */
import React, { useCallback, useState, useEffect } from 'react';
import { View, Image } from '@ray-js/ray';
import res from './res';
import { useThrottleFn } from 'ahooks';
import { defaultProps, IProps } from './props';
import Circle from './components';
import styled from './index.module.less';

const RhythmsCircle = (props: IProps) => {
  const {
    data,
    disable,
    style,
    iconList,
    centerBackground,
    backgroundStyle,
    innerRadius = 107.5,
    radius = 147.5,
    padding,
    timeOffset,
    backgroundImage,
    isDarkTheme,
    onStart,
    onChange,
    onRelease,
  } = props;
  useEffect(() => {
    updateThumbPosition();
  }, [data]);

  const handleChange = useCallback(v => {
    onChange?.(v);
    // updateThumbPosition();
  }, []);
  const [stops, setStops] = useState([]);
  // 根据当前角度计算时间
  const getAngleByTime = time => {
    return time * 0.25 > 360 ? time * 0.25 - 360 : time * 0.25;
  };
  const getAngleRange = (angle1, angle2) => {
    if (angle1 < angle2) {
      return angle2 - angle1;
    }
    return 360 + angle2 - angle1;
  };

  const hex2rgb = hex => {
    const r = parseInt(`0x${hex.slice(1, 3)}`, 16);
    const g = parseInt(`0x${hex.slice(3, 5)}`, 16);
    const b = parseInt(`0x${hex.slice(5, 7)}`, 16);
    return { r, g, b };
  };
  // 计算中间的渐变值
  const getMidColor = (nowItem, nextItem, rate) => {
    const color1 = nowItem.activeColor;
    const color2 = nextItem.activeColor;
    const isRgbStr = color1.includes('rgb');
    const isRgbStr2 = color2.includes('rgb');

    if (isRgbStr && isRgbStr2) {
      const newR =
        parseInt(color1.split(',')[0].split('(')[1]) +
        (parseInt(color2.split(',')[0].split('(')[1]) -
          parseInt(color1.split(',')[0].split('(')[1])) *
          rate;
      const newG =
        parseInt(color1.split(',')[1]) +
        (parseInt(color2.split(',')[1]) - parseInt(color1.split(',')[1])) * rate;
      const newB =
        parseInt(color1.split(',')[2].split(')')[0]) +
        (parseInt(color2.split(',')[2].split(')')[0]) -
          parseInt(color1.split(',')[2].split(')')[0])) *
          rate;
      return `rgb(${newR},${newG},${newB})`;
    }
    const newR = hex2rgb(color1).r + (hex2rgb(color2).r - hex2rgb(color1).r) * rate;
    const newG = hex2rgb(color1).g + (hex2rgb(color2).g - hex2rgb(color1).g) * rate;
    const newB = hex2rgb(color1).b + (hex2rgb(color2).b - hex2rgb(color1).b) * rate;
    return `rgb(${newR} ,${newG} ,${newB})`;
  };
  const updateThumbPosition = useThrottleFn(
    () => {
      let newData = [...data];
      let newStops = [];
      let startColor = '';
      // 1080为起始渐变的时间节点,计算当前哪个时间节点和1080最接近,渲染起始位置的渐变
      newData = newData.map(item => {
        return { ...item, closeTime: Math.abs(item.time - 1080) };
      });
      // @ts-ignore
      newData.sort((a, b) => a.closeTime - b.closeTime);
      const index = data.findIndex(item => item.time === newData[0].time);

      if (data && index !== -1) {
        const TIME_OFFSET = timeOffset;
        // 通过当前不同的起始点位置计算中间的渐变颜色
        if (data[index].time < 1080 - TIME_OFFSET) {
          const nextIndex = index === data.length - 1 ? 0 : index + 1;
          const nowAngle = getAngleByTime(data[index].time);
          const nextAngle = getAngleByTime(data[nextIndex].time);
          const angleRange = getAngleRange(nowAngle, nextAngle);
          let rate = 0;
          if (nowAngle >= 270 && nowAngle < 360) {
            rate = (nowAngle - 270) / angleRange;
          }
          if (nowAngle >= 0 && nowAngle < 90) {
            rate = (nowAngle + 90) / angleRange;
          }
          if (nowAngle >= 90 && nowAngle < 270) {
            rate = (270 - nowAngle) / angleRange;
          }
          startColor = getMidColor(data[index], data[nextIndex], Math.abs(rate));
        }

        if (data[index].time > 1080 + TIME_OFFSET) {
          const prevIndex = index === 0 ? data.length - 1 : index - 1;
          const nowAngle = getAngleByTime(data[index].time);
          const prevAngle = getAngleByTime(data[prevIndex].time);
          const angleRange = getAngleRange(prevAngle, nowAngle);
          let rate = 0;
          if (nowAngle >= 270 && nowAngle < 360) {
            rate = (nowAngle - 270) / angleRange;
          }
          if (nowAngle >= 0 && nowAngle < 90) {
            rate = (nowAngle + 90) / angleRange;
          }
          if (nowAngle >= 90 && nowAngle < 270) {
            rate = (270 - nowAngle) / angleRange;
          }

          startColor = getMidColor(data[index], data[prevIndex], Math.abs(rate));
        }
        if (1080 - TIME_OFFSET <= data[index].time && data[index].time <= 1080 + TIME_OFFSET) {
          startColor = data[index].activeColor;
        }
        // 获取每个节点的渐变颜色
        newData.forEach(item => {
          const OFFSET_RATE = 0.25;
          const rate =
            item.time / 60 / 24 + OFFSET_RATE > 1
              ? item.time / 60 / 24 + OFFSET_RATE - 1
              : item.time / 60 / 24 + OFFSET_RATE;
          newStops.push([item.activeColor, rate]);
        });
        newStops.sort((a, b) => a[1] - b[1]);
        newStops = newStops.map(item => {
          return `${item[0]} ${Math.round(item[1] * 360)}deg`;
        });
        newStops.unshift(`${startColor}`);
        newStops.push(`${startColor}`);
        setStops(newStops);
      }
    },
    { wait: 80 }
  ).run;

  const transparentPercent = Math.round((innerRadius / radius) * 100);

  return (
    <View className={styled.container} style={style}>
      <View
        className={styled.rhythmBackground}
        style={{
          background: `conic-gradient(from 0.25turn at 50% 50%, ${stops.join()})`,
          width: `${radius * 4}rpx`,
          height: `${radius * 4}rpx`,
          borderRadius: '50%',
          maskImage: `radial-gradient(circle, transparent ${transparentPercent * 0.71}%, black ${
            transparentPercent * 0.71 + 1
          }%)`,
          WebkitMaskImage: `radial-gradient(circle, transparent ${
            transparentPercent * 0.71
          }%, black ${transparentPercent * 0.71 + 1}%)`,
        }}
      >
        <Circle
          style="height: 100%;width: 100%;"
          disable={disable}
          data={data}
          padding={padding}
          iconSize={props.iconSize}
          timeOffset={timeOffset}
          iconList={iconList || data.map(item => item.icon).filter(Boolean)}
          isDarkTheme={isDarkTheme}
          innerRingRadius={innerRadius}
          radius={radius}
          bindstart={(e) => onStart(e.detail)}
          bindmove={e => handleChange(e.detail)}
          bindend={e => onRelease(e.detail)}
        />
      </View>
      <View
        className={styled.center}
        style={{
          width: innerRadius * 4,
          height: innerRadius * 4,
          background: centerBackground || '#000',
        }}
      />
      <Image
        src={backgroundImage ?? (isDarkTheme ? res.timeBg_dark : res.timeBg_light)}
        className={styled.timeBg}
        style={{
          width: innerRadius * 4,
          height: innerRadius * 4,
          borderRadius: '50%',
          ...backgroundStyle,
        }}
      />
    </View>
  );
};

RhythmsCircle.defaultProps = defaultProps;

export default React.memo(RhythmsCircle);
