import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Input,
  router,
  navigateBack,
  showToast,
  setClipboardData,
  useQuery,
} from '@ray-js/ray';
import { NavBar, Switch } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import { fitAddPassword, fitUpdateUnlockMethod } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import { templateConfig } from '@/config';
import { reConnectBle } from '@/utils/reConnectBle';
import styles from './index.module.less';

/**
 * 添加 / 编辑永久密码页（在线密码）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/password/{addPermanentPsw,editPermanentPsw}.js：
 * - 新增（默认）：输入 / 随机生成数字密码（RN 用 RandomPassword + CustomKeyboard，miniapp 用数字 Input +
 *   「随机」按钮；密码长度在本地配置，使用十进制数字。
 *   「保存」调 `fitAddPassword`（SDK 先下发 dp1 → 等 0xff/0xfd → 云端 addFitOpenMode），回退 4 层到 openMode（RN popN(4)）；
 * - 编辑（query isEdit=1，对齐 RN editPermanentPsw）：仅改名 + 劫持（无密码框），「保存」调纯云端
 *   `fitUpdateUnlockMethod({id,name,hijack})`（opmode.update），回退 1 层（RN pop()）。
 *
 * 新增入口：openMode → chooseOpenModeType(password) → chooseLockList(选门锁) → chooseUserList(选成员) → 本页
 * （query 带 lockDevId + userId）。编辑入口：openMode 密码列表项菜单「编辑」→ 本页（query 带 isEdit=1 + editData）。
 */

const MAX_NAME_LEN = 20;
/** 新增回退层数：openMode→chooseOpenModeType→chooseLockList→chooseUserList→本页（对齐 RN popN(4)） */
const ADD_BACK_DELTA = 4;
/** 编辑回退层数：openMode→本页（对齐 RN editPermanentPsw pop()） */
const EDIT_BACK_DELTA = 1;
/** 劫持 DP code（设备支持时才展示劫持开关，对齐 RN Config.uiConfig.dpHijack；与告警 hijack DP 同源） */
const DP_HIJACK = 'hijack';

interface EditData {
  id: number;
  name: string;
  hijack: boolean;
}

