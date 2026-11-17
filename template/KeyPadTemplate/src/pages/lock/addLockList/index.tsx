import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  getCdnUrl,
  showToast,
  showLoading,
  hideLoading,
  router,
  usePageEvent,
  getBLEOnlineState,
  connectBLEDevice,
} from '@ray-js/ray';
import { NavBar, Dialog } from '@ray-js/smart-ui';
import { getUnbindLockList, bindLockToFit } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { AddBtn } from '@/components';
import { gotoAddDevice } from '@/utils/nativeRouter';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/** 可绑定门锁项（对齐 fit UnbindLockListItem，此处只取用到的字段） */
interface UnbindLockItem {
  devId: string;
  devName: string;
  devUnlockId: string;
  devUuid: string;
  fittingId: string;
  fittingUnlockId: string;
  icon: string;
  isSupportScy?: boolean;
  online?: boolean;
  protocolVersion?: string;
  randomStr: string;
  /** SDK 计算的可绑定判定（蓝牙协议版本 + 安全版本） */
  bindable?: boolean;
  /** 不可绑定原因，用于映射副标题文案 */
  unbindableReason?: 'ble_version_mismatch' | 'security_version_mismatch';
}

/** 不可绑定原因 -> 副标题多语言 key */
const UNBINDABLE_REASON_LANG_KEY = {
  ble_version_mismatch: 'BleVersionMismatch',
  security_version_mismatch: 'securityVersionMismatch',
} as const;

/**
 * 选择门锁并绑定页。
 *
 * 对齐 RN(0000007ew6) src/containers/lock/addLockList.js：
 * - 进入页面拉取可绑定列表 + 配件蓝牙协议版本 BV；
 * - 蓝牙版本 / 安全版本不匹配的门锁置灰禁用；
 * - 选中门锁若离线，先 connectBLEDevice 连接后再绑定；在线直接绑定；
 * - 绑定调 fit bindLockToFit（内部完成透传+云端+SECURITY_UPDATED），成功后返回 lock 列表页；
 * - 不再迁移 RN bindPage 中转页，绑定/解绑细节由 fit 高阶 API 处理。
 */
