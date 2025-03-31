import React, { FC, useMemo } from 'react';
import { View, getSystemInfoSync, navigateBack } from '@ray-js/ray';
import TopBar from '@/components/TopBar';
import * as icons from '@tuya-miniapp/icons';
import { Cell, Icon, IndexAnchor, IndexBar } from '@ray-js/smart-ui';
import { useSelector } from 'react-redux';
import { selectPetBreed } from '@/redux/modules/petBreedSlice';
import Strings from '@/i18n';
import { THEME_COLOR } from '@/constant';
import { emitter } from '@/utils';
import styles from './index.module.less';

type Props = {
  location: {
    query: {
      petType: PetType;
      value: string;
    };
  };
};

const SelectPetBreed: FC<Props> = ({ location }) => {
  const { petType, value } = location.query;
  const statusBarHeight = useMemo(() => getSystemInfoSync().statusBarHeight, []);

  const petBreeds = useSelector(selectPetBreed(petType));
  const petBreedIndexList = useMemo(() => {
    return Object.keys(petBreeds);
  }, [petBreeds]);

  const handleChange = (breedCode: string, breedName: string) => {
    emitter.emit('selectPetBreed', {
      breedCode,
      breedName,
    });
    navigateBack();
  };

  return (
    <View className={styles.container}>
      <TopBar.Sub title={Strings.getLang('select_pet_breed_title')} />

      <View className={styles['index-bar-wrapper']}>
        <View
          className={styles.mask}
          style={{
            height: `${statusBarHeight + 24}px`,
          }}
        />
        <IndexBar indexList={petBreedIndexList} stickyOffsetTop={statusBarHeight + 24}>
          {petBreedIndexList.map(item => (
            <View key={item}>
              <IndexAnchor index={item} useSlot>
                {item}
              </IndexAnchor>
              {petBreeds[item].map(({ name, breedCode }) => (
                <Cell key={breedCode} title={name} onClick={() => handleChange(breedCode, name)}>
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

export default SelectPetBreed;
