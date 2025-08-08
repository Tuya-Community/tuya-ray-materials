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
   * sunset 为 1
   * sunrise 为 0
   */
  type: 0 | 1;
  /**
   * -1 为日出（落）前
   * 0 为日出（落）时
   * 1 为日出（落）后
   */
  offsetType: -1 | 0 | 1;
  /**
   * 时间，单位分钟
   */
  value?: number;
  /**
   * picker 每个选项的高度
   */
  itemHeight?: number;

  /**
   * 变化事件
   * @param time 时间，单位 秒
   * @returns
   */
  onChange?: (offType: number, time: number) => void;
}

interface Column extends SmartPickerMultipleColumn {}

const offTypeMap = {
  '-1': 'before',
  '0': 'at',
  '1': 'after',
};

const AstronomicalTimePicker: FC<Props> = ({ value = 0, type, offsetType, itemHeight = 44, onChange }) => {
  const [temp, setTemp] = useState(value);
  const [tempType, setTempType] = useState(offsetType);
  const pickerColumns = useMemo(() => {
    const keyCode = type ? 'sunset' : 'sunrise';
    const offTypeList = [
      {
        value: -1,
        text: Strings.getLang(`ret_${keyCode}_before`),
      },
      {
        value: 0,
        text: Strings.getLang(`ret_${keyCode}_at`),
      },
      {
        value: 1,
        text: Strings.getLang(`ret_${keyCode}_after`),
      },
    ];
    const columns: Column[] = [
      {
        values: offTypeList,
        activeIndex: offTypeList.findIndex((i) => i.value === tempType),
      },
    ];
    const hour = Math.floor(temp / 60);
    const minute = temp % 60;
    let hours = ['00'];
    let minutes = ['00'];
    if (tempType !== 0) {
      hours = range(5, 0);
      minutes = range(60, hour > 0 ? 0 : 1);
    }
    columns.push({
      values: hours,
      activeIndex: hours.findIndex((item) => Number(item) === hour),
      unit: Strings.getLang('ret_hour'),
    });

    columns.push({
      values: minutes,
      activeIndex: minutes.findIndex((item) => Number(item) === minute),
      unit: Strings.getLang('ret_minute'),
    });

    return columns;
  }, [tempType, type, temp]);

  const handleChange = useCallback(
    (event) => {
      const { value } = event.detail;
      let time = 0;
      setTempType(value[0].value);
      if (value[0].value !== 0) {
        time = Math.max(Number(value[1]) * 60 + Number(value[2]), 1);
      }
      setTemp(time);
      onChange && onChange(value[0].value, time);
    },
    [pickerColumns],
  );

  useEffect(() => {
    setTemp(value);
  }, [value]);
  useEffect(() => {
    setTempType(offsetType);
  }, [offsetType]);

  return <Picker columns={pickerColumns} itemHeight={itemHeight} onChange={handleChange} />;
};

export default AstronomicalTimePicker;
