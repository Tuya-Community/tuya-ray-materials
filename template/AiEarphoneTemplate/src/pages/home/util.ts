import Strings from '@/i18n';
import { getRemainingDays } from '@/utils/time';
import { BenefitScope, BenefitType, BenefitVasType } from '@/constant/enums';
import dayjs from 'dayjs';
import { BenefitItem } from '@/api/ttt.interface';

// 获取权益标题
export const getBenefitTitle = (item: BenefitItem, showTotalMin = true) => {
  const deviceName = item?.deviceName;
  const totalMin = Math.floor(item?.totalQuantity / 60);

  // 新人赠送权益，显示：新人赠送权益 | 时长
  if (deviceName === 'first_time_') {
    return `${Strings.getLang('benefit_new_user')}${
      showTotalMin ? ` | ${Strings.formatValue('total_min', totalMin)}` : ''
    }`;
  }

  // 设备按天权益, 过期之前无限使用，直接显示：设备名称
  if (item?.type === BenefitType.Day && item?.scope === BenefitScope.Device) {
    return deviceName;
  }

  // 按月权益, 显示：(设备名称/通用/AI 积分) | 时长/月
  // 一次性权益, 显示：(设备名称/通用/AI 积分) | 时长
  const fallbackName =
    item?.scope === BenefitScope.HeyTuya
      ? Strings.getLang('benefit_ai_credit')
      : Strings.getLang('general');
  return `${deviceName || fallbackName} |  ${Strings.formatValue(
    item?.vasType === BenefitVasType.Cycle ? 'benefit_by_month' : 'total_min',
    totalMin
  )}`;
};

// 获取处理后的权益列表
export const getProcessedBenefitList = (benefits: BenefitItem[], showTotalMin = true) => {
  return benefits.map(item => {
    const dateLabel =
      item.vasType === BenefitVasType.Cycle
        ? Strings.getLang('benefit_refresh_date')
        : Strings.getLang('benefit_expire_date');

    // 计算剩余天数
    const remainingDays =
      item.effectiveEndDate === -1 ? -1 : getRemainingDays(item.effectiveEndDate);

    // 根据剩余天数决定显示格式
    let effectiveEndDate: string;
    if (item.effectiveEndDate === -1) {
      // 终身有效
      effectiveEndDate = Strings.getLang('benefit_lifetime');
    } else if (remainingDays > 0 && remainingDays <= 3) {
      // 剩余3天以内且未过期，显示年月日时分秒
      effectiveEndDate = dayjs(item.effectiveEndDate).format('YYYY/MM/DD HH:mm:ss');
    } else {
      // 超过3天或已过期，显示年月日, 如果是周期类型，则加1秒
      effectiveEndDate = dayjs(
        item.effectiveEndDate + (item.vasType === BenefitVasType.Cycle ? 1000 : 0)
      ).format('YYYY/MM/DD');
    }

    // 购买按钮文案
    let buyButtonText = '';
    const isLt20 = item.leftQuantity / item.totalQuantity <= 0.2; // 剩余20%以下
    if (item.vasType === BenefitVasType.Cycle && remainingDays < 3) {
      buyButtonText = Strings.getLang('benefit_renewal');
    } else if (isLt20) {
      buyButtonText = Strings.getLang('benefit_add_duration');
    }

    // 是否过期, effectiveEndDate：-1表示终身有效
    const isExpired = item.effectiveEndDate === -1 ? false : remainingDays <= 0;

    // 是否在我的页面和商城页面显示, 设备的权益全部展示，通用/AI 积分的权益展示未过期且未耗尽的权益
    const isShow =
      item.scope === BenefitScope.Device ||
      ((item.scope === BenefitScope.Mall || item.scope === BenefitScope.HeyTuya) &&
        !isExpired &&
        item.leftQuantity > 0);

    const isLimited = item.type === BenefitType.DayLocked;

    let scope: string;
    if (item.scope === BenefitScope.Mall || item.scope === BenefitScope.HeyTuya) {
      scope = Strings.getLang('benefit_scope_mall');
    } else if (isLimited) {
      scope = `${item.deviceName} ${Strings.getLang('benefit_service_limited')}`;
    } else {
      scope = item.deviceName;
    }

    return {
      title: getBenefitTitle(item, showTotalMin),
      showProgress: item.type === BenefitType.Usage,
      dateLabel,
      effectiveEndDate,
      isExpired,
      isLimited,
      totalMin: Math.floor(item.totalQuantity / 60),
      leftMin: Math.floor(item.leftQuantity / 60),
      usedMin: Math.floor(item.usedQuantity / 60),
      scope,
      vasType: item.vasType,
      buyButtonText,
      scopeType: item.scope,
      isShow,
    };
  });
};
