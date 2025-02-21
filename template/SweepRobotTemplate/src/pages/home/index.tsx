import HomeTopBar from '@/components/HomeTopBar';
import store from '@/redux';
import { freezeMapUpdate, setLaserMapStateAndEdit } from '@/utils/openApi';
import { getDevInfo, View } from '@ray-js/ray';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import React, { FC, useState } from 'react';

import ControllerBar from './ControllerBar';
import styles from './index.module.less';
import Map from './Map';

const Home: FC = () => {
  const [mapStatus, setMapStatus] = useState<ENativeMapStatusEnum>(ENativeMapStatusEnum.normal); // 地图状态

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

  return (
    <View className={styles.container}>
      {/* Topbar */}
      <HomeTopBar />
      {/* 操作栏 */}
      <ControllerBar mapStatus={mapStatus} setMapStatus={setMapStatusChange} />
      {/* 实时地图 */}
      <Map mapStatus={mapStatus} />
    </View>
  );
};

export default Home;
