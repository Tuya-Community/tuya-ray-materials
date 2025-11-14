import { useCommandTransData, useMapData, usePathData } from '@/hooks';
import store from '@/redux';
import { selectMapStateByKey, updateMapState } from '@/redux/modules/mapStateSlice';
import { useProps } from '@ray-js/panel-sdk';
import { getStorageSync, getSystemInfoSync } from '@ray-js/ray';
import { StreamDataNotificationCenter, useP2PDataStream } from '@ray-js/robot-data-stream';
import log4js from '@ray-js/log4js';
import React, { useEffect, useMemo } from 'react';
import { customizeModeSwitchCode, statusCode } from '@/constant/dpCodes';
import { useDispatch, useSelector } from 'react-redux';
import { APP_LOG_TAG, MAP_CONFIG } from '@/constant';
import useVisionData from '@/hooks/useVisionData';
import useImgDialog from '@/hooks/useImageDialog';
import WebViewMap from '@/components/Map/WebViewMap';
import { merge } from 'lodash-es';
import {
  DeepPartialAppConfig,
  DeepPartialRuntimeConfig,
  DetectedObjectParam,
  MapApi,
  MapState,
  RoomData,
  SpotParam,
  ZoneParam,
} from '@ray-js/robot-map';
import { devices } from '@/devices';
import { setMapApi } from '@/redux/modules/mapApisSlice';
import { robotIsNotWorking } from '@/utils/robotStatus';

