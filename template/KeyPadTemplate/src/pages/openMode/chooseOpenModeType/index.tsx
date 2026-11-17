import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, getCdnUrl, router, useQuery } from '@ray-js/ray';
import { NavBar, ActionSheet, type SmartAction } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/**
 * 选择开锁方式类型页（密码类型 / 蓝牙钥匙类型）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/chooseOpenModeType.js（PasswordType）：
 * - type='password'：在线密码（永久/一次性/不限次）+ 离线密码（一次性/不限次/清空码，设备支持时）
 *   + 动态密码（设备支持时）三组分区；在线密码项在配件离线时置灰不可点（对齐 RN disabled:!deviceOnline）；
 * - type='key'：永久蓝牙钥匙 / 临时蓝牙钥匙 两项；
 * - 清空码点击弹「清空所有 / 清空单个」菜单（对齐 RN showClearMenu 的 Popup.list）。
 *
 * 使用十进制密码，入口按设备 DP 能力展示：
 * 离线密码 = dpUnlockOfflinePd && digitalBase>6；动态密码 = dpUnlockDynamic && digitalBase>4。
 */

/** 离线密码 DP（对齐 RN Config.uiConfig.dpUnlockOfflinePd） */
const DP_UNLOCK_OFFLINE_PD = 'unlock_offline_pd';
/** 动态密码 DP（对齐 RN Config.uiConfig.dpUnlockDynamic） */
const DP_UNLOCK_DYNAMIC = 'unlock_dynamic';

const cdn = (name: string) => getCdnUrl(name, cdnImage);

interface TypeItem {
  key: string;
  title: string;
  /** 列表项图标（CDN 名） */
  icon: string;
  disabled?: boolean;
  onPress: () => void;
}

interface TypeSection {
  key: string;
  title: string;
  subTitle?: string;
  data: TypeItem[];
}

/** 单个列表项：主题色圆形 icon + 标题 + 右箭头 */
function Item({ item, first, last }: { item: TypeItem; first: boolean; last: boolean }) {
  const { themeColor } = templateConfig;
  const cls = [
    styles.item,
    first ? styles.itemFirst : '',
    last ? styles.itemLast : '',
    item.disabled ? styles.itemDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <View className={cls} onClick={() => !item.disabled && item.onPress()}>
      <View className={styles.iconBg} style={{ backgroundColor: themeColor }}>
        <Image className={styles.icon} src={cdn(item.icon)} />
      </View>
      <Text className={styles.title}>{item.title}</Text>
      <View className={styles.arrow} />
    </View>
  );
}

