import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  exitMiniProgram,
  getCdnUrl,
  showModal,
  router,
  useQuery,
} from '@ray-js/ray';
import { NavBar, Tabs, Tab, Overlay, Loading } from '@ray-js/smart-ui';
import { getFitBleKeyList, type FitBleKeyItem } from '@ray-js/lock-sdk';
import type { UnlockMethodType } from '@ray-js/lock-sdk';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import useUserPermission from '@/hooks/useUserPermission';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { selectHasBindLockList } from '@/redux/modules/lockHomeSlice';
import { templateConfig } from '@/config';
import { reConnectBle } from '@/utils/reConnectBle';
import { BleKeyList, UnlockMethodList, PasswordList } from './unlockTypeList';
import styles from './index.module.less';

/**
 * 开锁方式 Tab 容器页。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/index.js（OpenModeList）：
 * - 按 devInfo.schema 过滤出设备支持的开锁方式 tab（蓝牙钥匙 / 指纹 / 卡 / 人脸 / 掌静脉 / 密码）；
 * - 多个 tab 时渲染顶部 TabBar（仅 1 个时不渲染）；
 * - 每个 tab 内联对应类型的开锁方式列表（列表实现拆分在 ./unlockTypeList，对齐 RN key/others/password 目录）；
 * - 管理员可见右下角「添加」按钮（蓝牙钥匙已有钥匙时隐藏）；
 * - 「添加」和列表操作接入对应的录入、密码、钥匙新增/编辑页面。
 */

/** 对齐 RN openModeListArray(code.js:61)：tab 顺序 */
const OPEN_MODE_TABS = [
  'bluetooth_unlock_kit',
  'unlock_face_kit',
  'unlock_hand_kit',
  'unlock_fingerprint_kit',
  'unlock_password_kit',
  'unlock_card_kit',
] as const;

type TabCode = (typeof OPEN_MODE_TABS)[number];

/** tab -> 开锁方式 type（指纹/卡/人脸/掌静脉/密码走 getFitUnlockMethodList） */
const TAB_TYPE_MAP: Partial<Record<TabCode, UnlockMethodType>> = {
  unlock_fingerprint_kit: 'finger',
  unlock_card_kit: 'card',
  unlock_face_kit: 'face',
  unlock_hand_kit: 'hand',
  unlock_password_kit: 'password',
};

/** 对齐 RN getListDpId：tab -> dpId（空态文案 key 用 noData_<dpId>） */
const TAB_DP_ID_MAP: Record<TabCode, string> = {
  bluetooth_unlock_kit: '50',
  unlock_fingerprint_kit: '53',
  unlock_card_kit: '52',
  unlock_face_kit: '54',
  unlock_hand_kit: '56',
  unlock_password_kit: '51',
};

/** tab -> 列表项图标（CDN 名） */
const TAB_ICON_MAP: Record<TabCode, string> = {
  bluetooth_unlock_kit: 'permanentKey.png',
  unlock_fingerprint_kit: 'littleFinger.png',
  unlock_card_kit: 'littleCard.png',
  unlock_face_kit: 'littleFace.png',
  unlock_hand_kit: 'littleHand.png',
  unlock_password_kit: 'permanentPwd.png',
};

const cdn = (name: string) => getCdnUrl(name, cdnImage);

