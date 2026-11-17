import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, showModal, router, navigateBack, useQuery } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import {
  fitStartAddUnlockMethod,
  fitCancelAddUnlockMethod,
  onFitAddUnlockMethod,
  offFitAddUnlockMethod,
  fitUpdateUnlockMethod,
  getFitUnlockMethodList,
  type FitAddUnlockMethodEvent,
  type FitUnlockMethodItem,
  type UnlockMethodType,
} from '@ray-js/lock-sdk';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { templateConfig } from '@/config';
import { CollectVisual } from './collectVisual';
import { ResultView } from './resultView';
import styles from './index.module.less';

/**
 * 开锁方式录制页（指纹 / 门卡 / 人脸 / 掌静脉），四类共用一个页面。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/others/{addFinger,addCard,addFace,addHand}View.js：
 * RN 为四个独立页，主要差异仅在「采集视觉」(renderCenter)；共有的 DP 协议解析 / 云端保存 / 超时
 * 由 @ray-js/lock-sdk 统一封装，故此处合为单页：
 * - 共享逻辑层（本文件）：启动录入、监听 step/success/fail、倒计时、取消、保存/改名、导航；
 * - 采集视觉层（CollectVisual）：按 type 忠实还原各自视觉；
 * - 结果层（ResultView）：成功/失败·超时共用。
 *
 * SDK 契约：
 * - `fitStartAddUnlockMethod({type,userId,lockDevId,timeout})` → `{ total }` 总步骤数；
 * - `onFitAddUnlockMethod` 推送 `step`（进度）/`success`（云端已建记录，携带 id/name）/`fail`（error）；
 * - `fitCancelAddUnlockMethod(...)` 取消进行中的录入。
 *
 * 注意（SDK 限制）：success 事件在常规录入下 `id=0 / name=''`（配件云端 opmode.add 返回 unknown，
 * SDK 未回传 opModeId）。为让成功页输入的名称生效，本页在启动前快照已有记录 id（existingIdsRef），
 * 成功后重新拉列表按「新增 id」定位刚建的记录，再 `fitUpdateUnlockMethod({id,name})` 改名。
 */

const RECORD_TYPES: readonly UnlockMethodType[] = ['finger', 'card', 'face', 'hand'];

/** 单次采集超时（毫秒）；SDK 在每个 step 后按此值续期，倒计时展示同步复位。 */
const CAPTURE_TIMEOUT_MS = 30000;
const CAPTURE_TIMEOUT_SEC = CAPTURE_TIMEOUT_MS / 1000;

/**
 * 从 fit 添加流程返回「开锁方式」列表页需回退的层级：openMode→chooseLock→chooseUser→addGuide→addRecord。
 * 用 navigateBack({delta}) —— miniapp 的 router.go() 未实现（会抛错），router.back() 固定 delta=1。
 */
const BACK_TO_OPEN_MODE = 4;
const backToOpenMode = () => navigateBack({ delta: BACK_TO_OPEN_MODE });

/** 2 位十六进制（设备原始状态码 → i18n 后缀，如 2→'02'、0xfe→'fe'） */
const pad2Hex = (n: number) => n.toString(16).padStart(2, '0');

/**
 * fail 事件 → 友好文案。SDK 的 ErrorData 形状为 `{ errorCode, errorMsg }`，未知设备状态额外带 `devCode`。
 * 设备原始状态 status → 错误码映射：status 0~10 → 1015+status；0xfe → 1026；未知 → 1016 且带 devCode。
 * 反推回原始 status，命中类型化文案 `<type>Error_<hex>`（对齐 RN，如重复录入 status=2 → fingerError_02），
 * 否则回退通用「添加失败」。
 */
function errorTextFor(type: UnlockMethodType, error: any): string {
  let status: number | undefined;
  // 未知状态兜底分支带原始 status（devCode）优先；否则按错误码区间反推
  if (typeof error?.devCode === 'number') {
    status = error.devCode;
  } else {
    const code = error?.errorCode;
    if (typeof code === 'number' && code >= 1015 && code <= 1025) status = code - 1015;
    else if (code === 1026) status = 0xfe;
  }
  if (status != null) {
    const key = `${type}Error_${pad2Hex(status)}`;
    const text = Strings.getLang(key as any);
    if (text && text !== key) return text;
  }
  return Strings.getLang('addError');
}

