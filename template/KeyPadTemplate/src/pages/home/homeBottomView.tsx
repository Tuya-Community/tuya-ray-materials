import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, getCdnUrl, getNetworkType } from '@ray-js/ray';
import { Image as SmartImage } from '@ray-js/smart-ui';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { getAlarmText } from '@/utils/getAlarmText';
import useUserPermission from '@/hooks/useUserPermission';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import {
  selectRecentAlarm,
  selectAlarmUnReadCount,
  selectHasBindLockList,
} from '@/redux/modules/lockHomeSlice';
import { templateConfig } from '@/config';
import { openHomeEntry, HomeEntry } from '@/utils/homeEntry';
import styles from './index.module.less';

/** 功能按钮图标着色 */
const ICON_COLOR = '#333333';

/** 底部功能按钮定义 */
interface BottomAction {
  key: string;
  /** CDN 图标名 */
  icon: string;
  /** 对应二级页路由 id（页面建成后接入跳转） */
  routeId: HomeEntry;
  /** 是否展示 */
  show: boolean;
}

/**
 * 告警提示卡片：展示最近一条告警文案与时间，右上角未读数量角标，点击进入告警页。
 */
function AlarmTipView() {
  const recentAlarm = useSelectorWithEquality(selectRecentAlarm);
  const alarmUnReadCount = useSelectorWithEquality(selectAlarmUnReadCount);
  const { themeColor } = templateConfig;

  const recentRecord = useMemo(() => {
    if (!recentAlarm || Object.keys(recentAlarm).length === 0) {
      return Strings.getLang('noAlarmRecords');
    }
    const alarmText = getAlarmText(recentAlarm as any);
    const time = Number((recentAlarm as any).time);
    if (!time) return alarmText;
    const t = dayjs(time);
    const isToday = t.isSame(dayjs(), 'day');
    const timeText = isToday ? t.format('HH:mm') : t.format('YYYY-MM-DD HH:mm');
    return `${alarmText} ${timeText}`;
  }, [recentAlarm]);

  const badgeText = alarmUnReadCount > 99 ? '99+' : String(alarmUnReadCount);

  // 告警页迁移后在统一入口配置路由。
  const goToAlarmPage = () => {
    openHomeEntry('alarm');
  };

  return (
    <View className={styles.alarmTip} onClick={goToAlarmPage}>
      <View className={styles.alarmLeft}>
        <View className={styles.alarmIcon}>
          <SmartImage
            src={getCdnUrl('alarm.png', cdnImage)}
            width="40rpx"
            height="40rpx"
            tintColor={themeColor}
          />
        </View>
        <Text className={styles.alarmText}>{recentRecord}</Text>
      </View>
      {alarmUnReadCount > 0 && (
        <View className={styles.alarmBadge}>
          <Text className={styles.alarmBadgeText}>{badgeText}</Text>
        </View>
      )}
    </View>
  );
}

/**
 * 首页底部区：
 * - 告警提示卡片；
 * - 功能按钮栏（开关门记录 / 开锁方式 / 已绑定门锁 / 配件设置）；
 * - 首次未绑定门锁的引导气泡。
 *
 * 说明：目标二级页尚未建成，按钮点击暂为占位（不接跳转）。
 */
export function HomeBottomView() {
  // 按当前用户角色控制功能入口。
  const { isManager, isShare } = useUserPermission();

  // 已绑定门锁列表由 composeLayout 在 initFit 完成后拉取并写入 redux。
  // null 表示未拉取完成，避免气泡在数据就绪前误闪。
  const hasBindLockList = useSelectorWithEquality(selectHasBindLockList);

  // 网络状态为瞬时本地态，组件内自查：有网络时才提示绑定。
  const [net, setNet] = useState(false);

  useEffect(() => {
    let mounted = true;
    getNetworkType({
      success: ({ networkType }: { networkType: string }) => {
        if (mounted) setNet(networkType !== 'none' && networkType !== 'unknown');
      },
      fail: () => {
        if (mounted) setNet(false);
      },
    });
    return () => {
      mounted = false;
    };
  }, []);

  const actions: BottomAction[] = [
    { key: 'record', icon: 'record.png', routeId: 'records', show: true },
    {
      key: 'openMode',
      icon: 'openList.png',
      routeId: 'openMode',
      show: isManager && !isShare,
    },
    { key: 'lock', icon: 'lock.png', routeId: 'lock', show: isManager },
    { key: 'set', icon: 'set.png', routeId: 'set', show: isManager },
  ];
  const visibleActions = actions.filter(a => a.show);

  // 首次未绑定门锁的引导气泡：管理员 && 已拉取到空的门锁列表 && 有网络
  const showBubble =
    isManager && Array.isArray(hasBindLockList) && hasBindLockList.length === 0 && net;
  const [bubbleClosed, setBubbleClosed] = useState(false);

  const onActionClick = (action: BottomAction) => {
    openHomeEntry(action.routeId);
  };

  return (
    <View className={styles.bottom}>
      <AlarmTipView />
      <View className={styles.controllerBar}>
        {visibleActions.map(action => (
          <View
            key={action.key}
            className={styles.actionItem}
            onClick={() => onActionClick(action)}
          >
            <SmartImage
              src={getCdnUrl(action.icon, cdnImage)}
              width="56rpx"
              height="56rpx"
              tintColor={ICON_COLOR}
            />
            {/* 未绑定门锁引导气泡，指向「已绑定门锁」按钮。
                气泡为独立浮层，
                点击气泡本身不触发按钮跳转，仅关闭键可关闭。 */}
            {action.key === 'lock' && showBubble && !bubbleClosed && (
              <View className={styles.bubble} onClick={(e: any) => e?.stopPropagation?.()}>
                <View className={styles.bubbleBox}>
                  <Text className={styles.bubbleText}>{Strings.getLang('pleaseBindFirst')}</Text>
                  <View className={styles.bubbleCloseSlot}>
                    <View
                      className={styles.bubbleClose}
                      onClick={(e: any) => {
                        e?.stopPropagation?.();
                        setBubbleClosed(true);
                      }}
                    >
                      <SmartImage
                        src={getCdnUrl('close.png', cdnImage)}
                        width="24rpx"
                        height="24rpx"
                        tintColor="#fff"
                      />
                    </View>
                  </View>
                </View>
                <View className={styles.bubbleArrow} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

export default HomeBottomView;
