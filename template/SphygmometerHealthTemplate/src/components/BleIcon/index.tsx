import { Image, View } from '@ray-js/ray';
import clsx from 'clsx';

import { useSelector } from '@/redux';
import Res from '@/res';
import styles from './index.module.less';

const BleIcon = () => {
  const bleState = useSelector(({ uiState }) => uiState.bleState); // 蓝牙开启状态
  const bleConnectStatus = useSelector(({ uiState }) => uiState.isBleOnline); // 设备蓝牙连接状态

  return (
    <View
      className={clsx(
        styles.bluetoothBox,
        'm-l-24',
        bleState && !bleConnectStatus && styles.fadeInAnimation
      )}
    >
      <Image
        src={Res.bluetoothIcon}
        style={{ opacity: bleState ? 1 : 0.3, height: '24rpx', width: '16rpx' }}
      />
    </View>
  );
};

export default BleIcon;
