import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Input,
  ScrollView,
  router,
  navigateBack,
  showToast,
  useQuery,
} from '@ray-js/ray';
import { NavBar, Switch, Popup, DatetimePicker } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import dayjs from 'dayjs';
import { createFitTemporaryBleKey, updateFitTemporaryBleKey } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import { templateConfig } from '@/config';
import { reConnectBle } from '@/utils/reConnectBle';
import styles from './index.module.less';

/**
 * 添加 / 编辑临时蓝牙钥匙时效配置页。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/key/addTempKey.js：
 * - 命名（≤20）+ 生效/失效时间（datetime，失效须晚于生效）+ 可选「重复」
 *   （选每周星期 + 每日生效/失效时段，对齐 RN EffectiveInvalidTime + RepeatTime）；
 * - 新增：「保存」调 SDK `createFitTemporaryBleKey({ name, effective })`
 *   （下发 ble_key_create DP → 解析硬件序号 → 云端 key.virtual.add 落库，失败自动回滚），
 *   成功后回退 3 层到 openMode（RN redux popN）。
 * - 编辑（query isEdit=1，对齐 RN key/index.js editPsw → addTempKey isEdit）：预填名称/生效期/重复，
 *   「保存」调 `updateFitTemporaryBleKey({ id, name, effective })`（下发 ble_key_modify DP + 云端 update），
 *   成功后回退 1 层（RN pop()）。
 *
 * 新增入口：openMode → chooseOpenModeType(key) → chooseUserList(选成员) → 本页。
 * 编辑入口：openMode 钥匙列表项菜单「编辑」→ 本页（query 带 isEdit=1 + editData）。
 * 说明：临时钥匙云端落库不绑定成员（对齐 RN saveBleKey 临时分支无 userId），成员仅为流程对齐透传。
 * 时效编码（validConfig）与在线临时密码同源（SDK transformEffectiveConfigToValidConfig），
 * 故本页时间/重复交互与 addOnlinePsw 一致。
 */

const MAX_NAME_LEN = 20;
/** 新增回退层数：openMode→chooseOpenModeType→chooseUserList→本页（对齐 RN popN） */
const ADD_BACK_DELTA = 3;
/** 编辑回退层数：openMode→本页（对齐 RN uploadTempKeyAsync pop()） */
const EDIT_BACK_DELTA = 1;
/** 每日时段默认（对齐 RN scheduleItem effectiveTime:480=08:00 / invalidTime:540=09:00） */
const DEFAULT_DAILY_START = 480;
const DEFAULT_DAILY_END = 540;

