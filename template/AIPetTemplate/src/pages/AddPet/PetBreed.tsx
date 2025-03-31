import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Image, Text, View, getSystemInfoSync } from '@ray-js/ray';
import * as icons from '@tuya-miniapp/icons';
import { Cell, IndexBar, IndexAnchor, Icon } from '@ray-js/smart-ui';

import { imgArrowLeft } from '@/res';
import Strings from '@/i18n';
import { selectPetBreed } from '@/redux/modules/petBreedSlice';
import { THEME_COLOR } from '@/constant';
import styles from './index.module.less';

type Props = {
  petType: PetType;
  value: string | null;
  onChange: (value: string) => void;
  onBack: () => void;
};

const PetBreed: FC<Props> = ({ petType, value, onBack, onChange }) => {
  const statusBarHeight = useMemo(() => getSystemInfoSync().statusBarHeight, []);

  const petBreed = useSelector(selectPetBreed(petType));
  const petBreedIndexList = useMemo(() => {
    return Object.keys(petBreed);
  }, [petBreed]);

  return (
    <View style={{ paddingBottom: '320rpx' }}>
      <View
        className={styles.mask}
        style={{
          height: `${statusBarHeight + 24}px`,
        }}
      />
      <View className={styles.header}>
        <Image src={imgArrowLeft} className={styles.back} onClick={onBack} />
        <Text className={styles.title}>{Strings.getLang('add_pet_breed_title')}</Text>
      </View>
      <View className={styles['index-bar-wrapper']}>
        <IndexBar indexList={petBreedIndexList} stickyOffsetTop={statusBarHeight + 24}>
          {petBreedIndexList.map(item => (
            <View key={item}>
              <IndexAnchor index={item} useSlot>
                {item}
              </IndexAnchor>
              {petBreed[item].map(({ name, breedCode }) => (
                <Cell key={breedCode} title={name} onClick={() => onChange(breedCode)}>
                  {breedCode === value && (
                    <Icon name={icons.Checkmark} color={THEME_COLOR} size="40rpx" />
                  )}
                </Cell>
              ))}
            </View>
          ))}
        </IndexBar>
      </View>
    </View>
  );
};

export default PetBreed;