const Map: React.FC = () => {
  const dispatch = useDispatch();
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const dpCustomizeModeSwitch = useProps(props => props[customizeModeSwitchCode]);
  const currentMode = useSelector(selectMapStateByKey('currentMode'));
  const selectRoomIds = useSelector(selectMapStateByKey('selectRoomIds'));
  const editingCleanZoneIds = useSelector(selectMapStateByKey('editingCleanZoneIds'));

  const virtualWalls = useSelector(selectMapStateByKey('virtualWalls'));
  const forbiddenSweepZones = useSelector(selectMapStateByKey('forbiddenSweepZones'));
  const forbiddenMopZones = useSelector(selectMapStateByKey('forbiddenMopZones'));
  const cleanZones = useSelector(selectMapStateByKey('cleanZones'));
  const spots = useSelector(selectMapStateByKey('spots'));

  const { imgDialogElement, startVisionImgTask } = useImgDialog({ waitTime: 5000 });

  const runtime = useMemo<DeepPartialRuntimeConfig>(() => {
    return {
      enableRoomSelection: currentMode === 'select_room',
      selectRoomIds,
      editingSpotIds:
        robotIsNotWorking(dpStatus) && currentMode === 'pose' ? spots.map(spot => spot.id) : [],
      editingCleanZoneIds,
      showRoomProperty: dpCustomizeModeSwitch,
    };
  }, [currentMode, dpStatus, selectRoomIds, spots, editingCleanZoneIds, dpCustomizeModeSwitch]);

  /**
   * 可选参数, 机器人使用视觉识别的缩略概况数据从这里抛出
   * @param data
   */
  const onReceiveAIPicData = (data: string) => {
    StreamDataNotificationCenter.emit('receiveAIPicData', data);
  };

  /**
   * 可选参数, 机器人使用视觉识别的高清原图从这里抛出
   * @param data
   */
  const onReceiveAIPicHDData = (data: string) => {
    StreamDataNotificationCenter.emit('receiveAIPicHDData', data);
  };

  const { onMapData } = useMapData();
  const { onPathData } = usePathData();

  const { appendDownloadStreamDuringTask } = useP2PDataStream(
    devices.common.getDevInfo().devId,
    onMapData,
    onPathData,
    {
      logTag: APP_LOG_TAG,
      onReceiveAIPicData,
      onReceiveAIPicHDData,
    }
  );

  // AI Vision 需要你的设备支持IPC 视觉识别能力, 若不支持, 则不会收到数据
  // AI 视觉识别协议的具体内容, 请咨询对应的项目经理或产品经理
  useVisionData();
  useCommandTransData();

  useEffect(() => {
    if (getSystemInfoSync().brand === 'devtools') {
      // (加载缓存地图功能) 默认只在IDE环境下使用，如果业务需求需要可以去掉这个判断
      const cacheMap = getStorageSync({
        key: `map_${devices.common.getDevInfo().devId}`,
      });
      const cachePath = getStorageSync({
        key: `path_${devices.common.getDevInfo().devId}`,
      });

      // IDE 暂时不支持Vision的数据推送
      // const cacheVision = getStorageSync({
      //   key: `vision_${devices.common.getDevInfo().devId}`,
      // });

      if (cacheMap) {
        onMapData(cacheMap as string);
      }
      if (cachePath) {
        onPathData(cachePath as string);
      }
      // IDE 暂时不支持Vision的数据推送
      // if (cacheVision) {
      //   StreamDataNotificationCenter.emit('receiveAIPicData', cacheVision);
      // }
    }
  }, []);

  /**
   * 点击AI Vision 虚拟物体
   * @param data
   */
  const handleClickDetectedObject = (object: DetectedObjectParam) => {
    if (getSystemInfoSync().brand === 'devtools') {
      log4js.warn(
        '【HomeMapView】==> appendDownloadStreamDuringTask in IDE mode is not supported yet'
      );
      return;
    }
    const { xHex, yHex } = object.customData || {};

    if (xHex && yHex) {
      const fileName = `aiHD_${xHex}_${yHex}.bin`;
      const successCallback = () => {
        log4js.info('【HomeMapView】==> appendDownloadStreamDuringTask success', object);
      };
      const failCallback = () => {
        log4js.info('【HomeMapView】==> appendDownloadStreamDuringTask fail', object);
      };
      // 开启文件下载
      // 相当于在原来下载的文件列表中增加下载的文件，AI的数据只会收到一次
      appendDownloadStreamDuringTask([fileName], successCallback, failCallback);

      // 开启弹窗显示流程
      startVisionImgTask();
    }
  };

  const handleMapDrawed = (data: MapState) => {
    dispatch(
      updateMapState({
        mapSize: {
          width: data.width,
          height: data.height,
        },
        mapId: data.id,
        version: data.version as 0 | 1 | 2,
        origin: data.origin,
        charger: data.charger,
        mapStable: data.status,
      })
    );
  };

  const handleMapReady = (mapApi: MapApi) => {
    // 将 mapApi 实例存储到 Redux，方便其他组件调用
    dispatch(setMapApi({ key: 'home', mapApi }));

    // 由于ota的弹窗打开时，地图webview还没有加载导致nativedisable失败，弹窗无法点击，全局使用disableOtaDialog禁用了ota自动升级的弹窗展示
    // 业务侧加载到webView后，调用ty.panel.checkOTAUpdate方法来检查是否有ota更新
    setTimeout(() => {
      (ty as any).panel.checkOTAUpdate(devices.common.getDevInfo().devId, true);
    }, 2000);
  };

  const handleClickRoom = (data: RoomData) => {
    if (robotIsNotWorking(dpStatus) && currentMode === 'select_room') {
      const { selectRoomIds } = store.getState().mapState;

      if (selectRoomIds.includes(data.id)) {
        dispatch(updateMapState({ selectRoomIds: selectRoomIds.filter(id => id !== data.id) }));
      } else {
        dispatch(updateMapState({ selectRoomIds: [...selectRoomIds, data.id] }));
      }
    }
  };

  const handleClickCleanZone = (data: ZoneParam) => {
    dispatch(updateMapState({ editingCleanZoneIds: [data.id] }));
  };

  const handleUpdateCleanZone = (cleanZone: ZoneParam) => {
    dispatch(
      updateMapState({
        cleanZones: cleanZones.map(zone => (zone.id === cleanZone.id ? cleanZone : zone)),
      })
    );
  };

  const handleUpdateSpot = (spot: SpotParam) => {
    dispatch(updateMapState({ spots: [spot] }));
  };

  const handleRemoveCleanZone = (id: string) => {
    dispatch(updateMapState({ cleanZones: cleanZones.filter(zone => zone.id !== id) }));
  };

  return (
    <>
      <WebViewMap
        style={{
          height: '75vh',
        }}
        config={merge<DeepPartialAppConfig, DeepPartialAppConfig, DeepPartialAppConfig>(
          {},
          MAP_CONFIG,
          {
            global: {
              containerHeight: '75vh',
            },
          }
        )}
        virtualWalls={virtualWalls}
        forbiddenSweepZones={forbiddenSweepZones}
        forbiddenMopZones={forbiddenMopZones}
        cleanZones={cleanZones}
        spots={spots}
        runtime={runtime}
        onMapReady={handleMapReady}
        onMapDrawed={handleMapDrawed}
        onClickRoom={handleClickRoom}
        onClickRoomProperties={handleClickRoom}
        onClickCleanZone={handleClickCleanZone}
        onUpdateCleanZone={handleUpdateCleanZone}
        onUpdateSpot={handleUpdateSpot}
        onRemoveCleanZone={handleRemoveCleanZone}
        onClickDetectedObject={handleClickDetectedObject}
      />
      {imgDialogElement}
    </>
  );
};

export default Map;
