import React from 'react';
import { View, Image, Text } from '@ray-js/ray';
import Strings from '@/i18n';
import { openPlayCoolFunctional } from '@/utils/openPlayCoolFunctional';
import { lampSchemaMap } from '@/devices/schema';
import { useSupport } from '@ray-js/panel-sdk';
import { useCdnImgUrl } from '@/utils/getCdnImgUrl';
import styles from './index.module.less';

const { dreamlight_scene_mode } = lampSchemaMap;

export const CoolBarCard = () => {
  const support = useSupport();
  const url = useCdnImgUrl('coolBarBg.png');
  const supportDreamlightSceneMode = support.isSupportDp(dreamlight_scene_mode.code);
  if (!supportDreamlightSceneMode) return null;
  return (
    <View className={styles.banner} onClick={() => openPlayCoolFunctional()}>
      {url && <Image src={url} className={styles.image} />}
      <Text className={styles.text}>{Strings.getLang('coolBarTip')}</Text>
    </View>
  );
};
