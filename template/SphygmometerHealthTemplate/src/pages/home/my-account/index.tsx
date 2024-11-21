import { FC, useEffect, useState } from 'react';
import { Image, router, Text, View } from '@ray-js/ray';

import { PageWrapper, TopBar, TouchableOpacity, UserAvator } from '@/components';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { getDateList } from '@/redux/action';
import Res from '@/res';
import styles from './index.module.less';

type ITEM = 'UserManagement' | 'Record' | 'FileSharing' | 'AppleHealth';

interface SettingItem {
  key: ITEM;
  icon: any;
  path: string;
}

const buttonTitle = [
  {
    key: 'UserManagement',
    path: '/userManagement',
    icon: Res.iconUserManage,
  },
  {
    key: 'UnitSwitch',
    path: '/unitSwitch',
    icon: Res.iconUnitExange,
  },
  {
    key: 'Record',
    path: '/record?showAll=true',
    icon: Res.iconMeasureRecord,
  },
];

const MyAccount: FC = () => {
  const userInfo: UserInfo = useSelector(({ uiState }) => uiState.userInfo);
  const { userName, sex, avatar, userTypeCode, userType } = userInfo;

  const onPressAction = item => {
    router.push(item.path);
  };

  return (
    <>
      <TopBar root theme="dark" title={Strings.getLang('dsc_me')} />
      <Image className={styles.homeBg} src={Res.homeBg} />
      <Image className={styles.homeBg} src={Res.userBg} />
      <PageWrapper>
        <View className={styles.userHeadBox}>
          <View>
            <Text className={styles.userName}>{userName}</Text>
            {/* userType > 20 代表 dp 配置的用户 */}
            {userType > 20 && <Text className={styles.userName2}>{`(${userTypeCode})`}</Text>}
          </View>
          <UserAvator path={avatar} showDefault={sex} size={124} />
        </View>
        <View className="mg-l-20" style={{ position: 'relative' }}>
          {buttonTitle.map((item: SettingItem) => (
            <View className={styles.buttonBoxBg} key={item.key}>
              <TouchableOpacity
                activeOpacity={0.6}
                className={styles.buttonBox}
                onClick={() => onPressAction(item)}
              >
                <View className={styles.buttonHeader}>
                  <Image className={styles.bottonIcon} src={item.icon} />
                  <Text className={styles.buttonTitle}>{Strings.getLang(`dsc_${item.key}`)}</Text>
                </View>
                <Image src={Res.arrow7x12} style={{ height: '24rpx', width: '14rpx' }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </PageWrapper>
    </>
  );
};

export default MyAccount;
