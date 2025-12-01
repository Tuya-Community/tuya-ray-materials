import React, { useMemo } from 'react';
import { View, Text, Button, Image } from '@ray-js/components';

import Strings from '@/i18n';

import Res from '@/res';

// @ts-ignore
import styles from './index.module.less';

const Index = ({ total, startSync }) => {
  return (
    <View className={styles.container}>
      <Text className={styles.tip}>{Strings.formatValue('sync_tip_new', total)}</Text>
      <Button className={styles.syncBtn} onClick={startSync}>
        <Image className={styles.icon} src={Res.syncInitIcon} />
        <Text>{Strings.getLang('sync_btn_text')}</Text>
      </Button>
    </View>
  );
};

export default Index;
