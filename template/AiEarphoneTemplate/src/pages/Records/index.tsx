import React, { FC, useEffect, useState } from 'react';
import { View, ScrollView, Text } from '@ray-js/components';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { TopBar } from '@/components';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import { convertSecondsToTimeByLang } from '@/utils';
// eslint-disable-next-line import/named
import { ShopType } from '@/components/ShopTypeTab';
// @ts-ignore
import styles from './index.module.less';

const Records: FC = () => {
  const { screenHeight, safeBottomHeight, topBarHeight } = useSelector(selectSystemInfo);

  const [offlinePurchaseOrderList, setOfflinePurchaseOrderList] = useState<any>([]);
  const [realtimePurchaseOrderList, setRealtimePurchaseOrderList] = useState<any>([]);

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  const [currTab, setCurrTab] = useState<ShopType>('offline');

  return (
    <View className={styles.container}>
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
      >
        {(currTab === 'offline' ? offlinePurchaseOrderList : realtimePurchaseOrderList).map(
          item => (
            <View className={styles.row} key={item.resourceCode}>
              <Text className={styles.time}>
                {dayjs(item.purchaseTime).format('YYYY/MM/DD HH:mm:ss')}
              </Text>
              <Text className={styles.consuming}>{convertSecondsToTimeByLang(item.quantity)}</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default React.memo(Records);
