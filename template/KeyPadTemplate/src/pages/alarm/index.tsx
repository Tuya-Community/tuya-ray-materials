import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  getCdnUrl,
  showLoading,
  hideLoading,
  showToast,
  router,
} from '@ray-js/ray';
import { NavBar, Icon, Image as SmartImage } from '@ray-js/smart-ui';
import { getAlarms, getAlarmUnreadCount } from '@ray-js/lock-sdk';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { getAlarmText, AlarmLogLike } from '@/utils/getAlarmText';
import { getAlarmIconPath } from '@/utils/getAlarmIcon';
import { setAlarmUnReadCount, setRecentAlarm } from '@/redux/modules/lockHomeSlice';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/** 每页拉取数量 */
const PAGE_SIZE = 50;

/** 告警记录条目（lock-sdk getAlarms 返回项，仅取本页所需字段） */
type AlarmItem = AlarmLogLike & {
  logId: string;
  time: number;
};

/** 告警分组：按 RN 实际展示效果仅区分今天和历史 */
interface AlarmSection {
  key: 'today' | 'history';
  /** 分组标题：今天 / 历史 */
  title: string;
  data: AlarmItem[];
}

/**
 * 告警记录页。
 *
 * 页面交互逻辑：
 * - 进入即 showLoading 并拉取第一页；
 * - 分页无限滚动（滚动到底部触发 loadMore，hasMore 为 false 时停止）；
 * - 每次拉取后刷新告警未读数量（回写 redux，供首页角标同步）；
 * - 仅分「今天 / 历史」两组，所有非当天记录共用一个历史标题；
 * - 空数据展示空状态；异常时 Toast 提示。
 */
