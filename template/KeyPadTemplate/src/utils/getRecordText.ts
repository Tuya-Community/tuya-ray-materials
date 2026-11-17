import type { LogData } from '@ray-js/lock-sdk';
import Strings from '@/i18n';

/**
 * 组合开锁 dpId（对齐 RN(0000007ew6) src/containers/records.js:174 `dpId === '59'`）。
 */
const UNION_DP_ID = '59';

/**
 * 根据一条日志记录生成展示文案。
 *
 * 严格对齐 RN(0000007ew6) src/containers/records.js renderCustomItem：
 * - openModeType = ` ${openType_${dpId}}${unBindUnlock}`，多语言 key 为数字 dpId 维度
 *   （与 RN i18n openType_50~openType_74 一致），不依赖 dpCode，规避 kit/裸名命名差异；
 * - openText：先拼 userName，再拼 unlockName；无 unlockName 时追加 openModeType；
 * - 组合开锁（dpId === '59'）：`${userName},${unlockName}解锁,` 串接 → split(',') 去重 → join(' ')；
 * - 关锁记录：closeType_${dpId}（本产品仅 lock_record/106）。
 *
 * 注：lock-sdk 2.0 解析出的 type/localOperation 分支为 RN 之外的能力增强，不影响与 RN 的对齐。
 */
export const getRecordText = (log?: LogData | null): string => {
  if (!log) return '';
  const unlock = Strings.getLang('unBindUnlock');
  const { dpId } = log;

  // openModeType：方式名兜底（对齐 RN openModeType，key 为 openType_${dpId}）
  const openModeType = ` ${Strings.getLang(`openType_${dpId}` as any)}${unlock}`;

  // openText：严格对齐 RN 的 userName / unlockName 拼接
  let openText = '';
  const { userName, unlockName } = log;
  if (userName && userName !== '' && userName !== undefined) {
    openText += userName;
  }
  if (unlockName && unlockName !== '' && unlockName !== undefined) {
    openText += openText === '' ? `${unlockName}${unlock}` : ` ${unlockName}${unlock}`;
  } else {
    // 关键：无 unlockName 时追加方式名兜底（对齐 RN openText += openModeType）
    openText += openModeType;
  }

  // 组合开锁：严格对齐 RN dpId === '59' 的 split/join 去重拼接
  let unionText = '';
  if (`${dpId}` === UNION_DP_ID && log.unionUnlockInfo) {
    let raw = '';
    log.unionUnlockInfo.forEach(i => {
      raw += `${i.userName},${i.unlockName}${unlock},`;
    });
    unionText = Array.from(new Set(raw.split(',')))
      .filter(Boolean)
      .join(' ');
  }

  let recordText = `${dpId}` === UNION_DP_ID ? unionText : openText;

  // 关锁记录：closeType_${dpId}（严格对齐 RN records.js:183-185，
  // Config.closeDoorDpIds.includes(Number(dpId)) → closeType_${dpId}，本产品仅 lock_record/106）
  if (log.type === 'close_record') {
    recordText = Strings.getLang(`closeType_${dpId}` as any);
  }

  return recordText;
};

export default getRecordText;