export function ChooseOpenModeType() {
  // 进入类型（对齐 RN props.type）：password / key（由 openMode 添加入口带入）
  const { type } = useQuery() as { type?: 'password' | 'key' };

  // 配件在线态（对齐 RN props.deviceOnline；与 openMode/lock 页取值一致）
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);
  const schema = useDevice(d => d.devInfo?.schema);

  const digitalBase = 10;

  // 设备支持的密码能力（对齐 RN getPswLogs：dpUnlockOfflinePd && digitalBase>6 /
  // dpUnlockDynamic && digitalBase>4——残位进制过低时离线/动态密码算法不可用）
  const { hasOfflinePd, hasDynamic } = useMemo(() => {
    const set = new Set<string>((schema || []).map((s: any) => s.code));
    return {
      hasOfflinePd: set.has(DP_UNLOCK_OFFLINE_PD) && digitalBase > 6,
      hasDynamic: set.has(DP_UNLOCK_DYNAMIC) && digitalBase > 4,
    };
  }, [schema, digitalBase]);

  // 清空码菜单（对齐 RN showClearMenu 的 Popup.list）
  const [clearSheet, setClearSheet] = useState(false);

  /**
   * 跳转门锁选择页（对齐 RN goToChooseLockPage）。
   */
  const goToChooseLockPage = (pwdTag: string) =>
    router.push(`/chooseLockList?pwdTag=${encodeURIComponent(pwdTag)}`);

  /**
   * 跳转成员选择页（对齐 RN goToUserListPage，蓝牙钥匙用）。
   * 蓝牙钥匙绑定配件本身，无需先选门锁（对齐 RN chooseLockData:{fittingId: devId}）。
   */
  const goToUserListPage = (pwdTag: string) =>
    router.push(`/chooseUserList?pwdTag=${encodeURIComponent(pwdTag)}`);

  // 密码类型分组（对齐 RN getPswLogs）
  const pswSections = useMemo<TypeSection[]>(() => {
    const sections: TypeSection[] = [
      {
        key: 'online',
        title: Strings.getLang('onlinePsw'),
        subTitle: Strings.getLang('onlinePswTip'),
        data: [
          {
            key: 'permanentPsw',
            title: Strings.getLang('permanentPsw'),
            icon: 'permanentPwd.png',
            disabled: !deviceOnline,
            onPress: () => goToChooseLockPage('permanentPsw'),
          },
          {
            key: 'onlineOneTimePsw',
            title: Strings.getLang('onlineOneTimePsw'),
            icon: 'one.png',
            disabled: !deviceOnline,
            onPress: () => goToChooseLockPage('onlineOneTimePsw'),
          },
          {
            key: 'onlineUnlimitedPsw',
            title: Strings.getLang('onlineUnlimitedPsw'),
            icon: 'unlimited.png',
            disabled: !deviceOnline,
            onPress: () => goToChooseLockPage('onlineUnlimitedPsw'),
          },
        ],
      },
    ];
    // 离线密码（对齐 RN hasOfflinePd = digitalBase>6 && dpUnlockOfflinePd）
    if (hasOfflinePd) {
      sections.push({
        key: 'offline',
        title: Strings.getLang('offlinePsw'),
        subTitle: Strings.getLang('offlinePswTip'),
        data: [
          {
            key: 'offlineOneTimePsw',
            title: Strings.getLang('offlineOneTimePsw'),
            icon: 'one.png',
            // 离线一次性密码无需选择门锁，直接进入获取页（对齐 RN goToOfflinePswPage('once')）
            onPress: () => router.push('/addOfflinePsw?pwdType=1'),
          },
          {
            key: 'offlineUnlimitedPsw',
            title: Strings.getLang('offlineUnlimitedPsw'),
            icon: 'unlimited.png',
            // 时间限制离线密码需先选生效/失效时间（对齐 RN goToOfflinePswPage('unlimited')）
            onPress: () => router.push('/offlineUnlimitedPsw'),
          },
          {
            key: 'offlineClearPsw',
            title: Strings.getLang('offlineClearPsw'),
            icon: 'clearCode.png',
            onPress: () => setClearSheet(true),
          },
        ],
      });
    }
    // 动态密码（对齐 RN dpUnlockDynamic && digitalBase>4）
    if (hasDynamic) {
      sections.push({
        key: 'dynamic',
        title: Strings.getLang('dynamicPsw'),
        subTitle: Strings.getLang('dynamicPswTip'),
        data: [
          {
            key: 'dynamic',
            title: Strings.getLang('dynamic'),
            icon: 'dynamic.png',
            // 动态密码无需选择门锁，直接进入获取页（对齐 RN goToOfflinePswPage('dynamic')）
            onPress: () => router.push('/dynamicPsw'),
          },
        ],
      });
    }
    return sections;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceOnline, hasOfflinePd, hasDynamic]);

  // 蓝牙钥匙类型分组（对齐 RN getKeyLogs）
  const keySections = useMemo<TypeSection[]>(
    () => [
      {
        key: 'key',
        title: Strings.getLang('keyTypeTitle'),
        data: [
          {
            key: 'permanentKey',
            title: Strings.getLang('permanentKey'),
            icon: 'permanentKey.png',
            onPress: () => goToUserListPage('permanentKey'),
          },
          {
            key: 'temporaryKey',
            title: Strings.getLang('temporaryKey'),
            icon: 'temporaryKey.png',
            onPress: () => goToUserListPage('temporaryKey'),
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sections = type === 'password' ? pswSections : keySections;

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('chooseOpenModeType')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      <ScrollView className={styles.scroll} scrollY>
        {sections.map(section => (
          <View key={section.key} className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>{section.title}</Text>
              {!!section.subTitle && (
                <Text className={styles.sectionSubTitle}>{section.subTitle}</Text>
              )}
            </View>
            {section.data.map((item, idx) => (
              <Item
                key={item.key}
                item={item}
                first={idx === 0}
                last={idx === section.data.length - 1}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* 清空码菜单（对齐 RN showClearMenu：清空所有 → choosePsw='9'，清空单个 → choosePsw='8'） */}
      <ActionSheet
        show={clearSheet}
        title={Strings.getLang('clearPwdTip')}
        safeAreaInsetBottom={false}
        actions={[
          { name: Strings.getLang('clearAll'), value: 'all' },
          { name: Strings.getLang('clearOne'), value: 'one' },
        ]}
        cancelText={Strings.getLang('cancel')}
        onClose={() => setClearSheet(false)}
        onCancel={() => setClearSheet(false)}
        onSelect={(e: { detail: SmartAction }) => {
          setClearSheet(false);
          // 清空所有 → 清空码页 pwdType=9；清空单个 → 先选要清空的密码（对齐 RN showClearMenu）
          if ((e?.detail as any)?.value === 'all') {
            router.push('/addOfflinePsw?pwdType=9');
          } else if ((e?.detail as any)?.value === 'one') {
            router.push('/choosePswList');
          }
        }}
      />
    </View>
  );
}

export default ChooseOpenModeType;
