import React from 'react';
import { Text, View, Image } from '@ray-js/ray';
import { useDevice, useProps } from '@ray-js/panel-sdk';
import { bluetooth, bluetoothDisconnect } from '@/res';
import { useSelector } from 'react-redux';
import { selectThemeType } from '@/redux/modules/themeSlice';
import { getWifiIcon, getGpsIcon, supportDp } from '@/utils';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import Styles from './index.module.less';

export const Signal = React.memo(
  ({ checkHideDp, isBleOnline }: { checkHideDp: (d: string) => boolean; isBleOnline: boolean }) => {
    const capability = useDevice(device => device.devInfo.capability);
    const isOnline = useDevice(device => device.devInfo.isOnline);
    const theme = useSelector(selectThemeType);
    const isSupportBle = [1024, 1048576, 1049600].indexOf(capability) !== -1;
    const signalStrength4gDpVal = useProps(props => props[dpCodes.signalStrength4g]);
    const signalStrengthDpVal = useProps(props => props[dpCodes.signalStrength]);
    const signalStrengthGpsDpVal = useProps(props => props[dpCodes.signalStrengthGps]);
    const dpSchema = useDevice(device => device.dpSchema);
    const { [dpCodes.signalStrengthGps]: gpsShcema, [dpCodes.signalStrength]: signalSchema } =
      dpSchema;

    // 蓝牙单点&滑板车不展示4g 、gps信号强度
    const signalData = [
      {
        name: 'wifi',
        icon: supportDp(dpCodes.signalStrength4g, dpSchema)
          ? getWifiIcon(signalStrength4gDpVal, theme, 0, 100, !isBleOnline && !isOnline)
          : supportDp(dpCodes.signalStrength, dpSchema)
          ? getWifiIcon(
              signalStrengthGpsDpVal,
              theme,
              signalSchema?.property.min,
              signalSchema?.property.max,
              !isBleOnline && !isOnline
            )
          : null,
        isShow:
          (supportDp(dpCodes.signalStrength4g, dpSchema) &&
            !checkHideDp(dpCodes.signalStrength4g)) ||
          (supportDp(dpCodes.signalStrength, dpSchema) && !checkHideDp(dpCodes.signalStrength)),
      },
      {
        name: 'gps',
        icon: getGpsIcon(
          signalStrengthDpVal,
          theme,
          gpsShcema?.property?.max,
          gpsShcema?.property?.min
        ),
        isShow:
          supportDp(dpCodes.signalStrengthGps, dpSchema) && !checkHideDp(dpCodes.signalStrengthGps),
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
              src={isBleOnline ? bluetooth : bluetoothDisconnect}
              className={Styles.bluetoothIcon}
            />
            <Text className={`${Styles.connectText} ${isBleOnline && Styles.connectTextActive}`}>
              {isBleOnline ? Strings.getLang('hasConnected') : Strings.getLang('unConnected')}
            </Text>
          </View>
        )}
      </View>
    );
  }
);
