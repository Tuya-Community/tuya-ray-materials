import React, { FC } from 'react';
import { Image, Text, View } from '@ray-js/ray';
import clsx from 'clsx';

import Strings from '@/i18n';
import { getCdnPath } from '@/utils';
import styles from './index.module.less';

type Props = {
  value: PetType | null;
  onChange: (value: PetType) => void;
};

const PetType: FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <View className={styles.header}>
        <Text className={styles.title}>{Strings.getLang('add_pet_type_title')}</Text>
        <Text className={styles['sub-title']}>{Strings.getLang('add_pet_type_subTitle')}</Text>
      </View>
      <View className={styles['pet-type-wrapper']}>
        <View
          className={clsx(styles.item, value === 'dog' && styles.active)}
          onClick={() => onChange('dog')}
        >
          <Image src={getCdnPath('shadow.png')} className={styles.shadow} />

          <View className={styles['item-wrapper']}>
            <Text className={styles.title}>{Strings.getLang('dog')}</Text>
            <Image src={getCdnPath('dog.png')} className={styles.img} />
          </View>
        </View>
        <View
          className={clsx(styles.item, value === 'cat' && styles.active)}
          onClick={() => onChange('cat')}
        >
          <Image src={getCdnPath('shadow.png')} className={styles.shadow} />

          <View className={styles['item-wrapper']}>
            <Text className={styles.title}>{Strings.getLang('cat')}</Text>
            <Image src={getCdnPath('cat.png')} className={styles.img} />
          </View>
        </View>
      </View>
    </>
  );
};

export default PetType;
