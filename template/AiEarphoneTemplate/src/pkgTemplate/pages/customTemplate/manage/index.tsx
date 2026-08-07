import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, router, usePageEvent } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { TopBar } from '@/components';
import ThemedImage from '@/components/ThemedImage';
import { Icon } from '@ray-js/icons';
import Strings from '@/i18n';
import { useSelector, AppDispatch } from '@/redux';
import { useDispatch } from 'react-redux';
import { fetchCustomTemplates, selectCustomTemplates } from '@/redux/modules/customTemplateSlice';
import { getTemplateIcon } from '@/utils/image';
import Res from '@/res';

import styles from './index.module.less';

const Index = () => {
  const { statusBarHeight, topBarHeight, screenHeight } = useSelector(state => state.systemInfo);
  const { list, maxCount, loading } = useSelector(selectCustomTemplates);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    ty.hideMenuButton();
    dispatch(fetchCustomTemplates());
  }, []);

  usePageEvent('onShow', () => {
    dispatch(fetchCustomTemplates());
  });

  const scrollHeight = useMemo(() => {
    const height = screenHeight - statusBarHeight - topBarHeight;
    return `calc(${height}px - env(safe-area-inset-bottom))`;
  }, [statusBarHeight, topBarHeight, screenHeight]);

  const canCreate = list.length < maxCount;
  const countText = `${list.length}/${maxCount}`;

  const handleEdit = (id: string) => {
    router.push(`/customTemplate/create?id=${encodeURIComponent(id)}`, { subpackage: 'pkgTemplate' });
  };

  const renderEmpty = () => (
    <View className={styles.empty}>
      <Text className={styles.emptyText}>{Strings.getLang('custom_template_empty_mine')}</Text>
    </View>
  );

  const renderList = () => (
    <View className={styles.list}>
      <View className={styles.topTip}>
        <Text className={styles.topTipText}>{Strings.getLang('custom_template_created')}</Text>
        <Text className={styles.topTipCount}>{countText}</Text>
      </View>
      {list.map(item => (
        <View
          key={item.templateId}
          className={styles.listItem}
          onClick={() => handleEdit(item.templateId)}
        >
          <View className={styles.itemLeft}>
            <ThemedImage
              src={getTemplateIcon(item.icon) || Res.modeLiveRecordIcon}
              className={`${styles.itemIcon} ${item.needColorAdapt ? 'img-theme-bw' : ''}`}
            />
            <View className={styles.itemInfo}>
              <Text className={styles.itemName}>{item.templateName}</Text>
              <Text className={styles.itemPrompt}>{item.templateDesc ?? ''}</Text>
            </View>
          </View>
          <View className={styles.chevron}>
            <Icon type="icon-right" size={16} color="var(--color-arrow)" />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('custom_template_my')} />
      <ScrollView scrollY style={{ height: scrollHeight }}>
        {list.length === 0 ? (loading ? null : renderEmpty()) : renderList()}
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button
          customClass={styles.createBtn}
          disabled={!canCreate}
          onClick={() => router.push('/customTemplate/create', { subpackage: 'pkgTemplate' })}
        >
          {Strings.getLang('custom_template_create')}
        </Button>
      </View>
    </View>
  );
};

export default Index;
