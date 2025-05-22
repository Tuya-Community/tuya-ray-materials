import React, { useMemo } from 'react';
import { useProps } from '@ray-js/panel-sdk';
import { Text, View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import { themeColor } from '@/constant';
import { batteryPercentageCode, chargeStatusCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { iconCharging } from '@/res/iconsvg';
import { GridBattery } from '../GridBattery';
import styles from './index.module.less';

const Battery = () => {
  const dpBatteryPercentage = useProps(props => props[batteryPercentageCode]);
  const dpChargeStatus = useProps(props => props[chargeStatusCode]);

  const batteryBgColor = useMemo(() => {
    const bgColor =
      dpBatteryPercentage > 19 ? themeColor : dpBatteryPercentage < 10 ? '#F04C4C' : '#FFA000';
    const resBgColor = dpChargeStatus === 'charging' ? '#1ABC0D' : bgColor;
    return resBgColor;
  }, [dpBatteryPercentage, dpChargeStatus]);

  return (
    <View className={styles.batteryBox}>
      <View className={styles.battery}>
        <GridBattery
          value={dpChargeStatus === 'charging' ? 100 : dpBatteryPercentage} // 80% 显示蓝色
          direction="horizontal"
          size={30}
          status={dpChargeStatus}
        />
        {dpChargeStatus === 'charging' && (
          <View className={styles.chargingIconBox}>
            <Icon name={iconCharging} size="45rpx" color="#FFFFFF" />
          </View>
        )}
      </View>

      {dpChargeStatus === 'charging' && (
        <Text
          className={styles.batteryText}
          style={{
            color: batteryBgColor,
            marginLeft: '18rpx',
            marginTop: '2rpx',
          }}
        >
          {Strings.getLang('dsc_charging')}
        </Text>
      )}
    </View>
  );
};

export default Battery;
