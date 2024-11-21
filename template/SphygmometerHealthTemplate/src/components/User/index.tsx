import { View } from '@ray-js/ray';

import { useSelector } from '@/redux';
import { Text, TouchableOpacity } from '../common';
import UserAvator from '../UserAvator';
import styles from './index.module.less';

interface Props {
  onClick: () => void;
}

const User = ({ onClick }: Props) => {
  const userInfo: UserInfo = useSelector(({ uiState }) => uiState.userInfo);
  const { userName, userTypeCode, userType } = userInfo || {};

  return (
    <TouchableOpacity className={styles.container} onClick={onClick}>
      {userInfo && <UserAvator path={userInfo.avatar} showDefault={userInfo?.sex} />}
      <View className={styles.userName}>
        <Text className={styles.name} numberOfLines={1}>
          {userName}
        </Text>
        {/* dp 配置的用户 */}
        {userType > 20 && (
          <Text className={styles.devUserName} numberOfLines={1}>{`(${userTypeCode})`}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default User;
