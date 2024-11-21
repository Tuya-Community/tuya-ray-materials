import { dpCodes } from '@/config';
import { getDpSchema } from '.';

/* eslint-disable no-param-reassign */
interface Per {
  value: string | number;
  label: string;
}

const { systolicBpCode, diastolicBpCode, pulseCode } = dpCodes;

export const generateList = (code: string): Per[] => {
  const { min = 0, max = 0, step = 1 } = getDpSchema(code) || {};
  return new Array(max - min).fill(0).map((_, index) => {
    const val = min + index + step;
    return {
      label: String(val),
      value: val,
    };
  });
};

export const bpPickerData = (code: string) => {
  const { min = 0, max = 0, step = 1 } = getDpSchema(code);
  // const min = 0;
  // const max = 300;
  // const step = 1;
  return new Array(max - min + 1).fill(0).reduce((acc, cur, idx) => {
    const minValue = min || step;
    if (idx * step < max) {
      return [...acc, idx * step + minValue];
    }
    return acc;
  }, []);
};
