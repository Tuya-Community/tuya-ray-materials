import React, { FC } from 'react';
import { Text, View, getSystemInfoSync } from '@ray-js/ray';
import clsx from 'clsx';
import { Icon } from '@ray-js/smart-ui';
import { SEXS } from '@/constant';
import Strings from '@/i18n';

import styles from './index.module.less';

type Props = {
  value: number | null;
  onChange: (value: number) => void;
  onBack: () => void;
};

const PetSex: FC<Props> = ({ value, onChange, onBack }) => {
  const { screenHeight } = getSystemInfoSync();

  return (
    <>
      <View className={styles.header} style={{ marginTop: screenHeight <= 736 ? 0 : undefined }}>
        <Text className={styles.title}>{Strings.getLang('add_pet_sex_title')}</Text>
        <Text className={styles['sub-title']}>{Strings.getLang('add_pet_sex_subTitle')}</Text>
      </View>
      <View key="sex" className={styles['pet-sex-wrapper']}>
        {SEXS.map(({ code, text, icon }) => {
          const isActive = code === value;
          return (
            <View
              key={code}
              className={clsx(styles.item, isActive && styles.active)}
              onClick={() => onChange(code)}
            >
              <Icon
                name={icon}
                size="88rpx"
                color={isActive ? '#3d3d3d' : 'var(--panel-font-lighter)'}
              />
              <Text className={styles.text}>{text}</Text>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default PetSex;
