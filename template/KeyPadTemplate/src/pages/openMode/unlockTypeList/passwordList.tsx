import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, usePageEvent } from '@ray-js/ray';
import {
  getFitOnlinePasswordList,
  getFitOfflinePasswordList,
  type FitOnlinePasswordItem,
  type FitOfflinePasswordItem,
} from '@ray-js/lock-sdk';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { syncOpenModeKitByTypes } from '@/utils/syncOpenMode';
import { templateConfig } from '@/config';
import { getPswIcon, getRepeatStrByNumber, parseTimer, formatTime } from '../pswUtils';
import { cdn, DP_MESSAGE, EmptyState, FailureEntry } from './shared';
import { useItemActions } from './useItemActions';
import styles from './index.module.less';

/**
 * 密码开锁方式列表（对齐 RN(0000007ew6) openMode/password/index.js）。
 *
 * 数据源与其它开锁方式不同：在线密码走 lock-sdk 的 getFitOnlinePasswordList
 * （tuya.m.device.fittings.pwd.list），离线临时密码走 getFitOfflinePasswordList
 * （tuya.m.device.lock.offlinepwd.list.valid）；分「在线密码」「离线密码」两个可折叠分组展示。
 * 此前密码 tab 误用 getFitUnlockMethodList，导致列表恒为空 / 缺离线数据。
 *
 * 单项点击弹操作菜单（见 useItemActions）：重命名 / 删除 / 重发短信已接入 SDK；
 * 编辑和离线密码清空接入对应页面；在线密码补发沿用源工程的未实现提示。
 */

/**
 * 密码列表项（在线 / 离线联合）。
 * 数据由 lock-sdk 封装的 getFitOnlinePasswordList / getFitOfflinePasswordList 提供：
 * - 在线密码（opModeType 1 时效临时 / 2 永久）：时间字段 effectiveTime/invalidTime，名称 name；
 * - 离线临时密码（opModeType 3）：时间字段 gmtStart/gmtExpired，名称 pwdName。
 * opModeType / opModeSubType 决定图标（getPswIcon）与副信息渲染（对齐 RN renderRow）。
 */
type PwdItemData = FitOnlinePasswordItem | FitOfflinePasswordItem;
/** 渲染时按 opModeType 分支读取在线/离线各自字段，用交叉类型统一取值 */
type PwdItemFields = FitOnlinePasswordItem & FitOfflinePasswordItem;

/** 列表项 key（对齐 RN keyExtractor：pwdId > sn > index+gmtCreate） */
const pwdKey = (item: PwdItemData, index: number) =>
  item.pwdId != null
    ? `p${item.pwdId}`
    : item.sn != null
    ? `s${item.sn}-${index}-${item.gmtCreate ?? ''}`
    : `i${index}-${item.gmtCreate ?? ''}`;

/** 可折叠分组头（对齐 RN renderHeader：标题 + 数量 + 展开/收起箭头） */
function PwdSection({
  title,
  count,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <View>
      <View className={styles.pwdHeader} onClick={onToggle}>
        <View className={styles.pwdHeaderLeft}>
          <Text className={styles.pwdHeaderTitle}>{title}</Text>
          <Text className={styles.pwdHeaderCount}>{`(${count})`}</Text>
        </View>
        <Image className={styles.pwdArrow} src={cdn(expanded ? 'arrowDown.png' : 'arrowUp.png')} />
      </View>
      {expanded && children}
    </View>
  );
}

/**
 * 单个密码项（对齐 RN password/index.js renderRow）。
 * 按 opModeType 分离线（3）与在线（1 时效临时 / 2 永久）两套渲染。
 */