export function OpenList() {
  const { fromBleKeyGuide } = useQuery() as { fromBleKeyGuide?: string };
  const schema = useDevice(d => d.devInfo?.schema);
  const { themeColor } = templateConfig;
  const { isManager } = useUserPermission();

  /** 设备支持的 tab（对齐 RN 按 devInfo.schema[code] 过滤） */
  const tabs = useMemo<TabCode[]>(() => {
    const set = new Set<string>((schema || []).map((s: any) => s.code));
    return OPEN_MODE_TABS.filter(code => set.has(code));
  }, [schema]);

  const [active, setActive] = useState<string>('');

  /**
   * 默认选中 tab（对齐 RN openMode/index.js:31 `tab: tabArray[0]`）。
   *
   * RN 的默认 tab 取自 `_.map(TYNative.uiConfig, d => d.code)` 过滤后的首个开锁方式 code，
   * 即按设备 schema（DP 显示顺序）取第一个，而非固定 OPEN_MODE_TABS 顺序的 tabs[0]。
   * 二者顺序不同：本设备不含蓝牙钥匙时，固定顺序会误选到「人脸」，schema 顺序应选「密码」。
   * 注意 tab 栏渲染仍按 OPEN_MODE_TABS 固定顺序（对齐 RN renderTabBar），仅默认选中项按 schema 顺序。
   */
  const defaultTab = useMemo<TabCode | ''>(() => {
    const first = (schema || [])
      .map((s: any) => s.code as string)
      .find(code => (OPEN_MODE_TABS as readonly string[]).includes(code));
    return (first as TabCode) || tabs[0] || '';
  }, [schema, tabs]);

  // schema 就绪后默认选中 tab
  useEffect(() => {
    if (defaultTab && !active) setActive(defaultTab);
  }, [defaultTab, active]);

  // 对齐 RN(openMode/index.js:37)：无支持的开锁方式时兜底到 bluetooth_unlock_kit（展示其空列表）
  // active 未就绪时回退到 defaultTab（schema 顺序），避免默认项确定前先闪现固定顺序的 tabs[0]
  const currentTab = (tabs.find(t => t === active) ||
    defaultTab ||
    tabs[0] ||
    'bluetooth_unlock_kit') as TabCode;

  const renderContent = () => {
    // schema 未就绪：留白，避免空态一闪
    if (!schema) return <View className={styles.flex} />;
    if (currentTab === 'bluetooth_unlock_kit') return <BleKeyList />;
    // 密码走独立的在线/离线云端密码接口，并展示「查看无效开锁方式」入口
    // （对齐 RN password/index.js，数据源与其它开锁方式不同，text=failureText 通用文案）
    if (currentTab === 'unlock_password_kit') {
      return (
        <PasswordList
          dpId={TAB_DP_ID_MAP[currentTab]}
          failureText={Strings.getLang('failureText')}
          failureTag={currentTab}
        />
      );
    }
    const type = TAB_TYPE_MAP[currentTab]!;
    return (
      <UnlockMethodList
        type={type}
        dpId={TAB_DP_ID_MAP[currentTab]}
        dpCode={currentTab}
        icon={TAB_ICON_MAP[currentTab]}
      />
    );
  };

  // 右下角「添加」按钮显隐（对齐 RN isHide：蓝牙钥匙且已有钥匙时隐藏）
  const [bleKeyCount, setBleKeyCount] = useState(0);
  useEffect(() => {
    if (currentTab !== 'bluetooth_unlock_kit') return undefined;
    let mounted = true;
    getFitBleKeyList()
      .then(res => {
        if (mounted) setBleKeyCount(((res as FitBleKeyItem[]) || []).length);
      })
      .catch(error => {
        console.log('Operation failed', error);
      });
    return () => {
      mounted = false;
    };
  }, [currentTab]);

  // 已绑定门锁列表（对齐 RN state.hasBindLockList）：null 表示未拉取完成
  const hasBindLockList = useSelectorWithEquality(selectHasBindLockList);

  // 配件在线态（对齐 RN state.devInfo.deviceOnline；与 lock 页 deviceOnline 取值一致）
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);

  // 蓝牙重连倒计时弹框（受控，由 reConnectBle 的 onTick 回调驱动）：>0 展示「蓝牙连接中 Xs」
  const [reconnectSeconds, setReconnectSeconds] = useState(0);

  // 对齐 RN isHide：蓝牙钥匙且已有钥匙时整体隐藏
  const showAdd = isManager && !(currentTab === 'bluetooth_unlock_kit' && bleKeyCount > 0);
  // 对齐 RN btnDisabled：非蓝牙钥匙 tab 且未绑定任何门锁时，按钮置灰（不可用态）
  const btnDisabled =
    currentTab !== 'bluetooth_unlock_kit' && !(hasBindLockList && hasBindLockList.length > 0);

  /**
   * 添加开锁方式（对齐 RN(0000007ew6) src/containers/openMode/index.js:50 goToAddOpenModeType）。
   *
   * 1) 非蓝牙钥匙 tab 且未绑定任何门锁 → 弹窗提示先绑定门锁，不进入添加流程；
   * 2) 配件离线且非「密码」tab → 先触发一次蓝牙重连（受控倒计时弹框），成功后需用户再次点击
   *    「添加」（对齐 RN `return await reConnectBle(11, true, true)`；密码为在线云能力无需蓝牙在线）；
   * 3) 其余情形进入类型选择页（密码/蓝牙钥匙 → chooseOpenModeType；指纹/卡/人脸/掌静脉 → chooseLockList）。
   */
  const onAdd = useCallback(async () => {
    if (!currentTab) return;
    // 分支 1：对齐 RN 第一分支（tab !== 'bluetooth_unlock_kit' && !hasBindLockList.length）
    if (btnDisabled) {
      showModal({
        title: '',
        content: Strings.getLang('needBindLock'),
        showCancel: false,
        confirmText: Strings.getLang('confirm'),
      });
      return;
    }
    // 分支 2：对齐 RN 第二分支（!deviceOnline && tab !== 'unlock_password_kit' → reConnectBle）
    if (!deviceOnline && currentTab !== 'unlock_password_kit') {
      try {
        await reConnectBle({ onTick: sec => setReconnectSeconds(sec) });
      } catch {
        // 连接失败已由 reConnectBle 内部 Toast 提示
      } finally {
        setReconnectSeconds(0);
      }
      return; // 对齐 RN：重连后不自动续跑，需用户再次点击「添加」
    }
    // 分支 3：进入类型选择页（对齐 RN getTypeParams + Navigator.push({ id:'chooseOpenModeType', ...params })）
    // - 密码 → chooseOpenModeType?type=password；蓝牙钥匙 → chooseOpenModeType?type=key；
    // - 指纹/卡/人脸/掌静脉 → RN 中 params.id 覆写为 chooseLockList，直接进门锁选择页。
    if (currentTab === 'unlock_password_kit') {
      router.push('/chooseOpenModeType?type=password');
    } else if (currentTab === 'bluetooth_unlock_kit') {
      router.push('/chooseOpenModeType?type=key');
    } else {
      // 指纹/卡/人脸/掌静脉：pwdTag 取自 TAB_TYPE_MAP（finger/card/face/hand），直接进门锁选择页
      const pwdTag = TAB_TYPE_MAP[currentTab];
      router.push(`/chooseLockList?pwdTag=${encodeURIComponent(pwdTag || '')}`);
    }
  }, [currentTab, btnDisabled, deviceOnline]);

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('tab_openList')}
        leftArrow
        onClickLeft={() => {
          if (fromBleKeyGuide === '1') {
            // 对齐 RN：由“请添加一个蓝牙钥匙”引导进入时，返回直接退出配件面板。
            exitMiniProgram();
            return;
          }
          router.back();
        }}
      />
      {/*
       * 顶部只用 Tabs 作为「选项卡头」；内容不放进 <Tab> 面板内。
       * 因为 smart-ui 的 .smart-tabs__content 是 overflow:hidden 且高度由内容撑开，
       * 面板内的 flex:1 内容会塌陷成 0 高被裁剪（空态/列表都不可见）。
       * 改为把内容渲染在 page 的 flex 流里（与单 tab 分支一致），tabContent 作为
       * flex:1 直接子节点即可拿到真实高度。
       */}
      {tabs.length > 1 && (
        <Tabs
          type="line"
          active={active}
          color={themeColor}
          swipeable={false}
          onChange={(e: any) => {
            const name = e?.detail?.name;
            if (name) setActive(String(name));
          }}
        >
          {tabs.map(code => (
            <Tab key={code} name={code} title={Strings.getLang(`Tab_${code}`)} />
          ))}
        </Tabs>
      )}
      <View className={styles.tabContent}>{renderContent()}</View>

      {showAdd && (
        <View className={styles.addBtn} onClick={onAdd}>
          <Image
            className={styles.addIcon}
            src={cdn(btnDisabled ? 'add_disabled.png' : 'addPwd.png')}
          />
        </View>
      )}

      {/* 蓝牙重连倒计时：Overlay 作遮罩，盒子 fixed 自居中，文案由 reconnectSeconds 驱动 */}
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

export default OpenList;
