import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, usePageEvent } from '@ray-js/ray';
import { getFitBleKeyList, type FitBleKeyItem } from '@ray-js/lock-sdk';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import { cdn, MethodItem, EmptyState, FailureEntry, type SubRow } from './shared';
import { useItemActions } from './useItemActions';
import styles from './index.module.less';

/**
 * 蓝牙钥匙列表（对齐 RN(0000007ew6) src/containers/openMode/key/index.js）。
 * 永久钥匙(opModeSubType===10)显示用户名；临时钥匙显示生效时间。
 * 本 tab 无 per-type 同步（对齐 RN key/index.js componentDidMount：蓝牙钥匙是
 * App 侧凭证、不存于锁端，不参与 opmode.sync.rise，其余 tab 见 syncOpenModeKitByTypes）。
 */
export function BleKeyList() {
  const [list, setList] = useState<FitBleKeyItem[]>([]);
  const [started, setStarted] = useState(false);

  const refresh = useCallback(() => {
    return getFitBleKeyList()
      .then(res => setList((res as FitBleKeyItem[]) || []))
      .catch(err => console.log('=== getFitBleKeyList error', err))
      .finally(() => setStarted(true));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 添加钥匙返回本页后刷新（对齐 passwordList；chooseUserList / temporaryKey 保存成功回退至此）
  usePageEvent('onShow', () => {
    refresh();
  });

  // 列表项操作菜单（重命名 / 删除 / 编辑占位），成功后刷新
  const { openMenu, node } = useItemActions({ kind: 'bleKey', onChanged: refresh });

  // 无效开锁方式入口：蓝牙钥匙固定展示（对齐 RN key/index.js renderFooter，text=failureText_50）
  const failure = (
    <FailureEntry text={Strings.getLang('failureText_50')} tag="bluetooth_unlock_kit" />
  );

  if (!started) return <View className={styles.flex} />;
  if (list.length === 0) {
    return (
      <View className={styles.emptyWrap}>
        <EmptyState tip={Strings.getLang('noData_50')} />
        {failure}
      </View>
    );
  }

  return (
    <>
      <ScrollView className={styles.scroll} scrollY>
        {list.map(item => {
          const isPermanent = item.opModeSubType === 10;
          const icon = cdn(isPermanent ? 'permanentKey.png' : 'temporaryKey.png');
          const lockNames = (item.devNameList || []).join(',');
          // 副信息行（对齐 RN key/index.js renderCustomItem，均在白卡内）：
          // 永久钥匙(opModeSubType===10)显示用户名；门锁名（有则显示）；临时钥匙显示生效时间段。
          const subRows: SubRow[] = [];
          if (isPermanent && item.userName) {
            subRows.push({ icon: cdn('littleUser.png'), text: item.userName });
          }
          if (lockNames) {
            subRows.push({ icon: cdn('littleLock.png'), text: lockNames });
          }
          if (!isPermanent) {
            const { effectiveDate, expiredDate } = item.effectiveConfig || {};
            if (effectiveDate && expiredDate) {
              const s = dayjs(effectiveDate * 1000).format('YYYY.MM.DD HH:mm');
              const e = dayjs(expiredDate * 1000).format('YYYY.MM.DD HH:mm');
              subRows.push({ icon: cdn('littleTime.png'), text: `${s} ~ ${e}` });
            }
          }
          return (
            <View key={item.unlockBindingId} onClick={() => openMenu(item)}>
              <MethodItem icon={icon} title={item.name || ''} subRows={subRows} />
            </View>
          );
        })}
        {failure}
      </ScrollView>
      {node}
    </>
  );
}

export default BleKeyList;
