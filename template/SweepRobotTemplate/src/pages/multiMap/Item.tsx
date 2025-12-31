import React, { FC, useEffect, useRef } from 'react';
import { Image, Text, View, getSystemInfoSync, hideLoading, showLoading } from '@ray-js/ray';
import { Button, ToastInstance } from '@ray-js/smart-ui';
import { useActions } from '@ray-js/panel-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMultiMaps } from '@/redux/modules/multiMapsSlice';
import {
  DELETE_MAP_CMD_ROBOT_V1,
  USE_MAP_CMD_ROBOT_V1,
  decodeDeleteMap0x2d,
  decodeUseMap0x2f,
  encodeDeleteMap0x2c,
  encodeUseMap0x2e,
} from '@ray-js/robot-protocol';
import Strings from '@/i18n';
import { emitter } from '@/utils';
import { commandTransCode } from '@/constant/dpCodes';
import Loading from '@/components/Loading';
import { ReduxState } from '@/redux';

import ossApiInstance from '@/api/ossApi';
import styles from './index.module.less';

type Props = {
  data: MultiMap;
};

const Item: FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  const actions = useActions();
  const { mapId, id, bucket, title, time, robotUseFile, filePathKey } = data;

  const { image, mapWidth, mapHeight } = useSelector(
    (state: ReduxState) => state.multiMaps.snapshotImageMap[filePathKey]
  ) ?? { image: undefined, mapWidth: 0, mapHeight: 0 };

  const timerRef = useRef<NodeJS.Timeout>(null);

  const handleDelete = () => {
    showLoading({ title: '' });
    actions[commandTransCode].set(encodeDeleteMap0x2c({ id }));

    timerRef.current = setTimeout(() => {
      ToastInstance({
        message: Strings.getLang('dsc_delete_map_fail'),
      });
    }, 10 * 1000);
  };

  const handleUseMap = async () => {
    if (getSystemInfoSync().brand === 'devtools') {
      ToastInstance(
        'The IDE cannot obtain the complete URL temporarily, so it cannot properly issue the correct [Use Map] command. Please debug this feature on a real device.'
      );
      return;
    }

    showLoading({ title: '' });

    /**
     * IDE上暂时无法获得完整的url，所以无法正常下发正确的[使用地图]指令，请在真机上调试该功能
     */
    const { data: url } = await ossApiInstance.getCloudFileUrl(bucket, robotUseFile);

    actions[commandTransCode].set(
      encodeUseMap0x2e({
        mapId,
        url,
      })
    );

    timerRef.current = setTimeout(() => {
      ToastInstance({
        message: Strings.getLang('dsc_use_map_fail'),
      });
    }, 10 * 1000);
  };

  useEffect(() => {
    const handleUseOrDeleteResponse = ({ cmd, command }) => {
      if (timerRef.current) {
        if (cmd === DELETE_MAP_CMD_ROBOT_V1) {
          const deleteMapResponse = decodeDeleteMap0x2d({ command });
          if (deleteMapResponse) {
            clearTimeout(timerRef.current);
            hideLoading();

            if (deleteMapResponse.success) {
              ToastInstance.success({
                message: Strings.getLang('dsc_delete_map_success'),
              });
              dispatch(fetchMultiMaps());
            } else {
              ToastInstance.fail({
                message: Strings.getLang('dsc_delete_map_fail'),
              });
            }

            return;
          }
        }

        if (cmd === USE_MAP_CMD_ROBOT_V1) {
          const useMapResponse = decodeUseMap0x2f({ command });
          if (useMapResponse) {
            clearTimeout(timerRef.current);
            hideLoading();

            if (useMapResponse.success) {
              ToastInstance.success({
                message: Strings.getLang('dsc_use_map_success'),
              });
            } else {
              ToastInstance.fail({
                message: Strings.getLang('dsc_use_map_fail'),
              });
            }
          }
        }
      }
    };

    emitter.on('receiveUseOrDeleteResponse', handleUseOrDeleteResponse);

    return () => {
      emitter.off('receiveUseOrDeleteResponse', handleUseOrDeleteResponse);
    };
  }, []);

  return (
    <View className={styles.item}>
      <View className={styles.header}>
        <View className={styles.left}>
          <Text className={styles.title}>{title}</Text>
          <Text className={styles.subTitle}>{time}</Text>
        </View>
        <View className={styles.right}>
          <Button type="primary" onClick={handleUseMap}>
            {Strings.getLang('dsc_map_use')}
          </Button>
          <Button type="danger" onClick={handleDelete}>
            {Strings.getLang('dsc_delete_map')}
          </Button>
        </View>
      </View>
      <View className={styles.mapWrapper}>
        {image && <Image className={styles.mapImage} src={image} mode="aspectFit" />}

        <Loading isLoading={!image} />
      </View>
    </View>
  );
};

export default Item;
