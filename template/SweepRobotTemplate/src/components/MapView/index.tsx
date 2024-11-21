import { useMiddlewareMapViewParams } from '@/hooks';
import { View, getSystemInfoSync } from '@ray-js/ray';
import { IndoorMap } from '@ray-js/robot-map-component';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { freezeMapUpdate } from '@/utils/openApi';

import Loading from '../Loading';
import { IProps, mapDisplayModeEnum } from './type';

const MapView: React.FC<IProps> = React.memo(props => {
  const idRef = useRef(String(new Date().getTime()));
  const [isEmpty, setIsEmpty] = useState(false);
  const events = useRef<any>({});

  const onDecodeMapData = useCallback(data => {
    console.log('onDecodeMapData ==>', data);
    props.onDecodeMapData?.(data);
    const { mapWidth, mapHeight } = data.mapHeader;
    // 如果地图的宽高是0 则认为是空地图
    if (mapWidth === 0 || mapHeight === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, []);

  const onDecodePathData = useCallback(data => {
    console.log('onDecodePathData ==>', data);
  }, []);

  const {
    isFullScreen = false,
    showLoading = true,
    isLite,
    mapLoadEnd,
    uiInterFace,
    preCustomConfig,
    pathVisible,
    areaInfoList,
    logPrint = false,
  } = props;

  const params = {
    pathVisible,
    uiInterFace,
    areaInfoList,
    preCustomConfig,
    mapId: idRef.current,
  };

  const mapViewParams = useMiddlewareMapViewParams(params);

  const isIDE = getSystemInfoSync().brand === 'devtools';

  const isLoading = isIDE ? !mapLoadEnd : !mapViewParams.mapDataHex;

  const {
    onMapId = () => {
      //
    },
    onLaserMapPoints = () => {
      console.log('onLaserMapPoints');
    },
    onClickSplitArea = () => {
      console.log('onClickSplitArea');
    },
    onLongPressInAreaView = () => {
      console.log('onLongPressInAreaView');
    },
    onClickRoom = () => {
      console.log('onClickRoom');
    },
    onClickModel = () => {
      console.log('onClickModel');
    },
    onModelLoadingProgress = () => {
      console.log('onModelLoadingProgress');
    },
    onMapLoadEnd = () => {
      console.log('onMapLoadEnd');
    },
    onGestureChange = () => {
      //
    },
    onClickRoomProperties = () => {
      console.log('onClickRoomProperties');
    },
    onPosPoints = () => {
      console.log('onPosPoints');
    },
    onClickMapView = () => {
      console.log('onClickMapView');
    },
    onScreenSnapshot = () => {
      console.log('onScreenSnapshot');
    },
    onRobotPositionChange = () => {
      console.log('onRobotPositionChange');
    },
    onVirtualInfoRendered = () => {
      console.log('onVirtualInfoRendered');
    },
    onRenderContextLost = () => {
      console.log('onRenderContextLost');
    },
    onRenderContextRestored = () => {
      console.log('onRenderContextRestored');
    },
    onContainerVisibilityChange = () => {
      console.log('onContainerVisibilityChange');
    },
    onVirtualInfoOutOfBoundingBox = () => {
      console.log('onVirtualInfoOutOfBoundingBox');
    },
    onClickMaterial = () => {
      console.log('onClickMaterial');
    },
    onIDEP2pData = () => {
      //
    },
  } = props;

  /**
   * 因为与WebView通信的机制，这里必须更新最新的事件，否则可能会导致事件里存在过时的状态
   */
  useEffect(() => {
    events.current.onMapId = onMapId;
    events.current.onLaserMapPoints = onLaserMapPoints;
    events.current.onClickSplitArea = onClickSplitArea;
    events.current.onLongPressInAreaView = onLongPressInAreaView;
    events.current.onClickRoom = onClickRoom;
    events.current.onClickModel = onClickModel;
    events.current.onModelLoadingProgress = onModelLoadingProgress;
    events.current.onMapLoadEnd = onMapLoadEnd;
    events.current.onGestureChange = onGestureChange;
    events.current.onClickRoomProperties = onClickRoomProperties;
    events.current.onPosPoints = onPosPoints;
    events.current.onClickMapView = onClickMapView;
    events.current.onScreenSnapshot = onScreenSnapshot;
    events.current.onRobotPositionChange = onRobotPositionChange;
    events.current.onVirtualInfoRendered = onVirtualInfoRendered;
    events.current.onRenderContextLost = onRenderContextLost;
    events.current.onRenderContextRestored = onRenderContextRestored;
    events.current.onContainerVisibilityChange = onContainerVisibilityChange;
    events.current.onVirtualInfoOutOfBoundingBox = onVirtualInfoOutOfBoundingBox;
    events.current.onClickMaterial = onClickMaterial;
  }, [
    onMapId,
    onLaserMapPoints,
    onClickSplitArea,
    onLongPressInAreaView,
    onClickRoom,
    onClickModel,
    onModelLoadingProgress,
    onMapLoadEnd,
    onGestureChange,
    onClickRoomProperties,
    onPosPoints,
    onClickMapView,
    onScreenSnapshot,
    onRobotPositionChange,
    onVirtualInfoRendered,
    onRenderContextLost,
    onRenderContextRestored,
    onContainerVisibilityChange,
    onVirtualInfoOutOfBoundingBox,
    onClickMaterial,
  ]);

  const eventCallbacks = useRef({
    onMapId: (data: any) => {
      console.log('onMapId', typeof props.onMapId);
      events.current.onMapId?.(data);
    },
    onLaserMapPoints: (data: any) => {
      events.current.onLaserMapPoints?.(data);
    },
    onClickSplitArea: (data: any) => {
      events.current.onClickSplitArea?.(data);
    },
    onLongPressInAreaView: (data: any) => {
      events.current.onLongPressInAreaView?.(data);
    },
    onClickRoom: (data: any) => {
      events.current.onClickRoom?.(data);
    },
    onLoggerInfo: (data: any) => {
      if (logPrint) {
        console.log(data.info || '', data.theme || '', ...Object.values(data.args || {}));
      }
    },
    onClickModel: (data: any) => {
      events.current.onClickModel?.(data);
    },
    onModelLoadingProgress: (data: any) => {
      events.current.onModelLoadingProgress?.(data);
    },
    onMapLoadEnd: (data: any) => {
      events.current.onMapLoadEnd?.(data);
    },
    onGestureChange: (data: any) => {
      events.current.onGestureChange?.(data);
    },
    onClickRoomProperties: (data: any) => {
      events.current.onClickRoomProperties?.(data);
    },
    onPosPoints: (data: any) => {
      events.current.onPosPoints?.(data);
    },
    onClickMapView: (data: any) => {
      events.current.onClickMapView?.(data);
    },
    onScreenSnapshot: (data: any) => {
      events.current.onScreenSnapshot?.(data);
    },
    onRobotPositionChange: (data: any) => {
      events.current.onRobotPositionChange?.(data);
    },
    onVirtualInfoRendered: (data: any) => {
      events.current.onVirtualInfoRendered?.(data);
    },
    onRenderContextLost: (data: any) => {
      events.current.onRenderContextLost?.(data);
    },
    onRenderContextRestored: (data: any) => {
      events.current.onRenderContextRestored?.(data);
    },
    onContainerVisibilityChange: (data: any) => {
      /**
       * 小程序离开当前页面或手机进入后台将冻结地图，需要在回到当前页面后解冻地图并更新
       */
      if (data && data.info) {
        if (data.info.indexOf('foreground') !== -1) {
          freezeMapUpdate(idRef.current, false);
        }
      }

      events.current.onContainerVisibilityChange?.(data);
    },
    onVirtualInfoOutOfBoundingBox: (data: any) => {
      events.current.onVirtualInfoOutOfBoundingBox?.(data);
    },
    onClickMaterial: (data: any) => {
      events.current.onClickMaterial?.(data);
    },
    onD3MapViewModeEnd: (data: any) => {
      events.current.onD3MapViewModeEnd?.(data);
    },
    onSplitLine: (data: any) => {
      events.current.onSplitLine?.(data);
    },
  });

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isFullScreen && (
        <IndoorMap.Full
          {...eventCallbacks.current}
          {...mapViewParams}
          mapId={idRef.current}
          componentId={idRef.current}
          componentBackground="#f6f6f6"
          initUseThread={false}
          enableAICapability
          resourceUsageLevel="high"
          onDecodeMapData={onDecodeMapData}
          onDecodePathData={onDecodePathData}
          onIDEP2pData={onIDEP2pData}
        />
      )}
      {!isFullScreen && (
        <IndoorMap.Dynamic
          {...eventCallbacks.current}
          {...mapViewParams}
          mapId={idRef.current}
          componentId={idRef.current}
          componentBackground="#f6f6f6"
          initUseThread={false}
          enableAICapability
          resourceUsageLevel="high"
          onDecodeMapData={onDecodeMapData}
          onDecodePathData={onDecodePathData}
        />
      )}

      {showLoading && (
        <Loading
          showLoading={showLoading}
          isLoading={isLoading}
          mapLoadEnd={mapLoadEnd}
          isEmpty={isEmpty}
          isLite={isLite}
          isHomeMap={props.mapDisplayMode === mapDisplayModeEnum.immediateMap}
        />
      )}
    </View>
  );
});

export default MapView;
