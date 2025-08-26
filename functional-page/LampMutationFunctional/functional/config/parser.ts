import { utils } from '@ray-js/panel-sdk';
import { DpRule } from './dpRules';

export const decode = (value: string, rules: DpRule[]): any => {
  const result = rules.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.default }), {});

  if (!value) return result;

  const step = utils.generateDpStrStep(value);

  for (const rule of rules) {
    result[rule.name] = step(rule.length).value;
  }

  return result;
};

export const encode = (obj: any, rules: DpRule[]): any => {
  let result = '';
  if (!obj) return result;
  for (const rule of rules) {
    result += utils.numToHexString(obj[rule.name], rule.length);
  }

  return result;
};
