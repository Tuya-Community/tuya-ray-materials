import React, { FC, useCallback, useEffect, useMemo, useState, CSSProperties } from 'react';
import { PickerView, PickerViewColumn, View, getSystemInfoSync } from '@ray-js/ray';
import classnames from 'classnames';
import styles from './index.module.less';
import cnLoacel from './locale/zh_CN';

const systemInfo = getSystemInfoSync();

interface Locale {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  am: string;
  pm: string;
  dismissText?: string;
}

type ItemKey = 'year' | 'month' | 'day' | 'hours' | 'minutes' | 'ampm';

interface ItemData {
  key: ItemKey;
  unit: string;
  data: { value: number; label: string }[];
}

export interface DatePickerProps {
  mode?: 'date' | 'time' | 'datetime' | 'year' | 'month';
  date?: Date;
  defaultDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  use12Hours?: boolean;
  minuteStep?: number;
  disabled?: boolean;
  className?: string;
  onDateChange?: (date: Date) => void;
  onValueChange?: (vals: any, index: number) => void;
  locale?: Locale;
  isPlusZero?: boolean;
  style?: CSSProperties;
  pickerFontColor?: string;
  dateSortKeys?: Array<'year' | 'month' | 'day'>;
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function pad(n) {
  return n < 10 ? `0${n}` : n;
}

function getDisplayHour(rawHour, use12Hours) {
  // 12 hour am (midnight 00:00) -> 12 hour pm (noon 12:00) -> 12 hour am (midnight 00:00)
  if (use12Hours) {
    if (rawHour === 0) {
      rawHour = 12;
    }
    if (rawHour > 12) {
      rawHour -= 12;
    }
    return rawHour;
  }
  return rawHour;
}

function getTimeData(
  mode,
  locale,
  date,
  minuteStep,
  minDate: Date,
  maxDate: Date,
  use12Hours,
  minHour = 0,
  maxHour = 23,
  minMinute = 0,
  maxMinute = 59,
  isPlusZero = true
): ItemData[] {
  const minDateMinute = minDate.getMinutes();
  const maxDateMinute = maxDate.getMinutes();
  const minDateHour = minDate.getHours();
  const maxDateHour = maxDate.getHours();
  const hour = date.getHours();
  if (mode === 'datetime') {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const minDateYear = minDate.getFullYear();
    const maxDateYear = maxDate.getFullYear();
    const minDateMonth = minDate.getMonth();
    const maxDateMonth = maxDate.getMonth();
    const minDateDay = minDate.getDate();
    const maxDateDay = maxDate.getDate();
    if (minDateYear === year && minDateMonth === month && minDateDay === day) {
      minHour = minDateHour;
      if (minDateHour === hour) {
        minMinute = minDateMinute;
      }
    }
    if (maxDateYear === year && maxDateMonth === month && maxDateDay === day) {
      maxHour = maxDateHour;
      if (maxDateHour === hour) {
        maxMinute = maxDateMinute;
      }
    }
  } else {
    minHour = minDateHour;
    if (minDateHour === hour) {
      minMinute = minDateMinute;
    }
    maxHour = maxDateHour;
    if (maxDateHour === hour) {
      maxMinute = maxDateMinute;
    }
  }

  const hours: any[] = [];
  if ((minHour === 0 && maxHour === 0) || (minHour !== 0 && maxHour !== 0)) {
    minHour = getDisplayHour(minHour, use12Hours);
  } else if (minHour === 0 && use12Hours) {
    minHour = 1;
    hours.push({ value: 0, label: '12' });
  }
  maxHour = getDisplayHour(hour <= 12 && maxHour > 12 ? 23 : maxHour, use12Hours);
  for (let i = minHour; i <= maxHour; i++) {
    hours.push({
      value: i,
      label: isPlusZero ? pad(i) : i,
    });
  }
  const minutes: any[] = [];
  const selMinute = date.getMinutes();
  for (let i = minMinute; i <= maxMinute; i += minuteStep!) {
    minutes.push({
      value: i,
      label: isPlusZero ? pad(i) : i,
    });
    if (selMinute > i && selMinute < i + minuteStep!) {
      minutes.push({
        value: selMinute,
        label: isPlusZero ? pad(selMinute) : selMinute,
      });
    }
  }
  const cols: ItemData[] = [
    { key: 'hours', data: hours, unit: locale.hour } as ItemData,
    { key: 'minutes', data: minutes, unit: locale.minute } as ItemData,
  ].concat(
    use12Hours
      ? [
          {
            key: 'ampm',
            data: [
              { value: 0, label: locale.am },
              { value: 1, label: locale.pm },
            ],
            unit: '',
          } as ItemData,
        ]
      : []
  );
  return cols;
}

const getPickerData = (
  mode: string,
  locale: Locale,
  date: Date,
  minDate: Date,
  maxDate: Date,
  minuteStep: number,
  use12Hour: boolean,
  isPlusZero = true
): ItemData[] => {
  let timeData;
  if (mode === 'datetime' || mode === 'time') {
    timeData = getTimeData(
      mode,
      locale,
      date,
      minuteStep,
      minDate,
      maxDate,
      use12Hour,
      0,
      23,
      0,
      59,
      isPlusZero
    );
    if (mode === 'time') {
      return timeData;
    }
  }

  const selYear = date.getFullYear();
  const selMonth = date.getMonth() + 1;
  const minDateYear = minDate.getFullYear();
  const maxDateYear = maxDate.getFullYear();
  const minDateMonth = minDate.getMonth() + 1;
  const maxDateMonth = maxDate.getMonth() + 1;
  const minDateDay = minDate.getDate();
  const maxDateDay = maxDate.getDate();
  const years: any[] = [];
  for (let i = minDateYear; i <= maxDateYear; i++) {
    years.push({
      value: i,
      label: i,
    });
  }
  const yearCol: ItemData = { key: 'year', data: years, unit: locale.year };
  if (mode === 'year') {
    return [yearCol];
  }

  const months: any[] = [];
  let minMonth = 1;
  let maxMonth = 12;
  if (minDateYear === selYear) {
    minMonth = minDateMonth;
  }
  if (maxDateYear === selYear) {
    maxMonth = maxDateMonth;
  }
  for (let i = minMonth; i <= maxMonth; i++) {
    months.push({
      value: i,
      label: isPlusZero ? pad(i) : i,
    });
  }
  const monthCol: ItemData = { key: 'month', data: months, unit: locale.month };
  if (mode === 'month') {
    return [yearCol, monthCol];
  }

  const days: any[] = [];
  let minDay = 1;
  let maxDay = getDaysInMonth(date);

  if (minDateYear === selYear && minDateMonth === selMonth) {
    minDay = minDateDay;
  }
  if (maxDateYear === selYear && maxDateMonth === selMonth) {
    maxDay = maxDateDay;
  }
  for (let i = minDay; i <= maxDay; i++) {
    days.push({
      value: i,
      label: isPlusZero ? pad(i) : i,
    });
  }
  if (mode === 'date') {
    return [yearCol, monthCol, { key: 'day', data: days, unit: locale.day }];
  }
  if (mode === 'datetime') {
    return [yearCol, monthCol, { key: 'day', data: days, unit: locale.day }, ...timeData];
  }
  return [];
};

const getDataIndex = (pickerData: ItemData[], value: number, key: ItemKey) => {
  const items = pickerData.find(item => item.key === key);
  if (items) {
    const index = items.data.findIndex(item => item.value === value);
    if (index >= 0) {
      return index;
    }
  }
  return 0;
};
const getDataValueByIndex = (pickerData: ItemData[], index: number, key: ItemKey) => {
  const items = pickerData.find(item => item.key === key);
  if (items && items.data[index]) {
    return items.data[index].value;
  }
  return 0;
};

const DatePickerView: FC<DatePickerProps> = ({
  mode,
  date: value,
  minDate,
  maxDate,
  use12Hours,
  defaultDate,
  minuteStep,
  disabled,
  onDateChange,
  onValueChange,
  locale,
  className,
  isPlusZero,
  pickerFontColor,
  style,
  dateSortKeys,
}) => {
  const [date, setDate] = useState(() => {
    return value || defaultDate || minDate || new Date();
  });
  const pickerData = useMemo(() => {
    const list = getPickerData(
      mode as string,
      { ...defaultLocale, ...locale },
      date,
      minDate as Date,
      maxDate as Date,
      minuteStep as number,
      !!use12Hours,
      isPlusZero
    );

    if (Array.isArray(dateSortKeys)) {
      if (dateSortKeys.length !== 3) {
        console.warn(
          `dateSortKeys: ${JSON.stringify(
            dateSortKeys
          )} 不合法，必须为长度为3的数组，且值必须为'year' || 'month' || 'day`
        );
      } else {
        // 重新排序
        return list.sort((a, b) => {
          // @ts-ignore
          const aIndex = dateSortKeys.indexOf(a.key);
          // @ts-ignore
          const bIndex = dateSortKeys.indexOf(b.key);

          if (aIndex > 0 && bIndex > 0) {
            if (aIndex > bIndex) {
              return 1;
            }
            if (aIndex < bIndex) {
              return -1;
            }
          }
          return 0;
        });
      }
    }

    return list;
  }, [mode, locale, date, isPlusZero, minDate, maxDate, minuteStep, use12Hours, dateSortKeys]);

  const values = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    let ampm = 0;
    const minute = date.getMinutes();
    const result: number[] = pickerData.map(item => {
      let itemValue = 0;
      // eslint-disable-next-line default-case
      switch (item.key) {
        case 'year':
          itemValue = year;
          break;
        case 'month':
          itemValue = month;
          break;
        case 'day':
          itemValue = day;
          break;
        case 'hours':
          itemValue = hour;
          if (use12Hours) {
            ampm = hour >= 12 ? 1 : 0;
            itemValue = hour % 12 === 0 ? 12 : hour % 12;
          }
          break;
        case 'minutes':
          itemValue = minute;
          break;
        case 'ampm':
          itemValue = ampm;
          break;
      }
      if (item.key === 'ampm') {
        return ampm;
      }
      return getDataIndex(pickerData, itemValue, item.key);
    });
    return result;
  }, [mode, date, use12Hours]);

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value, defaultDate, minDate]);

  const handleValueChange = useCallback(
    (e: any) => {
      // eslint-disable-next-line no-shadow
      const values = e.value;
      const now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = 0;
      let minute = 0;
      let ampm = 0;

      pickerData.forEach((item, i) => {
        const itemValue = getDataValueByIndex(pickerData, values[i], item.key);
        // eslint-disable-next-line default-case
        switch (item.key) {
          case 'year':
            year = itemValue;
            break;
          case 'month':
            month = itemValue;
            break;
          case 'day':
            day = itemValue;
            break;
          case 'hours':
            hour = itemValue;
            break;
          case 'minutes':
            minute = itemValue;
            break;
          case 'ampm':
            ampm = itemValue;
        }
      });
      if (use12Hours) {
        if (ampm === 1) {
          // selected pm
          hour = 12 + hour;
        }
      }
      let newValue = new Date(year, month - 1, day, hour, minute);
      if (newValue < minDate) {
        newValue = minDate;
      }
      if (newValue > maxDate) {
        newValue = maxDate;
      }
      setDate(newValue);
      onDateChange && onDateChange(newValue);
      if (onValueChange) {
        console.warn('暂不支持 DatePicker 组件属性 onValueChange');
      }
    },
    [mode, onDateChange, onValueChange, pickerData, use12Hours, minDate, maxDate, dateSortKeys]
  );

  return (
    <View className={classnames(styles.picker, className)} style={style}>
      <View className={styles.box}>
        {/* 单位 */}
        <View className={styles.unitBox}>
          {pickerData.map(item => {
            return (
              <View
                key={item.key}
                className={classnames(styles.unit, {
                  [styles.year]: item.key === 'year',
                })}
              >
                {item.unit}
              </View>
            );
          })}
        </View>
        <PickerView
          className={classnames(styles.content, {
            [styles.disabled]: disabled,
          })}
          value={values}
          onChange={handleValueChange}
          indicator-style={`font-size:32rpx;height:34px;height:68rpx;line-height:68rpx;color:${
            pickerFontColor || '#333'
          }`}
        >
          {pickerData.map(item => (
            <PickerViewColumn key={item.key}>
              {item.data.map(x => (
                <View key={x.value} className={styles['col-item']}>
                  {x.label}
                </View>
              ))}
            </PickerViewColumn>
          ))}
        </PickerView>
        {disabled && <View className={styles['disabled-mask']} />}
      </View>
    </View>
  );
};

const defaultLocale: Locale = {
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '',
  am: 'AM',
  pm: 'PM',
};

DatePickerView.defaultProps = {
  locale: systemInfo.language === 'zh' ? cnLoacel : defaultLocale,
  minDate: new Date(2000, 0, 1, 0, 0, 0),
  maxDate: new Date(2100, 0, 1, 0, 0, 0),
  mode: 'date',
  disabled: false,
  minuteStep: 1,
  onDateChange() {
    //
  },
  use12Hours: false,
};

export default DatePickerView;
