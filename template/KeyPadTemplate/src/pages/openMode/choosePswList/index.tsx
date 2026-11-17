import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, getCdnUrl, router } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import dayjs from 'dayjs';
import { getFitOfflineRevocableList } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import styles from './index.module.less';

/**
 * 选择要清空的离线密码列表（清空单个码流程）。
 *
 * 对齐 RN(0000007ew6) src/containers/openMode/password/choosePsw.js：
 * - 拉「可清空」列表（至少使用过一次的时间限制离线密码，`offlinepwd.revocable`）；
 * - 点某条 → 进入 addOfflinePsw（pwdType='8'，带 pwdId / pwdName / 生效失效时间 + isPopN=1，
 *   拿到清空码后完成回退 3 层，对齐 RN choosePsw → addOfflinePsw popN(3)）；
 * - 列表为空时展示空态（noValidPsw）。
 *
 * 数据源：`@ray-js/lock-sdk` 的 `getFitOfflineRevocableList()`。
 */

const cdn = (name: string) => getCdnUrl(name, cdnImage);
/** 时间戳(秒) -> YYYY.MM.DD HH:00（对齐 RN dateFormat('yyyy.MM.dd hh:00')） */
const formatTime = (sec: string | number) => dayjs(Number(sec) * 1000).format('YYYY.MM.DD HH:00');

interface RevocableItem {
  pwdId: string;
  pwdName: string;
  gmtStart: string;
  gmtExpired: string;
}

export function ChoosePswList() {
  const [list, setList] = useState<RevocableItem[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = (await getFitOfflineRevocableList()) as RevocableItem[];
        setList(data || []);
      } catch (err) {
        console.log('=== getFitOfflineRevocableList error', err);
        setList([]);
      }
    })();
  }, []);

  // 选择某条 → 清空单个码页（对齐 RN choosePsw）
  const choose = (item: RevocableItem) => {
    const time = `${formatTime(item.gmtStart)} ~ ${formatTime(item.gmtExpired)}`;
    router.push(
      `/addOfflinePsw?pwdType=8&isPopN=1&pwdId=${encodeURIComponent(item.pwdId)}` +
        `&pwdName=${encodeURIComponent(item.pwdName || '')}&pwdTime=${encodeURIComponent(time)}`
    );
  };

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('choosePsw')}
        leftArrow
        onClickLeft={() => router.back()}
      />

      {list && list.length > 0 ? (
        <View className={styles.main}>
          <Text className={styles.topTitle}>{Strings.getLang('chooseTitle')}</Text>
          <ScrollView className={styles.scroll} scrollY>
            {list.map(item => {
              const time = `${formatTime(item.gmtStart)} ~ ${formatTime(item.gmtExpired)}`;
              return (
                <View key={item.pwdId} className={styles.item} onClick={() => choose(item)}>
                  <View className={styles.itemInfo}>
                    <Text className={styles.itemName}>{item.pwdName}</Text>
                    <Text className={styles.itemTime}>{time}</Text>
                  </View>
                  {/* 右侧选择按钮（对齐 RN choosePsw 的 Res.chooseNull） */}
                  <Image className={styles.selectIcon} src={cdn('chooseNull.png')} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        // list===null 加载中不渲染空态，避免闪现（对齐 RN showLoading）
        list !== null && (
          <View className={styles.noneWrap}>
            <Image className={styles.noneIcon} src={cdn('none.png')} />
            <Text className={styles.tip}>{Strings.getLang('noValidPsw')}</Text>
          </View>
        )
      )}
    </View>
  );
}

export default ChoosePswList;
