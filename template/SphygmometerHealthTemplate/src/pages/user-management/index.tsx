import { FC, useState } from 'react';
import { utils } from '@ray-js/panel-sdk';
import { Image, router, ScrollView, showToast, Text, usePageEvent, View } from '@ray-js/ray';
import { Button, Checkbox } from '@ray-js/smart-ui';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { PageWrapper, TouchableOpacity, UserAvator } from '@/components';
import UserManagementTopBar from '@/components/TopBar/UserManagementTopBar';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/action';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import Res from '@/res';
import { checkDpExist } from '@/utils';
import { kgToOther, otherToKg } from '@/utils/unit';
import styles from './index.module.less';

const UserManagement: FC = () => {
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const targetWeightUnit = useSelector(({ uiState }) => uiState.targetWeightUnit);
  const targetHeightUnit = useSelector(({ uiState }) => uiState.targetHeightUnit);
  const userList = useSelector(({ uiState }) => uiState.userList);
  const saveUserSuccess = useSelector(({ uiState }) => uiState.saveUserSuccess);
  const deleteUserSuccess = useSelector(({ uiState }) => uiState.deleteUserSuccess);
  const userInfo = useSelector(({ uiState }) => uiState.userInfo) || {};
  const defaultUser = useSelector(({ uiState }) => uiState.defaultUser) || '';
  const { userSetCode } = dpCodes;
  const ishaveUserSet = checkDpExist(userSetCode);
  const [currentUserCode, setCurrentUserCode] = useState(defaultUser);

  const dispatch = useDispatch();

  const [userManagement, setUserManagement] = useState(false);

  /**
   * 操作成功提示
   */
  usePageEvent('onShow', () => {
    if (saveUserSuccess) {
      showToast({
        title: Strings.getLang('dsc_saveUserSuccess'),
        icon: 'success',
        complete: () => updateUI({ saveUserSuccess: false }),
      });
    }

    if (deleteUserSuccess) {
      showToast({
        title: Strings.getLang('dsc_deleteUserSuccess'),
        icon: 'success',
        complete: () => updateUI({ deleteUserSuccess: false }),
      });
    }
  });

  const onPressAdd = () => {
    if (userList.length < 10) {
      const kgToOtherValue = kgToOther({ num: 56, unit: targetWeightUnit, scale: 1 });
      dispatch(
        updateUserInformation({
          userName: Strings.getLang('dsc_editeName1'),
          avatar: '',
          sex: 0,
          birthday: moment(new Date()).add(-50, 'year').valueOf(),
          weight: +kgToOtherValue,
          weightUnit: targetWeightUnit,
          height: 170,
          heightUnit: targetHeightUnit,
        })
      );
      const query = utils.stringifyJSON({ type: 'add' });
      router.push(`/userInformationEdit?params=${query}`);
    } else {
      showToast({ title: Strings.getLang('dsc_onlyTen'), icon: 'error' });
    }
  };

  const onPressEdit = (singleInfo: any) => {
    const {
      userName,
      sex,
      birthday,
      weight,
      height,
      id,
      avatar,
      userTypeCode,
      userType,
      heightUnit,
      weightUnit,
    } = singleInfo;
    const otherToKgValue = otherToKg(+weight, weightUnit);
    const kgToOtherValue = kgToOther({ num: +otherToKgValue, unit: targetWeightUnit, scale: 1 });
    dispatch(
      updateUserInformation({
        userName,
        sex,
        birthday,
        weight: +kgToOtherValue,
        weightUnit: targetWeightUnit,
        height,
        heightUnit: targetHeightUnit,
        avatar,
        userTypeCode: userType > 20 ? userTypeCode : '', // userType > 20 代表 dp 配置的用户
      })
    );
    const query = utils.stringifyJSON({ type: 'edit', userId: id });
    router.push(`/userInformationEdit?params=${query}`);
  };

  return (
    <>
      <UserManagementTopBar
        rightTopbarState={userManagement}
        setBackListNum={(code: string) => setCurrentUserCode(code)}
        userTypeCode={currentUserCode}
        onPressManagement={(state: boolean) => setUserManagement(state)}
      />
      <PageWrapper style={{ paddingTop: '24rpx' }}>
        <ScrollView
          scrollY
          style={{
            paddingBottom: '32rpx',
            height: !ishaveUserSet ? 'calc(100% - 256rpx)' : '100%',
          }}
        >
          {userList?.map((item, index) => (
            <View className={styles.container} key={item?.id}>
              <View className={styles.buttonBox}>
                <TouchableOpacity className={styles.buttonBoxUp} onClick={() => onPressEdit(item)}>
                  <View className={styles.userMessage}>
                    <UserAvator path={item.avatar} showDefault={item.sex} size={64} />
                    <View className={styles.nameBox}>
                      <Text className={styles.userName}>{item?.userName}</Text>
                      {item?.userType > 20 && (
                        <Text className={styles.userName}>{` (${item?.userTypeCode})`}</Text>
                      )}
                    </View>
                    {!ishaveUserSet && item?.userType === 1 && (
                      <View className={styles.nowUser} style={{ backgroundColor: themeColor }}>
                        <Text style={{ fontSize: '12px', color: '#FFFFFF', padding: '5rpx' }}>
                          {Strings.getLang('dsc_admin')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Image src={Res.arrow7x12} style={{ height: '24rpx', width: '14rpx' }} />
                </TouchableOpacity>
                {userManagement && (
                  <View>
                    <View className={styles.rowLine} />
                    <Checkbox
                      checkedColor={themeColor}
                      customClass="p-20"
                      iconSize="32rpx"
                      value={item.userTypeCode === currentUserCode}
                      onChange={() => setCurrentUserCode(item.userTypeCode)}
                    >
                      {Strings.getLang('dsc_setUser')}
                    </Checkbox>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </PageWrapper>
      {!ishaveUserSet && (
        <View className={styles.bottomButtonBg}>
          <Button round color={themeColor} size="large" type="primary" onClick={onPressAdd}>
            {Strings.getLang('dsc_add')}
          </Button>
        </View>
      )}
    </>
  );
};

export default UserManagement;
