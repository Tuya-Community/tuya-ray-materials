import React, { FC, useEffect, useState } from 'react';
import { View, Image, getSystemInfoSync } from '@ray-js/ray';
import { imgArrowLeft } from '@/res';

import PetAnalytics from '@/components/PetAnalytics';
import { emitter } from '@/utils';
import styles from './index.module.less';

type Props = {
  componentId: string;
  onBack: () => void;
  goNext?: () => void;
};

const PetProfile: FC<Props> = ({ componentId, onBack, goNext }) => {
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

  return (
    <View className={styles['pet-profile-wrapper']}>
      {showBack && (
        <Image
          src={imgArrowLeft}
          className={styles.back}
          onClick={onBack}
          style={{ marginTop: screenHeight <= 736 ? 0 : undefined }}
        />
      )}
      <PetAnalytics componentId={componentId} goNext={goNext} />
    </View>
  );
};

export default PetProfile;
