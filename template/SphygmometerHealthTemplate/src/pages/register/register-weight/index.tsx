import { FC, useState } from 'react';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { router, View } from '@ray-js/ray';
import { useDispatch } from 'react-redux';

import { saveDeviceCloudData } from '@/api';
import { PageWrapper, Text, TopBar, TouchableOpacity, WeightUnitPicker } from '@/components';
import { dpCodes } from '@/config';
import { useDefaultAvatarPath } from '@/hooks';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { addUser, updateUI, updateUser } from '@/redux/action';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import { checkDpExist } from '@/utils';
import storage from '@/utils/netCache/storage';
import styles from './index.module.less';

const { userSetCode } = dpCodes;

const RegisterWeight: FC = () => {
  const dispatch = useDispatch();
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const dpUserSetCode = useProps(props => props[userSetCode]);
  const dpActions = useActions();
  const devId = useDevice(device => device.devInfo.devId);
  const defaultUserInfo = {
    userName: '',
    sex: 0,
    birthday: 0,
    height: 170,
    heightUnit: 'cm',
    weight: 56,
    weightUnit: 'kg',
    avatar: '',
  };
  const userInformation = useSelector(state => state.userInformation);
  const userList = useSelector(({ uiState }) => uiState.userList);
  const { userName, sex, birthday, height, heightUnit, userTypeCode } = userInformation;
  const targetUser = userList.find(item => item.userTypeCode === userTypeCode);
  const defaultAvatar = useDefaultAvatarPath(sex);
  const ishaveUserSet = checkDpExist(userSetCode);
  const [weight, setWeight] = useState(['56', 'kg']);

  const onPressPre = () => {
    router.replace('/registerHeight');
  };
  const pickerChange = (value: any[]) => {
    setWeight(value);
  };

  const onPressNext = async () => {
    const user = {
      userName,
      sex,
      birthday,
      height,
      heightUnit,
      weight: Number(weight[0]) * 10,
      weightUnit: weight[1],
      extInfo: { weightScale: 1 },
      avatar: defaultAvatar,
    };

    if (ishaveUserSet) {
      updateUI({ currentUserType: targetUser?.userType, isFirstLoading: true });
      await updateUser({
        ...user,
        devId,
        type: 1,
        id: targetUser?.id || '',
        userType: targetUser?.userType,
      });
      await storage.setItem(`${devId}DefaultUser`, userTypeCode);
      updateUI({ defaultUser: userTypeCode });
      dpActions[userSetCode].set(userTypeCode);
    } else {
      updateUI({ currentUserType: 1, isFirstLoading: true });
      await addUser({
        ...user,
        devId,
        type: 1,
        userType: 1,
      });
      dispatch(
        updateUserInformation({
          ...defaultUserInfo,
        })
      );
    }
    storage.setItem(`${devId}targetWeightUnit`, user.weightUnit);
    storage.setItem(`${devId}targetHeightUnit`, user.heightUnit);
    saveDeviceCloudData('isCompleteUser', '1');
    updateUI({ isNeedToComplete: false });
    updateUI({ targetWeightUnit: user.weightUnit, targetHeightUnit: user.heightUnit });
    router.back();
  };

  return (
    <>
      <TopBar root right={<View />} title={Strings.getLang('dsc_registerTopbar1')} />
      <PageWrapper>
        <View style={{ flex: 1 }}>
          <View className={styles.textBox}>
            <Text className={styles.headTitle}>{Strings.getLang('dsc_userWeight')}</Text>
            <Text className={styles.subTitle}>{Strings.getLang('dsc_userWeightTips')}</Text>
          </View>
          <View className={styles.pickerBox}>
            <WeightUnitPicker
              defaultValue={['56', 'kg']}
              rangeConfig={{ min: 1, max: 300, step: 1 }}
              onChange={pickerChange}
            />
          </View>
        </View>
        <View className={styles.buttonBox}>
          <TouchableOpacity
            className={styles.bottomButton}
            style={{ backgroundColor: themeColor }}
            onClick={onPressPre}
          >
            <Text className={styles.buttonText}>{Strings.getLang('dsc_buttonPre')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={styles.bottomButton}
            style={{ backgroundColor: themeColor }}
            onClick={onPressNext}
          >
            <Text className={styles.buttonText}>{Strings.getLang('dsc_buttonNext')}</Text>
          </TouchableOpacity>
        </View>
      </PageWrapper>
    </>
  );
};

export default RegisterWeight;
