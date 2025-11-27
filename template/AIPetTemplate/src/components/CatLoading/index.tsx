import React from 'react';
import { Image, View } from '@ray-js/ray';
import { getCdnPath } from '@/utils';
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
          <Image src={getCdnPath('cycle.png')} className={styles['cycle-img']} />
          <Image src={getCdnPath('fish.png')} className={styles['fish-img']} />
        </View>

        <View className={styles.cat}>
          <View className={styles.bg}>
            <View className={styles.body}>
              <Image className={styles['body-img']} src={getCdnPath('catBody.png')} />
              <View className={styles['eye-main']}>
                <Image className={styles['eye-bg-img']} src={getCdnPath('catEyeBg.png')} />
                <Image className={styles['eye-img']} src={getCdnPath('catEye.png')} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
