import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  getCdnUrl,
  showLoading,
  hideLoading,
  showToast,
  router,
} from '@ray-js/ray';
import { NavBar, Image as SmartImage } from '@ray-js/smart-ui';
import { getFitLogs } from '@ray-js/lock-sdk';
import type { LogData } from '@ray-js/lock-sdk';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import cdnImage from 'cdn/cdnImage.json';
import { getRecordText } from '@/utils/getRecordText';
import { templateConfig } from '@/config';
import styles from './index.module.less';

/** 每页拉取数量（对齐 RN(0000007ew6) src/containers/records.js pageSize=50） */
const PAGE_SIZE = 50;

/** 按自然日聚合后的分组（对齐 RN formateData：按自然日分组，标题区分今天/日期+星期） */
interface RecordSection {
  /** 分组自然日 yyyy-MM-dd，用于 key */
  date: string;
  /** 分组标题：今天 / `yyyy-MM-dd (周x)` */
  title: string;
  data: LogData[];
}

/**
 * 开关门记录页。
 *
 * 对齐 RN(0000007ew6) src/containers/records.js 的交互逻辑：
 * - 进入即 showLoading 并拉取第一页；
 * - 分页无限滚动（滚动到底部触发 loadMore，hasMore 为 false 时停止）；
 * - 按自然日分组，标题区分「今天 / 日期(星期)」；
 * - 空数据展示空状态；异常时 Toast 提示。
 */
export function Records() {
  const [list, setList] = useState<LogData[]>([]);
  /** 是否已完成首帧拉取：未完成时不渲染空状态，避免闪现（对齐 RN startRender） */
  const [started, setStarted] = useState(false);
  /** 是否正在加载（用于底部提示 & loadMore 去重） */
  const [loading, setLoading] = useState(false);

  const [loadFailed, setLoadFailed] = useState(false);
  const mountedRef = useRef(false);
  const loadingOverlayRef = useRef(false);

  /** 下一页页码（对齐 RN offset，改为页码制：getFitLogs 以 page 分页） */
  const pageRef = useRef(1);
  /** 是否还有下一页（对齐 RN hasNextPage） */
  const hasMoreRef = useRef(true);
  /** 是否在请求中（对齐 RN isLoading，避免并发拉取） */
  const loadingRef = useRef(false);

  /**
   * 拉取一页开关门记录。
   * @param reset 为 true 时视为首屏/刷新：重置分页并替换列表；否则追加下一页。
   */
  const fetchLogs = useCallback(async (reset: boolean) => {
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
      const res = await getFitLogs({ page, pageSize: PAGE_SIZE });
      if (!mountedRef.current) return;
      const nextList = (res?.list ?? []) as LogData[];
      setLoadFailed(false);

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
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchLogs(true);
    return () => {
      mountedRef.current = false;
      if (loadingOverlayRef.current) {
        loadingOverlayRef.current = false;
        hideLoading();
      }
    };
  }, [fetchLogs]);

  /** 滚动到底部：加载下一页 */
  const onScrollToLower = useCallback(() => {
    fetchLogs(false);
  }, [fetchLogs]);

  /** 按自然日聚合（对齐 RN formateData） */
  const sections: RecordSection[] = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const map: Record<string, RecordSection> = {};
    const result: RecordSection[] = [];
    list.forEach(item => {
      const date = dayjs(Number(item.time)).format('YYYY-MM-DD');
      if (!map[date]) {
        const week = Strings.getLang(`day${dayjs(date).day()}` as any);
        map[date] = {
          date,
          title: date === today ? Strings.getLang('today') : `${date} (${week})`,
          data: [],
        };
        result.push(map[date]);
      }
      map[date].data.push(item);
    });
    return result;
  }, [list]);

  /** 单条记录时间文案：今天仅时分，历史含年月日（对齐 RN renderCustomItem） */
  const formatTime = (time: number) => {
    const t = dayjs(Number(time));
    const isToday = t.isSame(dayjs(), 'day');
    return isToday ? t.format('HH:mm') : t.format('YYYY-MM-DD HH:mm');
  };

  const renderItem = (item: LogData) => (
    <View className={styles.item} key={item.logId}>
      {/* 对齐 RN(0000007ew6) records.js renderCustomItem：仅展示 avatarUrl，无兜底图标 */}
      <Image className={styles.itemIcon} src={item.avatarUrl} mode="scaleToFill" />
      <View className={styles.itemBody}>
        <Text className={styles.itemTitle}>{getRecordText(item)}</Text>
        {/* 关联子设备：小锁图标 + 设备名（对齐 RN relateDevName 分支，maxWidth 限宽） */}
        {item.relateDevName && (
          <View className={styles.itemSub}>
            <Image className={styles.itemSubIcon} src={getCdnUrl('littleLock.png', cdnImage)} />
            <Text className={styles.itemSubText}>{` ${item.relateDevName}`}</Text>
          </View>
        )}
        <Text className={styles.itemTime}>{formatTime(item.time)}</Text>
      </View>
    </View>
  );

  const renderRetry = () => (
    <View className={styles.retry} onClick={() => fetchLogs(list.length === 0)}>
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
          <Text className={styles.emptyText}>{Strings.getLang('noRecords')}</Text>
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
            <View key={section.date}>
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
        title={Strings.getLang('tab_records')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      {renderContent()}
    </View>
  );
}

export default Records;
