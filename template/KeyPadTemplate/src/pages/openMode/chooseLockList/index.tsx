import React, { useState } from 'react';
import { View, Text, Image, ScrollView, getCdnUrl, showToast, router, useQuery } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { templateConfig } from '@/config';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { selectHasBindLockList } from '@/redux/modules/lockHomeSlice';
import styles from './index.module.less';

/**
 * 选择关联门锁页（添加开锁方式流程第二步）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/chooseLockList.js（LockChoosePage）：
 * - 展示配件已绑定门锁列表（redux hasBindLockList，源自 getBoundLockList，与 openMode 添加门控同源）；
 * - 单选（点击整行或右侧单选圈切换选中，再次点击已选项取消，对齐 RN chooseItem）；
 * - 列表为空时展示空态（noneLock + pleaseBindLock），底部「下一步」置灰不可点；
 * - 「下一步」按钮：未选择门锁时禁用；已选后按 pwdTag 分流（对齐 RN gotoNextPage）：
 *   · permanentPsw/permanentKey/finger/card/face/hand → chooseUserList（选择关联成员）；
 *   · 其余（onlineOneTimePsw/onlineUnlimitedPsw 等）→ 对应密码添加页（getJumpPwdParams）。
 *
 */

/** 对齐 RN goToUserChooseKeyArr：这些 pwdTag 下一步进「选择关联成员」页 */
const GO_TO_USER_CHOOSE_KEYS = ['permanentPsw', 'permanentKey', 'finger', 'card', 'face', 'hand'];

/**
 * 在线临时密码 pwdTag → 是否不限次数（对齐 RN getJumpPwdParams）：
 * onlineOneTimePsw = 一次性（isUnlimited=false）；onlineUnlimitedPsw = 不限次数（isUnlimited=true）。
 */
const ONLINE_TEMP_UNLIMITED: Record<string, boolean> = {
  onlineOneTimePsw: false,
  onlineUnlimitedPsw: true,
};

const cdn = (name: string) => getCdnUrl(name, cdnImage);

interface BoundLock {
  devId: string;
  devName: string;
  icon: string;
}

export function ChooseLockList() {
  // 开锁方式类型标签（对齐 RN props.pwdTag），决定下一步去向
  const { pwdTag = '' } = useQuery() as { pwdTag?: string };

  // 已绑定门锁列表（对齐 RN state.hasBindLockList）：null 表示未拉取完成
  const hasBindLockList = useSelectorWithEquality(selectHasBindLockList) as BoundLock[] | null;
  const list = hasBindLockList || [];

  const { themeColor } = templateConfig;

  // 当前选中门锁 devId（对齐 RN state.chooseId / chooseLockData）
  const [chooseId, setChooseId] = useState('');

  /** 单选切换：点已选项取消，点其它项切换（对齐 RN chooseItem） */
  const chooseItem = (item: BoundLock) => {
    setChooseId(prev => (prev === item.devId ? '' : item.devId));
  };

  /**
   * 下一步（对齐 RN gotoNextPage）。
   * permanentPsw/finger/card/face/hand → 选择关联成员页 chooseUserList（带 pwdTag + 选中门锁）；
   * 其余（onlineOneTimePsw/onlineUnlimitedPsw 等）→ 密码添加页。
   */
  const gotoNextPage = () => {
    if (!chooseId) return;
    if (GO_TO_USER_CHOOSE_KEYS.includes(pwdTag)) {
      router.push(
        `/chooseUserList?pwdTag=${encodeURIComponent(pwdTag)}&lockDevId=${encodeURIComponent(
          chooseId
        )}`
      );
    } else if (pwdTag in ONLINE_TEMP_UNLIMITED) {
      // 在线一次性 / 不限次数密码 → addOnlinePsw（已迁移），透传选中门锁 + isUnlimited
      router.push(
        `/addOnlinePsw?lockDevId=${encodeURIComponent(chooseId)}` +
          `&isUnlimited=${ONLINE_TEMP_UNLIMITED[pwdTag]}`
      );
    } else {
      // 无效路由参数不进入新增流程。
      showToast({ title: Strings.getLang('loadFailed'), icon: 'none' });
    }
  };

  const disabled = !chooseId;

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('pleaseChooseLock')}
        leftArrow
        onClickLeft={() => router.back()}
      />

      {list.length === 0 ? (
        <View className={styles.noneWrap}>
          <Image className={styles.noneIcon} src={cdn('noneLock.png')} />
          <Text className={styles.tip}>{Strings.getLang('pleaseBindLock')}</Text>
        </View>
      ) : (
        <ScrollView className={styles.scroll} scrollY>
          {list.map(item => (
            <View key={item.devId} className={styles.item} onClick={() => chooseItem(item)}>
              <Image className={styles.lockIcon} src={item.icon} />
              <Text className={styles.title}>{item.devName}</Text>
              <Image
                className={styles.radio}
                src={cdn(chooseId === item.devId ? 'choose.png' : 'chooseNull.png')}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* 底部「下一步」（对齐 RN AddBtnView，未选门锁时置灰不可点） */}
      <View className={styles.footer}>
        <View
          className={`${styles.btn} ${disabled ? styles.btnDisabled : ''}`}
          style={{ backgroundColor: themeColor }}
          onClick={gotoNextPage}
        >
          <Text className={styles.btnText}>{Strings.getLang('next')}</Text>
        </View>
      </View>
    </View>
  );
}

export default ChooseLockList;
