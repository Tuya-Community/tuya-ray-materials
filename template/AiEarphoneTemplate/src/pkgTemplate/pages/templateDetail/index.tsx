/*
 * @Author: xuzhe
 * @Date: 2025-12-05 18:00:00
 * @LastEditors: xuzhe
 * @LastEditTime: 2025-12-05 18:00:00
 * @Description: 模板详情页面
 */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, Text } from '@ray-js/ray';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import clsx from 'clsx';
import { useSelector } from '@/redux';
import { updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { atopGetSummaryTemplateListByCategory } from '@/api/common';
import { SummaryTemplateInfo } from '@/api/interface';
import { getTemplateIcon } from '@/utils/image';
import { Button } from '@ray-js/smart-ui';
import ThemedImage from '@/components/ThemedImage';
import styles from './index.module.less';

const Index = props => {
  const { selectedTemplate, selectedTemplateInfo } = useSelector(state => state.fileDetail);
  const { statusBarHeight, topBarHeight, screenHeight } = useSelector(state => state.systemInfo);
  const [template, setTemplate] = useState<string | null>(selectedTemplate);
  const [templateList, setTemplateList] = useState<SummaryTemplateInfo[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState<{
    nodeName: string;
    nodeCode: string;
  } | null>(null);
  const dispatch = useDispatch();
  const [templateInfo, setTemplateInfo] = useState(selectedTemplateInfo);
  // 从路由参数获取分类信息
  const { categoryCode, nodeName } = props?.location?.query;
  useEffect(() => {
    ty.hideMenuButton();
  }, []);
  useEffect(() => {
    setTemplate(selectedTemplate);
  }, [selectedTemplate]);

  // 加载模板列表
  const loadTemplates = useCallback(
    async (page: number, append = false) => {
      if (!categoryCode) return;
      try {
        const result = await atopGetSummaryTemplateListByCategory({
          categoryCode,
          pageNo: page,
          pageSize: 20,
        });

        if (result) {
          setCategoryInfo({
            nodeName: result.nodeName,
            nodeCode: result.nodeCode,
          });

          if (append) {
            setTemplateList(prev => [...prev, ...result.list]);
          } else {
            setTemplateList(result.list);
          }

          setHasMore(result.hasMore);
          setPageNo(result.pageNo);
        }
      } catch (error) {
        console.error('加载模板列表失败:', error);
      }
    },
    [categoryCode]
  );

  // 初始加载
  useEffect(() => {
    if (categoryCode) {
      loadTemplates(1, false);
    }
  }, [categoryCode]);

  const scrollHeight = useMemo(() => {
    const height = screenHeight - statusBarHeight - topBarHeight;
    return `calc(${height}px - env(safe-area-inset-bottom))`;
  }, [statusBarHeight, topBarHeight, screenHeight]);

  // 滚动到底部加载更多
  const handleScrollToLower = useCallback(() => {
    if (hasMore) {
      loadTemplates(pageNo + 1, true);
    }
  }, [hasMore, pageNo, loadTemplates]);

  // 选择模板
  const handleTemplateClick = (item: SummaryTemplateInfo) => {
    setTemplate(item?.id);
    setTemplateInfo(item);
  };

  // 保存模板
  const handleSave = () => {
    if (template) {
      dispatch(
        updateFileDetail({
          selectedTemplate: template,
          selectedTemplateInfo: templateInfo,
        })
      );
      // 返回前两级路由
      // @ts-ignore
      ty.navigateBack({ delta: 2 });
    }
  };

  return (
    <View className={styles.container}>
      <TopBar title={categoryInfo?.nodeName || nodeName || Strings.getLang('template_more')} />
      <ScrollView
        scrollY
        // @ts-ignore
        hideScrollbar
        style={{
          height: scrollHeight,
        }}
        onScrollToLower={handleScrollToLower}
        lowerThreshold={100}
      >
        {!templateList || templateList.length === 0 ? (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>{Strings.getLang('noData') || '暂无数据'}</Text>
          </View>
        ) : (
          <View className={styles.content}>
            <View className={styles.templateGrid}>
              {templateList.map(templateItem => (
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
                    src={getTemplateIcon(templateItem.icon)}
                    className={`${styles.img} ${
                      templateItem?.needColorAdapt ? 'img-theme-bw' : ''
                    }`}
                  />
                  <Text className={styles.name}>{templateItem.templateName}</Text>
                  <Text className={styles.desc}>{templateItem.templateDesc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View className={styles.buttonWrapper} onClick={handleSave}>
        <Button customClass={styles.button} disabled={!template}>
          {Strings.getLang('use_this_template')}
        </Button>
      </View>
    </View>
  );
};

export default Index;
