import { isUndefined } from 'lodash-es';
import React, { useMemo } from 'react';
import { View, Text } from '@ray-js/ray';
import { useStructuredProps, useSupport } from '@ray-js/panel-sdk';
import { useThrottleFn } from 'ahooks';
import LampBrightSlider from '@ray-js/lamp-bright-slider';
import LampSaturationSlider from '@ray-js/lamp-saturation-slider';
import LampColorSlider from '@ray-js/lamp-color-slider';
import Strings from '@/i18n';
import ColorObj from 'color';
import { lampSchemaMap } from '@/devices/schema';
import styles from './index.module.less';

const { colour_data } = lampSchemaMap;

interface IProps {
  style?: React.CSSProperties;
  /**
   * 彩光值，不传则默认使用 DP colour_data
   */
  colour?: COLOUR;
  fontColor?: string;
  themeColor?: string;
  background?: string;
  onRelease: (code: string, value: COLOUR) => void;
  onChange?: (isColor: boolean, value: COLOUR) => void;
  setScrollEnabled?: (v: boolean) => void;
}

export const Colour = (props: IProps) => {
  const { background, themeColor, fontColor, style, onRelease, onChange, setScrollEnabled } = props;
  const cardBackground = new ColorObj(fontColor).alpha(0.2).toString();
  const support = useSupport();
  const colourDp = useStructuredProps(dpState => dpState.colour_data);
  const colour = isUndefined(props.colour) ? colourDp : props.colour;
  const isTouching = React.useRef(false);

  const handleColourMove = useThrottleFn(
    (v: number, type: keyof COLOUR) => {
      if (isTouching.current) setScrollEnabled?.(false);
      const newColorData = { ...colour, [type]: v };
      onChange?.(true, newColorData);
    },
    { wait: 80 }
  ).run;

  const handleColourEnd = React.useCallback(
    (v: number, type: keyof COLOUR) => {
      setScrollEnabled?.(true);
      const newColorData = { ...colour, [type]: v };
      onRelease?.(colour_data.code, newColorData);
    },
    [colour]
  );

  const handleTouchStart = React.useCallback(
    (type: 'hue' | 'saturation' | 'value') => {
      return (v: number) => {
        isTouching.current = true;
        handleColourMove(v, type);
      };
    },
    [colour]
  );

  const handleTouchEnd = React.useCallback(
    (type: 'hue' | 'saturation' | 'value') => {
      return (v: number) => {
        isTouching.current = false;
        handleColourEnd(v, type);
      };
    },
    [colour]
  );

  const configs = useMemo(() => {
    const trackStyle = {
      width: '504rpx',
      height: '56rpx',
    };

    const thumbStyle = {
      width: '68rpx',
      height: '68rpx',
      borderRadius: '100%',
    };
    return [
      {
        label: 'hue' as const,
        Component: (
          <LampColorSlider
            trackStyle={trackStyle}
            thumbStyle={thumbStyle}
            value={colour?.hue ?? 1}
            onTouchStart={handleTouchStart('hue')}
            onTouchMove={v => handleColourMove(v, 'hue')}
            onTouchEnd={handleTouchEnd('hue')}
          />
        ),
      },
      {
        label: 'saturation' as const,
        Component: (
          <LampSaturationSlider
            trackStyle={trackStyle}
            thumbStyle={thumbStyle}
            hue={colour?.hue ?? 1}
            value={colour?.saturation ?? 1}
            onTouchStart={handleTouchStart('saturation')}
            onTouchMove={v => handleColourMove(v, 'saturation')}
            onTouchEnd={handleTouchEnd('saturation')}
          />
        ),
      },
      {
        label: 'value' as const,
        Component: (
          <LampBrightSlider
            trackStyle={trackStyle}
            thumbStyle={thumbStyle}
            value={colour?.value ?? 1}
            onTouchStart={handleTouchStart('value')}
            onTouchMove={v => handleColourMove(v, 'value')}
            onTouchEnd={handleTouchEnd('value')}
          />
        ),
      },
    ];
  }, [colour]);

  if (support.isSupportColour())
    return (
      <View style={style}>
        <View
          className={styles.title}
          style={{
            color: fontColor,
          }}
        >
          {Strings.getLang('lpmf_hsv')}
        </View>
        {configs.map(item => {
          const { label, Component } = item;
          return (
            <View key={label} className={styles.colorRow}>
              <View
                className={styles.inputBox}
                style={{
                  background: cardBackground,
                }}
              >
                <Text
                  className={styles.label}
                  style={{
                    color: fontColor,
                  }}
                >
                  {Strings.getLang(`lpmf_${label}`)}：
                </Text>
                <View
                  className={styles.input}
                  style={{
                    color: themeColor,
                  }}
                >
                  {colour?.[label] ?? 1}
                </View>
              </View>
              {Component}
            </View>
          );
        })}
      </View>
    );
  return <></>;
};
