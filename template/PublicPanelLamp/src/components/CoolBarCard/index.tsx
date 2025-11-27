import React from 'react';
import { View, Image, Text } from '@ray-js/ray';
import Strings from '@/i18n';
import { getRoad, openPlayCoolFunctional } from '@/utils/openPlayCoolFunctional';
import { lampSchemaMap } from '@/devices/schema';
import { useDevInfo, useSupport } from '@ray-js/panel-sdk';
import styles from './index.module.less';

const { scene_data, dreamlight_scene_mode } = lampSchemaMap;

export const CoolBarCard = () => {
  const support = useSupport();
  const supportSceneData = support.isSupportDp(scene_data.code);
  const supportDreamlightSceneMode = support.isSupportDp(dreamlight_scene_mode.code);
  const deviceInfo = useDevInfo();
  const road = getRoad(deviceInfo);
  if (!supportSceneData && !supportDreamlightSceneMode) return null;
  return (
    <View className={styles.banner} onClick={() => openPlayCoolFunctional(supportSceneData, road)}>
      <Image src="/images/coolBarBg.png" className={styles.image} />
      <Text className={styles.text}>{Strings.getLang('coolBarTip')}</Text>
    </View>
  );
};
