import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Text, View, navigateBack, router, showLoading, hideLoading } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import dayjs from 'dayjs';
import {
  ActionSheet,
  Button,
  DateTimePicker,
  Dialog,
  DialogInstance,
  Picker,
  Toast,
  ToastInstance,
} from '@ray-js/smart-ui';

import BgBones from '@/components/BgBones';
import TopBar from '@/components/TopBar';
import { imgAngleRight, imgCamera, imgCat, imgDog } from '@/res';
import Strings from '@/i18n';
import { AppDispatch, ReduxState, getHomeId } from '@/redux';
import { deletePet, selectPetById, updatePet, fetchPetDetail } from '@/redux/modules/petsSlice';
import UploadWebView from '@/components/UploadWebView';
import {
  authorizeAlbum,
  authorizeCamera,
  emitter,
  formatTimeDifference,
  routerPush,
} from '@/utils';
import { chooseCropImage, uploadImage } from '@/utils/file';
import {
  ACTIVENESSES,
  MAX_BIRTH_DAY,
  MIN_BIRTH_DAY,
  SEXS,
  WEIGHT_COLUMN_0,
  WEIGHT_COLUMN_1,
} from '@/constant';

import styles from './index.module.less';

const PetEdit: FC<{
  pet: Pet;
}> = ({ pet }) => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(
    pet.avatarDisplay || (pet.petType === 'cat' ? imgCat : imgDog)
  );
  const [name, setName] = useState(pet.name);
  const [breedCode, setBreedCode] = useState(pet.breedCode);
  const [breedName, setBreedName] = useState(pet.breedName);
  const [birthday, setBirthday] = useState<number>(pet.birth);
  const [weight, setWeight] = useState<number>(pet.weight / 1000);
  const [sex, setSex] = useState(pet.sex);
  const [activeness, setActiveness] = useState(pet.activeness);
  const [profile, setProfile] = useState<ProfileResult | null>({
    idPhotos: pet?.idPhotos,
    features: pet?.features,
  });

  const bizUrlRef = useRef(pet.avatar ?? '');
  const tempBirthday = useRef<number>(birthday);
  const tempWeight = useRef(weight);
  const [showSexActionSheet, setShowSexActionSheet] = useState(false);
  const [showActivenessActionSheet, setShowActivenessActionSheet] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  const weights = weight.toFixed(1).split('.');

  const sexLabel = useMemo(() => {
    return SEXS.find(item => item.code === sex).text;
  }, [sex]);
  const activenessLabel = useMemo(() => {
    return ACTIVENESSES.find(item => item.code === activeness).text;
  }, [activeness]);

  useEffect(() => {
    const handleSelectPetBreed = ({
      breedCode,
      breedName,
    }: {
      breedCode: string;
      breedName: string;
    }) => {
      setBreedCode(breedCode);
      setBreedName(breedName);
    };

    emitter.on('selectPetBreed', handleSelectPetBreed);

    return () => {
      emitter.off('selectPetBreed', handleSelectPetBreed);
    };
  }, []);

  useEffect(() => {
    const handleSelectProfile = (value: ProfileResult) => {
      setProfile(value);
    };

    emitter.on('selectProfile', handleSelectProfile);

    return () => {
      emitter.off('selectProfile', handleSelectProfile);
    };
  }, []);

  const handleBindProfile = () => {
    routerPush('/addProfile?componentId=edit-component-id');
  };

  const handleDelete = async () => {
    try {
      await DialogInstance.confirm({
        context: this,
        title: Strings.getLang('tips'),
        message: Strings.getLang('pet_delete_tips'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
      });

      showLoading({
        title: '',
        mask: true,
      });
      await (dispatch as AppDispatch)(deletePet(pet.id)).unwrap();
      navigateBack();
    } catch (err) {
      console.log(err);
    } finally {
      hideLoading();
    }
  };

  const handleSave = async () => {
    if (name.trim() === '') {
      ToastInstance({
        context: this,
        message: Strings.getLang('pet_info_name_empty'),
      });
      return;
    }

    try {
      showLoading({
        title: '',
        mask: true,
      });
      await (dispatch as AppDispatch)(
        updatePet({
          id: pet.id,
          petType: pet.petType,
          breedCode,
          sex,
          activeness,
          name: name.trim(),
          avatar: bizUrlRef.current,
          weight: weight * 1000,
          birth: birthday,
          rfid: pet.rfid,
          ownerId: getHomeId(),
          timeZone: dayjs().format('Z'),
          idPhotos: profile?.idPhotos,
          features: profile?.features,
        })
      ).unwrap();

      if (pet.id) {
        await (dispatch as AppDispatch)(
          fetchPetDetail({ petId: Number(pet.id), forceUpdate: true })
        ).unwrap();
      }

      navigateBack();
    } catch (err) {
      console.log(err);
    } finally {
      hideLoading();
    }
  };

  const handleAvatar = async () => {
    await Promise.all([authorizeCamera(), authorizeAlbum()]);

    const path = await chooseCropImage();
    showLoading({
      title: Strings.getLang('uploading'),
      mask: true,
    });
    try {
      const res = await uploadImage(path, 'pet', 'edit-component-id');
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
      maxlength: 30,
      cancelButtonText: Strings.getLang('cancel'),
      confirmButtonText: Strings.getLang('confirm'),
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

  const handleSex = () => {
    setShowSexActionSheet(true);
  };

  const handlePetBreed = () => {
    router.push(`/selectPetBreed?petType=${pet.petType}&value=${breedCode}`);
  };

  const handleSelectSex = e => {
    setSex(e.detail.id);
    setShowSexActionSheet(false);
  };

  const handleActiveness = () => {
    setShowActivenessActionSheet(true);
  };

  const handleSelectActiveness = e => {
    setActiveness(e.detail.id);
    setShowActivenessActionSheet(false);
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
    <View className={styles.container}>
      <BgBones />
      <TopBar.Sub title={Strings.getLang('pet_title')} />
      <View className={styles['info-wrapper']}>
        <View className={styles['info-content']}>
          <View
            className={styles['avatar-wrapper']}
            hoverClassName="touchable"
            onClick={handleAvatar}
          >
            <Image src={avatar ?? imgCat} className={styles.img} mode="aspectFill" />
            <Image src={imgCamera} className={styles.camera} />
          </View>
          <View className={styles['block-row']}>
            <View className={styles.block} hoverClassName="touchable" onClick={handleAge}>
              <View className={styles.top}>
                <Text className={styles.value}>{formatTimeDifference(birthday)}</Text>
              </View>
              <Text className={styles.label}>{Strings.getLang('pet_info_age')}</Text>
            </View>
            <View className={styles.block} hoverClassName="touchable" onClick={handleWeight}>
              <View className={styles.top}>
                <Text className={styles.value}>{weight}</Text>
                <Text className={styles.unit}>{Strings.getLang('kg')}</Text>
              </View>
              <Text className={styles.label}>{Strings.getLang('pet_info_weight')}</Text>
            </View>
            <View className={styles.block} hoverClassName="touchable" onClick={handleActiveness}>
              <View className={styles.top}>
                <Text className={styles.value}>{activenessLabel}</Text>
              </View>
              <Text className={styles.label}>{Strings.getLang('pet_info_activeness')}</Text>
            </View>
          </View>
          <View className={styles.row} hoverClassName="touchable" onClick={handleName}>
            <Text className={styles.label}>{Strings.getLang('pet_info_name')}</Text>
            <Text className={styles.value}>{name}</Text>
            <Image src={imgAngleRight} className={styles.arrow} />
          </View>
          <View className={styles.row} hoverClassName="touchable" onClick={handlePetBreed}>
            <Text className={styles.label}>{Strings.getLang('pet_info_type')}</Text>
            <Text className={styles.value}>{breedName}</Text>
            <Image src={imgAngleRight} className={styles.arrow} />
          </View>
          <View className={styles.row} hoverClassName="touchable" onClick={handleSex}>
            <Text className={styles.label}>{Strings.getLang('pet_info_sex')}</Text>
            <Text className={styles.value}>{sexLabel}</Text>
            <Image src={imgAngleRight} className={styles.arrow} />
          </View>
          <View className={styles.row} hoverClassName="touchable" onClick={handleAge}>
            <Text className={styles.label}>{Strings.getLang('pet_info_birthday')}</Text>
            <Text className={styles.value}>{dayjs(birthday).format('YYYY-MM-DD')}</Text>
            <Image src={imgAngleRight} className={styles.arrow} />
          </View>

          {pet.rfid && (
            <View className={styles.row}>
              <Text className={styles.label}>{Strings.getLang('rfid')}</Text>
              <Text className={styles.value}>{pet.rfid}</Text>
            </View>
          )}
          <View className={styles.item} hoverClassName="touchable" onClick={handleBindProfile}>
            <Text className={styles.label}>{Strings.getLang('pet_info_facial_collect')}</Text>
            <Text className={styles.label} style={{ textAlign: 'right', marginRight: 0 }}>
              {profile?.features && profile?.idPhotos
                ? Strings.getLang('pet_info_collected')
                : Strings.getLang('pet_info_not_collected')}
            </Text>
            <Image src={imgAngleRight} className={styles.arrow} style={{ marginLeft: '16rpx' }} />
          </View>
        </View>

        <View className={styles['btns-wrapper']}>
          <Button type="info" size="large" round customClass={styles.btn} onClick={handleDelete}>
            {Strings.getLang('delete')}
          </Button>
          <Button
            type="info"
            size="large"
            round
            customClass={clsx(styles.btn, styles.save)}
            onClick={handleSave}
          >
            {Strings.getLang('save')}
          </Button>
        </View>

        <ActionSheet
          title={Strings.getLang('pet_info_sex_placeholder')}
          cancelText={Strings.getLang('cancel')}
          show={showSexActionSheet}
          actions={SEXS.map(({ code, text }) => {
            return {
              id: code,
              name: text,
              checked: code === sex,
            };
          })}
          onSelect={handleSelectSex}
          onCancel={() => setShowSexActionSheet(false)}
        />

        <ActionSheet
          title={Strings.getLang('pet_info_activeness_placeholder')}
          cancelText={Strings.getLang('cancel')}
          show={showActivenessActionSheet}
          actions={ACTIVENESSES.map(({ code, text }) => {
            return {
              id: code,
              name: text,
              checked: code === activeness,
            };
          })}
          onSelect={handleSelectActiveness}
          onCancel={() => setShowActivenessActionSheet(false)}
        />

        <ActionSheet
          show={showDatePicker}
          title={Strings.getLang('pet_info_birthday_placeholder')}
          cancelText={Strings.getLang('cancel')}
          confirmText={Strings.getLang('confirm')}
          onCancel={() => setShowDatePicker(false)}
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
          onCancel={() => setShowWeightPicker(false)}
          onConfirm={handleWeightPickerConfirm}
        >
          <Picker
            key={String(showWeightPicker)}
            columns={[
              {
                values: WEIGHT_COLUMN_0,
                defaultIndex: weights[0],
              },
              {
                values: ['.'],
              },
              {
                values: WEIGHT_COLUMN_1,
                defaultIndex: weights[1],
                unit: Strings.getLang('kg'),
              },
            ]}
            onChange={handleWeightChange}
            customClass={styles['weight-picker']}
          />
        </ActionSheet>

        <Toast id="smart-toast" />
        <Dialog id="smart-dialog" />
      </View>
      <UploadWebView componentId="edit-component-id" />
    </View>
  );
};

const Pet: FC<{
  location: {
    query: {
      petId?: string;
    };
  };
}> = ({ location }) => {
  const dispatch = useDispatch();
  const [initialed, setInitialed] = useState(false);

  useEffect(() => {
    ty.nativeDisabled(true);
    getData();
  }, []);

  const getData = async () => {
    // 增加 initialed是为了拉取最新的宠物详情
    await dispatch(fetchPetDetail({ petId: Number(location.query.petId), forceUpdate: true }));
    setInitialed(true);
  };

  const pet = useSelector((state: ReduxState) =>
    selectPetById(state, Number(location.query.petId))
  );

  return pet && initialed ? <PetEdit pet={pet} /> : <View />;
};

export default Pet;
