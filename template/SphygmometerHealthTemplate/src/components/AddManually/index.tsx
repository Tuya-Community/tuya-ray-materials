import { Text, View } from '@ray-js/ray';
import { Icon } from '@ray-js/svg';

import Strings from '@/i18n';
import icons from '@/icons';
import { useSelector } from '@/redux';
import styles from './index.module.less';

const AddManually = () => {
  const themeColor = useSelector(({ uiState }) => uiState.themeColor);

  return (
    <View className={styles.container}>
      <Icon className="m-r-16" color={themeColor} d={icons.iconAddUser} size="40rpx" />
      <Text className={styles.btnText}>{Strings.getLang('dsc_addManually')}</Text>
    </View>
  );
};

export default AddManually;
