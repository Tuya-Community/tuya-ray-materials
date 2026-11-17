import Strings from '@/i18n';

/**
 * 告警记录中用于生成文案的最小字段集合。
 * 对应 lock-sdk 的 LogData（getAlarms 返回项）。
 */
export interface AlarmLogLike {
  dpId: number;
  dpCode: string;
  data?: any;
  isHijack?: boolean;
}

/** 无值告警（仅展示 dp 名称，不拼接 dp 值）的 dpId 集合 */
const NO_VALUE_ALARM_DP_IDS = [33, 71, 72];
/** 劫持告警 dpId */
const HIJACK_DP_ID = 90;

/**
 * 根据告警记录生成展示文案。
 *
 * 告警文案规则：
 * - 劫持告警（isHijack 或 dpId 90）→ 「劫持告警」文案；
 * - dpId 为 33/71/72 → 仅取 dp 文案，不拼接 dp 值；
 * - 其余 → dp 文案 + dp 值。
 */
export const getAlarmText = (alarm?: AlarmLogLike | null): string => {
  if (!alarm) return '';
  const { dpId, dpCode, data, isHijack } = alarm;
  if (isHijack || Number(dpId) === HIJACK_DP_ID) {
    return Strings.getLang('hijackAlarm');
  }
  if (NO_VALUE_ALARM_DP_IDS.indexOf(Number(dpId)) > -1) {
    return Strings.getDpLang(dpCode);
  }
  return Strings.getDpLang(dpCode, data);
};

export default getAlarmText;
