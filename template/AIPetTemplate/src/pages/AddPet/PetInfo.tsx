import React, { FC, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import {
  Image,
  Text,
  View,
  navigateBack,
  showLoading,
  hideLoading,
  setNavigationBarBack,
} from '@ray-js/ray';
import {
  ActionSheet,
  DateTimePicker,
  DialogInstance,
  Picker,
  ToastInstance,
} from '@ray-js/smart-ui';
import { imgCat, imgDog, imgCamera, imgAngleRight } from '@/res';
import { chooseCropImage, uploadImage } from '@/utils/file';

import { authorizeAlbum, authorizeCamera, errorToast, routerPush } from '@/utils';

import { MAX_BIRTH_DAY, MIN_BIRTH_DAY, WEIGHT_COLUMN_0, WEIGHT_COLUMN_1 } from '@/constant';
import { addPet, fetchPetDetail } from '@/redux/modules/petsSlice';
import { setSelectedPetId } from '@/redux/modules/globalSlice';
import store, { AppDispatch, getHomeId } from '@/redux';
import Strings from '@/i18n';
import styles from './index.module.less';

type Props = {
  petType: PetType;
  breed: string;
  sex: number;
  activeness: number;
  profile: ProfileResult;
};

const PetInfo: FC<Props> = ({ petType, breed, sex, activeness, profile }) => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState<string>(null);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<number>(MAX_BIRTH_DAY);
  const [weight, setWeight] = useState<number>(0);

  const bizUrlRef = useRef('');
  const tempBirthday = useRef<number>(birthday);
  const tempWeight = useRef(weight);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  const weights = weight.toFixed(1).split('.');

  const handleSave = async () => {
    if (name.trim() === '') {
      ToastInstance({
        context: this,
        message: Strings.getLang('pet_info_name_empty'),
      });
      return;
    }

    if (weight === 0) {
      ToastInstance({
        context: this,
        message: Strings.getLang('weight_not_zero'),
      });
      return;
    }

    try {
      showLoading({
        title: '',
        mask: true,
      });
      const petId = await (dispatch as AppDispatch)(
        addPet({
          petType,
          breedCode: breed,
          sex,
          activeness,
          name: name.trim(),
          avatar: bizUrlRef.current,
          weight: weight * 1000,
          birth: birthday,
          ownerId: getHomeId(),
          timeZone: dayjs().format('Z'),
          idPhotos: profile?.idPhotos,
          features: profile?.features,
        })
      ).unwrap();

      dispatch(fetchPetDetail({ petId, forceUpdate: true }));
      setNavigationBarBack({ type: 'system' });
      navigateBack();

      if (store.getState().global.selectedPetId === -1) {
        dispatch(setSelectedPetId(petId));
      }
    } catch (err) {
      errorToast(err);
    } finally {
      hideLoading();
    }
  };

  const handleBindProfile = () => {
    routerPush(`/addProfile?componentId=add-component-id`);
  };

  const handleAvatar = async () => {
    await Promise.all([authorizeCamera(), authorizeAlbum()]);

    const path = await chooseCropImage();
    showLoading({
      title: Strings.getLang('uploading'),
      mask: true,
    });
    try {
      const res = await uploadImage(path, 'pet', 'add-component-id');
      const { cloudKey } = res;
      bizUrlRef.current = cloudKey;
      setAvatar(path);
    } catch (error) {
      console.log('error:', error);
    } finally {
      hideLoading();
    }
  };

  const handleName = () => {
    DialogInstance.input({
      context: this,
      title: Strings.getLang('pet_info_name_placeholder'),
      value: name,
      cancelButtonText: Strings.getLang('cancel'),
      confirmButtonText: Strings.getLang('confirm'),
      maxlength: 30,
      placeholder: Strings.getLang('pet_info_name_input_placeholder'),
      beforeClose(action, value) {
        return new Promise(resolve => {
          if (action === 'confirm') {
            setName(value);
          }
          resolve(true);
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    }).catch(() => {});
  };

  const handleAge = () => {
    tempBirthday.current = birthday;
    setShowDatePicker(true);
  };

  const handleDateChange = e => {
    tempBirthday.current = e.detail;
  };

  const handleDatePickerConfirm = () => {
    setBirthday(tempBirthday.current);
    setShowDatePicker(false);
  };

  const handleWeight = () => {
    tempBirthday.current = weight;
    setShowWeightPicker(true);
  };

  const handleWeightChange = e => {
    tempWeight.current = Number(e.detail.value.join(''));
  };

  const handleWeightPickerConfirm = () => {
    setWeight(tempWeight.current);
    setShowWeightPicker(false);
  };

  return (
    <View className={styles['info-wrapper']}>
      <View className={styles['info-content']}>
        <View
          className={styles['avatar-wrapper']}
          hoverClassName="touchable"
          onClick={handleAvatar}
        >
          <Image src={avatar ?? (petType === 'cat' ? imgCat : imgDog)} className={styles.img} />
          <Image src={imgCamera} className={styles.camera} />
        </View>
        <View className={styles.row} hoverClassName="touchable" onClick={handleName}>
          <Text className={styles.label}>{Strings.getLang('pet_info_name')}</Text>
          <Text className={styles.value}>{name}</Text>
          <Image src={imgAngleRight} className={styles.arrow} />
        </View>
        <View className={styles.row} hoverClassName="touchable" onClick={handleAge}>
          <Text className={styles.label}>{Strings.getLang('pet_info_birthday')}</Text>
          <Text className={styles.value}>{dayjs(birthday).format('YYYY-MM-DD')}</Text>
          <Image src={imgAngleRight} className={styles.arrow} />
        </View>
        <View className={styles.row} hoverClassName="touchable" onClick={handleWeight}>
          <Text className={styles.label}>{Strings.getLang('pet_info_weight')}</Text>
          <Text className={styles.value}>
            {weight}
            {Strings.getLang('kg')}
          </Text>
          <Image src={imgAngleRight} className={styles.arrow} />
        </View>
        <View className={styles.item} hoverClassName="touchable" onClick={handleBindProfile}>
          <Text className={styles.label}>{Strings.getLang('pet_info_facial_collect')}</Text>
          <Text className={styles.label} style={{ textAlign: 'right', marginRight: 0 }}>
            {profile
              ? Strings.getLang('pet_info_collected')
              : Strings.getLang('pet_info_not_collected')}
          </Text>
          <Image src={imgAngleRight} className={styles.arrow} style={{ marginLeft: '16rpx' }} />
        </View>
      </View>
      <View className={styles['save-btn']} hoverClassName="touchable" onClick={handleSave}>
        <Text className={styles.text}>{Strings.getLang('save')}</Text>
      </View>

      <ActionSheet
        show={showDatePicker}
        title={Strings.getLang('pet_info_birthday_placeholder')}
        cancelText={Strings.getLang('cancel')}
        confirmText={Strings.getLang('confirm')}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        onConfirm={handleDatePickerConfirm}
      >
        <DateTimePicker
          key={String(showDatePicker)}
          showToolbar={false}
          type="date"
          minDate={MIN_BIRTH_DAY}
          maxDate={MAX_BIRTH_DAY}
          value={birthday}
          onInput={handleDateChange}
        />
      </ActionSheet>

      <ActionSheet
        show={showWeightPicker}
        title={Strings.getLang('pet_info_weight_placeholder')}
        cancelText={Strings.getLang('cancel')}
        confirmText={Strings.getLang('confirm')}
        onCancel={() => {
          setShowWeightPicker(false);
        }}
        onConfirm={handleWeightPickerConfirm}
      >
        <Picker
          key={String(showWeightPicker)}
          columns={[
            {
              values: WEIGHT_COLUMN_0,
              activeIndex: weights[0],
            },
            {
              values: ['.'],
            },
            {
              values: WEIGHT_COLUMN_1,
              activeIndex: weights[1],
              unit: Strings.getLang('kg'),
            },
          ]}
          onChange={handleWeightChange}
          customClass={styles['weight-picker']}
        />
      </ActionSheet>
    </View>
  );
};

export default PetInfo;
