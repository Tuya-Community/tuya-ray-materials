import { Text, View } from '@ray-js/ray';
import React from 'react';
import Strings from '@/i18n';
import styles from './index.module.less';

type Props = {
  isHomeMap?: boolean;
};

const DrawMap: React.FC<Props> = ({ isHomeMap = false }) => {
  return (
    <View className={styles.root}>
      <View
        className={styles.loadingContainer}
        style={isHomeMap ? { position: 'relative', top: '-150rpx' } : null}
      >
        <View style={{ position: 'relative', width: '600rpx', height: '300rpx' }}>
          {/* <ILiteLoading sysInfo={systemInfo} /> */}
        </View>
        <Text className={styles.textStyle} style={{ position: 'relative', top: '-80rpx' }}>
          {Strings.getLang('dsc_map_loading')}
        </Text>
      </View>
    </View>
  );
};

export default DrawMap;