export function Alarm() {
  const dispatch = useDispatch();

  const [list, setList] = useState<AlarmItem[]>([]);
  /** 是否已完成首帧拉取：未完成时不渲染空状态，避免闪现（对齐 RN startRender） */
  const [started, setStarted] = useState(false);
  /** 是否正在加载（用于底部提示 & loadMore 去重） */
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const mountedRef = useRef(false);
  const loadingOverlayRef = useRef(false);

  /** 下一页页码（对齐 RN offset，改为页码制：getAlarms 以 page 分页） */
  const pageRef = useRef(1);
  /** 是否还有下一页（对齐 RN hasNextPage） */
  const hasMoreRef = useRef(true);
  /** 是否在请求中（对齐 RN isLoading，避免并发拉取） */
  const loadingRef = useRef(false);

  /**
   * 拉取一页告警记录。
   * @param reset 为 true 时视为首屏/刷新：重置分页并替换列表；否则追加下一页。
   */
  const fetchAlarms = useCallback(
    async (reset: boolean) => {
      if (!mountedRef.current || loadingRef.current) return;
      if (!reset && !hasMoreRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      const page = reset ? 1 : pageRef.current;
      if (reset) {
        loadingOverlayRef.current = true;
        showLoading({ title: '' });
      }

      try {
        const res = await getAlarms({ page, pageSize: PAGE_SIZE });
        if (!mountedRef.current) return;
        const nextList = (res?.list ?? []) as AlarmItem[];
        setLoadFailed(false);
        if (reset) dispatch(setRecentAlarm(nextList[0] || null));

        // 每次拉取后刷新未读数量并回写 redux（对齐 RN getAlarmCountAsync）
        getAlarmUnreadCount()
          .then(count => {
            if (mountedRef.current) dispatch(setAlarmUnReadCount(Number(count) || 0));
          })
          .catch(error => console.log('getAlarmUnreadCount failed', error));

        setList(prev => {
          const existing = reset ? [] : prev;
          const seen = new Set(existing.map(i => i.logId));
          const unique = nextList.filter(item => {
            if (seen.has(item.logId)) return false;
            seen.add(item.logId);
            return true;
          });
          return [...existing, ...unique];
        });

        hasMoreRef.current = Boolean(res?.hasMore) && nextList.length > 0;
        // 有下一页时页码前移；首屏从 1 起，故下一页为 2
        pageRef.current = hasMoreRef.current ? page + 1 : page;
      } catch (e) {
        if (!mountedRef.current) return;
        setLoadFailed(true);
        showToast({
          title: Strings.getLang('loadFailed'),
          icon: 'none',
        });
      } finally {
        loadingRef.current = false;
        if (mountedRef.current) {
          setLoading(false);
          setStarted(true);
        }
        if (reset && loadingOverlayRef.current) {
          loadingOverlayRef.current = false;
          hideLoading();
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    mountedRef.current = true;
    fetchAlarms(true);
    return () => {
      mountedRef.current = false;
      if (loadingOverlayRef.current) {
        loadingOverlayRef.current = false;
        hideLoading();
      }
    };
  }, [fetchAlarms]);

  /** 滚动到底部：加载下一页 */
  const onScrollToLower = useCallback(() => {
    fetchAlarms(false);
  }, [fetchAlarms]);

  /** 按 RN 实际展示效果聚合：仅保留“今天”和“历史”两个分组 */
  const sections: AlarmSection[] = useMemo(() => {
    const todayItems: AlarmItem[] = [];
    const historyItems: AlarmItem[] = [];
    const now = dayjs();

    list.forEach(item => {
      const target = dayjs(Number(item.time)).isSame(now, 'day') ? todayItems : historyItems;
      target.push(item);
    });

    const result: AlarmSection[] = [];
    if (todayItems.length) {
      result.push({ key: 'today', title: Strings.getLang('today'), data: todayItems });
    }
    if (historyItems.length) {
      result.push({ key: 'history', title: Strings.getLang('history'), data: historyItems });
    }
    return result;
  }, [list]);

  /** 单条告警时间文案：今天仅时分，历史含年月日（对齐 RN renderCustomItem） */
  const formatTime = (time: number) => {
    const t = dayjs(Number(time));
    const isToday = t.isSame(dayjs(), 'day');
    return isToday ? t.format('HH:mm') : t.format('YYYY-MM-DD HH:mm');
  };

  const renderItem = (item: AlarmItem) => (
    <View className={styles.item} key={item.logId}>
      <View className={styles.itemIcon}>
        {/* 按告警类型渲染对应 iconfont（对齐 RN 的 getAlarmIcon + IconFont）：
            smart-ui Icon 的 name 传入 SVG path 数据即按路径渲染并用 color 着色 */}
        <Icon name={getAlarmIconPath(item)} size="48rpx" color="#999" />
      </View>
      <View className={styles.itemBody}>
        <Text className={styles.itemTitle}>{getAlarmText(item)}</Text>
        <Text className={styles.itemTime}>{formatTime(item.time)}</Text>
      </View>
    </View>
  );

  const renderRetry = () => (
    <View className={styles.retry} onClick={() => fetchAlarms(list.length === 0)}>
      <Text style={{ color: templateConfig.themeColor }}>{Strings.getLang('retry')}</Text>
    </View>
  );

  const renderContent = () => {
    // 首屏未完成前不渲染任何内容，避免空状态闪现
    if (!started) return null;

    if (list.length === 0) {
      if (loadFailed) {
        return (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>{Strings.getLang('loadFailed')}</Text>
            {renderRetry()}
          </View>
        );
      }
      return (
        <View className={styles.empty}>
          <SmartImage
            className={styles.emptyIcon}
            src={getCdnUrl('none.png', cdnImage)}
            width="320rpx"
            height="320rpx"
          />
          <Text className={styles.emptyText}>{Strings.getLang('noAlarmRecords')}</Text>
        </View>
      );
    }

    return (
      <ScrollView
        className={styles.scroll}
        scrollY
        lowerThreshold={50}
        onScrollToLower={onScrollToLower}
      >
        <View className={styles.list}>
          {sections.map(section => (
            <View key={section.key}>
              <Text className={styles.sectionTitle}>{section.title}</Text>
              {section.data.map(renderItem)}
            </View>
          ))}
          {loading && hasMoreRef.current && <Text className={styles.footer}>...</Text>}
          {!loading && loadFailed && renderRetry()}
        </View>
      </ScrollView>
    );
  };

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        title={Strings.getLang('tabAlarm')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      {renderContent()}
    </View>
  );
}

export default Alarm;
