import { publishDps } from '@ray-js/ray';
import { syncOpenModeRise } from '@ray-js/lock-sdk';
import { devices } from '@/devices';

/**
 * 按分类同步开锁方式（SDK opmode.sync.rise → synch_method DP 下发）：
 * - syncOpenModeKitByTypes：各分类 tab 的 per-type 单类型同步（对齐 RN syncPsw）。
 */

/** 同步指令下发 DP（对齐 RN putDpData({ synch_method: ins })） */
const DP_SYNCH_METHOD = 'synch_method';

/** rise 返回的 ins 经 synch_method DP 下发给设备（schema 无该 DP 时跳过） */
const publishSynchMethod = (devInfo: DevInfo, ins: string): void => {
  const schema = (devInfo.schema || []) as unknown as Array<{
    id: number | string;
    code: string;
  }>;
  const synchDp = schema.find(s => s?.code === DP_SYNCH_METHOD);
  if (!synchDp) return;
  publishDps({
    deviceId: devInfo.devId,
    dps: { [String(synchDp.id)]: ins },
    mode: 0,
    pipelines: [],
    options: {},
  });
};

/**
 * per-type 单类型同步：分类 tab 进入时只同步当前类型的开锁方式。
 * 对齐 RN(0000007ew6) openMode/others/*.js、password/index.js 的 syncPsw：
 * `TYNative.syncOpenMode([dpId])`（单 dpId），本端改传 dpCode 由 SDK 按 schema 解析；
 * RN 仅在 componentDidMount 触发、无节流、不检查在线态，此处保持一致（fire-and-forget，
 * 离线时 rise 仍会占住云端同步会话，publishDps 失败由 catch 兜底，与 RN putDpData 行为一致）。
 *
 */
export const syncOpenModeKitByTypes = (dpCodes: string[]): void => {
  const devInfo = devices.common.getDevInfo() as unknown as DevInfo | undefined;
  if (!devInfo || !dpCodes.length) return;

  syncOpenModeRise(dpCodes)
    .then(res => {
      if (!res?.ins || !res.distributed) return;
      publishSynchMethod(devInfo, res.ins);
    })
    .catch((err: unknown) => {
      console.log('=== syncOpenModeKitByTypes error', err);
    });
};
