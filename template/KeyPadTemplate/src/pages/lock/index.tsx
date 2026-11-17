import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  getBLEOnlineState,
  openPanel,
  usePageEvent,
} from '@ray-js/ray';
import { NavBar, ActionSheet, Dialog, Overlay, Loading, type SmartAction } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import { activateLockToFit, getBoundLockList, unbindLockToFit } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { AddBtn } from '@/components';
import { reConnectBle } from '@/utils/reConnectBle';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { useDispatch } from 'react-redux';
import {
  selectBleOnline,
  selectHasBindLockList,
  setHasBindLockList,
} from '@/redux/modules/lockHomeSlice';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/** 已绑定门锁项（对齐 fit BoundLockListItem，此处只取用到的字段） */
interface BoundLockItem {
  devId: string;
  bindingId: string;
  devName: string;
  icon: string;
  isSupportScy?: boolean;
  online?: boolean;
  /** SDK 计算的安全版本兼容判定（门锁支持安全版本但配件未开启安全通道） */
  securityVersionMismatch?: boolean;
  /** SDK 计算的激活判定（门锁支持安全版本但未重新下发过安全密钥），true 时显示「激活」按钮 */
  securityNeedUpdate?: boolean;
}

/**
 * 已绑定门锁列表页。
 *
 * 对齐 RN(0000007ew6) src/containers/lock/index.js：
 * - 进入页面拉取已绑定列表（composeLayout 已拉取一份进 redux，此处再实时刷新）；
 * - 批量查询门锁蓝牙在线状态，离线门锁展示「已离线」副标题；
 * - 点击门锁项弹 ActionSheet（查看 / 解除绑定）：查看用 openPanel 跳门锁面板，
 *   解除绑定经 Dialog 确认后：配件离线先 reConnectBle（10s 倒计时居中 Loading），
 *   网关在线非蓝牙则拦截；蓝牙在线再调 fit unbindLockToFit 完成解绑并刷新；
 * - 绑定/解绑的透传、加密密钥、SECURITY_UPDATED 等细节由 fit 高阶 API 内部处理，
 *   故不再迁移 RN 的 bindPage 中转页；
 * - 「激活」按钮（对齐 RN activateKeyPad）：securityNeedUpdate 为 true 时展示，
 *   与门锁离线态无关（离线只影响副标题）；点击时才校验配件自身在线（离线
 *   reConnectBle，网关拦截 gatewayActivateError），激活调 fit activateLockToFit。
 *   仅历史存量绑定需要激活，经 SDK 绑定的锁在绑定流程内已标记 SECURITY_UPDATED。
 */