function PwdItem({ item, onPress }: { item: PwdItemData; onPress: () => void }) {
  const { themeColor } = templateConfig;
  /** 设备是否支持短信通知 DP（对齐 RN Boolean(Config.uiConfig.dpMessage)） */
  const schema = useDevice(d => d.devInfo?.schema);
  const hasMessageDp = React.useMemo(
    () => (schema || []).some((s: any) => s.code === DP_MESSAGE),
    [schema]
  );
  // 按 opModeType 分支渲染，用交叉类型统一读取在线/离线各自字段
  const it = item as PwdItemFields;
  const { opModeType, opModeSubType } = it;
  const icon = cdn(getPswIcon(it));
  const isOffline = opModeType === 3;

  // 生效时间段：离线取 gmtStart/gmtExpired，在线取 effectiveTime/invalidTime
  const s = formatTime(isOffline ? it.gmtStart : it.effectiveTime);
  const e = formatTime(isOffline ? it.gmtExpired : it.invalidTime);

  // 周期重复文案（对齐 RN repeatTime：取首条 schedule，非全天才展示）
  const sd = it.scheduleDetails?.[0];
  const repeatTime =
    sd && !sd.allDay
      ? `${getRepeatStrByNumber(sd.workingDay)} ${parseTimer(
          (sd.effectiveTime || 0) * 60
        )} - ${parseTimer((sd.invalidTime || 0) * 60 - (sd.invalidTime === 1440 ? 1 : 0))}`
      : '';

  const phoneText =
    !it.mobile || it.mobile === ''
      ? Strings.getLang('noPhone')
      : `${Strings.getLang('acceptPhone')}: +${it.mobile}`;

  // 未完成状态标（对齐 RN hasPwsStatusTag：operate 为 124/125/126 时展示，整卡半透明）
  const hasStatusTag = it.operate === 124 || it.operate === 125 || it.operate === 126;

  if (isOffline) {
    const revokedS = formatTime(it.revokedPwdEffectiveTime);
    const revokedE = formatTime(it.revokedPwdInvalidTime);
    return (
      <View className={styles.pwdItem} onClick={onPress}>
        <View className={styles.pwdItemTop}>
          <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
            <Image className={styles.pwdIcon} src={icon} />
          </View>
          <Text className={styles.pwdTitle}>{it.pwdName || ''}</Text>
          {!!it.mayExpired && (
            <View className={styles.overTimeTag}>
              <Text className={styles.overTimeText}>{Strings.getLang('timeoutNotUsed')}</Text>
            </View>
          )}
          {(opModeSubType === 8 || opModeSubType === 9) && (
            <View
              className={styles.clearTag}
              style={opModeSubType === 8 ? { backgroundColor: 'rgba(35,156,142,0.1)' } : undefined}
            >
              <Text
                className={styles.clearTagText}
                style={opModeSubType === 8 ? { color: '#239C8E' } : undefined}
              >
                {Strings.getLang(`clearCode_${opModeSubType}` as any)}
              </Text>
            </View>
          )}
        </View>
        {opModeSubType === 0 ? (
          <Text className={styles.pwdTime}>{`${s} ~ ${e} ${repeatTime}`}</Text>
        ) : (
          <Text className={styles.pwdTime}>
            {Strings.formatValue(
              'offLineItemSubtitle',
              e,
              Strings.getLang(`pswType${opModeSubType}` as any)
            )}
          </Text>
        )}
        {(opModeSubType === 0 || opModeSubType === 1) && (
          <View className={styles.pwdCenter}>
            <Image className={styles.subIcon} src={cdn('littleLock.png')} />
            <Text className={styles.pwdSubText}>{Strings.getLang('canOpenAllDoor')}</Text>
          </View>
        )}
        {opModeSubType === 8 && (
          <View className={styles.revokedView}>
            <Text className={styles.revokedTitle}>{Strings.getLang('lookClearTitle')}</Text>
            <View className={styles.revokedBox}>
              <Text className={styles.revokedName}>{it.revokedPwdName}</Text>
              <Text className={styles.revokedTime}>{`${revokedS} ~ ${revokedE}`}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  // 在线密码（opModeType 1 时效临时 / 2 永久）
  return (
    <View
      className={styles.pwdItem}
      style={hasStatusTag ? { opacity: 0.6 } : undefined}
      onClick={onPress}
    >
      <View className={styles.pwdItemTop}>
        <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
          <Image className={styles.pwdIcon} src={icon} />
        </View>
        <Text className={styles.pwdTitle}>{it.name || ''}</Text>
        {!!it.hijack && (
          <View className={styles.clearTag}>
            <Text className={styles.clearTagText}>{Strings.getLang('hijack')}</Text>
          </View>
        )}
      </View>
      {opModeType !== 2 && <Text className={styles.pwdTime}>{`${s} ~ ${e} ${repeatTime}`}</Text>}
      {hasMessageDp && opModeType !== 2 && <Text className={styles.pwdPhone}>{phoneText}</Text>}
      {!!it.userName && (
        <View className={styles.pwdCenter}>
          <Image className={styles.subIcon} src={cdn('littleUser.png')} />
          <Text className={styles.pwdSubText}>{it.userName}</Text>
        </View>
      )}
      {!!it.devNameList?.length && (
        <View className={styles.pwdCenter}>
          <Image className={styles.subIcon} src={cdn('littleLock.png')} />
          <Text className={styles.pwdSubText}>{it.devNameList.join(',')}</Text>
        </View>
      )}
      {hasStatusTag && (
        <View className={styles.statusTag} style={{ backgroundColor: themeColor }}>
          <Text className={styles.statusTagText}>
            {Strings.getLang(`incompleteStatus_${it.operate}` as any)}
          </Text>
        </View>
      )}
    </View>
  );
}

export function PasswordList({
  dpId,
  failureText,
  failureTag,
}: {
  dpId: string;
  failureText?: string;
  failureTag?: string;
}) {
  const [online, setOnline] = useState<FitOnlinePasswordItem[]>([]);
  const [offline, setOffline] = useState<FitOfflinePasswordItem[]>([]);
  const [started, setStarted] = useState(false);
  // 分组折叠态（对齐 RN showOnline / showOffline，默认展开）
  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(true);

  // 在线 / 离线密码分别走 lock-sdk 封装接口（内部按运行时 devId 请求云端）
  const refresh = useCallback(() => {
    return Promise.all([
      getFitOnlinePasswordList().catch((err: any) => {
        console.log('=== getFitOnlinePasswordList error', err);
        return [] as FitOnlinePasswordItem[];
      }),
      getFitOfflinePasswordList().catch((err: any) => {
        console.log('=== getFitOfflinePasswordList error', err);
        return [] as FitOfflinePasswordItem[];
      }),
    ])
      .then(([on, off]) => {
        setOnline(on || []);
        setOffline(off || []);
      })
      .finally(() => setStarted(true));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // per-type 单类型同步（对齐 RN password/index.js:93 syncPsw：getDpIdByCode('unlock_password_kit')
  // 后单 dpId 同步）：密码 tab 固定同步 unlock_password_kit，仅挂载时一次
  useEffect(() => {
    syncOpenModeKitByTypes(['unlock_password_kit']);
  }, []);

  // 从添加流程（offlineOncePsw 等）返回 openMode 时刷新，展示新增离线/在线密码
  usePageEvent('onShow', () => {
    refresh();
  });

  // 列表项操作菜单（重命名 / 删除 / 重发；编辑/补发占位），成功后刷新
  const { openMenu, node } = useItemActions({ kind: 'password', onChanged: refresh });

  const failure =
    failureText && failureTag ? <FailureEntry text={failureText} tag={failureTag} /> : null;

  if (!started) return <View className={styles.flex} />;

  // 两组皆空：空态（对齐 RN render 空判断）
  if (online.length === 0 && offline.length === 0) {
    return (
      <View className={styles.emptyWrap}>
        <EmptyState tip={Strings.getLang(`noData_${dpId}` as any)} />
        {failure}
      </View>
    );
  }

  return (
    <>
      <ScrollView className={styles.scroll} scrollY>
        {online.length > 0 && (
          <PwdSection
            title={Strings.getLang('onlinePsw')}
            count={online.length}
            expanded={showOnline}
            onToggle={() => setShowOnline(v => !v)}
          >
            {online.map((item, i) => (
              <PwdItem key={pwdKey(item, i)} item={item} onPress={() => openMenu(item)} />
            ))}
          </PwdSection>
        )}
        {offline.length > 0 && (
          <PwdSection
            title={Strings.getLang('offlinePsw')}
            count={offline.length}
            expanded={showOffline}
            onToggle={() => setShowOffline(v => !v)}
          >
            {offline.map((item, i) => (
              <PwdItem key={pwdKey(item, i)} item={item} onPress={() => openMenu(item)} />
            ))}
          </PwdSection>
        )}
        {failure}
      </ScrollView>
      {node}
    </>
  );
}

export default PasswordList;
