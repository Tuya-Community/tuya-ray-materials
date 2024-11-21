import Strings from '@/i18n';

export enum WeightUnit {
  kg = 'kg',
  lb = 'lb',
  st = 'st',
  jin = 'jin',
  // og = 'og',
}

export enum HeightUnit {
  cm = 'cm',
  inch = 'inch',
}

/*
 * 获取小数位数
 */
function getMaxDecimalLength(...val: any[]) {
  // 最大小数位长度
  let maxDecimalLength = 0;
  val.forEach(x => {
    const strVal = x.toString();
    const dotIndex = strVal.indexOf('.');
    if (dotIndex > -1) {
      // 获取当前值小数位长度
      const curDecimalLength = strVal.length - 1 - dotIndex;
      if (curDecimalLength > maxDecimalLength) {
        maxDecimalLength = curDecimalLength;
      }
    }
  });
  return maxDecimalLength;
}

/**
 * Picker 数据源获取
 */
export const getDatasourceByRange = (min: number | string, max: number | string, step: number) => {
  const res: { value: number; label: string }[] = [];
  for (let i = +min; i < +max; i += step) {
    res.push({ value: i, label: `${i}` });

    // 边界处理
    if (i < +max && i + step >= +max) {
      res.push({ value: +max, label: `${max}` });
      break;
    }
  }
  return res;
};

/**
 * Picker 数据源获取 - 小数点
 */
export const getPointDatasourceByRange = (
  min: number | string,
  max: number | string,
  step: number
) => {
  const res: { value: number; label: string }[] = [];
  for (let i = +min; i < +max; i += step) {
    res.push({ value: getDecimal(i), label: `.${Math.round(i * 10)}` });
    // 边界处理
    if (i < +max && i + step >= +max && Math.round(i * 10) !== Math.round(+max * 10)) {
      res.push({ value: getDecimal(+max), label: `.${Math.round(+max * 10)}` });
      break;
    }
  }
  return res;
};

/**
 * 返回指定位数长度的小数值
 * @param num 数字
 * @param pointN 得到小数位数
 */
export const getDecimal = (num: number, pointN = 1) => {
  const len = getMaxDecimalLength(num); // 当前小数长度
  const saveLen = len > pointN ? pointN : len;
  return (
    Math.round(Number(+num.toString().split('.')[1] / Math.pow(10, len - saveLen)) || 0) /
    Math.pow(10, saveLen)
  );
};

export const getDatasourceByRangeZero = (min: number, max: number, step: number) => {
  const res: { value: number | string; label: string }[] = [];
  for (let i = min; i < max; i += step) {
    if (i < 10) {
      res.push({ value: `0${i}`, label: `0${i}` });
    } else {
      res.push({ value: `${i}`, label: `${i}` });
    }

    // 边界处理
    if (i < max && i + step >= max) {
      res.push({ value: max, label: `${max}` });
      break;
    }
  }
  return res;
};
/**
 * 格式化数据
 * 保留几位小数，输出了字符串
 * @param value
 * @param scale
 */
export const formatNumber2String = (value: number, scale = 1) => {
  // eslint-disable-next-line no-restricted-properties
  const [integer, decimal] = `${value}`.split('.');
  if (!decimal || scale === 0) {
    return `${integer || 0}`;
  }
  let point = decimal.slice(0, scale) || '';
  const add0Num = scale - point.length;
  for (let index = 0; index < add0Num; index++) {
    point += '0';
  }
  if (scale > 0) {
    return `${integer || 0}.${point || 0}`;
  }
  return `${integer || 0}`;
};

export const cmToFt = (v: number) => Math.floor(v / 30.48);
export const cmToInch = (v: number) => Math.round((v % 30.48) / 2.54);
export const inchToCm = (ft: number, inch: number) => Math.round(ft * 30.48 + inch * 2.54);
export const cmToInchUnit = (height = 0, heightUnit = 'cm') => {
  if (heightUnit === 'cm') return `${height}${Strings.getLang('cmUnit')}`;
  return `${cmToFt(height)}${Strings.getLang('ftUnit')} ${cmToInch(height)}${Strings.getLang(
    'inchUnit'
  )}`;
};

