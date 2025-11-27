import React, { FC } from 'react';
import { View } from '@ray-js/ray';
import BgBones from '@/components/BgBones';
import TopBar from '@/components/TopBar';
import PetAnalytics from '@/components/PetAnalytics';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import Strings from '@/i18n';
import styles from './index.module.less';

type Props = {
  location: {
    query: {
      petType: PetType;
    };
  };
};

const AddProfile: FC<Props> = ({ location }) => {
  const isLight = getCachedSystemInfo()?.theme === 'light';
  const { petType } = location.query;
  return (
    <View className={styles.container}>
      {isLight && <BgBones />}
      <TopBar.Sub title={Strings.getLang('pet_info_facial_collect')} />

      <View className={styles.content}>
        <PetAnalytics petType={petType} />
      </View>
    </View>
  );
};

export default AddProfile;
