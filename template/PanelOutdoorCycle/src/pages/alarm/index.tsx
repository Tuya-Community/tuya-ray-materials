import React, { useMemo } from 'react';
import { View } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
import { TopBar, DpListItem } from '@/components';
import { useDevice } from '@ray-js/panel-sdk';
import List from '@ray-js/components-ty-cell';
import Strings from '@/i18n';
import useJumpPage from '@/hooks/useJumpPage';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

export const AlarmPage = () => {
  const devInfo = useDevice(device => device.devInfo);

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
      <TopBar title={Strings.getLang('alarmTitle')} />
      <View className={styles.content}>
        <List.Item
          className={styles.listItem}
          title={Strings.getLang('lostMode')}
          content={<Icon type="icon-right" color="var(--app-B1-N4)" size={18} />}
          onClick={() => goToRNPage('000001jt3i')} // 丢失模式二级页
        />
        {dataSource.map(i => (
          <DpListItem code={i.code} key={i.code} />
        ))}
      </View>
    </View>
  );
};

export default AlarmPage;
