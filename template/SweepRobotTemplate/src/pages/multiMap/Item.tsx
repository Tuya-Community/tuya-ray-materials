import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Text, View, hideLoading, showLoading } from '@ray-js/ray';
import HistoryMapView from '@/components/HistoryMapView';
import { Button, ToastInstance } from '@ray-js/smart-ui';
import { useActions } from '@ray-js/panel-sdk';
import { useDispatch } from 'react-redux';
import {
  fetchMultiMaps,
  saveJsonFile,
  translateFileName,
  updateMultiMap,
} from '@/redux/modules/multiMapsSlice';
import {
  DELETE_MAP_CMD_ROBOT_V1,
  USE_MAP_CMD_ROBOT_V1,
  decodeDeleteMap0x2d,
  decodeUseMap0x2f,
  encodeDeleteMap0x2c,
  encodeUseMap0x2e,
} from '@ray-js/robot-protocol';
import Strings from '@/i18n';
import { snapshot } from '@/utils/openApi';
import { emitter } from '@/utils';
import { useDebounceFn } from 'ahooks';
import { commandTransCode } from '@/constant/dpCodes';

import styles from './index.module.less';

type Props = {
  data: MultiMap;
};

const Item: FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  const actions = useActions();
  const { mapId, id, bucket, snapshotImage, file, title, time, filePathKey } = data;
  const timerRef = useRef<NodeJS.Timeout>(null);
  const mapIdRef = useRef<string>(null);

  const history = useMemo(() => {
    return {
      bucket,
      file,
    };
  }, [bucket, file]);

  const handleDelete = () => {
    showLoading({ title: '' });
    actions[commandTransCode].set(encodeDeleteMap0x2c({ id }));

    timerRef.current = setTimeout(() => {
      ToastInstance({
        message: Strings.getLang('dsc_delete_map_fail'),
      });
    }, 10 * 1000);
  };

  const handleUseMap = () => {
    showLoading({ title: '' });
    actions[commandTransCode].set(
      encodeUseMap0x2e({
        mapId,
        url: file,
      })
    );

    timerRef.current = setTimeout(() => {
      ToastInstance({
        message: Strings.getLang('dsc_use_map_fail'),
      });
    }, 10 * 1000);
  };

  const onVirtualInfoRendered = useDebounceFn(
    (data: { rendered: boolean; data: { areaInfoList: any[] } }) => {
      const { rendered } = data;
      if (rendered && mapIdRef.current) {
        setTimeout(() => {
          snapshot(mapIdRef.current)
            .then(snapshotImage => {
              if (snapshotImage && snapshotImage.image) {
                const fileName = translateFileName(filePathKey);

                dispatch(
                  updateMultiMap({
                    id: filePathKey,
                    changes: {
                      snapshotImage,
                    },
                  })
                );

                saveJsonFile(snapshotImage, fileName);
              }
            })
            .catch(e => {
              console.log('onVirtualInfoRendered error', e);
            });
        }, 1000);
      }
    },
    { wait: 1000 }
  ).run;

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
        <HistoryMapView
          history={history}
          onMapId={(data: any) => {
            mapIdRef.current = data.mapId;
          }}
          pathVisible
          enableGesture={false}
          snapshotImage={snapshotImage}
          onVirtualInfoRendered={onVirtualInfoRendered}
        />
      </View>
    </View>
  );
};

export default Item;
