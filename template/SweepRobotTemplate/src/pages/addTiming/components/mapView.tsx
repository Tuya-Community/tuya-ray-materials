import MapView from '@/components/MapView';
import store from '@/redux';
import {
  getLaserMapPoints,
  getMapPointsInfo,
  setLaserMapStateAndEdit,
  updateSelectRoom,
} from '@/utils/openApi';
import { View } from '@ray-js/ray';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { map, orderBy } from 'lodash';
import React, { FC, useCallback, useRef, useState } from 'react';

import styles from '../index.module.less';

type Props = {
  setRoomIds: (v: number[]) => void;
  roomIds: number[];
};

export const AddTimingMapView: FC<Props> = props => {
  const mapIdRef = useRef<string>();

  /**
   * 获取选择的房间信息
   */
  const getSelectedRoomIds = async () => {
    if (!mapIdRef.current) return [];
    const { data } = await getMapPointsInfo(mapIdRef.current);

    // 对房间信息排序，并返回roomIds
    if (!data.length) return [];
    const selectRoomIds = map(orderBy(data, ['order'], ['asc']), item => {
      return item.extend.roomId;
    });
    return selectRoomIds;
  };

  const onClickSplitArea = async () => {
    const selectRoomIds = await getSelectedRoomIds();
    handleMapChange?.(selectRoomIds);
  };

  const handleMapChange = r => {
    props.setRoomIds(r);
  };

  const onLoggerInfo = useCallback((data: { info: any; theme: string; args: any }) => {
    console.log(data.info || '', data.theme || '', ...Object.values(data.args || {}));
  }, []);

  const onMapId = async data => {
    const { mapId } = data;
    const { roomNum } = store.getState().mapState;

    // 将地图状态置为编辑状态
    mapIdRef.current = mapId;
    await setLaserMapStateAndEdit(mapId, {
      state: ENativeMapStatusEnum.mapTimerSelect,
      edit: true,
    });
    if (roomNum) {
      updateSelectRoom(mapId, props.roomIds, false);
    }
  };

  const onClickRoom = async data => {
    const aaa = await getLaserMapPoints(mapIdRef.current);
    console.log(aaa);
  };

  return (
    <View className={styles.mapBox}>
      <MapView
        isFullScreen={false}
        onMapId={onMapId}
        onClickSplitArea={onClickSplitArea}
        onClickRoom={onClickRoom}
        onLoggerInfo={onLoggerInfo}
        mapId={mapIdRef.current}
      />
    </View>
  );
};
