import { Image, Text, View } from '@ray-js/ray';

import Strings from '@/i18n';
import Res from '@/res';
import styles from './index.module.less';

const NoData = () => {
  return (
    <View className={styles.container}>
      <Image className={styles.noDataPic} src={Res.noDataPic} />
      <Text className={styles.noDataText}>{Strings.getLang('dsc_noData')}</Text>
    </View>
  );
};

export default NoData;
