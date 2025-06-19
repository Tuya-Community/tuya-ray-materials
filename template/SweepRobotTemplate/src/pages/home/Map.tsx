import { useCommandTransData, useMapData, usePathData } from '@/hooks';
import Strings from '@/i18n';
import store from '@/redux';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { foldableSingleRoomInfo } from '@/utils/openApi';
import { useProps } from '@ray-js/panel-sdk';
import { getDevInfo, getStorageSync, getSystemInfoSync, showToast } from '@ray-js/ray';
import { StreamDataNotificationCenter, useP2PDataStream } from '@ray-js/robot-data-stream';
import { MapHeader, RoomDecoded, parseRoomId } from '@ray-js/robot-protocol';
import log4js from '@ray-js/log4js';
import React, { useEffect, useRef } from 'react';
import { customizeModeSwitchCode, modeCode, statusCode } from '@/constant/dpCodes';
import { useDispatch } from 'react-redux';
import { ENativeMapStatusEnum } from '@ray-js/robot-sdk-types';
import { APP_LOG_TAG } from '@/constant';
import useVisionData from '@/hooks/useVisionData';
import useImgDialog from '@/hooks/useImageDialog';
import WebViewMap from '@/components/MapView/WebViewMap';

type Props = {
  mapStatus: number;
};

const Map: React.FC<Props> = ({ mapStatus }) => {
  const dispatch = useDispatch();
  // dp点
  const dpMode = useProps(props => props[modeCode]) as Mode;
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const customizeModeSwitchState = useProps(props => props[customizeModeSwitchCode]);
  const mapId = useRef('');

  const { imgDialogElement, startVisionImgTask } = useImgDialog({ waitTime: 5000 });

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
    getDevInfo().devId,
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
        key: `map_${getDevInfo().devId}`,
      });
      const cachePath = getStorageSync({
        key: `path_${getDevInfo().devId}`,
      });

      // IDE 暂时不支持Vision的数据推送
      // const cacheVision = getStorageSync({
      //   key: `vision_${getDevInfo().devId}`,
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

  /**
   * 点击AI Vision 虚拟物体
   * @param data
   */
  const onClickMaterial = ({ data }: any) => {
    if (getSystemInfoSync().brand === 'devtools') {
      log4js.warn(
        '【HomeMapView】==> appendDownloadStreamDuringTask in IDE mode is not supported yet'
      );
      return;
    }
    const { xHex, yHex } = data.extends || {};

    if (xHex && yHex) {
      const fileName = `aiHD_${xHex}_${yHex}.bin`;
      const successCallback = () => {
        log4js.info('【HomeMapView】==> appendDownloadStreamDuringTask success', data);
      };
      const failCallback = () => {
        log4js.info('【HomeMapView】==> appendDownloadStreamDuringTask fail', data);
      };
      // 开启文件下载
      // 相当于在原来下载的文件列表中增加下载的文件，AI的数据只会收到一次
      appendDownloadStreamDuringTask([fileName], successCallback, failCallback);

      // 开启弹窗显示流程
      startVisionImgTask();
    }
  };

  const uiInterFace = React.useMemo(() => {
    return {
      isCustomizeMode: customizeModeSwitchState, // 是否显示房间属性折叠标签
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
    <>
      <WebViewMap
        uiInterFace={uiInterFace}
        onMapId={onMapId}
        onClickSplitArea={onClickSplitArea}
        onDecodeMapData={onDecodeMapData}
        onClickRoomProperties={onClickRoomProperties}
        onClickMaterial={onClickMaterial}
        onClickRoom={onClickRoom}
        style={{
          height: '75vh',
        }}
      />
      {imgDialogElement}
    </>
  );
};

export default Map;
