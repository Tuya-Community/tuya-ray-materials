import React, { FC, useEffect, useState } from 'react';
import { View, ScrollView, Text } from '@ray-js/components';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { TopBar } from '@/components';
import { atopGetPurchaseOrder } from '@/api/shop';
import dayjs from 'dayjs';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import Strings from '@/i18n';
import { convertSecondsToTimeByLang } from '@/utils';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';

import Res from '@/res';
// @ts-ignore
import styles from './index.module.less';

const Records: FC = () => {
  const { screenHeight, safeBottomHeight, topBarHeight } = useSelector(selectSystemInfo);
  const { homeId } = useSelector(selectDevInfo);
  const [offlinePurchaseOrderList, setOfflinePurchaseOrderList] = useState<any>([]);
  useAppFloatCtrl(true);
  const initData = async () => {
    try {
      const offlineList = await atopGetPurchaseOrder(homeId);
      setOfflinePurchaseOrderList(offlineList);
      // const realtimeList = await atopGetPurchaseOrder('rts');
      // setRealtimePurchaseOrderList(realtimeList);
    } catch {}
  };

  useEffect(() => {
    ty.hideMenuButton();
    initData();
  }, []);

  return (
    <View className={styles.container} >
      <TopBar title={Strings.getLang('title_transcription_records')} />
      <View className={styles.header}>
        <Text className={styles.timeLabel}>{Strings.getLang('transcription_records_time')}</Text>
        <Text className={styles.consumingLabel}>
          {Strings.getLang('transcription_records_time_consuming')}
        </Text>
      </View>
      <ScrollView
        className={styles.main}
        refresherTriggered={false}
        scrollY
        style={{
          height: `${screenHeight - topBarHeight - safeBottomHeight - 63 - 36}px`,
        }}
        hideScrollbar={true}
      >
        {offlinePurchaseOrderList.map(item => (
          <View className={styles.row} key={item.resourceCode}>
            <Text className={styles.time}>
              {dayjs(item.purchaseTime).format('YYYY/MM/DD HH:mm:ss')}
            </Text>
            <Text className={styles.consuming}>{convertSecondsToTimeByLang(item.quantity)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(Records);