export function AddLock() {
  const { themeColor } = templateConfig;
  const [list, setList] = useState<UnbindLockItem[]>([]);
  /** 首帧是否拉取完成（未完成不渲染空状态，避免闪现） */
  const [started, setStarted] = useState(false);
  /** 门锁在线态集合（对齐 RN getOnlineStateArr） */
  const [onlineIds, setOnlineIds] = useState<string[]>([]);
  /** 当前选中门锁的 devUnlockId */
  const [chooseId, setChooseId] = useState('');
  const chooseDataRef = useRef<UnbindLockItem | null>(null);
  /** 正在连接选中门锁 */
  const [bleConnecting, setBleConnecting] = useState(false);
  /**
   * 副标题：不可绑定原因（蓝牙版本 > 安全版本，由 SDK 定优先级）> 已离线 > 无。
   */
  const getSubtitle = useCallback(
    (item: UnbindLockItem) => {
      if (item.unbindableReason) {
        return Strings.getLang(UNBINDABLE_REASON_LANG_KEY[item.unbindableReason]);
      }
      return onlineIds.indexOf(item.devId) === -1 && !item.online
        ? Strings.getLang('hasOffline')
        : '';
    },
    [onlineIds]
  );

  /** 列表项是否禁用（SDK 判定不可绑定） */
  const isItemDisabled = useCallback((item: UnbindLockItem) => item.bindable === false, []);

  /** 批量查询门锁蓝牙在线态（对齐 RN getOnlineStateArr） */
  const refreshOnlineState = useCallback((locks: UnbindLockItem[]) => {
    if (!locks.length) {
      setOnlineIds([]);
      return;
    }
    // 严格对齐 RN addLockList getOnlineStateArr：用 getBLEOnlineState 取 BLE 本地在线态
    // （回调 {isOnline}），命中即在线。此前用 getDeviceOnlineType 会对跨设备 BLE 门锁误判
    // 离线（onlineType=0），进而误触发绑定前的重连流程，故回退为与 RN 一致的 getBLEOnlineState。
    Promise.all(
      locks.map(
        item =>
          new Promise<string>(resolve => {
            getBLEOnlineState({
              deviceId: item.devId,
              success: ({ isOnline }) => resolve(isOnline ? item.devId : ''),
              fail: () => resolve(''),
            });
          })
      )
    )
      .then(ids => setOnlineIds(ids.filter(Boolean)))
      .catch(err => {
        console.log('=== getBLEOnlineState error', err);
      });
  }, []);

  /**
   * 校验目标门锁是否仍在可绑定列表中（绑定异常兜底）。
   *
   * fit bindLockToFit 为多阶段事务：stage1（bindLockAndFit）成功后绑定关系可能已建立，
   * 但后续 publishToLock（给门锁下发并等校验码）若超时 errorCode 1002 或校验码不符
   * errorCode 1004 会导致整体 reject。此时实际可能已绑定成功，需以列表为准兜底：
   * 目标门锁已不在可绑定列表 -> 实际绑定成功；仍在才提示失败。
   */
  const checkStillUnbound = useCallback(async (devId: string) => {
    try {
      const res = await getUnbindLockList();
      const current = (Array.isArray(res) ? res : []) as UnbindLockItem[];
      return current.some(it => it.devId === devId);
    } catch {
      return true; // 拉取失败保守判定为仍在，维持原失败提示，避免误返回列表页
    }
  }, []);

  /**
   * 拉取可绑定列表。
   *
   * 蓝牙协议版本（BV）与安全版本的兼容判定由 SDK 在 getUnbindLockList 内部完成，
   * 直接读列表项的 bindable / unbindableReason，无需业务侧自行比对与编排。
   */
  const refreshList = useCallback(async () => {
    try {
      const res = await getUnbindLockList();
      const next = (Array.isArray(res) ? res : []) as UnbindLockItem[];
      setList(next);
      refreshOnlineState(next);
    } catch (err) {
      console.log('=== getUnbindLockList error', err);
    } finally {
      setStarted(true);
    }
  }, [refreshOnlineState]);

  // 进入页面拉取（仅挂载时执行一次）
  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // v2.3 §6：快捷加设备跳出（App 配网页）后本页保留在栈内，切回面板时（onShow）主动
  // 刷新可绑定列表并重算在线态（对齐 RN onPageAppear 监听；多刷一次幂等无害）
  usePageEvent('onShow', () => {
    refreshList();
  });

  /** 选中 / 取消选中门锁（对齐 RN chooseItem） */
  const onChoose = (item: UnbindLockItem) => {
    if (isItemDisabled(item)) return;
    if (item.devUnlockId === chooseId) {
      setChooseId('');
      chooseDataRef.current = null;
    } else {
      setChooseId(item.devUnlockId);
      chooseDataRef.current = item;
    }
  };

  /** 当前选中门锁是否离线（对齐 RN selectedIsOffline） */
  const selectedIsOffline = useMemo(() => {
    const item = chooseDataRef.current;
    return !!item?.devId && onlineIds.indexOf(item.devId) === -1 && !item.online;
  }, [chooseId, onlineIds]); // chooseId 作为依赖触发重算

  const bindingRef = useRef(false);

  /** 开始绑定（对齐 RN startBind） */
  const startBind = useCallback(async () => {
    const item = chooseDataRef.current;
    if (!item || bindingRef.current) return;
    bindingRef.current = true;
    showLoading({ title: Strings.getLang('bindLockLoading') });
    try {
      await bindLockToFit(item as any);
      hideLoading();
      showToast({ title: Strings.getLang('bindSuccess'), icon: 'success' });
      chooseDataRef.current = null;
      // 成功后返回 lock 列表页（该页 onShow 时会重新拉取）
      setTimeout(() => router.back(), 800);
    } catch (err: any) {
      hideLoading();
      // fit bindLockToFit 多阶段事务，stage1 成功后 publishToLock 超时/校验码不符会整体
      // reject，此时实际可能已绑定成功，以可绑定列表为准兜底校验。
      const stillUnbound = await checkStillUnbound(item.devId);
      if (!stillUnbound) {
        showToast({ title: Strings.getLang('bindSuccess'), icon: 'success' });
        chooseDataRef.current = null;
        setTimeout(() => router.back(), 800);
        return;
      }
      // fit SDK 超时抛 errorCode 1002（对齐 RN 12s 超时文案 bindTimeOut）
      const errorText =
        Number(err?.errorCode) === 1002
          ? Strings.getLang('bindTimeOut')
          : Strings.getLang('bindError');
      showToast({ title: errorText, icon: 'none' });
    } finally {
      bindingRef.current = false;
    }
  }, [checkStillUnbound]);

  /**
   * 连接选中门锁（严格对齐 RN connectBleDevice）。
   *
   * 目标门锁不是当前面板设备，BLE/设备在线事件默认可能只订阅了当前配件，单纯等待
   * onBLEConnectStatusChange/onDeviceOnlineStatusUpdate 会漏掉跨设备门锁的连接结果。
   * RN 的做法是发起连接后每秒轮询 getBLEOnlineState，因此这里也以轮询结果为准。
   */
  const connectSelected = useCallback(
    (devId: string) =>
      new Promise<boolean>(resolve => {
        const getOnlineState = () =>
          new Promise<boolean>(resolveOnline => {
            getBLEOnlineState({
              deviceId: devId,
              success: ({ isOnline }) => resolveOnline(!!isOnline),
              fail: () => resolveOnline(false),
            });
          });

        // 先查本地蓝牙在线态，已在线直接判成功。
        getOnlineState().then(isOnline => {
          if (isOnline) {
            resolve(true);
            return;
          }

          let settled = false;
          let elapsedSeconds = 0;
          let timer: ReturnType<typeof setInterval> | undefined;
          const finish = (ok: boolean) => {
            if (settled) return;
            settled = true;
            if (timer) clearInterval(timer);
            resolve(ok);
          };

          // 与 RN 相同：连接动作发起后轮询目标门锁的 BLE 本地在线态。
          timer = setInterval(async () => {
            elapsedSeconds += 1;
            if (await getOnlineState()) {
              finish(true);
              return;
            }
            if (elapsedSeconds >= 15) finish(false);
          }, 1000);

          // success 仅表示连接动作已发起；最终结果以上面的在线态轮询为准。
          connectBLEDevice({
            deviceId: devId,
            fail: err => {
              console.log('=== connectBLEDevice fail', err);
              finish(false);
            },
          });
        });
      }),
    []
  );

  /** 点击底部按钮（对齐 RN onPressHandle） */
  const onPressButton = useCallback(async () => {
    const item = chooseDataRef.current;
    if (!item) return;
    // 选中门锁离线，先连接再绑定
    if (selectedIsOffline) {
      setBleConnecting(true);
      const connected = await connectSelected(item.devId);
      if (connected) {
        // 连接成功：刷新在线态后继续绑定
        refreshOnlineState(list);
      } else {
        showToast({ title: Strings.getLang('blueNotConnect'), icon: 'none' });
      }
      setBleConnecting(false);
      return;
    }
    startBind();
  }, [selectedIsOffline, list, refreshOnlineState, startBind, connectSelected]);

  /** 网关连接下不可绑定（对齐 RN：配件在线但非蓝牙在线） */
  const [gatewayVisible, setGatewayVisible] = useState(false);

  const isEmpty = started && list.length === 0;

  // 按钮文案随态切换（对齐 RN addBtnText）
  const btnText = bleConnecting
    ? Strings.getLang('startConnecting')
    : selectedIsOffline
    ? Strings.getLang('startConnect')
    : Strings.getLang('startBind');

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('chooseLock')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      <ScrollView className={styles.scroll} scrollY>
        {isEmpty ? (
          <View className={styles.noneWrap}>
            <Image className={styles.noneIcon} src={getCdnUrl('noneLock.png', cdnImage)} />
            <Text className={styles.tip}>{Strings.getLang('pleaseAddLock')}</Text>
            {/* v2.3 §6：新增「去添加」入口，跳 App 配网页加设备；原「开始绑定」按钮保持不动 */}
            <View
              className={styles.goAddBtn}
              style={{ backgroundColor: themeColor || '#519A8E' }}
              onClick={() => {
                gotoAddDevice().catch(err => console.log('=== gotoAddDevice error', err));
              }}
            >
              <Text className={styles.goAddBtnText}>{Strings.getLang('goAdd')}</Text>
            </View>
          </View>
        ) : (
          list.map(item => {
            const disabled = isItemDisabled(item);
            const subTitle = getSubtitle(item);
            const checked = item.devUnlockId === chooseId;
            return (
              <View
                key={item.devId}
                className={`${styles.item} ${disabled ? styles.itemDisabled : ''}`}
                onClick={() => onChoose(item)}
              >
                <Image className={styles.icon} src={item.icon} />
                <View className={styles.info}>
                  <Text className={styles.title}>{item.devName}</Text>
                  {!!subTitle && <Text className={styles.subTitle}>{subTitle}</Text>}
                </View>
                <Image
                  className={styles.chooseIcon}
                  src={getCdnUrl(checked ? 'choose.png' : 'chooseNull.png', cdnImage)}
                />
              </View>
            );
          })
        )}
      </ScrollView>

      <AddBtn text={btnText} disabled={!chooseDataRef.current} onPress={onPressButton} />

      {/* 网关下不可操作提示 */}
      <Dialog
        show={gatewayVisible}
        title={Strings.getLang('gatewayBindError')}
        confirmButtonText={Strings.getLang('confirm')}
        onClose={() => setGatewayVisible(false)}
        onConfirm={() => setGatewayVisible(false)}
      />
    </View>
  );
}

export default AddLock;
