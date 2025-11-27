import React, { useEffect } from 'react';
import { View, setNavigationBarTitle } from '@ray-js/ray';
import { DpListItem } from '@/components';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

export function ControlPage() {
  const devInfo = useDevice(device => device.devInfo);

  useEffect(() => {
    setNavigationBarTitle({ title: Strings.getLang('controlTitle') });
  }, []);

  const dataSource = devInfo.schema.filter(
    schema =>
      [
        dpCodes.cruiseSwitch,
        dpCodes.speedLimitEnum,
        dpCodes.speedLimitE,
        dpCodes.energyRecoveryLevel,
        dpCodes.unitSet,
        dpCodes.startMode,
      ].indexOf(schema.code) !== -1 || /^ride_mode_/.test(schema.code)
  );

  return (
    <View className={styles.container}>
      {dataSource.map(i => (
        <DpListItem code={i.code} key={i.code} />
      ))}
    </View>
  );
}

export default ControlPage;
