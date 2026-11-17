import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  getCdnUrl,
  showToast,
  showLoading,
  hideLoading,
  navigateBack,
  router,
  useQuery,
  hideMenuButton,
} from '@ray-js/ray';
import { NavBar, ActionSheet, Icon, type SmartAction } from '@ray-js/smart-ui';
import Plus from '@tuya-miniapp/icons/dist/svg/Plus';
import { useDevice } from '@ray-js/panel-sdk';
import { getFitUsers, createFitPermanentBleKey, type FitUserItem } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import { reConnectBle } from '@/utils/reConnectBle';
import { gotoAddFamilyMember } from '@/utils/nativeRouter';
import styles from './index.module.less';

/**
 * 选择关联成员页（添加开锁方式流程末步）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/chooseUserList.js（UserChooseList）：
 * - 展示家庭成员列表（与 RN getUsers 同一云端接口 tuya.m.device.member.list，已封装为
 *   lock-sdk 的 getFitUsers，返回 FitUserItem：userId/nickName/userContact/avatarUrl/...）；
 * - 单选（点击整行或右侧单选圈切换，再次点击已选项取消，对齐 RN chooseItem）；
 * - 列表为空时展示空态（noneLock + pleaseAddUser），底部「下一步」置灰；
 * - 「下一步」按 pwdTag 分流（对齐 RN gotoPswPage）：
 *   · permanentKey → 直接经 SDK createFitPermanentBleKey 保存永久蓝牙钥匙（savePermanentKey）；
 *   · temporaryKey → 跳临时钥匙时效配置页（/temporaryKey）；
 *   · 其余（permanentPsw/finger/card/face/hand）→ 对应添加页（getJumpPwdParams）。
 *
 * 蓝牙钥匙保存 / 下发需设备在线，离线先 reConnectBle（对齐 RN !deviceOnline）。
 *
 * v2.3 §7 快捷添加人员：
 * - 右上角「+」弹菜单（仅「添加成员」，无分享）→ 跳 App 家庭添加成员页（配件家庭成员会自动绑定到主锁）；
 * - 下拉刷新成员列表——快捷添加成员保存后几乎立刻返回面板，彼时对方必然还没接受邀请，返回时自动
 *   刷新拉回的仍是旧名单（故不做 onShow 自动刷新）；对方接受后用户下拉即见（对齐 RN onRefresh）。
 */

/** 对齐 RN gotoPswPage：permanentKey 走保存钥匙，其余走添加页 */
const KEY_TAG = 'permanentKey';

const cdn = (name: string) => getCdnUrl(name, cdnImage);

/**
 * 选完成员后的去向（对齐 RN gotoPswPage + getJumpPwdParams 的 id）。
 *
 * permanentKey / temporaryKey 不在此表：蓝牙钥匙在 gotoPswPage 的钥匙分支单独处理
 * （永久直接保存，临时跳 /temporaryKey）。
 * 其余 pwdTag 各自跳转到对应添加页（route 名对齐 RN getJumpPwdParams 返回的 id）：
 * - permanentPsw → 'addPermanentPsw' 添加永久密码（RN openMode/password/addPermanentPsw）
 * - finger/card/face/hand → 'addGuide' 录入引导（RN openMode/others/addGuideView，按 type 区分）
 *
 * 注意：onlineOneTimePsw / onlineUnlimitedPsw 不经过本页 —— 它们在 chooseLockList 选完门锁后
 * 直接跳 addOnlinePsw（对齐 RN chooseLockList.gotoNextPage 的 else 分支）。
 */
const JUMP_TARGET: Record<string, { route: string; type?: string }> = {
  permanentPsw: { route: 'addPermanentPsw' },
  finger: { route: 'addGuide', type: 'finger' },
  card: { route: 'addGuide', type: 'card' },
  face: { route: 'addGuide', type: 'face' },
  hand: { route: 'addGuide', type: 'hand' },
};