const toSec = (ms: number) => Math.floor(ms / 1000);
const fmtDateTime = (ms: number) => dayjs(ms).format('YYYY-MM-DD HH:mm');
/** 分钟数 → HH:mm */
const minToHHmm = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(h)}:${pad(m)}`;
};
/** HH:mm → 分钟数 */
const hhmmToMin = (v: string) => {
  const [h, m] = v.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** 周标签（对齐 RN WeekView day0~day6 = 周日~周六，与 workingDay bit0~bit6 对应） */
const WEEK_KEYS = ['day0', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6'] as const;

type PickerTarget = 'effective' | 'invalid' | 'dailyStart' | 'dailyEnd' | null;

interface BleKeyEditData {
  id: string;
  name: string;
  effective: {
    effectiveDate: number; // 秒
    expiredDate: number; // 秒
    repeat?: 'none' | 'week';
    weeks?: number[];
    effectiveTime?: number; // 每日起（分）
    expiredTime?: number; // 每日止（分）
  } | null;
}

export function TemporaryKey() {
  const query = useQuery() as { userId?: string; isEdit?: string; editData?: string };
  const isEdit = query.isEdit === '1';
  // 编辑态入参（对齐 RN editPsw 透传的 keyData，miniapp 经 editData query 传 JSON）
  const edit = useMemo<BleKeyEditData | null>(() => {
    if (!isEdit || !query.editData) return null;
    try {
      return JSON.parse(decodeURIComponent(query.editData));
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, query.editData]);
  const editEff = edit?.effective || null;

  const { themeColor } = templateConfig;
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);

  const now = Date.now();
  const yearLater = useMemo(() => dayjs(now).add(10, 'year').valueOf(), [now]);

  const [name, setName] = useState(edit?.name || '');
  const [loading, setLoading] = useState(false);
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  // 生效：新增默认当前，编辑取原值；失效：新增需选（null），编辑取原值
  const [effectiveMs, setEffectiveMs] = useState<number>(
    editEff ? editEff.effectiveDate * 1000 : now
  );
  const [invalidMs, setInvalidMs] = useState<number | null>(
    editEff ? editEff.expiredDate * 1000 : null
  );

  // 重复相关：allDay = !repeat（对齐 RN schedule[0].allDay）
  const [repeat, setRepeat] = useState(editEff?.repeat === 'week');
  const [dailyStart, setDailyStart] = useState(
    editEff?.repeat === 'week' ? editEff.effectiveTime ?? DEFAULT_DAILY_START : DEFAULT_DAILY_START
  );
  const [dailyEnd, setDailyEnd] = useState(
    editEff?.repeat === 'week' ? editEff.expiredTime ?? DEFAULT_DAILY_END : DEFAULT_DAILY_END
  );
  // 周重复位图：索引 0~6 = 周日~周六（对齐 RN workingDay bit0~bit6，默认全选）
  const [weeks, setWeeks] = useState<number[]>(
    editEff?.repeat === 'week' && editEff.weeks?.length === 7
      ? editEff.weeks
      : [1, 1, 1, 1, 1, 1, 1]
  );

  const [picker, setPicker] = useState<PickerTarget>(null);

  const toast = (title: string) => showToast({ title, icon: 'none' });

  const errText = (err: any) => {
    const e = typeof err === 'string' ? { message: err } : err || {};
    return e?.errorMsg || e?.message || Strings.getLang('addError');
  };

  const onNameInput = (value: string) => {
    if (value.length > MAX_NAME_LEN) {
      toast(Strings.getLang('nameToLong'));
      return;
    }
    setName(value);
  };

  const toggleWeek = (idx: number) => {
    setWeeks(prev => prev.map((v, i) => (i === idx ? (v ? 0 : 1) : v)));
  };

  const openPicker = (target: Exclude<PickerTarget, null>) => setPicker(target);

  const onPickerConfirm = (e: { detail: number | string }) => {
    if (picker === 'effective') {
      setEffectiveMs(e.detail as number);
    } else if (picker === 'invalid') {
      setInvalidMs(e.detail as number);
    } else if (picker === 'dailyStart') {
      setDailyStart(hhmmToMin(e.detail as string));
    } else if (picker === 'dailyEnd') {
      setDailyEnd(hhmmToMin(e.detail as string));
    }
    setPicker(null);
  };

  // 保存（对齐 RN putAddDp → paramsTest 校验 → createKey DP → saveBleKey）
  const onSave = async () => {
    if (loading) return;
    if (!deviceOnline) {
      await reConnectBle({ onTick: sec => setReconnectSeconds(sec) })
        .catch(error => {
          console.log('Operation failed', error);
        })
        .finally(() => setReconnectSeconds(0));
      return;
    }
    if (name.length > MAX_NAME_LEN) {
      toast(Strings.getLang('nameToLong'));
      return;
    }
    if (invalidMs === null) {
      toast(Strings.getLang('invalidTimeCanNotNull'));
      return;
    }
    if (effectiveMs >= invalidMs) {
      toast(Strings.getLang('timeChooseError'));
      return;
    }
    if (repeat) {
      if (dailyStart >= dailyEnd) {
        toast(Strings.getLang('timeChooseError1'));
        return;
      }
      if (weeks.every(v => v === 0)) {
        toast(Strings.getLang('weekNotNull'));
        return;
      }
    }

    const effective = {
      effectiveDate: toSec(effectiveMs),
      expiredDate: toSec(invalidMs),
      repeat: (repeat ? 'week' : 'none') as 'week' | 'none',
      ...(repeat ? { weeks: weeks as any, effectiveTime: dailyStart, expiredTime: dailyEnd } : {}),
    };

    setLoading(true);
    try {
      if (isEdit && edit) {
        await updateFitTemporaryBleKey({
          id: edit.id,
          name: name.trim(),
          effective,
        });
        showToast({ title: Strings.getLang('saveSuccess'), icon: 'success' });
        navigateBack({ delta: EDIT_BACK_DELTA });
      } else {
        await createFitTemporaryBleKey({
          name: name.trim() || undefined,
          effective,
        });
        showToast({ title: Strings.getLang('saveSuccess'), icon: 'success' });
        navigateBack({ delta: ADD_BACK_DELTA });
      }
    } catch (err) {
      console.warn('=== save temporary ble key error', err);
      toast(errText(err));
    } finally {
      setLoading(false);
    }
  };

  const renderTimeRow = (
    label: string,
    target: Exclude<PickerTarget, null>,
    display: string | null
  ) => (
    <View className={styles.row} onClick={() => openPicker(target)}>
      <Text className={styles.itemLabel}>{label}</Text>
      <View className={styles.valueWrap}>
        <Text className={display !== null ? styles.value : styles.placeholder}>
          {display !== null ? display : Strings.getLang('pleaseChoose')}
        </Text>
        <View className={styles.arrow} />
      </View>
    </View>
  );

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang(isEdit ? 'edit' : 'temporaryKey')}
        leftArrow
        onClickLeft={() => router.back()}
      />

      <ScrollView className={styles.scroll} scrollY>
        {/* 命名 */}
        <View className={styles.nameItem}>
          <Text className={styles.itemLabel}>{Strings.getLang('keyName')}</Text>
          <Input
            className={styles.nameInput}
            value={name}
            maxLength={MAX_NAME_LEN}
            placeholder={Strings.getLang('inputName')}
            placeholderStyle="color: rgba(51,51,51,0.2)"
            onInput={(e: { detail: { value: string } }) => onNameInput(e.detail.value)}
          />
        </View>

        {/* 生效 / 失效时间 */}
        <View className={styles.group}>
          {renderTimeRow(Strings.getLang('effectiveTime'), 'effective', fmtDateTime(effectiveMs))}
          {renderTimeRow(
            Strings.getLang('invalidTime'),
            'invalid',
            invalidMs !== null ? fmtDateTime(invalidMs) : null
          )}
        </View>

        {/* 重复 */}
        <View className={styles.group}>
          <View className={styles.row}>
            <Text className={styles.itemLabel}>{Strings.getLang('repeat')}</Text>
            <Switch
              checked={repeat}
              activeColor={themeColor}
              onChange={(e: { detail: boolean }) => setRepeat(e.detail)}
            />
          </View>
          {repeat && (
            <View>
              {renderTimeRow(Strings.getLang('_startTime'), 'dailyStart', minToHHmm(dailyStart))}
              {renderTimeRow(Strings.getLang('_endTime'), 'dailyEnd', minToHHmm(dailyEnd))}
              <View className={styles.weekRow}>
                {WEEK_KEYS.map((k, idx) => {
                  const active = weeks[idx] === 1;
                  return (
                    <View
                      key={k}
                      className={`${styles.weekDay} ${active ? styles.weekDayActive : ''}`}
                      style={
                        active
                          ? { backgroundColor: themeColor, borderColor: themeColor }
                          : undefined
                      }
                      onClick={() => toggleWeek(idx)}
                    >
                      <Text className={`${styles.weekText} ${active ? styles.weekTextActive : ''}`}>
                        {Strings.getLang(k)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomWrap}>
        <View
          className={styles.btn}
          style={{ backgroundColor: themeColor, opacity: loading ? 0.5 : 1 }}
          onClick={onSave}
        >
          <Text className={styles.btnText}>{Strings.getLang('save')}</Text>
        </View>
      </View>

      {/* 日期时间选择器（生效/失效：datetime；每日时段：time） */}
      <Popup show={picker !== null} position="bottom" round onClose={() => setPicker(null)}>
        {(picker === 'effective' || picker === 'invalid') && (
          <DatetimePicker
            type="datetime"
            value={
              picker === 'effective'
                ? effectiveMs
                : invalidMs ?? dayjs(effectiveMs).add(1, 'hour').valueOf()
            }
            minDate={picker === 'invalid' ? effectiveMs : now}
            maxDate={yearLater}
            title={Strings.getLang(picker === 'invalid' ? 'invalidTime' : 'effectiveTime')}
            confirmButtonText={Strings.getLang('confirm')}
            cancelButtonText={Strings.getLang('cancel')}
            onConfirm={onPickerConfirm}
            onCancel={() => setPicker(null)}
          />
        )}
        {(picker === 'dailyStart' || picker === 'dailyEnd') && (
          <DatetimePicker
            type="time"
            value={minToHHmm(picker === 'dailyStart' ? dailyStart : dailyEnd)}
            title={Strings.getLang(picker === 'dailyEnd' ? '_endTime' : '_startTime')}
            confirmButtonText={Strings.getLang('confirm')}
            cancelButtonText={Strings.getLang('cancel')}
            onConfirm={onPickerConfirm}
            onCancel={() => setPicker(null)}
          />
        )}
      </Popup>

      {reconnectSeconds > 0 && (
        <View className={styles.reconnectMask}>
          <View className={styles.reconnectBox}>
            <Text className={styles.reconnectText}>
              {Strings.formatValue('connectBle', String(reconnectSeconds))}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default TemporaryKey;
