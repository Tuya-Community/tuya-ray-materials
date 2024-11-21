import React from 'react';
import { Text, View, Image } from '@ray-js/ray';
import { useDevice, useProps } from '@ray-js/panel-sdk';
import { useSelector } from 'react-redux';
import { selectThemeType } from '@/redux/modules/themeSlice';
import dpCodes from '@/constant/dpCodes';
import { getWifiIcon, getGpsIcon, isDpExist } from '@/utils';
import Strings from '@/i18n';
import Res from '@/res';
import Styles from './index.module.less';

const { signalStrength4g, signalStrengthGps } = dpCodes;

export const SignalView = React.memo(({ isBleOnline }: { isBleOnline: boolean }) => {
  const capability = useDevice(device => device.devInfo.capability);
  const theme = useSelector(selectThemeType);
  const isSupportBle = [1024, 1048576, 1049600].indexOf(capability) !== -1; // 是否支持蓝牙
  const dpState = useProps();
  const dpSchema = useDevice(device => device.dpSchema);
  const signalData = [
    {
      name: 'wifi',
      icon: getWifiIcon(dpState[signalStrength4g], theme),
      isShow: isDpExist(signalStrength4g, dpSchema),
    },
    {
      name: 'gps',
      icon: getGpsIcon(
        dpState[signalStrengthGps],
        theme,
        dpSchema[signalStrengthGps]?.property?.max,
        dpSchema[signalStrengthGps]?.property?.min
      ),
      isShow: isDpExist(signalStrengthGps, dpSchema),
    },
  ].filter(i => i.isShow);

  return (
    <View className={Styles.signal}>
      {signalData.map(i => (
        <Image key={i.name} src={i.icon} className={Styles.signalIcon} />
      ))}
      {isSupportBle && (
        <View className={Styles.bluetoothView}>
          <Image
            src={isBleOnline ? Res.bluetooth : Res.bluetoothDisconnect}
            className={Styles.bluetoothIcon}
          />
          <Text className={`${Styles.connectText} ${isBleOnline && Styles.connectTextActive}`}>
            {isBleOnline ? Strings.getLang('hasConnected') : Strings.getLang('unConnected')}
          </Text>
        </View>
      )}
    </View>
  );
});
