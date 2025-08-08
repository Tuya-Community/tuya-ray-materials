import { SmartPickerSingleColumn } from '@ray-js/smart-ui';

export const getHourSelections = (is12Hours = false): { value: number; text: string }[] => {
  const hours = [];
  const count = is12Hours ? 12 : 24;
  for (let i = 0; i < count; i++) {
    let label = '';
    if (is12Hours) {
      label = `${i === 0 ? 12 : i}`;
    } else {
      label = i.toString().padStart(2, '0');
    }
    hours.push({
      value: i,
      text: label.toString(),
    });
  }
  return hours;
};

export const getMinsSelections = (): { value: number; text: string }[] => {
  const minutes = [];
  for (let i = 0; i < 60; i++) {
    minutes.push({
      value: i,
      text: i.toString().padStart(2, '0'),
    });
  }
  return minutes;
};

export const getTimePrefixSelections = (amText: string, pmText: string): { value: string; text: string }[] => [
  {
    value: 'AM',
    text: amText,
  },
  {
    value: 'PM',
    text: pmText,
  },
];

export const getPrefix = (hour) => (hour >= 12 ? 'PM' : 'AM');

export const omit: (object: Record<string, unknown>, keys: string[]) => Record<string, unknown> = (object, keys) => {
  const shallowCopy = {
    ...object,
  };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
};

export const parseTimer: (second: number) => string = (second: number) => {
  const t = second % 86400;
  const h = Math.floor(t / 3600);
  const m = Math.floor(t / 60 - h * 60);

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};
