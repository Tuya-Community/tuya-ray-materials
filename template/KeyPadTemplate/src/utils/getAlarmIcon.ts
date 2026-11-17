import icons from '@/res/iconfont.json';
import { AlarmLogLike } from './getAlarmText';

/** 无值告警（仅按 dp 命中图标，不拼接 dp 值）的 dpId 集合 */
const NO_VALUE_ALARM_DP_IDS = [33, 71, 72];
/** 劫持告警 dpId */
const HIJACK_DP_ID = 90;

const iconMap = icons as Record<string, string>;

/**
 * 根据告警记录计算 iconfont 图标名。
 *
 * 告警图标规则：
 * - 劫持告警（isHijack 或 dpId 90）→ 'hijack'；
 * - dpId 为 33/71/72 → 'lxmm'；
 * - 其余 → `dp_${dpCode}_${dpValue}`。
 */
export const getAlarmIconName = (alarm?: AlarmLogLike | null): string => {
  if (!alarm) return 'default';
  const { dpId, dpCode, data, isHijack } = alarm;
  if (isHijack || Number(dpId) === HIJACK_DP_ID) {
    return 'hijack';
  }
  if (NO_VALUE_ALARM_DP_IDS.indexOf(Number(dpId)) > -1) {
    return 'lxmm';
  }
  return `dp_${dpCode}_${data}`;
};

/**
 * 取告警图标的 SVG path 数据（供 smart-ui `Icon` 的 name 直接渲染）。
 * 命中不到具体图标时回退到 'default'（对齐 RN 的 `|| 'default'`）。
 */
export const getAlarmIconPath = (alarm?: AlarmLogLike | null): string => {
  const name = getAlarmIconName(alarm);
  return iconMap[name] || iconMap.default || '';
};

export default getAlarmIconPath;
