import React from 'react';
import { Image, View } from '@ray-js/ray';
import { imgCycle, imgFish, imgCatBody, imgCatEyeBg, imgCatEye } from '@/res';

import styles from './index.module.less';

interface Props {
  className?: string;
  size?: 'small';
}

export default function CatLoading({ className, size }: Props) {
  return (
    <View className={`${styles.wrap} ${className || ''} ${size ? styles.small : ''}`}>
      <View className={`${styles.loading} ${styles.enter}`}>
        <View className={styles.cycle}>
          <Image src={imgCycle} className={styles['cycle-img']} />
          <Image src={imgFish} className={styles['fish-img']} />
        </View>

        <View className={styles.cat}>
          <View className={styles.bg}>
            <View className={styles.body}>
              <Image className={styles['body-img']} src={imgCatBody} />
              <View className={styles['eye-main']}>
                <Image className={styles['eye-bg-img']} src={imgCatEyeBg} />
                <Image className={styles['eye-img']} src={imgCatEye} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
