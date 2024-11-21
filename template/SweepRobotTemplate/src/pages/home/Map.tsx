import MapView from '@/components/MapView';
import { useCommandTransData, useMapData, usePathData } from '@/hooks';
import Strings from '@/i18n';
import store from '@/redux';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { foldableSingleRoomInfo } from '@/utils/openApi';
import { isRobotQuiet } from '@/utils/robotStatus';
import { useProps } from '@ray-js/panel-sdk';
import { View, getDevInfo, getStorageSync, getSystemInfoSync, showToast } from '@ray-js/ray';
import { StreamDataNotificationCenter, useP2PDataStream } from '@ray-js/robot-data-stream';
import { MapHeader, RoomDecoded, parseRoomId } from '@ray-js/robot-protocol';
import log4js from '@ray-js/log4js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { customizeModeSwitchCode, modeCode, statusCode } from '@/constant/dpCodes';
import { useDispatch, useSelector } from 'react-redux';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { APP_LOG_TAG } from '@/constant';

type Props = {
  mapStatus: number;
};

const Map: React.FC<Props> = ({ mapStatus }) => {
  const dispatch = useDispatch();

  // 状态栏高度
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  // dp点
  const dpMode = useProps(props => props[modeCode]) as Mode;
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const customizeModeSwitchState = useProps(props => props[customizeModeSwitchCode]);
  const mapId = useRef('');

  const [mapLoadEnd, setMapLoadEnd] = useState(false);

  const onReceiveMapData = (data: string) => {
    StreamDataNotificationCenter.emit('receiveMapData', data);
  };

  const onReceivePathData = (data: string) => {
    StreamDataNotificationCenter.emit('receivePathData', data);
  };

  useP2PDataStream(getDevInfo().devId, onReceiveMapData, onReceivePathData, {
    logTag: APP_LOG_TAG,
  });

  useMapData();
  usePathData();
  useCommandTransData();

  useEffect(() => {
    if (getSystemInfoSync().brand === 'devtools') {
      // (加载缓存地图功能) 默认只在IDE环境下使用，如果业务需求需要可以去掉这个判断
      const cacheMap = getStorageSync({
        key: `map_${getDevInfo().devId}`,
      });
      const cachePath = getStorageSync({
        key: `path_${getDevInfo().devId}`,
      });

      if (cacheMap) {
        StreamDataNotificationCenter.emit('receiveMapData', cacheMap);
      }
      if (cachePath) {
        StreamDataNotificationCenter.emit('receivePathData', cachePath);
      }
    }
  }, []);

  const handleIDEP2pData = ({ map, path }: IDEP2pData) => {
    // IDE环境下的P2p数据会在这里收到
    if (map) {
      onReceiveMapData(map);
    }

    if (path) {
      onReceivePathData(path);
    }
  };

  /**
   * 地图唯一标识
   * @param data
   */
  const onMapId = async (data: any) => {
    mapId.current = data.mapId;
    dispatch(
      updateMapData({
        mapId: data.mapId,
      })
    );
  };

  /**
   * 地图渲染完成回调
   * @param success
   */
  const onMapLoadEnd = (success: boolean) => {
    log4js.info('【HomeMapView】==> onMapLoadEnd', success, new Date().getTime());
    setMapLoadEnd(success);
    dispatch(updateMapData({ mapLoadEnd: success }));
  };

  /**
   * 选区
   * @param data
   * @returns
   */
  const onClickSplitArea = (data: any) => {
    const { version, selectRoomData } = store.getState().mapState;

    if (!data || !data.length || !Array.isArray(data)) {
      return;
    }
    const room = data[0];
    const { pixel } = room;
    const roomId = parseRoomId(pixel, version);
    const maxUnknownId = version === 1 ? 31 : 26;
    if (roomId > maxUnknownId) {
      showToast({
        title: Strings.getLang('dsc_home_selectRoom_unknown'),
        icon: 'error',
      });
      return;
    }

    dispatch(
      updateMapData({
        selectRoomData: selectRoomData.includes(pixel)
          ? selectRoomData.filter((i: string) => i !== pixel)
          : [...selectRoomData, pixel],
      })
    );
  };

  /**
   * 点击房间的回调
   * @param data
   */
  const onClickRoom = data => {
    const { foldableRoomIds } = store.getState().mapState;
    const { roomId, isFoldable } = data;
    const edit = mapStatus !== ENativeMapStatusEnum.normal;
    if (edit) return;
    let curData = [];
    if (!isFoldable && !foldableRoomIds.includes(roomId)) {
      curData = foldableRoomIds.concat([roomId]);
    } else {
      curData = foldableRoomIds.filter((i: string) => i !== roomId);
    }
    dispatch(updateMapData({ foldableRoomIds: curData }));
  };

  const onClickRoomProperties = (data: any) => {
    const {
      properties: { colorHex },
    } = data;
    foldableSingleRoomInfo(mapId.current, colorHex, true);
  };

  const uiInterFace = React.useMemo(() => {
    return {
      isShowCurPosRing: !isRobotQuiet(dpStatus), // 当前点ring
      isCustomizeMode: customizeModeSwitchState, // 是否显示房间属性折叠标签
      isRobotQuiet: isRobotQuiet(dpStatus), // 当前地图是否安静
    };
  }, [dpMode, dpStatus]);

  const onDecodeMapData = (data: { mapHeader: MapHeader; mapRooms: RoomDecoded[] }) => {
    console.log('onDecodeMapData====>', data);
    const { mapHeader, mapRooms } = data;

    dispatch(
      updateMapData({
        pilePosition: {
          theta: mapHeader.chargeDirection || 0,
          startTheta: mapHeader.chargeDirection !== undefined ? 90 : 0,
          ...mapHeader.chargePositionTransformed,
        },
        mapSize: {
          width: mapHeader.mapWidth,
          height: mapHeader.mapHeight,
        },
        dataMapId: mapHeader.id,
        version: mapHeader.version as 0 | 1 | 2,
        origin: { x: mapHeader.originX, y: mapHeader.originY },
        mapStable: mapHeader.mapStable,
        isEmptyMap: mapHeader.mapWidth === 0 || mapHeader.mapHeight === 0,
        roomNum: mapRooms?.length || 0,
      })
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: `${statusBarHeight + 44}px`,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* 地图组件 */}
      <MapView
        isFullScreen
        logPrint
        mapDisplayMode="immediateMap"
        uiInterFace={uiInterFace}
        onMapId={onMapId}
        onClickSplitArea={onClickSplitArea}
        onDecodeMapData={onDecodeMapData}
        onClickRoomProperties={onClickRoomProperties}
        onClickRoom={onClickRoom}
        onMapLoadEnd={onMapLoadEnd}
        onIDEP2pData={handleIDEP2pData}
        showLoading
        mapLoadEnd={mapLoadEnd}
      />
    </View>
  );
};

export default Map;