export function Lock() {
  const reduxList = useSelectorWithEquality(selectHasBindLockList);
  const bleOnline = useSelectorWithEquality(selectBleOnline);
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);
  const dispatch = useDispatch();
  const { themeColor } = templateConfig;

  const [list, setList] = useState<BoundLockItem[]>([]);
  /** 首帧是否拉取完成（未完成不渲染空状态，避免闪现） */
  const [started, setStarted] = useState(false);
  /** 门锁在线态集合（对齐 RN getOnlineStateArr） */
  const [onlineIds, setOnlineIds] = useState<string[]>([]);

  // ===== 弹层：门锁操作 ActionSheet =====
  const [sheetVisible, setSheetVisible] = useState(false);
  const targetRef = useRef<BoundLockItem | null>(null);

  // ===== 弹层：解除绑定确认 Dialog =====
  const [confirmVisible, setConfirmVisible] = useState(false);
  /** 网关下不可操作提示文案（解绑 gatewayBindError / 激活 gatewayActivateError），空串不显示 */
  const [gatewayError, setGatewayError] = useState('');
  const unbindingRef = useRef(false);
  const activatingRef = useRef(false);
  /**
   * 最近一次点击「激活」按钮的时间戳。Ray 运行时 tap 事件的 stopPropagation
   * 并不生效（点按钮仍会冒泡触发行点击弹 ActionSheet），故用时间戳做冒泡拦截：
   * 行点击回调里发现刚点过激活按钮（同一次 tap 的冒泡窗口内）则忽略。
   */
  const activateTapAtRef = useRef(0);

  // ===== 蓝牙重连倒计时弹框（受控，由 reConnectBle 的 onTick 回调驱动） =====
  /** >0 时展示「蓝牙连接中 Xs」弹框；0 表示关闭 */
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  /**
   * 校验目标门锁是否仍在已绑定列表中。
   *
   * 用于解绑异常时的兜底判定：fit unbindLockToFit 是多阶段事务，stage1
   * （unbindLockFromFitCloud）成功后云端绑定关系已解除，但后续 publishToLock
   * （给门锁下发解绑并等校验码）若超时/失败会导致整体 reject。此时实际已解绑，
   * 需以列表为准重新校验，避免「提示失败但实际成功」。
   */
  const checkStillBound = useCallback(async (devId: string) => {
    try {
      const res = await getBoundLockList();
      const current = (Array.isArray(res) ? res : []) as BoundLockItem[];
      return current.some(it => it.devId === devId);
    } catch {
      return true; // 拉取失败时保守判定为仍在，维持原失败提示
    }
  }, []);

  /** 拉取已绑定门锁列表并同步 redux */
  const refreshList = useCallback(async () => {
    try {
      const res = await getBoundLockList();
      const next = (Array.isArray(res) ? res : []) as BoundLockItem[];
      setList(next);
      dispatch(setHasBindLockList(next as Record<string, any>[]));
    } catch (err) {
      console.log('=== getBoundLockList error', err);
    } finally {
      setStarted(true);
    }
  }, [dispatch]);

  /**
   * 批量查询门锁 BLE 本地在线态（严格对齐 RN getOnlineStateArr）。
   *
   * RN 用 TYNative.getBLEOnlineState(devId) 取 BLE 本地在线态（{state}），命中即视为
   * 在线；此处用 Ray 同名 API getBLEOnlineState（回调 {isOnline}），语义一致。
   *
   * 早前曾改用 getDeviceOnlineType（onlineType 位掩码综合各通道），本意想更宽松地判定
   * 在线，结果反而对「跨设备的对端 BLE 门锁」返回 onlineType=0 造成误离线——同一设备
   * RN 的 getBLEOnlineState 却能查到本地在线。故回退为与 RN 一致的 getBLEOnlineState。
   */
  const refreshOnlineState = useCallback((locks: BoundLockItem[]) => {
    if (!locks.length) {
      setOnlineIds([]);
      return;
    }
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
      .then(ids => {
        setOnlineIds(ids.filter(Boolean));
      })
      .catch(err => {
        console.log('=== getBLEOnlineState error', err);
      });
  }, []);

  // 本页 push 到 addLockList / openPanel 跳门锁面板后仍保留在栈内，返回时不会重新挂载，
  // 需在 onShow 主动刷新（绑定成功返回后列表才会更新；多刷一次幂等无害）
  usePageEvent('onShow', () => {
    refreshList();
  });

  // 列表变化时刷新在线态
  useEffect(() => {
    refreshOnlineState(list);
  }, [list, refreshOnlineState]);

  // redux 列表先于本地拉取就绪时，用其渲染
  useEffect(() => {
    if (!started && reduxList && reduxList.length > 0) {
      setList(reduxList as BoundLockItem[]);
    }
  }, [reduxList, started]);

  /** 点击门锁项：打开操作面板（激活按钮冒泡触发的行点击忽略） */
  const onItemClick = (item: BoundLockItem) => {
    if (Date.now() - activateTapAtRef.current < 500) return;
    targetRef.current = item;
    setSheetVisible(true);
  };

  /** ActionSheet 选项回调 */
  const onSheetSelect = (e: { detail: SmartAction }) => {
    const value = e?.detail?.value as string | undefined;
    setSheetVisible(false);
    const item = targetRef.current;
    if (!item || !value) return;
    if (value === 'viewLock') {
      // 跳转门锁面板（对齐 RN navManager.pushWithDevID）
      openPanel({ deviceId: item.devId });
    } else if (value === 'remove') {
      setConfirmVisible(true);
    }
  };

  /**
   * 确认解除绑定（对齐 RN startRemove）。
   *
   * 1. 配件离线 → reConnectBle（居中「蓝牙连接中 Xs」倒计时），成功后需用户再次解绑；
   * 2. 配件在线但非蓝牙（网关）→ 弹 gatewayBindError，不可解绑；
   * 3. 蓝牙在线 → unbindLockToFit。
   */
  const onConfirmRemove = useCallback(async () => {
    setConfirmVisible(false);
    const item = targetRef.current;
    if (!item || unbindingRef.current) return;

    // 配件离线：先蓝牙重连（受控居中弹框倒计时），对齐 RN return reConnectBle()
    if (!deviceOnline) {
      try {
        await reConnectBle({
          onTick: sec => setReconnectSeconds(sec),
        });
      } catch {
        // 连接失败已 Toast，结束
      } finally {
        setReconnectSeconds(0);
      }
      return;
    }

    // 网关在线、非蓝牙：安全原因不可解绑/绑定
    if (!bleOnline && deviceOnline) {
      setGatewayError(Strings.getLang('gatewayBindError'));
      return;
    }

    unbindingRef.current = true;
    showLoading({ title: Strings.getLang('pleaseHoldOn') });
    try {
      // 必须传列表返回的完整 item：SDK 拼解绑透传帧依赖其中的
      // fittingUnlockId/randomStr/devUnlockId/devUuid，只传 devId+bindingId 会拼帧失败
      await unbindLockToFit(item as any);
      hideLoading();
      showToast({ title: Strings.getLang('removeSuccess'), icon: 'success' });
      targetRef.current = null;
      refreshList();
    } catch (err: any) {
      hideLoading();
      // fit unbindLockToFit 为多阶段事务：stage1（云端解除绑定）成功后，若后续给门锁
      // 下发解绑（publishToLock）超时 errorCode 1002 或校验码不符 errorCode 1004，
      // 整体 reject。此时绑定关系在云端可能已解除，需以列表为准兜底校验：
      // 目标门锁已不在列表 -> 实际成功；仍在列表才提示失败。
      const stillBound = await checkStillBound(item.devId);
      if (!stillBound) {
        showToast({ title: Strings.getLang('removeSuccess'), icon: 'success' });
        targetRef.current = null;
        refreshList();
        return;
      }
      // fit SDK 超时抛 errorCode 1002（对齐 RN 12s 超时文案 removeTimeOut）
      const errorText =
        Number(err?.errorCode) === 1002
          ? Strings.getLang('removeTimeOut')
          : Strings.getLang('removeError');
      showToast({ title: errorText, icon: 'none' });
    } finally {
      unbindingRef.current = false;
    }
  }, [refreshList, checkStillBound, deviceOnline, bleOnline]);

  /**
   * 激活门锁安全密钥（对齐 RN activateKeyPad）。
   *
   * 1. 配件离线 → reConnectBle（居中「蓝牙连接中 Xs」倒计时），成功后需用户再次点击激活；
   * 2. 配件在线但非蓝牙（网关）→ 弹 gatewayActivateError，不可激活；
   * 3. 蓝牙在线 → activateLockToFit（透传 bind 帧 + 标记 SECURITY_UPDATED），
   *    成功后刷新列表（securityNeedUpdate 变 false，按钮消失）。
   */
  const onActivate = useCallback(
    async (item: BoundLockItem) => {
      if (activatingRef.current) return;

      // 配件离线：先蓝牙重连，对齐 RN return reConnectBle()
      if (!deviceOnline) {
        try {
          await reConnectBle({
            onTick: sec => setReconnectSeconds(sec),
          });
        } catch {
          // 连接失败已 Toast，结束
        } finally {
          setReconnectSeconds(0);
        }
        return;
      }

      // 网关在线、非蓝牙：安全原因不可透传激活
      if (!bleOnline && deviceOnline) {
        setGatewayError(Strings.getLang('gatewayActivateError'));
        return;
      }

      activatingRef.current = true;
      showLoading({ title: Strings.getLang('pleaseHoldOn') });
      try {
        await activateLockToFit(item as any);
        hideLoading();
        showToast({ title: Strings.getLang('activateSuccessful'), icon: 'success' });
        refreshList();
      } catch (err: any) {
        hideLoading();
        // SDK 透传 ACK 超时抛 1002（对齐 RN 12s activateTimeout），其余按激活失败提示
        const errorText =
          Number(err?.errorCode) === 1002
            ? Strings.getLang('activateTimeout')
            : Strings.getLang('activateFailed');
        showToast({ title: errorText, icon: 'none' });
      } finally {
        activatingRef.current = false;
      }
    },
    [refreshList, deviceOnline, bleOnline]
  );

  /** 跳转选择门锁页 */
  const goAddLock = () => {
    router.push('/addLockList');
  };

  const isEmpty = started && list.length === 0;

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('tab_lock')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      <ScrollView className={styles.scroll} scrollY>
        {isEmpty ? (
          <View className={styles.noneWrap}>
            <Image className={styles.noneIcon} src={getCdnUrl('noneLock.png', cdnImage)} />
            <Text className={styles.tip}>{Strings.getLang('pleaseBindLock')}</Text>
          </View>
        ) : (
          list.map(item => {
            const misMatch = !!item.securityVersionMismatch;
            // 在线判定：综合在线态查询命中 OR 云端 online 字段（对齐 RN）
            const isOnline = onlineIds.indexOf(item.devId) !== -1 || item.online;
            // 副标题：安全版本不匹配 > 已离线 > 无
            const subTitle = misMatch
              ? Strings.getLang('securityVersionMismatch')
              : isOnline
              ? ''
              : Strings.getLang('hasOffline');
            return (
              <View key={item.devId} className={styles.item} onClick={() => onItemClick(item)}>
                <Image className={styles.icon} src={item.icon} />
                <View className={styles.info}>
                  <Text className={styles.title}>{item.devName}</Text>
                  {!!subTitle && (
                    <Text className={`${styles.subTitle} ${misMatch ? styles.subTitleWarn : ''}`}>
                      {subTitle}
                    </Text>
                  )}
                </View>
                {/* 激活按钮：只看 securityNeedUpdate，与离线态无关（对齐 RN），在线校验在点击时做 */}
                {!!item.securityNeedUpdate && (
                  <View
                    className={styles.activateBtn}
                    style={{ backgroundColor: themeColor }}
                    onClick={() => {
                      activateTapAtRef.current = Date.now();
                      onActivate(item);
                    }}
                  >
                    <Text className={styles.activateText}>{Strings.getLang('activate')}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <AddBtn text={Strings.getLang('add')} onPress={goAddLock} />

      {/* 门锁操作面板 */}
      <ActionSheet
        show={sheetVisible}
        actions={
          [
            { name: Strings.getLang('viewLock'), value: 'viewLock' },
            { name: Strings.getLang('removeBind'), value: 'remove' },
          ] as SmartAction[]
        }
        cancelText={Strings.getLang('cancel')}
        safeAreaInsetBottom={false}
        onClose={() => setSheetVisible(false)}
        onSelect={onSheetSelect}
        onCancel={() => setSheetVisible(false)}
      />

      {/* 解除绑定确认 */}
      <Dialog
        show={confirmVisible}
        title={Strings.getLang('confirmRemoveTip')}
        showCancelButton
        confirmButtonText={Strings.getLang('confirm')}
        cancelButtonText={Strings.getLang('cancel')}
        onClose={() => setConfirmVisible(false)}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={onConfirmRemove}
      />

      {/* 网关下不可解绑/激活 */}
      <Dialog
        show={!!gatewayError}
        title={gatewayError}
        confirmButtonText={Strings.getLang('confirm')}
        onClose={() => setGatewayError('')}
        onConfirm={() => setGatewayError('')}
      />

      {/* 蓝牙重连倒计时：Overlay 仅作遮罩，盒子用 fixed 自居中，文案由 reconnectSeconds 驱动 */}
      <Overlay show={reconnectSeconds > 0}>
        <View className={styles.reconnectBox}>
          <Loading type="circular" color="#ffffff" size="36px" />
          <Text className={styles.reconnectText}>
            {Strings.formatValue('connectBle', String(reconnectSeconds))}
          </Text>
        </View>
      </Overlay>
    </View>
  );
}

export default Lock;
