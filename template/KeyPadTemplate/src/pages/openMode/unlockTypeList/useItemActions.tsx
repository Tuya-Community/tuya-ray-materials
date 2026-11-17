import React, { useCallback, useState } from 'react';
import { View, showModal, showToast, showLoading, hideLoading, router } from '@ray-js/ray';
import { ActionSheet, Dialog, Field } from '@ray-js/smart-ui';
import {
  renameFitTempPwd,
  renameFitOfflineTempPwd,
  removeFitTempPwd,
  resendFitTempPwd,
  renameFitBleKey,
  removeFitBleKey,
  fitUpdateUnlockMethod,
  fitDeleteUnlockMethod,
} from '@ray-js/lock-sdk';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { reConnectBle } from '@/utils/reConnectBle';
import { formatTime } from '../pswUtils';
import { placeholder } from './shared';
import styles from './index.module.less';

/**
 * 开锁方式列表项操作菜单（对齐 RN(0000007ew6) openMode/{password,key,others}/index.js 的
 * showMenu / menuSelect / reName / deletePsw / reSendMsg）。
 *
 * 三个列表共用：点击项 → ActionSheet 菜单 → 重命名（Dialog 输入框）/ 删除（二次确认 + SDK）
 * / 重发短信（confirm + SDK）。SDK 已封装 DP 下发，业务只按 item id 调用。
 *
 * edit 已接线：
 * - 在线密码 opModeType 1 → addOnlinePsw 编辑模式（updateFitTempPwd）；
 *   opModeType 2 → addPermanentPsw 编辑模式（fitUpdateUnlockMethod）。
 * - 临时蓝牙钥匙 → temporaryKey 编辑模式（updateFitTemporaryBleKey：ble_key_modify DP + 云端）；
 *   永久蓝牙钥匙（opModeSubType 10）无 edit 菜单。
 *
 * 源工程尚未实现的操作：
 * - rePut（在线密码补发 → put DP 流程未实现）
 *
 * 离线密码删除（对齐 RN gerClearCode）：不能远程删，确认后跳 addOfflinePsw?pwdType=8 生成清空码。
 */

export type ItemKind = 'password' | 'bleKey' | 'method';

/** 对齐 RN utils OPERATE_MAP（在线密码未完成状态） */
const OPERATE_MAP = { modifyNew: 126, createNew: 124, delNew: 125 };

/** 对齐 RN getMenuList：密码项按 opModeType/opModeSubType/mobile/operate 组合菜单 */
function getPwdMenu(item: any): string[] {
  const { opModeType, opModeSubType, mobile, hasClearPwd, operate } = item;
  let menuList: string[] = [];
  switch (opModeType) {
    case 2: // 永久在线密码
      menuList = ['edit', 'delete'];
      break;
    case 1: // 时效临时在线密码
      menuList = opModeSubType === 0 ? ['edit', 'delete', 'reName'] : ['delete', 'reName'];
      if (mobile !== '' && mobile != null) {
        menuList.push('reSendMsg');
      }
      if ([OPERATE_MAP.createNew, OPERATE_MAP.modifyNew].includes(operate)) {
        menuList = ['rePut', 'delete'];
      }
      if (operate === OPERATE_MAP.delNew) {
        menuList = ['rePut'];
      }
      break;
    case 3: // 离线临时密码
      menuList = opModeSubType === 0 && !hasClearPwd ? ['delete', 'reName'] : ['reName'];
      break;
    default:
      break;
  }
  return menuList;
}

/** 按列表类型计算菜单项（对齐各 RN 列表 showMenu） */
function computeMenu(kind: ItemKind, item: any): string[] {
  if (kind === 'password') return getPwdMenu(item);
  if (kind === 'bleKey') {
    // 永久钥匙(10) 无 edit（对齐 RN key/index.js showMenu）
    return item.opModeSubType === 10 ? ['delete', 'reName'] : ['edit', 'reName', 'delete'];
  }
  // 指纹/卡/人脸/掌静脉（对齐 RN others/index.js showMenu）
  return ['delete', 'reName'];
}

