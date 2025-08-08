/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from '@ray-js/ray';
import Slider from '@ray-js/components-ty-slider/lib/SjsSlider';
import { toStyle } from '@ray-js/components-ty-slider';
import { useDebounceFn, useThrottleFn } from 'ahooks';
import { formatPercent } from './utils';
import styles from './index.module.less';
import { defaultProps, IProps } from './props';

function OpacitySlider(props: IProps) {
  const preValue = useRef(-1);
  const lastValue = useRef(null);
  const timer = useRef(null);
  const moveTimer = useRef(null);
  const isMove = useRef(false);
  const {
    label,
    min = 0,
    max = 1000,
    value,
    style,
    trackStyle = {},
    thumbStyle = {},
    textValue,
    disable = false,
    valueStyle,
    trackBackgroundColor,
    enableTouch = true,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = props;

  const startRefValue = useRef(-1);
  const handleTouchStart = ({ detail }) => {
    if (!onTouchStart || disable) {
      return;
    }
    if (detail.end === startRefValue.current) {
      return;
    }
    isMove.current = false;
    onTouchStart && onTouchStart(detail.end);
    startRefValue.current = detail.end;
  };

  const handTouchMove = useThrottleFn(
    ({ detail }) => {
      if (!onTouchMove || disable) {
        return;
      }
      isMove.current = true;
      lastValue.current = detail.end + min;
      if (detail.end + min === preValue.current) {
        return;
      }
      if (timer.current) {
        return;
      }

      onTouchMove && onTouchMove(detail.end + min);
      if (!textValue && label) {
        setControllerValue(detail.end + min);
      }

      preValue.current = detail.end + min;
      clearTimeout(timer.current);
      timer.current = null;
      if (lastValue.current !== preValue.current) {
        onTouchMove && onTouchMove(lastValue.current + min);
      }
    },
    { wait: 80 }
  ).run;

  const endRefValue = useRef(-1);

  const handTouchEnd = ({ detail }) => {
    if (!onTouchEnd || disable) {
      return;
    }
    if (detail.end + min === endRefValue.current) {
      return;
    }
    clearTimeout(moveTimer.current);
    moveTimer.current = setTimeout(() => {
      isMove.current = false;
    }, 100);
    onTouchEnd && onTouchEnd(detail.end + min);
    endRefValue.current = detail.end + min;
  };

  const instanceId = useRef(
    `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-10)}`
  );
  const [controllerValue, setControllerValue] = useState(-1);

  useEffect(() => {
    if (!isMove.current && value !== controllerValue) {
      updateControlVal(value);
    }
  }, [value]);

  const updateControlVal = useDebounceFn(
    val => {
      setControllerValue(val);
    },
    { wait: 150 }
  ).run;
  const renderTextRow = () => {
    return (
      <View className={styles.textRow}>
        <Text className={styles.label}>{label}</Text>
        <Text className={styles.label} style={{ margin: '0 4px' }}>
          ·
        </Text>
        <Text className={styles.value} style={valueStyle}>
          {textValue || `${formatPercent(controllerValue, { min, max, minPercent: min })}%`}
        </Text>
      </View>
    );
  };

  return (
    <View style={style}>
      {label && renderTextRow()}
      <View
        style={{
          width: '646rpx',
          height: '56rpx',
          position: 'relative',
          borderRadius: '28rpx',
          ...trackStyle,
        }}
      >
        <Slider
          instanceId={props.instanceId || instanceId.current}
          min={0}
          max={max - min}
          disable={disable}
          end={controllerValue - min}
          step={1}
          enableTouch={enableTouch}
          bindstart={handleTouchStart}
          bindmove={handTouchMove}
          bindend={handTouchEnd}
          trackStyle={toStyle({
            width: '646rpx',
            height: '56rpx',
            position: 'relative',
            borderRadius: '28rpx',
            ...trackStyle,
            background: trackBackgroundColor,
          })}
          barStyle={toStyle({ background: 'transparent' })}
          thumbStyle={toStyle({
            width: '62rpx',
            height: '62rpx',
            border: '8rpx solid #fff',
            borderRadius: '50%',
            boxShadow: 'rgb(255 255 255 / 10%) 0px 0px 1px',
            background: `${'transparent'}`,
            ...thumbStyle,
          })}
          thumbStyleRenderFormatter={{
            background: props?.thumbColorFormatterConfig?.formatter,
          }}
          thumbStyleRenderValueScale={props?.thumbColorFormatterConfig?.scale}
        />
      </View>
    </View>
  );
}

OpacitySlider.defaultProps = defaultProps;

export default OpacitySlider;
