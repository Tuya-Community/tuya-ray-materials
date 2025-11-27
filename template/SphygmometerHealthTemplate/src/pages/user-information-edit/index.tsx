import { useDevice, utils } from '@ray-js/panel-sdk';
import { Image, router, ScrollView, showToast, View } from '@ray-js/ray';
import { Button, Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SingleInformation, Text, TouchableOpacity, UserAvator } from '@/components';
import UserInformationTopBar from '@/components/TopBar/UserInformationTopBar';
import { dpCodes } from '@/config';
import { useDefaultAvatarPath } from '@/hooks';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { addUser, updateUI, updateUser } from '@/redux/action';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import Res from '@/res';
import { checkDpExist, getAvatarPath } from '@/utils';
import styles from './index.module.less';

export type ITEM = 'sex' | 'birthday' | 'height' | 'weight';
const buttonTitle = ['sex', 'birthday', 'height', 'weight'];

interface Props {
  location: { query: Record<string, any> };
}

const UserInformationEdit = (props: Props) => {
  const dispatch = useDispatch();
  const devId = useDevice(device => device.devInfo.devId);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const themeColor2 = utils.hex2rgbString(themeColor, 0.4);
  const { userSetCode } = dpCodes;
  const ishaveUserSet = checkDpExist(userSetCode);

  const { type, userId } = props.location.query ?? {};

  console.log(props.location.query);
  const defaultUserInfo = {
    avatar: '',
    userName: '',
    sex: 0,
    birthday: 0,
    height: 170,
    heightUnit: 'cm',
    weight: 56,
    weightUnit: 'kg',
  };
  const userInformation = useSelector(state => state.userInformation);
  const userList = useSelector(({ uiState }) => uiState.userList);
  const defaultAvatar = useDefaultAvatarPath(userInformation.sex);
  const [currentName, setCurrentName] = useState('');

  const {
    userName,
    sex,
    birthday,
    height,
    weight,
    avatar,
    userTypeCode = '',
    heightUnit,
    weightUnit,
  } = userInformation;
  const editeUserName = () => {
    DialogInstance.input({
      title: Strings.getLang('dsc_editeUserName'),
      value: currentName,
      placeholder: Strings.getLang('dsc_nameFormat1'),
      confirmButtonText: Strings.getLang('dsc_confirm'),
      cancelButtonText: Strings.getLang('dsc_cancel'),
      maxlength: 20,
    })
      .then(res => {
        const curInputValue = res?.data?.inputValue;
        setCurrentName(curInputValue);
      })
      .catch(() => {
        console.log('=== cancel');
      });
  };
  useEffect(() => {
    if (userName !== Strings.getLang('dsc_editeName1')) {
      setCurrentName(userName);
    }
  }, []);

  const onPressSave = async () => {
    if ((!ishaveUserSet && currentName === '') || !+height || !+weight) {
      showToast({ title: Strings.getLang('dsc_nilInfo'), icon: 'error' });
      return;
    }
    const isHaveSameName = userList.some(item => {
      return item.id !== userId && item?.userName === currentName;
    });
    if (isHaveSameName) {
      showToast({ title: Strings.getLang('dsc_changeName'), icon: 'error' });
      return;
    }
    const user = {
      avatar: getAvatarPath(avatar || '') || defaultAvatar,
      userName: currentName,
      sex,
      birthday,
      height,
      heightUnit,
      weight: weight * 10,
      weightUnit,
    };
    if (type === 'add') {
      const newUserbackId = await addUser({
        ...user,
        devId,
        type: 1,
        userType: 2,
        extInfo: { weightScale: 1 },
      });

      if (newUserbackId) {
        updateUI({ saveUserSuccess: true });
      }

      dispatch(
        updateUserInformation({
          ...defaultUserInfo,
        })
      );
      router.back();
    } else {
      const userInfo = userList.find(item => {
        return item?.id === userId;
      });
      const backState = await updateUser({
        ...user,
        id: userId,
        devId,
        type: 1,
        extInfo: { ...JSON.parse(userInfo?.extInfo || '{}'), weightScale: 1 },
      });

      if (backState) {
        updateUI({
          saveUserSuccess: true,
          currentUserType: ishaveUserSet && userInfo?.userType ? userInfo?.userType : 2,
        });
      }

      dispatch(
        updateUserInformation({
          ...defaultUserInfo,
        })
      );

      router.back();
    }
  };

  return (
    <View>
      <UserInformationTopBar
        title={Strings.getLang('dsc_UserManagement')}
        type={type}
        userId={userId || ''}
      />
      <Image className={styles.homeBg} src={Res.homeBg} />
      <Image className={styles.homeBg} src={Res.userBg} />
      <View className={styles.userHeadBox}>
        <UserAvator
          isSelect
          path={userInformation.avatar}
          showDefault={userInformation.sex}
          size={124}
          onSelect={(path: string) => {
            dispatch(
              updateUserInformation({
                ...userInformation,
                avatar: path,
              })
            );
          }}
        />
        <View className={styles.userNameBox}>
          <Text className={styles.userName} numberOfLines={1}>
            {currentName !== '' ? currentName : Strings.getLang('dsc_editeName1')}
          </Text>
          {userTypeCode ? (
            <Text className={styles.userTypeCode} numberOfLines={1}>
              {`(${userTypeCode})`}
            </Text>
          ) : null}
          <TouchableOpacity className={styles.editwNameBox} onClick={editeUserName}>
            <Image src={Res.editUserName} style={{ height: '30rpx', width: '32rpx' }} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView scrollY>
        <View style={{ padding: '0 40rpx' }}>
          <View style={{ marginBottom: '10rpx' }}>
            {buttonTitle.map((item: ITEM) => (
              <SingleInformation item={item} key={item} type={type} value={userInformation} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View className={styles.bottomButtonBg}>
        <Button
          round
          color={themeColor}
          disabled={(!ishaveUserSet && currentName === '') || height === 0 || weight === 0}
          size="large"
          type="primary"
          onClick={onPressSave}
        >
          {Strings.getLang('dsc_save')}
        </Button>
      </View>
      <Dialog id="smart-dialog" />
    </View>
  );
};

export default UserInformationEdit;
