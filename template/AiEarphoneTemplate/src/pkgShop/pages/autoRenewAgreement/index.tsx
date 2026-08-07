/*
 * @Author: hkc
 * @Date: 2026-04-08
 * @Description: 自动续订服务协议
 */
import React from 'react';
import { ScrollView, Text, View } from '@ray-js/ray';

import { TopBar } from '@/components';
import { useSelector } from '@/redux';
import Strings from '@/i18n';

import styles from './index.module.less';

const AutoRenewAgreement: React.FC = () => {
  const { useWindowHeight, topBarHeight } = useSelector(state => state.systemInfo);

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('auto_renew_agreement_title')} />
      <ScrollView
        scrollY
        className={styles.scrollView}
        hideScrollbar
        style={{ height: `${useWindowHeight - topBarHeight}px` }}
      >
        <Text className={styles.sectionTitle}>
          {Strings.getLang('auto_renew_agreement_section_title')}
        </Text>
        <Text className={styles.paragraph}>{Strings.getLang('auto_renew_agreement_para_1')}</Text>
        <Text className={styles.paragraph}>{Strings.getLang('auto_renew_agreement_para_2')}</Text>
        <Text className={styles.paragraph}>{Strings.getLang('auto_renew_agreement_para_3')}</Text>
      </ScrollView>
    </View>
  );
};

export default AutoRenewAgreement;
