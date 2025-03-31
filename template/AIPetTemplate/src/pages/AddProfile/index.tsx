import React from 'react';
import { View } from '@ray-js/ray';
import BgBones from '@/components/BgBones';
import TopBar from '@/components/TopBar';
import PetAnalytics from '@/components/PetAnalytics';

import Strings from '@/i18n';
import styles from './index.module.less';

const AddProfile = ({ location }) => {
  return (
    <View className={styles.container}>
      <BgBones />
      <TopBar.Sub title={Strings.getLang('pet_info_facial_collect')} />

      <View className={styles.content}>
        <PetAnalytics componentId={location?.query.componentId} />
      </View>
    </View>
  );
};

export default AddProfile;
