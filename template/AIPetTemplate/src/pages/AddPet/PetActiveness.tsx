import React, { FC } from 'react';
import { Image, Text, View, getSystemInfoSync } from '@ray-js/ray';
import clsx from 'clsx';
import { getCdnPath } from '@/utils';
import { ACTIVENESSES } from '@/constant';
import Strings from '@/i18n';
import styles from './index.module.less';

type Props = {
  petType: PetType;
  value: number | null;
  onChange: (value: number) => void;
  onBack: () => void;
};

const PetActiveness: FC<Props> = ({ petType, value, onChange, onBack }) => {
  const { screenHeight } = getSystemInfoSync();

  return (
    /** 得加个View 不然现象很诡异 */
    <View className={styles.content}>
      <View className={styles.header} style={{ marginTop: screenHeight <= 736 ? 0 : undefined }}>
        <Text className={styles.title}>{Strings.getLang('add_pet_activeness_title')}</Text>
        <Text className={styles['sub-title ']}>
          {Strings.getLang('add_pet_activeness_subTitle')}
        </Text>
      </View>
      <View key="activeness" className={styles['pet-activeness-wrapper']}>
        {ACTIVENESSES.map(({ imgCat, imgDog, text, code, styleCat, styleDog }) => {
          const isActive = value === code;
          return (
            <View
              key={code}
              className={clsx(styles.item, isActive && styles.active)}
              onClick={() => onChange(code)}
            >
              <Image src={getCdnPath('shadow.png')} className={styles.shadow} />
              <Image
                src={petType === 'cat' ? imgCat : imgDog}
                className={styles.img}
                style={petType === 'cat' ? styleCat : styleDog}
              />
              <Text className={styles.text}>{text}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PetActiveness;
