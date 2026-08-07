/*
 * @Author: hkc
 * @Date: 2025-07-18 18:57:17
 * @LastEditors: hkc
 * @LastEditTime: 2025-10-14 20:07:30
 * @Description: 更多模板（模板推荐 / 我的模板）
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, router, Text, usePageEvent } from '@ray-js/ray';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import clsx from 'clsx';
import { useRequest } from 'ahooks';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';
import { Icon, Button } from '@ray-js/smart-ui';
import { getTemplateIcon } from '@/utils/image';
import { useSelector } from '@/redux';
import { updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { fetchCustomTemplates, selectCustomTemplates } from '@/redux/modules/customTemplateSlice';
import { atopGetSummaryTemplateRecommendList } from '@/api/common';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';

import { CustomTemplateItem, SummaryTemplateInfo } from '@/api/interface';
import styles from './index.module.less';

type MainTabKey = 'recommend' | 'mine';

const Index = (props: { location?: { query?: { tab?: MainTabKey } } }) => {
  const { selectedTemplate, selectedTemplateInfo } = useSelector(state => state.fileDetail);
  const { statusBarHeight, topBarHeight, screenHeight } = useSelector(state => state.systemInfo);
  const { list: customList, maxCount } = useSelector(selectCustomTemplates);
  const [template, setTemplate] = useState(selectedTemplate);
  const [templateInfo, setTemplateInfo] = useState(selectedTemplateInfo);
  const defaultTab = props?.location?.query?.tab || 'recommend';
  const [mainTab, setMainTab] = useState<MainTabKey>(defaultTab);
  const dispatch = useDispatch();
  const fetchRef = useRef<ReturnType<typeof dispatch> & { abort?: () => void }>();

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  useEffect(() => {
    if (mainTab === 'mine') {
      fetchRef.current?.abort?.();
      fetchRef.current = dispatch(fetchCustomTemplates());
    }
    return () => {
      fetchRef.current?.abort?.();
    };
  }, [mainTab, dispatch]);

  const { data: templateList } = useRequest(atopGetSummaryTemplateRecommendList);

  usePageEvent('onShow', () => {
    if (mainTab === 'mine') {
      fetchRef.current?.abort?.();
      fetchRef.current = dispatch(fetchCustomTemplates());
    }
  });

  const scrollHeight = useMemo(() => {
    const height = screenHeight - statusBarHeight - topBarHeight - 60;
    return `calc(${height}px - env(safe-area-inset-bottom))`;
  }, [statusBarHeight, topBarHeight, screenHeight]);

  const toSummaryInfo = (item: CustomTemplateItem): SummaryTemplateInfo => ({
    id: item.templateId,
    icon: item.icon || '',
    templateName: item.templateName,
    templateDesc: item.templateDesc ?? '',
    sort: item.sort ?? 0,
    customize: item.customize,
    needColorAdapt: item.needColorAdapt,
    templateCode: item.templateCode,
    prompt: item.prompt,
  });

  const handleTemplateClick = (item: SummaryTemplateInfo) => {
    setTemplate(item?.id);
    setTemplateInfo(item);
  };

  const handleSave = () => {
    dispatch(
      updateFileDetail({
        selectedTemplate: template,
        selectedTemplateInfo: templateInfo,
      })
    );
    router.back();
  };

  useEffect(() => {
    setTemplate(selectedTemplate);
  }, [selectedTemplate]);
  // 如果模板不在自定义模板列表和推荐模板列表中，则设置为推荐模板列表的第一个模板
  useEffect(() => {
    if (!template || !templateList) return;
    const inCustom = customList.some(item => item.templateId === template);
    const inRecommend = templateList.some(cat => cat.templates?.some(t => t.id === template));
    if (!inCustom && !inRecommend) {
      const firstRecommend = templateList.find(cat => cat.nodeCode === 'recommend')?.templates?.[0];
      if (firstRecommend) {
        setTemplate(firstRecommend.id);
        setTemplateInfo(firstRecommend);
      } else {
        setTemplate(null);
        setTemplateInfo(null);
      }
    }
  }, [customList, templateList, template]);

  const handleCategoryMore = (nodeCode: string, nodeName: string) => {
    router.push(
      `/detail/templateDetail?categoryCode=${nodeCode}&nodeName=${encodeURIComponent(nodeName)}`,
      { subpackage: 'pkgTemplate' }
    );
  };

  const createDisabled = customList.length >= maxCount;
  const showManage = mainTab === 'mine';

  // ============ 模板推荐 Tab ============
  const renderRecommend = () => {
    if (!templateList || templateList.length === 0) {
      return (
        <View className={styles.empty}>
          <Text className={styles.emptyText}>{Strings.getLang('noData') || '暂无数据'}</Text>
        </View>
      );
    }
    return (
      <View className={styles.content}>
        {templateList?.map((category, categoryIndex) => (
          <View key={category.nodeCode || categoryIndex} className={styles.categorySection}>
            <View className={styles.categoryHeader}>
              <Text className={styles.categoryTitle}>{category.nodeName}</Text>
              {category.nodeCode !== 'recommend' && category.templates.length > 4 && (
                <View
                  className={styles.moreLink}
                  onClick={() => handleCategoryMore(category.nodeCode, category.nodeName)}
                >
                  <Text className={styles.moreText}>{Strings.getLang('more') || 'More'}</Text>
                  <Icon name={rightIcon} size={16} color="var(--color-text-tertiary)" />
                </View>
              )}
            </View>
            <View className={styles.templateGrid}>
              {category.templates?.slice(0, 4)?.map(templateItem => (
                <View
                  key={templateItem.id}
                  className={clsx(styles.listItem, template === templateItem.id && styles.active)}
                  onClick={() => handleTemplateClick(templateItem)}
                >
                  {templateItem.customize === true && (
                    <Text className={styles.customizeBadge}>
                      {Strings.getLang('custom_template_customize_badge')}
                    </Text>
                  )}
                  <ThemedImage
                    src={getTemplateIcon(templateItem.icon) || Res.modeLiveRecordIcon}
                    className={`${styles.img} ${templateItem.needColorAdapt ? 'img-theme-bw' : ''}`}
                  />
                  <Text className={styles.name}>{templateItem.templateName}</Text>
                  <Text className={styles.desc}>{templateItem.templateDesc}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ============ 我的模板 Tab ============
  const renderMine = () => {
    return (
      <View className={styles.content}>
        <View className={styles.templateGrid}>
          {customList.map(item => {
            const summary = toSummaryInfo(item);
            return (
              <View
                key={item.templateId}
                className={clsx(styles.listItem, template === item.templateId && styles.active)}
                onClick={() => handleTemplateClick(summary)}
              >
                <ThemedImage
                  src={getTemplateIcon(item.icon) || Res.modeLiveRecordIcon}
                  className={`${styles.img} ${item.needColorAdapt ? 'img-theme-bw' : ''}`}
                />
                <Text className={styles.name}>{item.templateName}</Text>
                <Text className={styles.desc}>{summary.templateDesc}</Text>
              </View>
            );
          })}
          <View
            className={clsx(styles.createCard, createDisabled && styles.createCardDisabled)}
            onClick={() => {
              if (createDisabled) {
                return;
              }
              router.push('/customTemplate/create', { subpackage: 'pkgTemplate' });
            }}
          >
            <View className={styles.createIcon}>
              <Text className={styles.createPlus}>+</Text>
            </View>
            <Text className={styles.createText}>{Strings.getLang('custom_template_create')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <TopBar
        title={Strings.getLang('template_more')}
        rightText={showManage ? Strings.getLang('custom_template_manage') : ''}
        rightTextClass={styles.topBarManage}
        onClickRight={() => {
          if (showManage) router.push('/customTemplate/manage', { subpackage: 'pkgTemplate' });
        }}
      />
      {/* Tab 切换栏 */}
      <View className={styles.tabRow}>
        <Text
          className={clsx(styles.tabItem, mainTab === 'recommend' && styles.tabActive)}
          onClick={() => setMainTab('recommend')}
        >
          {Strings.getLang('custom_template_tab_recommend')}
        </Text>
        <Text
          className={clsx(styles.tabItem, mainTab === 'mine' && styles.tabActive)}
          onClick={() => setMainTab('mine')}
        >
          {Strings.getLang('custom_template_tab_mine')}
        </Text>
      </View>
      <ScrollView
        scrollY
        // @ts-ignore
        hideScrollbar
        style={{ height: scrollHeight }}
      >
        {mainTab === 'recommend' ? renderRecommend() : renderMine()}
      </ScrollView>
      <View
        className={styles.buttonWrapper}
        onClick={handleSave}
        style={{ backgroundColor: 'var(--color-bg-page)' }}
      >
        <Button customClass={styles.button} disabled={!template}>
          {Strings.getLang('use_this_template')}
        </Button>
      </View>
    </View>
  );
};

export default Index;
