import { router, ScrollView, showModal, View } from '@ray-js/ray';
import { Divider, Overlay } from '@ray-js/smart-ui';
import clsx from 'clsx';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { dpCodes } from '@/config';
import Strings from '@/i18n';
import icons from '@/icons';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/modules/uiSlice';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import { checkDpExist, getDevId, safeTopHeight } from '@/utils';
import storage from '@/utils/netCache/storage';
import { kgToOther } from '@/utils/unit';
import { Text, TouchableOpacity } from '../common';
import UserAvator from '../UserAvator';
import styles from './index.module.less';

interface ItemProps {
  userInfo?: UserInfo;
  isSelected: boolean;
  count?: number; // 数量提示
  d?: string;
  name?: string;
  onPress: () => void;
}

const Item = ({ userInfo, onPress, isSelected, count, d, name }: ItemProps) => {
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  return (
    <TouchableOpacity className={styles.item} onClick={onPress}>
      <View>
        <View
          style={{
            opacity: isSelected ? 1 : 0.5,
          }}
        >
          <UserAvator d={d} path={userInfo?.avatar} showDefault={userInfo?.sex} size="small" />
        </View>

        {!!count && (
          <View className={styles.tip}>
            <Text className={styles.tipTxt}>{count}</Text>
          </View>
        )}
      </View>
      <View className={styles.nameBox}>
        <Text
          className={styles.name}
          numberOfLines={1}
          style={{
            fontWeight: isSelected ? '500' : '400',
            color: isSelected ? themeColor : 'rgba(0,30,62,0.4)',
            maxWidth: userInfo?.userType > 20 ? '210rpx' : '750rpx', // userType > 20 代表 dp 配置的用户
          }}
        >
          {userInfo?.userName || name}
        </Text>
        {userInfo?.userType > 20 && (
          <Text
            className={styles.name}
            style={{
              opacity: isSelected ? 1 : 0.4,
              color: isSelected ? themeColor : 'rgba(0,30,62,0.4)',
            }}
          >
            {` (${userInfo?.userTypeCode})`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface Props {
  show: boolean;
  onHide: () => void;
  setErrorShow: any;
}

const SwitchUser = ({ show, onHide, setErrorShow }: Props) => {
  const targetWeightUnit = useSelector(({ uiState }) => uiState.targetWeightUnit);
  const targetHeightUnit = useSelector(({ uiState }) => uiState.targetHeightUnit);
  const userList = useSelector(({ uiState }) => uiState.userList) || [];
  const userInfo = useSelector(({ uiState }) => uiState.userInfo) || {};
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const { userSetCode } = dpCodes;
  const ishaveUserSet = checkDpExist(userSetCode);
  const { id: userId } = userInfo as UserInfo;
  const dispatch = useDispatch();

  const onPressSingleUser = async (isCurrent: boolean, item: any, idx: number) => {
    onHide();
    let isUnComplete = true;
    const judeKeys = ['userName', 'birthday', 'height', 'weight'];
    isUnComplete = judeKeys.some((k: any) => {
      switch (k) {
        case 'userName':
          return userList[idx][k] === '';
        case 'birthday':
          return !userList[idx][k];
        case 'height':
          return !userList[idx][k];
        case 'weight':
          return !userList[idx][k];
        default:
          return false;
      }
    });
    if (isUnComplete) {
      showModal({
        title: '',
        content: Strings.getLang('dsc_userSetTips'),
        confirmText: Strings.getLang('dsc_set'),
        cancelText: Strings.getLang('dsc_notSet'),
        confirmColor: themeColor,
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if (confirm) {
            dispatch(
              updateUserInformation({
                userName: userList[idx]?.userName,
                sex: userList[idx]?.sex,
                birthday: userList[idx]?.birthday,
                weight: userList[idx]?.weight,
                weightUnit: userList[idx]?.weightUnit,
                height: userList[idx]?.height,
                heightUnit: userList[idx]?.heightUnit,
                avatar: userList[idx]?.avatar,
                userTypeCode: userList[idx]?.userType > 20 ? userList[idx].userTypeCode : '',
              })
            );
            router.push(`/userInformationEdit?type=edit&userId=${userList[idx]?.id}`);
          }
        },
      });
    } else {
      dispatch(
        updateUI({
          userInfo: userList[idx],
          currentUserType: userList[idx]?.userType,
          defaultUser: userList[idx]?.userTypeCode,
        })
      );

      storage.setItem(`${getDevId()}DefaultUser`, userList[idx]?.userTypeCode);
    }
  };

  const onPressAdd = () => {
    const kgToOtherValue = kgToOther({ num: 56, unit: targetWeightUnit, scale: 1 });
    if (userList.length < 10) {
      dispatch(
        updateUserInformation({
          userName: Strings.getLang('dsc_editeName1'),
          sex: 0,
          birthday: moment(new Date()).add(-20, 'year').valueOf(),
          weight: +kgToOtherValue,
          weightUnit: targetWeightUnit,
          height: 170,
          heightUnit: targetHeightUnit,
        })
      );
      router.push(`/userInformationEdit?type=add`);
    } else {
      setErrorShow();
    }
  };

  return (
    <Overlay show={show} zIndex="2" onClick={onHide}>
      {show && (
        <View className={styles.pop} style={{ top: `${safeTopHeight + 80}px` }}>
          <View className={clsx(styles.scroll, 'p-t-20')}>
            <View className={styles.triangle} />
            <ScrollView scrollY className={styles.scroll}>
              <View className={styles.list}>
                {userList.map((item, index) => {
                  const isCurrent = item.id === userId;
                  return (
                    <View key={item.id}>
                      {index !== 0 && <Divider hairline customStyle={{ margin: 0 }} />}
                      <Item
                        isSelected={isCurrent}
                        key={userId}
                        userInfo={item}
                        onPress={() => {
                          onPressSingleUser(isCurrent, item, index);
                        }}
                      />
                    </View>
                  );
                })}
                {!ishaveUserSet && (
                  <View>
                    <Divider hairline customStyle={{ margin: 0 }} />
                    <Item
                      d={icons.iconAddUser}
                      isSelected={false}
                      name={Strings.getLang('dsc_addUser')}
                      onPress={() => {
                        onHide();
                        onPressAdd();
                      }}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </Overlay>
  );
};

export default SwitchUser;
