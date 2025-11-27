import React, { FC, useEffect, useState } from 'react';
import { View, getSystemInfoSync, ai } from '@ray-js/ray';

import PetAnalytics from '@/components/PetAnalytics';
import { emitter } from '@/utils';
import styles from './index.module.less';

const { petsDetectCreate, petsDetectDestory } = ai;

type Props = {
  petType: PetType;
  onBack: () => void;
  goNext?: () => void;
};

const PetProfile: FC<Props> = ({ petType, onBack, goNext }) => {
  const { screenHeight } = getSystemInfoSync();
  const [showBack, setShowBack] = useState<boolean>(true);

  useEffect(() => {
    const handleChangeShowBack = (value: boolean) => {
      setShowBack(value);
    };

    emitter.on('changeShowBack', handleChangeShowBack);

    return () => {
      emitter.off('changeShowBack', handleChangeShowBack);
    };
  }, []);

  useEffect(() => {
    petsDetectCreate();
    return () => {
      petsDetectDestory();
    };
  }, []);

  return (
    <View className={styles['pet-profile-wrapper']}>
      <PetAnalytics petType={petType} goNext={goNext} />
    </View>
  );
};

export default PetProfile;