/** 取列表项当前名称（在线密码 name / 离线密码 pwdName / 开锁方式 unlockName / 钥匙 name） */
const itemName = (item: any): string => item?.name || item?.pwdName || item?.unlockName || '';

export function useItemActions(config: {
  kind: ItemKind;
  /** 开锁方式类型名（删除确认标题用，对齐 RN this.opModeName），仅 method 需要 */
  opModeName?: string;
  /** 操作成功后回调（刷新列表） */
  onChanged: () => void;
}) {
  const { kind, opModeName, onChanged } = config;
  // 配件在线态（对齐 RN deviceOnline：删除需设备在线，否则先蓝牙重连）
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);

  const [sheetItem, setSheetItem] = useState<any>(null);
  const [renameItem, setRenameItem] = useState<any>(null);
  const [renameValue, setRenameValue] = useState('');

  const openMenu = useCallback((item: any) => setSheetItem(item), []);

  /** 执行删除：loading → SDK → 成功 Toast + 刷新；失败弹窗（errTitle） */
  const runDelete = useCallback(
    async (fn: () => Promise<unknown>, errTitle: string) => {
      showLoading({ title: '' });
      try {
        await fn();
        hideLoading();
        showToast({ title: Strings.getLang('deleteSuccess'), icon: 'success' });
        onChanged();
      } catch (e) {
        hideLoading();
        console.warn('=== delete error', e);
        showModal({
          title: errTitle,
          showCancel: false,
          confirmText: Strings.getLang('confirm'),
        });
      }
    },
    [onChanged]
  );

  /** 删除（对齐 RN deletePsw）：按 kind 分派；在线类需设备在线，否则先蓝牙重连 */
  const handleDelete = useCallback(
    (item: any) => {
      if (kind === 'password' && item.opModeType === 3) {
        // 离线密码删除（对齐 RN gerClearCode）：不能远程删，需生成清空码由用户在门锁输入。
        // 确认后跳「清空码」页，由其调 revokeFitOfflineTempPwd({ pwdId }) 生成并展示。
        if (item.opModeSubType === 0) {
          showModal({
            title: Strings.getLang('deletePsw'),
            content: Strings.getLang('deletePswTip'),
            confirmText: Strings.getLang('getClearCode'),
            cancelText: Strings.getLang('cancel'),
            success: res => {
              if (!res.confirm) return;
              // 跳「清空单个」清空码页（addOfflinePsw pwdType=8），由其 revokeFitOfflineTempPwd({pwdId}) 生成清空码。
              // isPswToClear=1：从列表删除直接进入，完成后回退 1 层回 openMode（对齐 RN gerClearCode isPswToClear → pop()）。
              const pwdTime = `${formatTime(item.gmtStart)} ~ ${formatTime(item.gmtExpired)}`;
              const query = [
                'pwdType=8',
                'isPswToClear=1',
                `pwdId=${encodeURIComponent(String(item.pwdId))}`,
                `pwdName=${encodeURIComponent(item.pwdName || '')}`,
                `pwdTime=${encodeURIComponent(pwdTime)}`,
              ].join('&');
              router.push(`/addOfflinePsw?${query}`);
            },
          });
        }
        return;
      }
      // 在线密码 / 钥匙 / 开锁方式：删除走 DP 下发，需设备在线（对齐 RN !deviceOnline → reConnectBle）
      if (!deviceOnline) {
        reConnectBle().catch(() => {
          /* 忽略蓝牙重连失败（对齐 RN 静默重连） */
        });
        return;
      }
      if (kind === 'password') {
        showModal({
          title: '',
          content: Strings.getLang('confirmDeletePswTip'),
          confirmText: Strings.getLang('confirm'),
          cancelText: Strings.getLang('cancel'),
          success: res => {
            if (res.confirm) {
              runDelete(
                // 永久密码属于普通开锁方式，必须走 unlock_method_delete；
                // 只有时效临时在线密码才走 temporary_password_delete。
                () =>
                  item.opModeType === 2
                    ? fitDeleteUnlockMethod(Number(item.id))
                    : removeFitTempPwd({ id: Number(item.id) }),
                Strings.getLang('deleteError')
              );
            }
          },
        });
      } else if (kind === 'bleKey') {
        showModal({
          title: '',
          content: Strings.getLang('deleteBleKey'),
          confirmText: Strings.getLang('confirm'),
          cancelText: Strings.getLang('cancel'),
          success: res => {
            if (res.confirm) {
              runDelete(
                () => removeFitBleKey({ id: String(item.unlockBindingId) }),
                Strings.getLang('deleteError')
              );
            }
          },
        });
      } else {
        const errTitle = Strings.formatValue('deleteOpModeError', opModeName || '');
        showModal({
          title: '',
          content: Strings.formatValue('confirmDeleteOpModeTip', opModeName || ''),
          confirmText: Strings.getLang('confirm'),
          cancelText: Strings.getLang('cancel'),
          success: res => {
            if (res.confirm) {
              runDelete(
                () => fitDeleteUnlockMethod(Number(item.id), item.devices?.[0]?.devId),
                errTitle
              );
            }
          },
        });
      }
    },
    [kind, deviceOnline, opModeName, runDelete]
  );

  /**
   * 编辑在线密码（对齐 RN password/index.js editPsw）：需设备在线，否则先蓝牙重连。
   * - opModeType 1（时效临时）→ addOnlinePsw 编辑模式（改名 + 生效期 + 重复），updateFitTempPwd；
   * - opModeType 2（永久）→ addPermanentPsw 编辑模式（改名 + 劫持），fitUpdateUnlockMethod。
   * 复杂字段经单个 editData query 传 JSON（对齐 addOfflinePsw 的 query 传参约定）。
   */
  const handleEdit = useCallback(
    (item: any) => {
      if (!deviceOnline) {
        reConnectBle().catch(() => {
          /* 忽略蓝牙重连失败（对齐 RN 静默重连） */
        });
        return;
      }
      if (item.opModeType === 1) {
        const editData = {
          id: item.id,
          name: item.name || '',
          effectiveTime: item.effectiveTime, // 秒
          invalidTime: item.invalidTime, // 秒
          schedule: item.scheduleDetails?.[0] || null,
        };
        router.push(
          `/addOnlinePsw?isEdit=1&isUnlimited=true&editData=${encodeURIComponent(
            JSON.stringify(editData)
          )}`
        );
      } else {
        const editData = { id: item.id, name: item.name || '', hijack: !!item.hijack };
        router.push(
          `/addPermanentPsw?isEdit=1&editData=${encodeURIComponent(JSON.stringify(editData))}`
        );
      }
    },
    [deviceOnline]
  );

  /**
   * 编辑临时蓝牙钥匙（对齐 RN key/index.js editPsw → addTempKey isEdit）：需设备在线，
   * 否则先蓝牙重连。跳 temporaryKey 编辑模式（改名 + 生效期 + 重复 → updateFitTemporaryBleKey）。
   * 复杂字段经单个 editData query 传 JSON（对齐 addOfflinePsw / addOnlinePsw 约定）。
   * 永久钥匙（opModeSubType 10）无 edit 菜单，不会到此。
   */
  const handleEditBleKey = useCallback(
    (item: any) => {
      if (!deviceOnline) {
        reConnectBle().catch(() => {
          /* 忽略蓝牙重连失败（对齐 RN 静默重连） */
        });
        return;
      }
      const editData = {
        id: String(item.unlockBindingId),
        name: item.name || '',
        // FitBleKeyItem.effectiveConfig 已是 EffectiveConfig 结构，直接透传给编辑页预填
        effective: item.effectiveConfig || null,
      };
      router.push(
        `/temporaryKey?isEdit=1&editData=${encodeURIComponent(JSON.stringify(editData))}`
      );
    },
    [deviceOnline]
  );

  /** 重发短信（对齐 RN reSendMsg）：confirm → resendFitTempPwd */
  const handleResend = useCallback((item: any) => {
    showModal({
      title: '',
      content: Strings.getLang('confirmReMessageTip'),
      confirmText: Strings.getLang('confirm'),
      cancelText: Strings.getLang('cancel'),
      success: res => {
        if (!res.confirm) return;
        showLoading({ title: '' });
        resendFitTempPwd({ id: Number(item.id) })
          .then(() => {
            hideLoading();
            showToast({ title: Strings.getLang('reSendMsgSuccess'), icon: 'success' });
          })
          .catch(e => {
            hideLoading();
            console.warn('=== resend error', e);
            showToast({ title: Strings.getLang('deleteError'), icon: 'none' });
          });
      },
    });
  }, []);

  /** 菜单项选择分派（对齐 RN menuSelect） */
  const onSelect = useCallback(
    (value: string, item: any) => {
      switch (value) {
        case 'reName':
          setRenameValue(itemName(item));
          setRenameItem(item);
          break;
        case 'delete':
          handleDelete(item);
          break;
        case 'reSendMsg':
          handleResend(item);
          break;
        case 'edit':
          // 在线密码 / 临时蓝牙钥匙编辑均已迁移
          if (kind === 'password') handleEdit(item);
          else if (kind === 'bleKey') handleEditBleKey(item);
          else placeholder(value);
          break;
        case 'rePut':
        default:
          placeholder(value); // 源工程尚未实现在线密码补发。
          break;
      }
    },
    [kind, handleDelete, handleResend, handleEdit, handleEditBleKey]
  );

  /** 重命名确认（对齐 RN reName onConfirm：空/超长校验 → 按 kind 调云端改名） */
  const onRenameConfirm = useCallback(() => {
    const item = renameItem;
    const text = renameValue;
    setRenameItem(null);
    if (!item) return;
    if (text === '') {
      showToast({ title: Strings.getLang('nameCanNotNull'), icon: 'none' });
      return;
    }
    if (text.length > 20) {
      showToast({ title: Strings.getLang('nameToLong'), icon: 'none' });
      return;
    }
    let task: Promise<unknown>;
    if (kind === 'password' && item.opModeType === 3) {
      // 离线密码改名：offlinepwd.name.update v1.0 按 pwdId 定位（对齐 RN；离线列表不下发 unlockBindingId）
      task = renameFitOfflineTempPwd({ pwdId: Number(item.pwdId), name: text });
    } else if (kind === 'password') {
      task = renameFitTempPwd({ id: Number(item.id), name: text });
    } else if (kind === 'bleKey') {
      task = renameFitBleKey({ id: String(item.unlockBindingId), name: text });
    } else {
      task = fitUpdateUnlockMethod({ id: Number(item.id), name: text });
    }
    task
      .then(() => onChanged())
      .catch(e => {
        console.warn('=== rename error', e);
        showToast({ title: Strings.getLang('reNameFailed'), icon: 'none' });
      });
  }, [renameItem, renameValue, kind, onChanged]);

  const actions = sheetItem
    ? computeMenu(kind, sheetItem).map(v => ({ name: Strings.getLang(v as any), value: v }))
    : [];

  const node = (
    <>
      <ActionSheet
        show={!!sheetItem}
        actions={actions}
        safeAreaInsetBottom={false}
        cancelText={Strings.getLang('cancel')}
        onClose={() => setSheetItem(null)}
        onCancel={() => setSheetItem(null)}
        onSelect={(e: any) => {
          const item = sheetItem;
          setSheetItem(null);
          const value = e?.detail?.value as string | undefined;
          if (value && item) onSelect(value, item);
        }}
      />
      <Dialog
        show={!!renameItem}
        title={Strings.getLang('reName')}
        showConfirmButton
        showCancelButton
        useSlot
        confirmButtonText={Strings.getLang('confirm')}
        cancelButtonText={Strings.getLang('cancel')}
        onConfirm={onRenameConfirm}
        onCancel={() => setRenameItem(null)}
        onClose={() => setRenameItem(null)}
      >
        <View className={styles.renameField}>
          <Field
            value={renameValue}
            maxlength={20}
            focus
            clearable
            border={false}
            inputAlign="center"
            placeholder={Strings.getLang('reName')}
            onChange={(e: { detail: string }) => setRenameValue(e.detail)}
          />
        </View>
      </Dialog>
    </>
  );

  return { openMenu, node };
}