export const kgToLb = (num = 0) => {
  const value = Math.round(num * 2.2046226 * 100) / 100;

  const [integer, decimal] = `${value}`.split('.');

  const decimalPlace = decimal?.split('');
  const oneDecimalPlace = decimalPlace?.shift() || '';

  if (+oneDecimalPlace % 2 === 0)
    return +`${integer || 0}.${+oneDecimalPlace || 0}${decimalPlace?.join('') || ''}`;
  return +`${integer || 0}.${+oneDecimalPlace - 1 || 0}${decimalPlace?.join('') || ''}`;
};

export const kgToSt = (num = 0, scale: number) => {
  const lb = Number(kgToLb(num)) || 0;
  const value = divide(lb, 14);
  const [integer, decimal] = `${value}`.split('.');

  const decimalPlace = decimal?.split('');
  const oneDecimalPlace = decimalPlace?.shift() || '';
  let result = '';

  if (+oneDecimalPlace % 2 !== 0 && scale === 1) {
    if (+oneDecimalPlace === 9) {
      result = `${+integer + 1 || 0}.${0}`;
    } else {
      result = `${integer || 0}.${+oneDecimalPlace + 1 || 0}`;
    }
  } else {
    result = `${integer || 0}.${+oneDecimalPlace || 0}`;
  }
  result += decimalPlace?.join('') || '';
  return Number(result);
};

export const kgToJin = (num: number) => {
  return num * 2;
};

export const kgToOther = ({
  num = 0,
  unit = WeightUnit.kg,
  hasUnit = false,
  scale = 0,
}): string | number => {
  const value = +num || 0;
  if (unit === WeightUnit.kg) {
    if (hasUnit) {
      return `${formatNumber2String(value, scale)}${Strings.getLang('kgUnit')}`;
    }
    return formatNumber2String(value, scale);
  }

  const lb = kgToLb(value);

  if (unit === WeightUnit.lb) {
    if (hasUnit) {
      return `${formatNumber2String(lb, scale)}${Strings.getLang('lbUnit')}`;
    }
    return formatNumber2String(lb, scale);
  }

  const jin = kgToJin(value);

  if (unit === WeightUnit.jin) {
    if (hasUnit) {
      return `${formatNumber2String(jin, scale)}${Strings.getLang('jinUnit')}`;
    }
    return formatNumber2String(jin, scale);
  }

  const st = kgToSt(value, scale) || 0;

  if (unit === WeightUnit.st) {
    if (hasUnit) {
      return `${formatNumber2String(st, scale)}${Strings.getLang('stUnit')}`;
    }
    return formatNumber2String(st, scale);
  }

  return value;
};

export const otherToKg = (num: number | string = 0, unit = WeightUnit.kg) => {
  const v = unit === WeightUnit.st ? num : +num || 0;
  if (unit === WeightUnit.kg) return +v;
  if (unit === WeightUnit.lb) return divide(+v, 2.2046226);
  if (unit === WeightUnit.jin) return divide(+v, 2);
  if (unit === WeightUnit.st) return divide(+v / 2.2046226) * 14;
  return num;
};

/*
 * 除法 解决精度丢失问题
 * divide(0.123 , 1.4567 , 10.56789)
 */
export const divide = (...val: any[]) => {
  let sum = 0;
  let decimalLengthSum = 0;
  val.forEach((x, index) => {
    // 获取当前小数位长度
    const decimalLength = getMaxDecimalLength(x);
    // 将当前数变为整数
    const nurVal = Math.round(x * Math.pow(10, decimalLength));
    if (index === 0) {
      decimalLengthSum = decimalLength;
      sum = nurVal;
    } else {
      decimalLengthSum -= decimalLength;
      sum /= nurVal;
    }
  });
  return sum / Math.pow(10, decimalLengthSum);
};
