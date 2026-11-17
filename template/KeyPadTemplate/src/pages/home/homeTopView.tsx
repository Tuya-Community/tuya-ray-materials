import React from 'react';
import { View, Text, Image, getCdnUrl } from '@ray-js/ray';
import { Image as SmartImage } from '@ray-js/smart-ui';
import { useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { getEleIcon } from '@/utils/getEleIcon';
import { useSelectorWithEquality } from '@/hooks/useSelectorWithEquality';
import { selectSaveTime } from '@/redux/modules/lockHomeSlice';
import { templateConfig } from '@/config';
import cdnImage from 'cdn/cdnImage.json';
import styles from './index.module.less';

const batteryTextKeys = {
  low: 'battery_state_low',
  medium: 'battery_state_medium',
  high: 'battery_state_high',
  poweroff: 'battery_state_poweroff',
} as const;

/**
 * 首页顶部栏：电池电量 + 安全守护天数。
 */
export function HomeTopView() {
  // useProps 的返回值需符合 DpValue，缺失电量用 -1 / 空字符串表示。
  const electricity = useProps(props => {
    const value: unknown = props?.battery_percentage;
    return typeof value === 'number' ? value : -1;
  });
  const batteryState = useProps(props => {
    const value: unknown = props?.battery_state;
    return typeof value === 'string' ? value : '';
  });
  // 安防天数由 composeLayout 在 initFit 完成后拉取并写入 Redux
  const saveTime = useSelectorWithEquality(selectSaveTime);
  const { themeColor } = templateConfig;

  // 枚举电量优先于数值电量
  const hasBatteryState = !!batteryTextKeys[batteryState as keyof typeof batteryTextKeys];
  const ele = hasBatteryState ? batteryState : electricity;
  const showBattery = ele !== undefined && ele !== -1;
  const eleText =
    typeof ele === 'number'
      ? `${ele}%`
      : hasBatteryState
      ? Strings.getLang(batteryTextKeys[batteryState as keyof typeof batteryTextKeys])
      : '';
  const eleIcon = showBattery ? getEleIcon(ele) : '';

  return (
    <View className={styles.topBar}>
      {showBattery && (
        <View className={styles.battery}>
          <Image src={eleIcon} className={styles.batteryIcon} />
          <Text className={styles.batteryText}>{eleText}</Text>
        </View>
      )}
      <View className={styles.saveTime}>
        <SmartImage
          src={getCdnUrl('save.png', cdnImage)}
          className={styles.saveIcon}
          width="28rpx"
          height="34rpx"
          tintColor={themeColor}
        />
        <Text className={styles.saveText}>{Strings.formatValue('saveTime', saveTime)}</Text>
      </View>
    </View>
  );
}

export default HomeTopView;
