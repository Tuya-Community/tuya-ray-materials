import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from '@ray-js/ray';
import { Picker, SmartPickerMultipleColumn } from '@ray-js/smart-ui';
import classNames from 'clsx';
import { getHourSelections, getMinsSelections, getTimePrefixSelections } from './utils';
import styles from './index.module.less';

const noop = () => {
  //
};

interface TimerPickerProps {
  /**
   * 内容样式
   */
  style?: CSSProperties;
  /**
   * picker 是否支持手势
   */
  disabled?: boolean;
  /**
   * 开始时间,minutes(0 - 1440)
   */
  time?: number;

  /**
   * 时间段更改回调
   */
  onTimeChange?: (value: number) => void;
  /**
   * 是否为 12 小时制
   */
  is12Hours?: boolean;

  /**
   * 前缀位置（即 AMPM 位置）
   */
  prefixPosition?: 'left' | 'right';
  /**
   * picker 字体大小
   */
  pickerFontSize?: number;

  pickerFontLineHeight?: number;

  /**
   * 上午文本
   */
  amText?: string;
  /**
   * 下午文本
   */
  pmText?: string;
}

const minutes = getMinsSelections();

const TimePicker: FC<TimerPickerProps> = ({
  is12Hours,
  amText,
  pmText,
  prefixPosition,
  disabled,
  time,
  style,
  pickerFontSize,
  pickerFontLineHeight,
  onTimeChange,
}) => {
  const [temp, setTemp] = useState(time);
  // 选择器
  const pickerData = useMemo(() => {
    const result: SmartPickerMultipleColumn[] = [];

    const hours = getHourSelections(is12Hours);
    const prefixs = getTimePrefixSelections(amText, pmText);
    const hour = Math.floor(temp / 60);
    const minute = temp % 60;

    let tempHour = hour;
    if (is12Hours) {
      tempHour = hour % 12;
    }

    if (is12Hours && prefixPosition === 'left') {
      const index = hour >= 12 ? 1 : 0;
      result.push({ values: prefixs, key: 'prefix', activeIndex: index });
    }
    result.push({ values: hours, key: 'hour', activeIndex: hours.findIndex((item) => item.value === tempHour) });
    result.push({ values: minutes, key: 'minute', activeIndex: minutes.findIndex((item) => item.value === minute) });
    if (is12Hours && prefixPosition === 'right') {
      const index = hour >= 12 ? 1 : 0;
      result.push({ values: prefixs, key: 'prefix', activeIndex: index });
    }
    return result;
  }, [is12Hours, amText, pmText, temp, prefixPosition]);

  const handleChange = useCallback(
    (e: any) => {
      const { value: values } = e.detail;
      let hour: number;
      let prefix: string;
      let minute: number;

      pickerData.forEach((item, i) => {
        const exist = item.values.find(
          (x: { value: number | string; text: string }) => x.value === values[i].value,
        ) as { value: number | string; text: string };
        if (exist) {
          switch (item.key) {
            case 'prefix':
              prefix = exist.value as string;
              break;
            case 'hour':
              hour = exist.value as number;
              break;
            case 'minute':
              minute = exist.value as number;
              break;
            default:
          }
        }
      });

      if (prefix && prefix === 'PM') {
        hour += 12;
      }
      const value = hour * 60 + minute;
      setTemp(value);
      onTimeChange && onTimeChange(value);
    },
    [pickerData, onTimeChange],
  );

  const pickerHeight = pickerFontLineHeight || pickerFontSize * 1.5;

  useEffect(() => {
    setTemp(time);
  }, [time]);
  return (
    <View
      className={classNames(styles.timePicker, {
        [styles.disabled]: disabled,
      })}
      style={style}
      // @ts-ignore
      catchTouchMove={noop}
    >
      <Picker columns={pickerData} itemHeight={pickerHeight} onChange={handleChange} />
    </View>
  );
};

export default TimePicker;
