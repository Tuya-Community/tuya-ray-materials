/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useRef } from 'react';
import { View } from '@ray-js/ray';
import { useInterval } from 'ahooks';
import { times } from 'lodash';
import './index.less';

const classPrefix = 'lamp-music-bar-';
const bars = times(22).map(i => {
  return i * (22 + 8);
});

type Props = {
  /**
   * @description.zh 颜色列表
   * @description.en Color list
   * @default null
   */
  colorList: string[];
  /**
   * @description.zh 背景颜色
   * @description.en background color
   * @default '#201e1e'
   */
  bgColor?: string;
};

const LampMusicBar = (props: Props) => {
  const { colorList, bgColor } = props;
  const [realColor, setRealColor] = React.useState(colorList.slice(0, 2));

  useInterval(() => {
    const randomIndex = Math.floor(Math.random() * (colorList.length - 1));
    const _color = [...colorList, ...colorList].slice(randomIndex, randomIndex + 2);
    setRealColor(_color);
  }, 600);

  const cacheBarIds = useRef([]);
  const renderBars = useMemo(() => {
    return bars.map((val, idx) => {
      if (cacheBarIds.current.length < bars.length) {
        const id = (Math.floor(Math.random() * (100 - 1)) + 0) % 6;
        cacheBarIds.current[idx] = id;
      }
      return (
        <View
          key={val}
          className={`${classPrefix}content  ${classPrefix}content-${cacheBarIds.current[idx]}`}
          style={{
            background: `linear-gradient(${realColor.join(',')})`,
            left: `${val}rpx`,
          }}
        />
      );
    });
  }, [bars, realColor]);

  const renderLine = useMemo(() => {
    const arr = new Array(25).fill(0);
    return (
      <View className={`${classPrefix}lines`}>
        {arr.map((_, index) => {
          const _style = bgColor
            ? { bottom: index * 8, backgroundColor: bgColor }
            : { bottom: index * 8 };
          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}slider`}
              className={`${classPrefix}lines__item`}
              style={_style}
            />
          );
        })}
      </View>
    );
  }, [bgColor]);

  return (
    <View className={`${classPrefix}wrapper`}>
      {renderBars}
      {renderLine}
    </View>
  );
};

export default LampMusicBar;
