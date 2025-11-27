import React, { useEffect, useMemo } from 'react';
import { View, setNavigationBarTitle } from '@ray-js/ray';
import { Cell, CellGroup } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import { DpListItem } from '@/components';
import Strings from '@/i18n';
import useJumpPage from '@/hooks/useJumpPage';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

export const AlarmPage = () => {
  const devInfo = useDevice(device => device.devInfo);

  useEffect(() => {
    setNavigationBarTitle({ title: Strings.getLang('alarmTitle') });
  }, []);

  const dataSource = useMemo(() => {
    return devInfo.schema.filter(
      schema =>
        [dpCodes.moveAlarm, dpCodes.antiThefSensitivity].indexOf(schema.code) !== -1 ||
        /^alarm_/.test(schema.code)
    );
  }, [devInfo]);

  const { goToRNPage } = useJumpPage(devInfo);

  return (
    <View className={styles.container}>
      <View className={styles.settingItem} onClick={() => goToRNPage('000001jt3i')}>
        <CellGroup inset>
          <Cell title={Strings.getLang('lostMode')} value="" isLink />
        </CellGroup>
      </View>
      {dataSource.map(i => (
        <DpListItem code={i.code} key={i.code} />
      ))}
    </View>
  );
};

export default AlarmPage;
