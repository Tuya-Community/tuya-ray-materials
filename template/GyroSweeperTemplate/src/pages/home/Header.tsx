import React, { FC, useMemo } from 'react';
import { Text, View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import { useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n/index';
import { iconCharging, iconSweep } from '@/res/iconsvg';

import styles from './index.module.less';

type PropsDpItem = {
  dpCode: string;
};

const DpItem: FC<PropsDpItem> = ({ dpCode }) => {
  const dpValue = useProps(props => props[dpCode]);

  return (
    <View className={styles.item}>
      <View className={styles.valueWrapper}>
        <Text className={styles.value}>{dpValue}</Text>
        <Text className={styles.unit}>{Strings.getDpLang(dpCode, 'unit')}</Text>
      </View>
      <Text className={styles.label}>{Strings.getDpLang(dpCode)}</Text>
    </View>
  );
};

const Header: FC = () => {
  const status = useProps(props => props?.status);

  // 切换模式动画效果
  const modeSwitch = useMemo(() => {
    if (status === 'standby' || status === 'sleep') {
      return 'standby';
    }
    if (status === 'charge_done' || status === 'charging' || status === 'goto_charge') {
      return 'chargego';
    }
    return 'sweep';
  }, [status]);

  return (
    <View className={styles.header}>
      <View className={styles.statusWrapper}>
        {modeSwitch === 'standby' ? (
          <View className={styles.standby} />
        ) : (
          <Icon
            name={modeSwitch === 'chargego' ? iconCharging : iconSweep}
            size="128rpx"
            color="#fff"
          />
        )}
        <Text className={styles.statusText}>{Strings.getDpLang('status', status)}</Text>
      </View>
      <View className={styles.summary}>
        <DpItem dpCode="clean_area" />
        <DpItem dpCode="clean_time" />
        <DpItem dpCode="battery_percentage" />
      </View>
    </View>
  );
};
export default Header;
