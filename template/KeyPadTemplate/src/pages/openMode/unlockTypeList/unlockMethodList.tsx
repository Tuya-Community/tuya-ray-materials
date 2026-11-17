import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, usePageEvent } from '@ray-js/ray';
import {
  getFitUnlockMethodList,
  type FitUnlockMethodItem,
  type UnlockMethodType,
} from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import { syncOpenModeKitByTypes } from '@/utils/syncOpenMode';
import { cdn, MethodItem, EmptyState, type SubRow } from './shared';
import { useItemActions } from './useItemActions';
import styles from './index.module.less';

/**
 * 开锁方式列表（指纹 / 卡 / 人脸 / 掌静脉，对齐 RN(0000007ew6) openMode/others/index.js）。
 *
 * 这四类结构同构，共用本组件（对齐 RN 的 others 目录：同一套列表复用于多种开锁方式）；
 * 仅入参 type/dpId/dpCode/icon 不同。密码走独立的 PasswordList（数据源不同）；
 * 这几类 RN 已注释「不需要无效列表入口」，故无 failure 入口。
 */
export function UnlockMethodList({
  type,
  dpId,
  dpCode,
  icon,
}: {
  type: UnlockMethodType;
  dpId: string;
  dpCode: string;
  icon: string;
}) {
  const [list, setList] = useState<FitUnlockMethodItem[]>([]);
  const [started, setStarted] = useState(false);

  const refresh = useCallback(() => {
    return getFitUnlockMethodList({ type })
      .then(res => setList((res as FitUnlockMethodItem[]) || []))
      .catch(err => console.log('=== getFitUnlockMethodList error', err))
      .finally(() => setStarted(true));
  }, [type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // per-type 单类型同步（对齐 RN others/*.js componentDidMount 的 syncPsw）：
  // 进入/切换到本 tab 时只同步当前类型（四类共用本组件、切 tab 不重挂载，故以 dpCode 为依赖）
  useEffect(() => {
    syncOpenModeKitByTypes([dpCode]);
  }, [dpCode]);

  // 从添加流程（addRecord）录制成功返回 openMode 时刷新列表，展示新增项
  usePageEvent('onShow', () => {
    refresh();
  });

  // 列表项操作菜单（重命名 / 删除）；opModeName 用类型名（对齐 RN this.opModeName）
  const { openMenu, node } = useItemActions({
    kind: 'method',
    opModeName: Strings.getLang(type as any),
    onChanged: refresh,
  });

  if (!started) return <View className={styles.flex} />;
  if (list.length === 0) {
    return (
      <View className={styles.emptyWrap}>
        <EmptyState tip={Strings.getLang(`noData_${dpId}` as any)} />
      </View>
    );
  }

  return (
    <>
      <ScrollView className={styles.scroll} scrollY>
        {list.map(item => {
          const lockNames = (item.devices || []).map(d => d.devName).join(',');
          // 副信息行（对齐 RN others/index.js renderCustomItem，均在白卡内）：用户名 + 门锁名
          const subRows: SubRow[] = [];
          if (item.userName) {
            subRows.push({ icon: cdn('littleUser.png'), text: item.userName });
          }
          if (lockNames) {
            subRows.push({ icon: cdn('littleLock.png'), text: lockNames });
          }
          return (
            <View key={item.id} onClick={() => openMenu(item)}>
              <MethodItem icon={cdn(icon)} title={item.unlockName || ''} subRows={subRows} />
            </View>
          );
        })}
      </ScrollView>
      {node}
    </>
  );
}

export default UnlockMethodList;
