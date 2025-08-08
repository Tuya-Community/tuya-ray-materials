import React, { CSSProperties, FC, useCallback, useEffect, useRef } from 'react';
import { View } from '@ray-js/ray';
import classNames, { clsx } from 'clsx';
import { Picker } from '@ray-js/smart-ui';
import styles from './index.module.less';
import TimePicker from './TimePicker';

export interface TimerPickerProps {
  /**
   * 内容样式
   */
  style?: CSSProperties;
  className?: string;
  /**
   * picker 是否支持手势
   */
  disabled?: boolean;
  /**
   * 开始时间,minutes(0 - 1440)
   */
  startTime?: number;
  /**
   * 结束时间,minutes(0 - 1440)
   */
  endTime?: number;
  /**
   * 时间段更改回调
   */
  onTimerChange?: (start: number, end: number) => void;
  /**
   * 是否为 12 小时制
   */
  is12Hours?: boolean;
  /**
   * 是否只需要一个picker
   */
  singlePicker?: boolean;
  /**
   * 前缀位置（即 AMPM 位置）
   */
  prefixPosition?: 'left' | 'right' | Array<'left' | 'right'>;
  /**
   * picker 字体颜色
   */
  pickerFontColor?: string;
  /**
   * picker 字体大小
   */
  pickerFontSize?: number;
  pickerFontLineHeight?: number;
  /**
   * 前缀字符
   */
  symbol?: string;

  /**
   * 上午文本
   */
  amText?: string;
  /**
   * 下午文本
   */
  pmText?: string;

  startTimeLabel?: string;
  endTimeLabel?: string;
}

const TimerPicker: FC<TimerPickerProps> = ({
  is12Hours,
  className,
  amText,
  pmText,
  prefixPosition,
  singlePicker,
  disabled,
  startTime,
  endTime,
  style,
  pickerFontColor,
  pickerFontSize,
  pickerFontLineHeight,
  startTimeLabel,
  endTimeLabel,
  symbol,
  onTimerChange,
}) => {
  // 选择器
  let prefixPositionStart: 'left' | 'right';
  let prefixPositionEnd: 'left' | 'right';
  if (Array.isArray(prefixPosition)) {
    [prefixPositionStart, prefixPositionEnd] = prefixPosition;
  } else {
    prefixPositionStart = prefixPosition;
    prefixPositionEnd = prefixPosition;
  }
  const range = useRef({ start: startTime, end: endTime });

  const hanldeChangeStart = useCallback(
    (v: number) => {
      range.current.start = v;
      onTimerChange && onTimerChange(range.current.start, range.current.end);
    },
    [onTimerChange],
  );
  const hanldeChangeEnd = useCallback(
    (v: number) => {
      range.current.end = v;
      onTimerChange && onTimerChange(range.current.start, range.current.end);
    },
    [onTimerChange],
  );
  useEffect(() => {
    range.current.start = startTime;
  }, [startTime]);
  useEffect(() => {
    range.current.end = endTime;
  }, [endTime]);

  const pickerHeight = pickerFontLineHeight || pickerFontSize * 1.5;

  return (
    <View
      className={classNames(styles.container, className, {
        [styles.disabled]: disabled,
      })}
      style={style}
    >
      {!singlePicker && !!startTimeLabel && !!endTimeLabel && (
        <View className={styles.labels}>
          <View className={styles.label}>
            <View className={clsx(styles.labelText, is12Hours && styles[prefixPositionStart])}>{startTimeLabel}</View>
          </View>
          <View className={styles.symbol} />
          <View className={styles.label}>
            <View className={clsx(styles.labelText, is12Hours && styles[prefixPositionEnd])}>{endTimeLabel}</View>
          </View>
        </View>
      )}
      <View className={styles.times}>
        <TimePicker
          time={startTime}
          disabled={disabled}
          onTimeChange={hanldeChangeStart}
          is12Hours={is12Hours}
          prefixPosition={prefixPositionStart}
          pickerFontSize={pickerFontSize}
          pickerFontLineHeight={pickerFontLineHeight}
          amText={amText}
          pmText={pmText}
        />
        {!singlePicker && symbol ? (
          <View className={styles.symbol}>
            <Picker columns={[symbol]} itemHeight={pickerFontLineHeight} />
          </View>
        ) : null}
        {!singlePicker && (
          <TimePicker
            time={endTime}
            disabled={disabled}
            onTimeChange={hanldeChangeEnd}
            is12Hours={is12Hours}
            prefixPosition={prefixPositionEnd}
            pickerFontSize={pickerFontSize}
            pickerFontLineHeight={pickerFontLineHeight}
            amText={amText}
            pmText={pmText}
          />
        )}
      </View>
    </View>
  );
};

TimerPicker.defaultProps = {
  style: {},
  disabled: false,
  startTime: 480,
  endTime: 840,
  onTimerChange: null,
  is12Hours: true,
  singlePicker: false,
  prefixPosition: ['left', 'right'],
  pickerFontColor: '#333',
  symbol: '—',
  pickerFontSize: 60,
  pickerFontLineHeight: 44,
  amText: 'AM',
  pmText: 'PM',
};

export default TimerPicker;
