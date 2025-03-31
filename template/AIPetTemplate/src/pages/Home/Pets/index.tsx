import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Image, View, ScrollView, Text } from '@ray-js/ray';
import { Icon, Popup, Button } from '@ray-js/smart-ui';
import { fetchPets, selectAllPets } from '@/redux/modules/petsSlice';
import { fetchPetBreedList } from '@/redux/modules/petBreedSlice';
import { selectSelectedPet, setSelectedPetId } from '@/redux/modules/globalSlice';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import Strings from '@/i18n';
import { imgCat, imgDog } from '@/res';
import { iconAdd, iconChange, iconCheck, iconEdit } from '@/res/iconsvg';
import { routerPush } from '@/utils';

import styles from './index.module.less';

const Pets: FC = () => {
  const dispatch = useDispatch();
  const pets = useSelector(selectAllPets);
  const selectedPet = useSelectorWithEquality(selectSelectedPet) ?? ({} as Pet);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchPets());
    dispatch(fetchPetBreedList('cat'));
    dispatch(fetchPetBreedList('dog'));
  }, []);

  const handleClickChange = () => {
    // 弹框更改宠物
    setVisible(true);
  };

  const handleClickAdd = () => {
    routerPush('/addPet');
  };

  const handleAdd = () => {
    setVisible(false);
    routerPush('/addPet');
  };

  const handleSelect = (id: number) => {
    setVisible(false);
    dispatch(setSelectedPetId(id));
  };

  const handleEdit = (id: number) => {
    setVisible(false);
    routerPush(`/pet?petId=${id}`);
  };

  const renderPetAvatar = () => {
    const avatarUrl =
      selectedPet?.avatarDisplay || (selectedPet?.petType === 'cat' ? imgCat : imgDog);
    return (
      <View className={styles['avatar-wrapper']} onClick={handleClickChange}>
        <View className={styles['avatar-view']}>
          <Image src={avatarUrl} className={styles['pet-img']} />
        </View>
        <View className={styles.change}>
          <Icon name={iconChange} size="16rpx" color="#FFB53E" />
        </View>
      </View>
    );
  };

  const renderAdd = () => {
    return (
      <View className={styles['avatar-wrapper']} onClick={handleClickAdd}>
        <View className={clsx(styles['avatar-view'], styles.empty)}>
          <Icon name={iconAdd} size="32rpx" color="#FFB53E" />
        </View>
        <View className={styles['add-tip']}>{Strings.getLang('add_pet')}</View>
      </View>
    );
  };

  return (
    <>
      {selectedPet?.id ? renderPetAvatar() : renderAdd()}
      <Popup
        show={visible}
        closeable
        round
        position="bottom"
        customStyle={{ background: '#F8F8F8', maxHeight: '80vh' }}
        onClose={() => setVisible(false)}
        className={styles.activityPop}
        safeAreaInsetBottom={false}
        lockScroll={false}
      >
        <View className={styles.main}>
          <View className={styles['pop-head']}>{Strings.getLang('dsc_pet_select')}</View>
          <View className={styles.petList}>
            <ScrollView scrollY className={styles['pet-scroll']}>
              {pets.map((pet, index) => {
                const { avatarDisplay, petType, id } = pet;
                return (
                  <View
                    className={`${styles['pet-item']} ${
                      pet.id === selectedPet?.id ? styles['pet-active'] : ''
                    }`}
                    key={pet.id}
                  >
                    <View className={styles['pet-info']} onClick={() => handleEdit(id)}>
                      <Image
                        src={avatarDisplay || (petType === 'cat' ? imgCat : imgDog)}
                        className={styles['pet-avatar']}
                        mode="aspectFill"
                      />
                      <Text className={styles['pet-name']}>{pet.name}</Text>
                      <Icon name={iconEdit} size={12} color="#3d3d3d" />
                    </View>
                    <View className={styles['pet-check']} onClick={() => handleSelect(id)}>
                      {pet.id === selectedPet?.id && (
                        <Icon name={iconCheck} size={12} color="#3d3d3d" />
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <Button
              color="#ffffff"
              block
              round
              size="large"
              className={styles['add-btn']}
              onClick={handleAdd}
            >
              <View className={styles['add-btn-inner']}>
                <View className={styles['add-icon']} />
                <Text className={styles['add-text']}>{Strings.getLang('add_pet')}</Text>
              </View>
            </Button>
          </View>
        </View>
      </Popup>
    </>
  );
};

export default Pets;
