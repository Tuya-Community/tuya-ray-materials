import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@ray-js/components';
import { leftearBatteryPercentageCode, rightearBatteryPercentageCode } from '@/config/dpCodes';
import Res from '@/res';
import { useSelector } from 'react-redux';
import { selectDpStateByCode } from '@/redux/modules/dpStateSlice';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';

// @ts-ignore
import styles from './index.module.less';

interface PowerSty {
  left: {
    backgroundColor: string;
    width: string;
  };
  right: {
    backgroundColor: string;
    width: string;
  };
}

const Index = () => {
  const [powerSty, setPowerSty] = useState<PowerSty>();
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion'));
  const isCardStyle = productStyle === 'card';
  const leftbatteryPercentage = useSelector(
    selectDpStateByCode(leftearBatteryPercentageCode as never)
  );
  const rightbatteryPercentage = useSelector(
    selectDpStateByCode(rightearBatteryPercentageCode as never)
  );

  useEffect(() => {
    // 这里14是内部填充的最大宽度。100是返回的最大电量值。
    // 小于20%的时候，电量低，显示红色，否则显示绿色

    const left = {
      backgroundColor: leftbatteryPercentage > 20 ? '#00bf0d' : '#f24500',
      width: `${(14 / 100) * leftbatteryPercentage}px`,
    };

    const right = {
      backgroundColor: rightbatteryPercentage > 20 ? '#00bf0d' : '#f24500',
      width: `${(14 / 100) * rightbatteryPercentage}px`,
    };
    setPowerSty({
      left,
      right,
    });
  }, [leftbatteryPercentage, rightbatteryPercentage]);

  return (
    <View className={styles.container}>
      {isBtEntryVersion ? (
        <></>
      ) : isCardStyle ? (
        <View className={styles.hCenterBox}>
          <Text className={styles.batteryText}>{leftbatteryPercentage}%</Text>
          <View className={styles.powerBox}>
            <Image className={styles.powerIcon} src={Res.powerIcon} />
            <View className={styles.percent} style={powerSty?.left} />
          </View>
        </View>
      ) : (
        <>
          <View className={styles.hCenterBox}>
            <Image className={styles.icon16} src={Res.leftIcon} />
            <Text className={styles.batteryText}>{leftbatteryPercentage}%</Text>
            <View className={styles.powerBox}>
              <Image className={styles.powerIcon} src={Res.powerIcon} />
              <View className={styles.percent} style={powerSty?.left} />
            </View>
          </View>

          <View className={`${styles.hCenterBox} ${styles.mgl14}`}>
            <Image className={styles.icon16} src={Res.rightIcon} />
            <Text className={styles.batteryText}>{rightbatteryPercentage}%</Text>
            <View className={styles.powerBox}>
              <Image className={styles.powerIcon} src={Res.powerIcon} />
              <View className={styles.percent} style={powerSty?.right} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Index;
