import dayjs from 'dayjs';
import Strings from '@/i18n';

/**
 * 密码 / 开锁方式相关的纯工具函数（对齐 RN(0000007ew6) src/utils/index.js）。
 * 供无效开锁方式列表页（failurePswList）与密码开锁方式列表（openMode 密码 tab）共用。
 */

/** opModeType / opModeSubType 说明（对齐 RN 注释）：
 * 1. 在线带时效临时密码 2. 在线普通永久密码 3. 离线临时密码 4/10. 虚拟钥匙 5. 指纹 6. 门卡
 * opModeSubType：离线 0 多次 1 单次 8 清空单个 9 清空全部；在线 0 时效 1 单次
 */

/**
 * 密码图标（对齐 RN utils/index.js getPswIcon）。按 opModeType / opModeSubType 选择 CDN 图名。
 */
export function getPswIcon(item: { opModeType: number; opModeSubType: number }): string {
  const { opModeType, opModeSubType } = item;
  switch (opModeType) {
    case 30:
    case 20:
      return 'temporaryKey.png';
    case 10:
      return 'permanentKey.png';
    case 2:
      return 'permanentPwd.png';
    case 1:
      return opModeSubType === 0 ? 'unlimited.png' : 'one.png';
    case 3:
      if (opModeSubType === 0) return 'unlimited.png';
      if (opModeSubType === 1) return 'one.png';
      return 'clearCode.png';
    default:
      return 'permanentPwd.png';
  }
}

/**
 * 周期重复文案（对齐 RN utils/index.js getRepeatStrByNumber）。
 * workingDay 为按位掩码：bit1=周日(0) ... bit6=周五(5)，bit0=周六(6)。
 */
export function getRepeatStrByNumber(source = 0): string {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    let k = i + 1;
    if (k > 6) k = 0;
    // eslint-disable-next-line no-bitwise
    if (source & (1 << k)) {
      days.push(Strings.getLang(`day${k}` as any));
    }
  }
  if (days.length === 0) return Strings.getLang('day8' as any);
  if (days.length === 7) return Strings.getLang('day7' as any);
  return days.join(', ');
}

/**
 * 秒数 -> HH:mm（对齐 RN Utils.TimeUtils.parseTimer：入参为「秒」，`second % 86400`）。
 *
 * 注意单位：RN 及本项目所有调用方传入的都是 `分钟 * 60`（即秒）——如密码列表
 * `parseTimer((scheduleDetails[0].effectiveTime || 0) * 60)`（effectiveTime 为每日时段分钟数）。
 * 早期误按「分钟」实现（`% 1440`），会把 480min*60=28800 当成分钟 → 00:00，故每日时段显示错乱。
 */
export function parseTimer(second: number): string {
  const t = ((second % 86400) + 86400) % 86400;
  const h = Math.floor(t / 3600);
  const min = Math.floor(t / 60 - h * 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(h)}:${pad(min)}`;
}

/** 时间戳(秒) -> yyyy.MM.dd HH:mm（对齐 RN getTimeText） */
export function formatTime(time?: number): string {
  if (!time) return '';
  return dayjs(Number(time) * 1000).format('YYYY.MM.DD HH:mm');
}
