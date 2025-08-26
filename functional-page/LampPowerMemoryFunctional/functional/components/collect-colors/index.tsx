/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { View } from '@ray-js/ray';
import { utils, useSupport } from '@ray-js/panel-sdk';
import { useUnmount } from 'ahooks';
import { useSelector } from 'react-redux';
import { ReduxState } from '@/redux';
import { selectCollectColors } from '@/redux/modules/cloudStateSlice';
import styles from './index.module.less';

const { hsv2rgbString, brightKelvin2rgb } = utils;

const MAX_LENGTH = 8;

interface IProps {
  style?: React.CSSProperties;
  disable?: boolean;
  isColor: boolean;
  colourData: COLOUR;
  collectBorderColor?: string;
  brightness: number;
  temperature: number;
  chooseColor: (v: COLOUR & WHITE) => void;
}

export const CollectColors = (props: IProps) => {
  const {
    collectBorderColor,
    colourData,
    brightness,
    temperature,
    isColor,
    chooseColor,
    disable = false,
    style,
  } = props;
  const [animate, setAnimate] = useState(false);
  const support = useSupport();
  const [activeIndex, setActiveIndex] = useState<number>();
  const collectColors = useSelector((state: ReduxState) => selectCollectColors(state, isColor));

  useEffect(() => {
    if (isColor) {
      const newColorIndex = collectColors?.findIndex(item => {
        const { hue: h, saturation: s, value: v } = item;
        const { hue, saturation, value } = colourData;
        return h === hue && saturation === s && value === v;
      });
      newColorIndex !== activeIndex && setActiveIndex(newColorIndex);
    } else if (support.isSupportTemp()) {
      const newWhiteIndex = collectColors?.findIndex(item => {
        const { brightness: b, temperature: t } = item;
        return b === brightness && t === temperature;
      });
      newWhiteIndex !== activeIndex && setActiveIndex(newWhiteIndex);
    } else {
      const newWhiteIndex = collectColors?.findIndex(item => {
        const { brightness: b } = item;
        return b === brightness;
      });
      newWhiteIndex !== activeIndex && setActiveIndex(newWhiteIndex);
    }
  }, [colourData, temperature, brightness, isColor, collectColors]);

  useUnmount(() => {
    setAnimate(false);
  });

  const handleChoose = (item, index) => {
    if (!disable) {
      chooseColor(item);
      setActiveIndex(index);
      setAnimate(true);
    }
  };

  return (
    <View className={styles.row} style={style}>
      <View
        className={styles.colorRow}
        style={{
          marginLeft: 0,
        }}
      >
        <View style={{ display: 'flex' }}>
          {collectColors?.map((item, index) => {
            const isActive = index === activeIndex;
            const bg = isColor
              ? hsv2rgbString(
                  item.hue,
                  item.saturation / 10,
                  (200 + 800 * (item.value / 1000)) / 10
                )
              : brightKelvin2rgb(
                  200 + 800 * (item.brightness / 1000),
                  support.isSupportTemp() ? item.temperature : 1000,
                  { kelvinMin: 4000, kelvinMax: 8000 }
                );
            return (
              <View
                key={index}
                className={`${styles.circleBox} ${styles.button}`}
                style={{
                  marginRight: index === collectColors.length - 1 ? 0 : '24rpx',
                  border: isActive ? `4rpx solid ${bg}` : 'none',
                  background: 'transparent',
                  opacity: disable ? 0.4 : 1,
                }}
                onClick={() => handleChoose(item, index)}
              >
                <View
                  className={styles.circle}
                  style={{
                    backgroundColor: bg,
                    transform: `scale(${isActive ? 0.7 : 1})`,
                    transition: animate ? 'all .5s' : 'none',
                    border: collectBorderColor ? `1px solid ${collectBorderColor}` : '',
                  }}
                />
                {collectBorderColor && (
                  <View
                    className={styles.collection_border}
                    style={{
                      border: `1px solid ${collectBorderColor}`,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