export function AddRecord() {
  const {
    type: rawType,
    userId = '',
    lockDevId = '',
  } = useQuery() as { type?: string; userId?: string; lockDevId?: string };
  const type: UnlockMethodType = RECORD_TYPES.includes(rawType as UnlockMethodType)
    ? (rawType as UnlockMethodType)
    : 'finger';

  const { themeColor } = templateConfig;
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);

  // 采集态
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(0);
  const [seconds, setSeconds] = useState(CAPTURE_TIMEOUT_SEC);
  const [percent, setPercent] = useState(0); // 门卡成功后圆环填充
  const [isError, setIsError] = useState(false); // 采集中单次失败（进度变红）

  // 结果态
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [name, setName] = useState('');
  const successIdRef = useRef(0);
  // 启动前已存在的开锁方式记录 id 快照（用于成功后按「新增 id」定位刚建记录来改名）
  const existingIdsRef = useRef<Set<number>>(new Set());

  // 只结束一次（超时/成功/失败竞争时以先到者为准）
  const finishedRef = useRef(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(CAPTURE_TIMEOUT_SEC);

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startCountdown = useCallback(() => {
    clearCountdown();
    secondsRef.current = CAPTURE_TIMEOUT_SEC;
    setSeconds(CAPTURE_TIMEOUT_SEC);
    countdownRef.current = setInterval(() => {
      secondsRef.current -= 1;
      if (secondsRef.current <= 0) {
        setSeconds(0);
        clearCountdown();
        // 本地倒计时归零：按超时结果处理（SDK 也会 fail-timeout，finishedRef 去重）
        if (!finishedRef.current) {
          finishedRef.current = true;
          setIsSuccess(false);
          setIsTimeOut(true);
          setErrorText(Strings.getLang('addTimeOut'));
          setShowResult(true);
        }
      } else {
        setSeconds(secondsRef.current);
      }
    }, 1000);
  }, []);

  /**
   * 重新拉列表，按「不在启动前快照里的 id」定位刚新建的记录（对齐 RN 从 add 云端响应取 opModeId 的意图）。
   * 命中多条时取最大 id（最新）；失败返回 0。
   */
  const resolveNewMethodId = useCallback(async (): Promise<number> => {
    try {
      const list = await getFitUnlockMethodList({ type, lockDevId: lockDevId || undefined });
      const items = (list as FitUnlockMethodItem[]) || [];
      const fresh = items.filter(it => !existingIdsRef.current.has(it.id));
      if (fresh.length === 0) return 0;
      return fresh.reduce((max, it) => (it.id > max ? it.id : max), 0);
    } catch (e) {
      console.warn('=== resolveNewMethodId error', e);
      return 0;
    }
  }, [type, lockDevId]);

  /** 成功：停止计时；门卡先做圆环填充动画再进结果页，其余直接进结果页 */
  const finishSuccess = useCallback(
    (id: number, recordName: string) => {
      finishedRef.current = true;
      clearCountdown();
      successIdRef.current = id || 0;
      // SDK 常规录入 id=0：后台预取新增记录 id，供「完成」改名（不阻塞进结果页）
      if (successIdRef.current <= 0) {
        resolveNewMethodId().then(newId => {
          if (newId > 0) successIdRef.current = newId;
        });
      }
      setName(recordName || '');
      setIsError(false);
      if (type === 'card') {
        let p = 0;
        cardAnimRef.current = setInterval(() => {
          p = Math.min(p + 20, 100);
          setPercent(p);
          if (p >= 100) {
            if (cardAnimRef.current) clearInterval(cardAnimRef.current);
            cardAnimRef.current = null;
            setIsSuccess(true);
            setShowResult(true);
          }
        }, 120);
      } else {
        setIsSuccess(true);
        setShowResult(true);
      }
    },
    [type, resolveNewMethodId]
  );

  const finishFail = useCallback((text: string) => {
    finishedRef.current = true;
    clearCountdown();
    setIsSuccess(false);
    setIsTimeOut(false);
    setErrorText(text);
    setShowResult(true);
  }, []);

  // 启动录入 + 注册事件监听（监听先于启动，避免漏掉早到的 step 事件）
  useEffect(() => {
    let cancelled = false;
    const listener = (event: FitAddUnlockMethodEvent) => {
      if (finishedRef.current) return;
      if (event.stage === 'step') {
        setTotal(event.total);
        setStep(event.step);
        setIsError(false);
        startCountdown(); // 每步续期倒计时（对齐 SDK 超时续期）
      } else if (event.stage === 'success') {
        finishSuccess((event as any).id ?? 0, (event as any).name ?? '');
      } else if (event.stage === 'fail') {
        finishFail(errorTextFor(type, (event as any).error));
      }
    };
    onFitAddUnlockMethod(listener);

    fitStartAddUnlockMethod({
      type,
      userId,
      lockDevId: lockDevId || undefined,
      timeout: CAPTURE_TIMEOUT_MS,
    })
      .then(res => {
        if (cancelled) return;
        setTotal(res?.total ?? 0);
        startCountdown();
      })
      .catch(err => {
        console.warn('=== fitStartAddUnlockMethod error', err);
        if (cancelled || finishedRef.current) return;
        finishFail(errorTextFor(type, err));
      });

    return () => {
      cancelled = true;
      offFitAddUnlockMethod(listener);
      clearCountdown();
      if (cardAnimRef.current) clearInterval(cardAnimRef.current);
      // 未完成即离开：取消设备端录入态，避免门锁停留在无 UI 承接的录入
      if (!finishedRef.current) {
        fitCancelAddUnlockMethod({ type, userId, lockDevId: lockDevId || undefined }).catch(
          error => {
            console.log('Operation failed', error);
          }
        );
      }
    };
    // 仅初始化一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 启动前快照已有记录 id（成功后据此定位新增记录来改名，规避 SDK success id=0）
  useEffect(() => {
    getFitUnlockMethodList({ type, lockDevId: lockDevId || undefined })
      .then(list => {
        existingIdsRef.current = new Set(((list as FitUnlockMethodItem[]) || []).map(it => it.id));
      })
      .catch(error => {
        console.log('Operation failed', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 采集中设备离线：提示并终止（对齐 RN componentWillReceiveProps deviceDisconnected → stopCollection）
  useEffect(() => {
    if (deviceOnline || finishedRef.current || showResult) return;
    finishedRef.current = true;
    clearCountdown();
    fitCancelAddUnlockMethod({ type, userId, lockDevId: lockDevId || undefined }).catch(error => {
      console.log('Operation failed', error);
    });
    showModal({
      title: Strings.getLang('deviceDisconnected'),
      showCancel: false,
      confirmText: Strings.getLang('confirm'),
      success: () => backToOpenMode(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceOnline, showResult]);

  /** 采集中取消（对齐 RN cancelCollect → 二次确认 → stopCollection → 退回列表） */
  const handleCancel = useCallback(() => {
    showModal({
      title: Strings.getLang('cancel'),
      content: Strings.getLang('cancelTip'),
      confirmText: Strings.getLang('confirm'),
      cancelText: Strings.getLang('cancel'),
      success: res => {
        if (!res.confirm) return;
        finishedRef.current = true;
        clearCountdown();
        fitCancelAddUnlockMethod({ type, userId, lockDevId: lockDevId || undefined }).catch(
          error => {
            console.log('Operation failed', error);
          }
        );
        backToOpenMode();
      },
    });
  }, [type, userId, lockDevId]);

  /** 结果页主按钮：成功→改名并退回列表；失败/超时→退回引导页重试 */
  const handlePrimary = useCallback(async () => {
    if (!isSuccess) {
      router.back(); // 回引导页重新采集（对齐 RN retryAdd）
      return;
    }
    const trimmed = name.trim();
    if (trimmed) {
      // success 事件常返回 id=0（SDK 限制），改用「新增记录 id」定位刚建记录再改名
      let id = successIdRef.current;
      if (id <= 0) id = await resolveNewMethodId();
      if (id > 0) {
        try {
          await fitUpdateUnlockMethod({ id, name: trimmed });
        } catch (e) {
          console.warn('=== fitUpdateUnlockMethod error', e);
        }
      }
    }
    backToOpenMode();
  }, [isSuccess, name, resolveNewMethodId]);

  return (
    <View className={styles.page}>
      {!isSuccess && (
        <NavBar
          border={false}
          title={Strings.formatValue('collectOpenMode', Strings.getLang(type as any))}
          leftArrow
          onClickLeft={showResult ? () => backToOpenMode() : handleCancel}
        />
      )}

      {showResult ? (
        <ResultView
          isSuccess={isSuccess}
          isTimeOut={isTimeOut}
          errorText={errorText}
          code={type}
          themeColor={themeColor}
          name={name}
          onNameChange={setName}
          onPrimary={handlePrimary}
        />
      ) : (
        <CollectVisual
          type={type}
          step={step}
          total={total}
          seconds={seconds}
          percent={percent}
          isError={isError}
          themeColor={themeColor}
        />
      )}
    </View>
  );
}

export default AddRecord;
