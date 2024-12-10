import { View, Text } from '@ray-js/components';
import React, { FC, useEffect } from 'react';
import Strings from '@/i18n';
import { setPageNavigationBar } from '@/utils';
import { useSelector } from 'react-redux';
import { selectThemeByKey } from '@/redux/modules/themeSlice';
import styles from './index.module.less';

const guideList = new Array(3).fill(0);

const Guide: FC = () => {
  const themeType = useSelector(selectThemeByKey('type'));

  useEffect(() => {
    ty.hideMenuButton();
    setPageNavigationBar(Strings.getLang('guidePageTitle'), themeType);
  }, []);

  const renderTitle = () => {
    return (
      <View className={styles['operation-guide-title']}>
        {Strings.getLang('operationGuideTitle')}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <>
        <View className={styles['operation-guide-tips']}>
          {Strings.getLang('operationGuideTips')}
        </View>

        {guideList.map((d, i) => (
          <View key={i} className={styles['operation-guide-way-container']}>
            <Text className={styles['operation-guide-way-label']}>
              {Strings.getLang(`operationGuideWay${i + 1}`)}
            </Text>
            <Text className={styles['operation-guide-way']}>
              {Strings.getLang(`operationGuideWay${i + 1}Intro`)}
            </Text>
          </View>
        ))}
      </>
    );
  };

  return (
    <View className={styles.container}>
      {renderTitle()}
      {renderContent()}
    </View>
  );
};

export default Guide;
