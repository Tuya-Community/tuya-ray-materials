import { useActions, useProps } from '@ray-js/panel-sdk';
import { router, showModal, View } from '@ray-js/ray';
import { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { TopBar } from '@/components';
import { dpCodes } from '@/config';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { updateUI } from '@/redux/action';
import { updateUserInformation } from '@/redux/modules/userInformationSlice';
import { checkDpExist, getDevId } from '@/utils';
import { storage } from '@/utils/netCache';

const { userSetCode } = dpCodes;

interface Props {
  rightTopbarState: boolean;
  userTypeCode: string;
  onPressManagement: any;
  setBackListNum: any;
}

const UserManagementTopBar: FC<Props> = ({
  rightTopbarState,
  userTypeCode,
  onPressManagement,
  setBackListNum,
}) => {
  const dpUserSetCode = useProps(props => props[userSetCode]);
  const userList = useSelector(({ uiState }) => uiState.userList);
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);
  const dpActions = useActions();
  const dispatch = useDispatch();

  const listNumHistory = useRef(userTypeCode);

  const ishaveUserSet = checkDpExist(userSetCode);
  const listNum = userList.findIndex(item => item.userTypeCode === userTypeCode);

  const onPressRightTopBar = async () => {
    onPressManagement(!rightTopbarState);

    if (rightTopbarState) {
      let isUnComplete = true;
      const judeKeys = ['userName', 'birthday', 'height', 'weight'];
      isUnComplete = judeKeys.some((k: any) => {
        switch (k) {
          case 'userName':
            return userList[listNum][k] === '';
          case 'birthday':
            return !userList[listNum][k];
          case 'height':
            return !userList[listNum][k];
          case 'weight':
            return !userList[listNum][k];
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
                  userName: userList[listNum]?.userName,
                  sex: userList[listNum]?.sex,
                  birthday: userList[listNum]?.birthday,
                  weight: userList[listNum]?.weight,
                  height: userList[listNum]?.height,
                  weightUnit: userList[listNum]?.weightUnit,
                  heightUnit: userList[listNum]?.heightUnit,
                  userTypeCode,
                  avatar: userList[listNum]?.avatar,
                })
              );
              router.push(`/userInformationEdit?type=edit&userId=${userList[listNum]?.id}`);
            }

            if (cancel) {
              setBackListNum(listNumHistory.current);
            }
          },
        });
      } else {
        updateUI({
          userInfo: userList[listNum],
          currentUserType: userList[listNum]?.userType,
        });
        storage.setItem(`${getDevId()}DefaultUser`, userTypeCode);
        updateUI({ defaultUser: userTypeCode });

        dpActions[userSetCode].set(userTypeCode);
        router.back();
      }
    }
  };

  const right = () =>
    ishaveUserSet ? (
      <View style={{ fontSize: '30rpx' }} onClick={onPressRightTopBar}>
        {Strings.getLang(rightTopbarState ? 'dsc_finish' : 'dsc_management')}
      </View>
    ) : (
      <View />
    );

  return <TopBar right={right()} title={Strings.getLang('dsc_UserManagement')} />;
};

export default UserManagementTopBar;
