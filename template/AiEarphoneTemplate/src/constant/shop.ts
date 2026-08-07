/*
 * @Author: hkc
 * @Date: 2025-12-10 21:51:00
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-11 19:13:42
 * @Description:
 */
import Strings from '@/i18n';
import { IPeriodUnit } from '@/types/shop';

// 周期单位文本：year, month, day, week
export const dateType = {
  [IPeriodUnit.year]: Strings.getLang('unit.year'),
  [IPeriodUnit.month]: Strings.getLang('unit.month'),
  [IPeriodUnit.day]: Strings.getLang('unit.day'),
  [IPeriodUnit.week]: Strings.getLang('unit.week'),
};

// 周期单位复数文本：years, months, days, weeks
export const dateTypePlural = {
  [IPeriodUnit.year]: Strings.getLang('plural.years'),
  [IPeriodUnit.month]: Strings.getLang('plural.months'),
  [IPeriodUnit.day]: Strings.getLang('plural.days'),
  [IPeriodUnit.week]: Strings.getLang('plural.weeks'),
};

// 订阅时长
export enum SubscriptionDuration {
  year = 1,
  month = 2,
  day = 3,
  week = 4,
  halfYear = 5,
  quarterYear = 6,
}

// 订阅时长文本
export const subscriptionUnitText = {
  [SubscriptionDuration.year]: Strings.getLang('sub.year'),
  [SubscriptionDuration.month]: Strings.getLang('sub.month'),
  [SubscriptionDuration.day]: Strings.getLang('sub.day'),
  [SubscriptionDuration.week]: Strings.getLang('sub.week'),
  [SubscriptionDuration.halfYear]: Strings.getLang('sub.halfYear'),
  [SubscriptionDuration.quarterYear]: Strings.getLang('sub.quarterYear'),
};
