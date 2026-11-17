/**
 * @file reConnectBle.ts
 * @brief 配件蓝牙重连（对齐 RN utils.reConnectBle）
 *
 * 连接判定（含超时）完全交给 lock-sdk 的 connectDevice：传入 countdown*1000 作为
 * 超时，SDK 内部先看聚合态 onlineTypes 是否已含 ble、已在线直接成功，否则 connectBLEDevice
 * 并监听 onBleChange/onOnlineChange，超时未连上则 reject errorCode 1002。本工具不再另起
 * 在线状态轮询、也不再用自有倒计时判定失败，保证连接逻辑只有 SDK 一套。
 *
 * 倒计时弹框为纯视觉反馈：通过 onTick 回调每秒抛出剩余秒数（countdown→1），
 * 由调用方用 React state 驱动受控弹框。connectDevice resolve 即成功、reject 即失败。
 */
import { showToast } from '@ray-js/ray';
import { connectDevice } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import store from '@/redux';
import { setBleOnline } from '@/redux/modules/lockHomeSlice';

/** 防止并发重连（对齐 RN flag） */
let reconnecting = false;

export type ReConnectBleOptions = {
  /** 倒计时秒数，默认 10（用户可见 10s，同时作为 SDK 连接超时） */
  countdown?: number;
  /** 连接成功是否 Toast，默认 true */
  successToast?: boolean;
  /**
   * 倒计时回调：每秒抛出剩余秒数（含起始一次，countdown→1），供调用方驱动受控弹框文案。
   * 传入 0 表示连接结束（弹框应由调用方隐藏）。
   */
  onTick?: (secondsLeft: number) => void;
};

/**
 * 重连当前配件蓝牙。
 *
 * @param options 倒计时 / Toast / onTick 回调
 * @returns 连接成功为 true；失败抛出 Error
 * @note 对齐 RN(0000007ew6) src/utils/index.js reConnectBle：
 *       仅在配件离线时由业务侧调用；成功后需用户再次触发原业务（不解绑自动续跑）。
 */
export function reConnectBle(options: ReConnectBleOptions = {}): Promise<boolean> {
  const { countdown = 10, successToast = true, onTick } = options;

  return new Promise((resolve, reject) => {
    if (reconnecting) {
      reject(new Error(Strings.getLang('bleConnectFailed')));
      return;
    }
    reconnecting = true;

    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      reconnecting = false;
      clearInterval(timer);
      onTick?.(0); // 通知调用方关闭弹框
      if (ok) {
        store.dispatch(setBleOnline(true));
        if (successToast) {
          showToast({ title: Strings.getLang('bleConnectSuccess'), icon: 'success' });
        }
        resolve(true);
      } else {
        showToast({ title: Strings.getLang('bleConnectFailed'), icon: 'none' });
        reject(new Error(Strings.getLang('bleConnectFailed')));
      }
    };

    // 起始文案
    onTick?.(countdown);

    // 倒计时纯 UI 计时器：仅每秒刷新文案，不再判定失败（超时由 SDK 负责）
    let seconds = countdown;
    const timer = setInterval(() => {
      if (settled) return;
      seconds -= 1;
      if (seconds > 0) {
        onTick?.(seconds);
      }
    }, 1000);

    // 连接判定（含超时）完全交给 SDK：resolve 即成功，reject 即失败
    connectDevice({ timeout: countdown * 1000 })
      .then(() => finish(true))
      .catch(err => {
        console.log('=== connectDevice error', err);
        if (!settled) finish(false);
      });
  });
}

export default reConnectBle;
