import TopBar from '@/components/TopBar';
import { commandTransCode } from '@/constant/dpCodes';
import { devices } from '@/devices';
import store from '@/redux';
import { emitter, getDpIdByCode } from '@/utils';
import { freezeMapUpdate, setLaserMapStateAndEdit } from '@/utils/openApi';
import { View, usePageEvent } from '@ray-js/ray';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import React, { useEffect, useRef, useState } from 'react';

import ControllerBar from './ControllerBar';
import styles from './index.module.less';
import Map from './Map';

export function Home() {
  const [mapStatus, setMapStatus] = useState<ENativeMapStatusEnum>(ENativeMapStatusEnum.normal); // 地图状态
  const dpDataChangeRef = useRef<number>(null);

  /**
   * 修改地图状态&地图编辑状态
   * @param status 地图状态
   */
  const setMapStatusChange = (status: number) => {
    const { mapId } = store.getState().mapState;
    const edit = status !== ENativeMapStatusEnum.normal;
    // 当切换为选区清扫时,冻结地图,阻止地图更新
    if (status === ENativeMapStatusEnum.mapClick) {
      freezeMapUpdate(mapId, true);
    }
    // 切换回来时恢复地图
    if (status === ENativeMapStatusEnum.normal) {
      freezeMapUpdate(mapId, false);
    }

    setLaserMapStateAndEdit(mapId, { state: status, edit: edit || false });
    setMapStatus(status);
  };

  useEffect(() => {
    dpDataChangeRef.current = devices.common.onDpDataChange(({ dps }) => {
      const dpCommandTrans = dps[getDpIdByCode(commandTransCode)];

      if (dpCommandTrans && Object.keys(dps).length <= 1) {
        emitter.emit('receiveCommandTransData', dpCommandTrans);
      }
    });
  }, []);

  usePageEvent('onUnload', () => {
    dpDataChangeRef.current && devices.common.offDpDataChange(dpDataChangeRef.current);
  });

  return (
    <View className={styles.view}>
      {/* 实时地图 */}
      <Map mapStatus={mapStatus} />
      {/* Topbar */}
      <TopBar />
      {/* 操作栏 */}
      <ControllerBar mapStatus={mapStatus} setMapStatus={setMapStatusChange} />
    </View>
  );
}

export default Home;
