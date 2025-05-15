import DecisionBar from '@/components/DecisionBar';
import MapView from '@/components/MapView';
import RoomPreferencePopLayout from '@/components/RoomPreferencePopLayout';
import { commandTransCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { emitter } from '@/utils';
import { getAllMapAreaInfo } from '@/utils/openApi';
import { setMapStatusNormal, setMapStatusRename } from '@/utils/openApi/mapStatus';
import { useActions } from '@ray-js/panel-sdk';
import { CoverView, View } from '@ray-js/ray';
import { encodeSetRoomProperty0x22 } from '@ray-js/robot-protocol';
import { onClickSplitArea as onClickSplitAreaFun } from '@ray-js/robot-sdk-types';
import { Toast, ToastInstance } from '@ray-js/smart-ui';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { PROTOCOL_VERSION } from '@/constant';

import styles from './index.module.less';

export const cleanWorkModeEnum = {
  bothWork: 'both_work',
  onlySweep: 'only_sweep',
  onlyMop: 'only_mop',
};

type PreviewCustom = {
  [roomHexId: string]: {
    water_level?: string;
    fan?: string;
    sweep_count?: string;
  };
};

const CleanPreference: FC = () => {
  const [mapLoadEnd, setMapLoadEnd] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [prevCustomRoomInfos, setPrevCustomRoomInfos] = useState<PreviewCustom>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const mapId = useRef('');
  const previewCustomRef = useRef<any>({});
  const curRoomInfoRef = useRef<{ water_level?: string; fan?: string; sweep_count?: string }>();
  const roomHexIdRef = useRef<string>('');
  const dpActions = useActions();

  useEffect(() => {
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_preference'),
    });
    emitter.on('receiveSetRoomPropertyResponse', handleRoomPropertyResponse);

    return () => {
      emitter.off('receiveSetRoomPropertyResponse', handleRoomPropertyResponse);
    };
  }, []);

  useEffect(() => {
    if (Object.keys(prevCustomRoomInfos).length > 0) {
      setActiveConfirm(true);
    } else {
      setActiveConfirm(false);
    }
  }, [prevCustomRoomInfos]);

  const handleRoomPropertyResponse = () => {
    ToastInstance.success({
      message: Strings.getLang('edit_success'),
    });
    curRoomInfoRef.current = {};
    previewCustomRef.current = {};
    setActiveConfirm(false);
  };

  /**
   * 地图加载完成回调
   * @param data
   */
  const onMapId = (data: any) => {
    mapId.current = data.mapId;
  };

  const onClickSplitArea: onClickSplitAreaFun = async res => {
    if (res && res.length > 0) {
      const { extend, pixel } = res[0];
      const { fan, sweep_count, water_level } = extend || {};
      const previewCustomRoomInfo = prevCustomRoomInfos[pixel] || {};
      roomHexIdRef.current = pixel;
      curRoomInfoRef.current = { water_level, fan, sweep_count, ...previewCustomRoomInfo };

      setModalVisible(true);
    }
  };

  /**
   * 地图渲染完成回调
   * @param success
   */
  const onMapLoadEnd = (success: boolean) => {
    setMapLoadEnd(success);

    setMapStatusRename(mapId.current);
  };

  /**
   * 重命名弹窗确定
   * @param tag
   */
  const handleConfirm = (fanValue: string, waterValue: string, cleanCount: string) => {
    const room = prevCustomRoomInfos[roomHexIdRef.current] || {};
    const curRoom = {
      ...room,
      water_level: waterValue,
      fan: fanValue,
      sweep_count: cleanCount,
    };
    setPrevCustomRoomInfos({ ...prevCustomRoomInfos, [roomHexIdRef.current]: curRoom });

    setModalVisible(false);
  };

  /**
   * 重命名取消按钮
   */
  const handleCancel = () => {
    // 取消，弹框关闭，停留在rename
    setModalVisible(false);
  };

  /**
   * 回复地图到正常状态
   */
  const handleNormal = async () => {
    setMapStatusNormal(mapId.current);
    setShowMenuBar(true);
  };

  const onClickRoomProperties = (data: { properties: any }) => {
    const {
      properties: { extend, colorHex },
    } = data;
    const { fan, sweep_count, water_level } = extend || {};
    const previewCustomRoomInfo = prevCustomRoomInfos[colorHex] || {};

    roomHexIdRef.current = colorHex;
    curRoomInfoRef.current = { water_level, fan, sweep_count, ...previewCustomRoomInfo };

    setModalVisible(true);
  };

  /**
   * 取消按钮恢复初始状态
   */
  const _onCancel = () => {
    handleNormal();
    setPrevCustomRoomInfos({});
  };

  /**
   * 确定按钮对应的逻辑
   */
  const handleRoomCustomOk = async () => {
    try {
      const allAreaInfo = await getAllMapAreaInfo(mapId.current);
      const data = [];
      allAreaInfo.forEach(area => {
        const { extend, pixel } = area;
        const { fan, sweep_count, water_level, roomId } = extend || {};
        data.push({
          roomId,
          suction: parseInt(fan, 10),
          cleanTimes: parseInt(sweep_count, 10),
          cistern: parseInt(water_level, 10),
          pixel,
          yMop: 0,
        });
      });
      const res = encodeSetRoomProperty0x22({ rooms: data, version: PROTOCOL_VERSION });
      dpActions[commandTransCode].set(res);
    } catch (error) {
      console.warn('save room properties error\n', error);
    }
  };

  const uiInterFace = useMemo(() => ({ isFoldable: false, isCustomizeMode: true }), []);

  return (
    <View className={styles.container}>
      <MapView
        isFullScreen
        // 修改后存储的临时数据
        preCustomConfig={prevCustomRoomInfos}
        onMapId={onMapId}
        onClickSplitArea={onClickSplitArea}
        onMapLoadEnd={onMapLoadEnd}
        onClickRoomProperties={onClickRoomProperties}
        mapLoadEnd={mapLoadEnd}
        selectRoomData={[]}
        areaInfoList={[]}
        pathVisible={false}
        uiInterFace={uiInterFace}
      />

      <CoverView className={styles.bottomMenuBar}>
        {showMenuBar && mapLoadEnd && (
          <DecisionBar
            activeConfirm={activeConfirm}
            onCancel={_onCancel}
            onConfirm={handleRoomCustomOk}
            tipText={Strings.getLang('desc_modify_room_properties_tip')}
          />
        )}
      </CoverView>

      <RoomPreferencePopLayout
        show={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        fan={`${curRoomInfoRef.current?.fan}`}
        water={`${curRoomInfoRef.current?.water_level}`}
        sweepCount={`${curRoomInfoRef.current?.sweep_count}`}
      />

      <Toast id="smart-toast" />
    </View>
  );
};

export default CleanPreference;
