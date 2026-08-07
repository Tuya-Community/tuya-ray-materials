import React, { FC, useEffect } from 'react';
import { View, ScrollView } from '@ray-js/components';
import { useSelector } from 'react-redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { TopBar } from '@/components';
import { ActionRow } from '@/components/ActionRow';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import Res from '@/res';
// @ts-ignore
import styles from './index.module.less';

const Setting: FC = () => {
  useAppFloatCtrl(true);
  const { screenHeight, safeBottomHeight, topBarHeight } = useSelector(selectSystemInfo);

  useEffect(() => {
    ty.hideMenuButton();
  }, []);

  return (
    <View className={styles.container} >
      <TopBar title="Earphone settings" />
      <ScrollView
        className={styles.main}
        refresherTriggered={false}
        scrollY
        style={{
          height: `${screenHeight - topBarHeight - safeBottomHeight}px`,
        }}
        hideScrollbar={true}
      >
        <ActionRow label="Countdown" actionType="arrow" onClick={() => { }} />
        <ActionRow label="Bluetooth Name" actionType="arrow" onClick={() => { }} />
        <ActionRow label="Reset" actionType="arrow" onClick={() => { }} />
      </ScrollView>
    </View>
  );
};

export default React.memo(Setting);