export function AddPermanentPsw() {
  const query = useQuery() as {
    lockDevId?: string;
    userId?: string;
    isEdit?: string;
    editData?: string;
  };
  const { lockDevId = '', userId = '' } = query;
  const isEdit = query.isEdit === '1';
  // 编辑态入参（对齐 RN editPsw 透传的 pswData，miniapp 经 editData query 传 JSON）
  const edit = useMemo<EditData | null>(() => {
    if (!isEdit || !query.editData) return null;
    try {
      return JSON.parse(decodeURIComponent(query.editData));
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, query.editData]);

  const { themeColor } = templateConfig;
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);
  const schema = useDevice(d => d.devInfo?.schema);

  const { minLength: minPswLen, maxLength: maxPswLen } = templateConfig.password;
  const minDigit = 0;
  const maxDigit = 9;
  const pwdTitle =
    minPswLen === maxPswLen
      ? Strings.formatValue('pwdLenTitle', minPswLen)
      : Strings.formatValue('pwdRangeTitle', minPswLen, maxPswLen);
  // 设备是否支持劫持（对齐 RN dpHijack）：schema 含 hijack DP 才展示开关
  const hasHijack = useMemo(
    () => new Set<string>((schema || []).map((s: any) => s.code)).has(DP_HIJACK),
    [schema]
  );

  const [password, setPassword] = useState('');
  const [name, setName] = useState(edit?.name || '');
  const [hijack, setHijack] = useState(!!edit?.hijack);
  const [loading, setLoading] = useState(false);
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  const toast = (title: string) => showToast({ title, icon: 'none' });

  const errText = (err: any) => {
    const e =
      typeof err === 'string'
        ? (() => {
            try {
              return JSON.parse(err);
            } catch {
              return { message: err };
            }
          })()
        : err;
    return e?.errorMsg || e?.errorCode || e?.message || Strings.getLang('addError');
  };

  // 密码输入：仅保留 0-9 数字，长度由本地配置限制。
  const onPswInput = (value: string) => {
    const digits = value
      .replace(new RegExp(`[^${minDigit}-${maxDigit}]`, 'g'), '')
      .slice(0, maxPswLen);
    setPassword(digits);
  };

  // 随机生成密码（对齐 RN getRandomPassword：默认长度=最短位数，逐位取可用数字集内随机值）
  const genRandom = () => {
    let result = '';
    for (let i = 0; i < minPswLen; i++) {
      result += (minDigit + Math.floor(Math.random() * (maxDigit - minDigit + 1))).toString();
    }
    setPassword(result);
  };

  const copy = () => {
    setClipboardData({ data: password });
    toast(Strings.getLang('pswCopied'));
  };

  const onNameInput = (value: string) => {
    if (value.length > MAX_NAME_LEN) {
      toast(Strings.getLang('nameToLong'));
      return;
    }
    setName(value);
  };

  // 保存（对齐 RN savePsw：校验 → 下发 → 云端）
  const onSave = async () => {
    if (loading) return;
    // 设备离线先重连（对齐 RN !deviceOnline → reConnectBle）；连接失败已由 reConnectBle 内部 Toast 提示
    if (!deviceOnline) {
      await reConnectBle({ onTick: sec => setReconnectSeconds(sec) })
        .catch(error => {
          console.log('Operation failed', error);
        })
        .finally(() => setReconnectSeconds(0));
      return;
    }

    // 编辑态：仅改名 + 劫持，纯云端更新（对齐 RN editPermanentPsw.save → updatePermanentAsync）
    if (isEdit) {
      if (name.trim() === '') {
        toast(Strings.getLang('nameCanNotNull'));
        return;
      }
      setLoading(true);
      try {
        await fitUpdateUnlockMethod({ id: Number(edit?.id), name: name.trim(), hijack });
        navigateBack({ delta: EDIT_BACK_DELTA });
      } catch (err) {
        toast(errText(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password === '') {
      toast(Strings.getLang('passwordNotNull'));
      return;
    }
    if (password.length < minPswLen) {
      toast(Strings.getLang('pswNotMatch'));
      return;
    }
    setLoading(true);
    try {
      await fitAddPassword({
        lockDevId,
        userId,
        name: name.trim(),
        password,
        hijack: hasHijack ? hijack : false,
      });
      navigateBack({ delta: ADD_BACK_DELTA });
    } catch (err) {
      toast(errText(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={styles.page}>
      <NavBar border={false} title=" " leftArrow onClickLeft={() => router.back()} />

      <View className={styles.topWrap}>
        <Text className={styles.topTitle}>
          {Strings.getLang(isEdit ? 'edit' : 'addPermanentPsw')}
        </Text>
        {!isEdit && (
          <Text className={styles.topSubTitle}>{Strings.getLang('addPermanentPswSubTitle')}</Text>
        )}
      </View>

      {/* 密码输入 + 随机（对齐 RN renderPsw / RandomPassword）；编辑态不改密码，隐藏 */}
      {!isEdit && (
        <View className={styles.pswWrap}>
          <Text className={styles.pwdTextTitle}>{pwdTitle}</Text>
          <View className={styles.pswBox}>
            <Input
              className={styles.pswInput}
              type="number"
              value={password}
              maxLength={maxPswLen}
              placeholder=""
              onInput={(e: { detail: { value: string } }) => onPswInput(e.detail.value)}
            />
            <Text className={styles.randomBtn} style={{ color: themeColor }} onClick={genRandom}>
              {Strings.getLang('random')}
            </Text>
          </View>
          {password !== '' && (
            <Text className={styles.copyText} style={{ color: themeColor }} onClick={copy}>
              {Strings.getLang('copy')}
            </Text>
          )}
        </View>
      )}

      {/* 命名 */}
      <View className={styles.nameItem}>
        <Text className={styles.itemLabel}>{Strings.getLang('pswName')}</Text>
        <Input
          className={styles.nameInput}
          value={name}
          maxLength={MAX_NAME_LEN}
          placeholder={Strings.getLang('inputName')}
          placeholderStyle="color: rgba(51,51,51,0.2)"
          onInput={(e: { detail: { value: string } }) => onNameInput(e.detail.value)}
        />
      </View>

      {/* 劫持开关（对齐 RN renderHijack，dpHijack 时展示） */}
      {hasHijack && (
        <View className={styles.hijackItem}>
          <View className={styles.hijackTextWrap}>
            <Text className={styles.itemLabel}>
              {Strings.formatValue('hijackTitle', Strings.getLang('pswName'))}
            </Text>
            <Text className={styles.hijackSubTitle}>
              {Strings.formatValue('hijackSubTitle', Strings.getLang('pswName'))}
            </Text>
          </View>
          <Switch
            checked={hijack}
            activeColor={themeColor}
            onChange={(e: { detail: boolean }) => setHijack(e.detail)}
          />
        </View>
      )}

      <View className={styles.bottomWrap}>
        <View
          className={styles.btn}
          style={{ backgroundColor: themeColor, opacity: loading ? 0.5 : 1 }}
          onClick={onSave}
        >
          <Text className={styles.btnText}>{Strings.getLang('save')}</Text>
        </View>
      </View>

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

export default AddPermanentPsw;