export function ChooseUserList() {
  // pwdTag：开锁方式类型（决定下一步去向）；lockDevId：上一步选中的门锁（密码/指纹等由 chooseLockList 带入）
  const { pwdTag = '', lockDevId = '' } = useQuery() as { pwdTag?: string; lockDevId?: string };

  const { themeColor } = templateConfig;
  // 配件在线态（对齐 RN props.deviceOnline：保存钥匙需下发 DP，离线先蓝牙重连）
  const deviceOnline = useDevice(d => !!d.devInfo?.isOnline);

  const [list, setList] = useState<FitUserItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  // 当前选中成员 userId（对齐 RN state.chooseId / chooseUserData）
  const [chooseId, setChooseId] = useState('');
  // v2.3 §7：下拉刷新中（驱动 ScrollView refresher）
  const [refreshing, setRefreshing] = useState(false);
  // v2.3 §7：快捷添加人员菜单显隐
  const [addSheet, setAddSheet] = useState(false);

  // 拉取家庭成员列表（对齐 RN getFamilyUserAsync：getUsers → getFitUsers），错误吞掉、恒 resolve
  const fetchUsers = useCallback(
    () =>
      getFitUsers()
        .then(res => {
          setList((res || []).filter(Boolean));
        })
        .catch(err => {
          console.log('=== getFitUsers error', err);
        }),
    []
  );

  // 进页即拉最新成员列表（对齐 RN componentDidMount；member.list 只含已接受成员，
  // 邀请未被接受前新成员本就不在列表，非刷新能解决）
  useEffect(() => {
    hideMenuButton();
    fetchUsers().finally(() => setLoaded(true));
  }, [fetchUsers]);

  // v2.3 §7：下拉刷新（fetchUsers 吞错恒 resolve，refreshing 不会卡死）
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers().finally(() => setRefreshing(false));
  }, [fetchUsers]);

  // v2.3 §7：快捷添加人员——菜单选「添加成员」后跳 App 家庭添加成员页
  const onAddMember = useCallback(() => {
    setAddSheet(false);
    gotoAddFamilyMember().catch(err => {
      console.log('=== gotoAddFamilyMember error', err);
    });
  }, []);

  /** 单选切换：点已选项取消，点其它项切换（对齐 RN chooseItem） */
  const chooseItem = (item: FitUserItem) => {
    setChooseId(prev => (prev === item.userId ? '' : item.userId));
  };

  /**
   * 保存永久蓝牙钥匙（对齐 RN savePermanentKey + saveBleKey）。
   * 设备优先全流程封装在 SDK createFitPermanentBleKey：下发 ble_key_create DP →
   * 解析硬件序号 → 云端落库。只需传 userId，成员权限（是否管理员）与开门时效由 SDK
   * 内部查成员列表后组装，面板不再自行推导。
   * 成功后回退 2 层到 openMode（钥匙列表 onShow 刷新）。
   */
  const savePermanentKey = (user: FitUserItem) => {
    if (saving) return;
    setSaving(true);
    showLoading({ title: '' });
    createFitPermanentBleKey(user.userId)
      .then(() => {
        hideLoading();
        showToast({ title: Strings.getLang('saveSuccess'), icon: 'success' });
        // openMode → chooseOpenModeType → chooseUserList，回退 2 层回 openMode
        navigateBack({ delta: 2 });
      })
      .catch(err => {
        hideLoading();
        console.warn('=== savePermanentKey error', err);
        const e = typeof err === 'string' ? { message: err } : err || {};
        showToast({
          title: e?.errorMsg || e?.message || Strings.getLang('addError'),
          icon: 'none',
        });
      })
      .finally(() => setSaving(false));
  };

  /**
   * 下一步（对齐 RN gotoPswPage）。
   * permanentKey 直接保存永久蓝牙钥匙（不跳转）；temporaryKey 跳临时钥匙时效页；
   * 密码/指纹等按 JUMP_TARGET 跳对应添加页。
   */
  const gotoPswPage = () => {
    if (!chooseId) return;
    // 永久钥匙：立即下发 ble_key_create DP 保存，需设备在线（对齐 RN savePermanentKey → !deviceOnline → reConnectBle）
    if (pwdTag === KEY_TAG) {
      if (!deviceOnline) {
        reConnectBle().catch(() => {
          /* 忽略蓝牙重连失败（对齐 RN 静默重连） */
        });
        return;
      }
      const user = list.find(u => u.userId === chooseId);
      if (user) savePermanentKey(user);
      return;
    }
    // 临时钥匙：跳时效配置页（携带选中成员，对齐 RN gotoPswPage → addTempKey chooseUserData）；
    // 在线校验交由 temporaryKey 页保存时处理（对齐 RN putAddDp）
    if (pwdTag === 'temporaryKey') {
      router.push(`/temporaryKey?userId=${encodeURIComponent(chooseId)}`);
      return;
    }
    // 其余：跳转对应添加页（携带选中门锁 + 选中成员，供添加页下发使用）
    const target = JUMP_TARGET[pwdTag];
    // 指纹/卡/人脸/掌静脉 → 录入引导页 addGuide（已迁移），透传 type + 成员 + 门锁
    if (target?.route === 'addGuide' && target.type) {
      router.push(
        `/addGuide?type=${encodeURIComponent(target.type)}` +
          `&userId=${encodeURIComponent(chooseId)}&lockDevId=${encodeURIComponent(lockDevId)}`
      );
      return;
    }
    // 永久密码 → addPermanentPsw（已迁移），透传选中门锁 + 成员，供 fitAddPassword 下发
    if (target?.route === 'addPermanentPsw') {
      router.push(
        `/addPermanentPsw?lockDevId=${encodeURIComponent(lockDevId)}` +
          `&userId=${encodeURIComponent(chooseId)}`
      );
      return;
    }
    // 兜底：未知 pwdTag（正常不会到达）
    showToast({ title: Strings.getLang('loadFailed'), icon: 'none' });
  };

  const disabled = !chooseId || saving;

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('chooseUser')}
        leftArrow
        onClickLeft={() => router.back()}
        // v2.3 §7：右上角「快捷添加人员」+（对齐 RN TopBar actions plus，与主锁 family/index 一致）
        slot={{
          right: (
            <View className={styles.navPlus} onClick={() => setAddSheet(true)}>
              <Icon name={Plus} size="48rpx" color="#000" />
            </View>
          ),
        }}
      />

      {loaded && list.length === 0 ? (
        <View className={styles.noneWrap}>
          <Image className={styles.noneIcon} src={cdn('noneLock.png')} />
          <Text className={styles.tip}>{Strings.getLang('pleaseAddUser')}</Text>
        </View>
      ) : (
        <ScrollView
          className={styles.scroll}
          scrollY
          // v2.3 §7：下拉刷新成员列表（对齐 RN RefreshControl）
          refresherEnabled
          refresherTriggered={refreshing}
          onRefresherRefresh={onRefresh}
        >
          {list.map(item => (
            <View key={item.userId} className={styles.item} onClick={() => chooseItem(item)}>
              <Image className={styles.avatar} src={item.avatarUrl} />
              <View className={styles.info}>
                <Text className={styles.title}>{item.nickName}</Text>
                {!!item.userContact && <Text className={styles.subTitle}>{item.userContact}</Text>}
              </View>
              <Image
                className={styles.radio}
                src={cdn(chooseId === item.userId ? 'choose.png' : 'chooseNull.png')}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* 底部「下一步」（对齐 RN AddBtnView，未选成员时置灰不可点） */}
      <View className={styles.footer}>
        <View
          className={`${styles.btn} ${disabled ? styles.btnDisabled : ''}`}
          style={{ backgroundColor: themeColor }}
          onClick={gotoPswPage}
        >
          <Text className={styles.btnText}>{Strings.getLang('next')}</Text>
        </View>
      </View>

      {/* v2.3 §7：快捷添加人员菜单（对齐 RN Popup.list：仅「添加成员」+ 取消） */}
      <ActionSheet
        show={addSheet}
        safeAreaInsetBottom={false}
        actions={[{ name: Strings.getLang('addMember'), value: 'add' }]}
        cancelText={Strings.getLang('cancel')}
        onClose={() => setAddSheet(false)}
        onCancel={() => setAddSheet(false)}
        onSelect={(e: { detail: SmartAction }) => {
          if ((e?.detail as any)?.value === 'add') onAddMember();
          else setAddSheet(false);
        }}
      />
    </View>
  );
}

export default ChooseUserList;
