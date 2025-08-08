import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Picker, SmartPickerMultipleColumn } from '@ray-js/smart-ui';
import Strings from '@/i18n';

/**
 * 生成一个列表，注意，列表中的数值不包含 max
 * @param max
 * @param min
 * @param step
 * @param value
 */
export const range = (max: number, min: number, step = 1) => {
  if (step > 1) {
    const count = Math.floor((max - min) / step);
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(`${i * step}`.padStart(2, '0'));
    }
    return list;
  }
  return new Array(max - min).fill(1).map((x, i) => (i + min).toString().padStart(2, '0'));
};

interface Props {
  /**
   * 最小时间，单位秒
   */
  min?: number; //
  /**
   * 最大时间，单位秒
   */
  max?: number; //
  /**
   * 时间，单位秒
   */
  value?: number;
  /**
   * 步进
   * 当 type 为 second 时，只支持60秒以内的步进，此时单位为秒
   * 当 type 为 minute 时，只支持60分钟以内的步进，此时单位为分钟
   */
  step?: number;
  /**
   * 显示类型，
   * second 支持选择秒
   * minute 支持选择分钟
   * hour 支持选择小时
   * 注意，如果当前最大值不到1小时或1分钟，不显示小时或分钟
   * 默认为 支持选择分钟、小时
   */
  type?: Array<TimeType>;
  /**
   * picker 每个选项的高度
   */
  itemHeight?: number;

  /**
   * 变化事件
   * @param time 时间，单位 秒
   * @returns
   */
  onChange?: (time: number) => void;
}

interface Column extends SmartPickerMultipleColumn {
  type: TimeType;
}

const CountdownPicker: FC<Props> = ({ min = 0, max = 86400, value = min, step = 1, type, itemHeight, onChange }) => {
  const [temp, setTemp] = useState(value);
  const pickerColumns = useMemo(() => {
    const hourBaseNum = 3600;
    const minuteBaseNum = 60;
    let maxHour = Math.floor(max / hourBaseNum);
    let minHour = Math.floor(min / hourBaseNum);
    let maxMinute = Math.floor((max % hourBaseNum) / minuteBaseNum);
    let minMinute = Math.floor((min % hourBaseNum) / minuteBaseNum);
    let minSecond = min % minuteBaseNum;
    let maxSecond = max % minuteBaseNum;
    // 当前值
    const hour = Math.floor(temp / hourBaseNum);
    let minute = Math.floor((temp % hourBaseNum) / minuteBaseNum);
    const second = temp % minuteBaseNum;
    let hours: string[] = [];
    if (!type.includes('hour')) {
      maxHour = 0;
      minHour = 0;
      minute = Math.floor(temp / minuteBaseNum);
      maxMinute = Math.floor(max / minuteBaseNum);
      minMinute = Math.floor(min / minuteBaseNum);
    }
    if (maxHour > 0) {
      if (maxHour === minHour) {
        hours = [maxHour.toString().padStart(2, '0')];
      } else {
        hours = range(maxHour + 1, minHour);
      }
    }

    const columns: Column[] = [];
    if (hours.length) {
      columns.push({
        values: hours,
        activeIndex: hours.findIndex((item) => Number(item) === hour),
        unit: Strings.getLang('ret_hour'),
        type: 'hour',
      });
    }

    // 计算分钟列表
    let minutes: string[] = [];
    // 当前value 是否以达到最大值
    if (maxHour > minHour) {
      if (hour === minHour) {
        maxMinute = 59;
      } else if (hour === maxHour) {
        minMinute = 0;
      } else {
        minMinute = 0;
        maxMinute = 59;
      }
    }
    let minuteIndex = minute;
    if (minMinute !== maxMinute) {
      if (type.includes('second')) {
        minutes = range(maxMinute + 1, minMinute);
        minuteIndex = minutes.findIndex((item) => Number(item) === minute);
      } else {
        minutes = range(maxMinute + 1, minMinute, step);
        const base = Math.floor(minute / step) * step;
        minuteIndex = minutes.findIndex((item) => Number(item) === base);
      }
    } else {
      minutes = [minMinute.toString().padStart(2, '0')];
    }

    columns.push({ values: minutes, activeIndex: minuteIndex, unit: Strings.getLang('ret_minute'), type: 'minute' });

    if (type.includes('second')) {
      // 计算秒列表
      if (maxHour > minHour) {
        if (hour === minHour && minute === minMinute) {
          maxSecond = 59;
        } else if (hour === maxHour && minute === maxMinute) {
          minSecond = 0;
        } else {
          minSecond = 0;
          maxSecond = 59;
        }
      } else if (maxMinute > minMinute) {
        if (minute === minMinute) {
          maxSecond = 59;
        } else if (minute === maxMinute) {
          minSecond = 0;
        } else {
          minSecond = 0;
          maxSecond = 59;
        }
      }
      const seconds: string[] = range(maxSecond + 1, minSecond, step);
      const base = Math.floor(second / step) * step;
      const secondIndex = seconds.findIndex((item) => Number(item) === base);
      columns.push({
        values: seconds,
        activeIndex: secondIndex,
        unit: Strings.getLang('ret_second'),
        type: 'second',
      });
    }
    return columns;
  }, [min, max, type, temp, step]);

  const handleChange = useCallback(
    (event) => {
      const { value } = event.detail;
      let time = pickerColumns.reduce((sum, cur, i) => {
        const itemValue = Number(value[i] ?? 0);
        switch (cur.type) {
          case 'hour':
            return sum + itemValue * 3600;
          case 'minute':
            return sum + itemValue * 60;
          case 'second':
            return sum + itemValue;
          default:
            return 0;
        }
      }, 0);
      time = Math.min(max, Math.max(min, time));
      setTemp(time);
      onChange && onChange(time);
    },
    [pickerColumns],
  );

  useEffect(() => {
    setTemp(value);
  }, [value]);

  return <Picker columns={pickerColumns} itemHeight={itemHeight} onChange={handleChange} />;
};

CountdownPicker.defaultProps = {
  type: ['hour', 'minute'],
};

export default CountdownPicker;
