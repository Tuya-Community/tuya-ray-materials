/*
 * @Author: hkc
 * @Date: 2025-09-17 19:24:52
 * @LastEditors: hkc
 * @LastEditTime: 2026-04-29 11:54:20
 * @Description: 我的页面
 */
import React, { useEffect, useMemo, useState } from 'react';
import { View, router, ScrollView, Switch, getStorageSync, setStorageSync } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';

import { useSelector } from '@/redux';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';
import { getDomClientRect, getDomRectTop } from '@/utils/dom';
import Strings from '@/i18n';
import { CUSTOM_APPS, PUBLIC_APPS } from '@/constant';
import { selectAppInfo } from '@/redux/modules/appInfoSlice';
import { atopGetUserPreference, atopUpdateUserPreference } from '@/api/common';
import BenefitSwiper from '../BenefitSwiper';
import Statistic from '../Statistic';

import styles from './index.module.less';

const WIDGET_DOT_STORAGE_KEY = 'widget_new_dot_seen';

type CardItem = {
  title: string;
  subtitle?: string;
  eventKey: string;
} & (
  | { type: 'navigate'; path?: string; subpackage?: string }
  | { type: 'switch'; checked: boolean; onChange: (event: any) => void }
);

const Index = () => {
  const { appId } = useSelector(selectAppInfo);
  const { useWindowHeight } = useSelector(state => state.systemInfo);
  const [scrollHeight, setScrollHeight] = useState(useWindowHeight);
  const [bottomAreaHeight, setBottomAreaHeight] = useState(0);
  const switchConfig = useSelector(state => state.uiState.switchConfig);
  const [transcribeOptimize, setTranscribeOptimize] = useState(false);

  const { run: runGetPreference } = useRequest(atopGetUserPreference, {
    manual: true,
    onSuccess: data => {
      setTranscribeOptimize(data?.transcribeOptimizeEnabled ?? false);
    },
  });

  const { run: runUpdatePreference } = useRequest(atopUpdateUserPreference, {
    manual: true,
  });

  const handleTranscribeOptimizeChange = event => {
    const enabled = event.detail.value;
    setTranscribeOptimize(enabled);
    runUpdatePreference(JSON.stringify({ transcribeOptimizeEnabled: enabled }));
  };

  // 小组件红点：默认显示，点击一次后消失；本地存储，卸载重装后会再出现，升级继承
  const [widgetDotSeen, setWidgetDotSeen] = useState(() => {
    try {
      const stored: any = getStorageSync({ key: WIDGET_DOT_STORAGE_KEY });
      if (stored === 'true') return true;
      if (stored?.data === 'true') return true;
      return false;
    } catch {
      return false;
    }
  });
  const cardList = useMemo(() => {
    const data: CardItem[] = [
      {
        title: Strings.getLang('title_transcription_records'),
        path: '/records',
        subpackage: 'pkgSettings',
        eventKey: 'transcript_records',
        type: 'navigate',
      },
      {
        title: Strings.getLang('transcribe_optimize'),
        subtitle: Strings.getLang('transcribe_optimize_desc'),
        eventKey: 'transcribe_optimize',
        type: 'switch',
        checked: transcribeOptimize,
        onChange: handleTranscribeOptimizeChange,
      },
      {
        title: Strings.getLang('custom_template_my'),
        path: '/customTemplate/manage',
        subpackage: 'pkgTemplate',
        eventKey: 'my_templates',
        type: 'navigate',
      },
      {
        title: Strings.getLang('cloud_sync'),
        path: '/cloud',
        subpackage: 'pkgSettings',
        eventKey: 'cloud_sync',
        type: 'navigate',
      },
      {
        title: Strings.getLang('aiNote_web_version'),
        path: '/webVersion',
        subpackage: 'pkgSettings',
        eventKey: 'web_version',
        type: 'navigate',
      },
      {
        title: Strings.getLang('widget'),
        eventKey: 'widget',
        path: '/widget',
        subpackage: 'pkgSettings',
        type: 'navigate',
      },
    ];

    // 转写优化开关未开启时隐藏对应入口
    const filtered = switchConfig?.transcribeOptimizeEnabled
      ? data
      : data.filter(item => item.eventKey !== 'transcribe_optimize');

    // 根据 OEM 开关配置过滤入口
    const oemFiltered = filtered.filter(item => {
      if (item.eventKey === 'web_version' && switchConfig?.webEntry === false) return false;
      return true;
    });

    // 只有公版需要展示，为了测试方便先放开 TO DO:
    if (!PUBLIC_APPS.includes(appId)) {
      return oemFiltered.filter(item => item.eventKey !== 'web_version');
    }

    if (CUSTOM_APPS.includes(appId)) {
      return oemFiltered.filter(item => item.eventKey === 'transcript_records');
    }
    return oemFiltered;
  }, [transcribeOptimize, switchConfig]);

  // 获取scrollView高度
  const getScrollHeight = async () => {
    const rectTop = await getDomRectTop('mine-scroll-view');
    const controlBarRect = await getDomClientRect('home-control-bar');
    setScrollHeight(useWindowHeight - rectTop);
    setBottomAreaHeight(controlBarRect.height);
  };

  useEffect(() => {
    getScrollHeight();
    runGetPreference();
  }, []);

  return (
    <View className={styles.container}>
      <ScrollView scrollY id="mine-scroll-view" style={{ height: `${scrollHeight}px` }}>
        <View className={styles.content}>
          {/* 权益展示 */}
          {!CUSTOM_APPS.includes(appId) && !!switchConfig?.benefitCard && <BenefitSwiper />}
          {/* 统计信息 */}
          <Statistic />
          {/* 我的设备、隐私政策 */}
          {cardList.map(item => (
            <View
              className={styles.card}
              key={item.eventKey}
              onClick={() => {
                if (item.type === 'switch') return;
                if (item.eventKey === 'widget') {
                  if (!widgetDotSeen) {
                    setStorageSync({ key: WIDGET_DOT_STORAGE_KEY, data: 'true' });
                    setWidgetDotSeen(true);
                  }
                }
                if (item.type === 'navigate' && item.path) {
                  if (item.subpackage) {
                    router.push(item.path, { subpackage: item.subpackage });
                    return;
                  }
                  router.push(item.path);
                }
              }}
            >
              <View className={styles.cardContent}>
                <View className={styles.cardTitle}>{item.title}</View>
                {item.subtitle && <View className={styles.cardDesc}>{item.subtitle}</View>}
              </View>

              {item.type === 'switch' ? (
                <Switch checked={item.checked} onChange={item.onChange} />
              ) : item.eventKey === 'widget' && !widgetDotSeen ? (
                <View className={styles.widgetBadge}>
                  <View className={styles.newTag}>{Strings.getLang('new')}</View>
                  <View className={styles.redDot} />
                  <Icon
                    name={rightIcon}
                    size={16}
                    color="var(--color-arrow)"
                    className={styles.iconRight}
                  />
                </View>
              ) : (
                <Icon name={rightIcon} size={16} color="var(--color-arrow)" />
              )}
            </View>
          ))}
        </View>
        <View style={{ height: `${bottomAreaHeight}px` }} />
      </ScrollView>
    </View>
  );
};

export default Index;
