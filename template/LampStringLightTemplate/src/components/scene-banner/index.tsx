import React from 'react';

import { PRODUCT_CODE } from '@/constant';
import { devices } from '@/devices';
import { useAsync } from '@/hooks/useAsync';
import { useProductVerify } from '@/hooks/useProductVerify';
import res from '@/res';
import { Image, View } from '@ray-js/ray';

import Strings from '@/i18n';
import { dpCodes } from '@/constant/dpCodes';
import styles from './index.module.less';

export interface SceneBannerProps {}

export const SceneBanner: React.FC<SceneBannerProps> = ({}) => {
  const devInfo = devices.common.getDevInfo();
  // @ts-ignore
  const devId = devInfo.devId || '';
  // @ts-ignore
  const groupId = devInfo.groupId || '';

  const { run: clickSceneLib } = useAsync(
    async () => {
      const jumpUrl = `functional://rayPlayCoolFunctional/home?deviceId=${devId}&groupId=${groupId}&type=C`;
      console.log('jumpUrl', jumpUrl);

      // @ts-ignore
      if (typeof ty.presetFunctionalData === 'function') {
        // @ts-ignore
        ty.presetFunctionalData({
          url: jumpUrl,
          data: {
            deviceId: devId || groupId,
            deviceIds: encodeURIComponent([devId || groupId].join(',')),
            dpCode: dpCodes.scene_data,
            lightNum: 5,
            type: 'C',
          },
        });
      }

      ty.navigateTo({
        url: jumpUrl,
        fail(e) {
          console.log(e);
        },
        success(e) {
          console.log(e);
        },
      });
    },
    [devId, groupId],
    {
      manual: true,
    }
  );

  return (
    <View className={styles.bannerWrap} hoverClassName="button-hover">
      <Image
        onClick={clickSceneLib}
        mode="aspectFit"
        className={styles.banner}
        src={res.scene_banner}
      />
      <View className={styles.title}>{Strings.getLang('sceneLibName')}</View>
    </View>
  );
};
