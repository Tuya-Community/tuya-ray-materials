import { useMiddlewareMapViewParams } from '@/hooks';
import { View, getSystemInfoSync } from '@ray-js/ray';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { freezeMapUpdate } from '@/utils/openApi';
import { useSelector } from 'react-redux';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { decodeMapHeader } from '@ray-js/robot-protocol';
import RjsMapComponent from '@ray-js/robot-map-component/rjs';

import Loading from '../Loading';
import { IProps } from './type';
import EmptyMap from '../EmptyMap';

const IS_DEV = process.env.NODE_ENV === 'development';

const RjsMap: React.FC<IProps> = React.memo(props => {
  const [mapLoadEnd, setMapLoadEnd] = useState(false);

  const {
    uiInterFace,
    preCustomConfig,
    pathVisible,
    areaInfoList,
    backgroundColor = '#f2f4f6',
    style = {},
    roomPropertyStyle,
  } = props;

  const idRef = useRef(String(new Date().getTime()));
  const originMap = useSelector(selectMapStateByKey('originMap'));

  const isEmpty = useMemo(() => {
    const { mapHeight, mapWidth } = decodeMapHeader(originMap);

    return mapWidth === 0 || mapHeight === 0;
  }, [originMap]);

  const events = useRef<any>({});

  const handleDecodeMapData = useCallback(data => {
    console.log('onDecodeMapData ==>', data);
    props.onDecodeMapData?.(data);
  }, []);

  const handleDecodePathData = useCallback(data => {
    //
  }, []);

  const mapViewParams = useMiddlewareMapViewParams({
    pathVisible,
    uiInterFace,
    areaInfoList,
    preCustomConfig,
    mapId: idRef.current,
    roomPropertyStyle,
    backgroundColor,
  });

  const isIDE = getSystemInfoSync().brand === 'devtools';

  const isLoading = isIDE ? !mapLoadEnd : !mapLoadEnd || !originMap;

  const {
    onMapId = data => {
      console.log('onMapId', data);
    },
    onLaserMapPoints = data => {
      console.log('onLaserMapPoints', data);
    },
    onClickSplitArea = data => {
      console.log('onClickSplitArea', data);
    },
    onLongPressInAreaView = data => {
      console.log('onLongPressInAreaView', data);
    },
    onClickRoom = data => {
      console.log('onClickRoom', data);
    },
    onClickModel = data => {
      console.log('onClickModel', data);
    },
    onModelLoadingProgress = data => {
      console.log('onModelLoadingProgress', data);
    },
    onMapLoadEnd = data => {
      console.log('onMapLoadEnd', data);
    },
    onGestureChange = data => {
      console.log('onGestureChange', data);
    },
    onClickRoomProperties = data => {
      console.log('onClickRoomProperties', data);
    },
    onPosPoints = data => {
      console.log('onPosPoints', data);
    },
    onClickMapView = data => {
      console.log('onClickMapView', data);
    },
    onScreenSnapshot = data => {
      console.log('onScreenSnapshot', data);
    },
    onRobotPositionChange = data => {
      //
    },
    onVirtualInfoRendered = data => {
      //
    },
    onRenderContextLost = data => {
      console.log('onRenderContextLost', data);
    },
    onRenderContextRestored = data => {
      console.log('onRenderContextRestored', data);
    },
    onContainerVisibilityChange = data => {
      console.log('onContainerVisibilityChange', data);
    },
    onVirtualInfoOutOfBoundingBox = data => {
      console.log('onVirtualInfoOutOfBoundingBox', data);
    },
    onClickMaterial = data => {
      console.log('onClickMaterial', data);
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
    // 调试有必要的话，可开启日志打印，注意这会增加通道数据量
    onLoggerInfo:
      IS_DEV && false
        ? (data: any) => {
            console.log(data.info || '', data.theme || '', ...Object.values(data.args || {}));
          }
        : undefined,
    onClickModel: (data: any) => {
      events.current.onClickModel?.(data);
    },
    onModelLoadingProgress: (data: any) => {
      events.current.onModelLoadingProgress?.(data);
    },
    onMapLoadEnd: (data: any) => {
      setMapLoadEnd(true);
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

  console.log('render MapView', mapViewParams);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <RjsMapComponent
        {...eventCallbacks.current}
        {...mapViewParams}
        mapId={idRef.current}
        componentBackground={backgroundColor}
        initUseThread={false}
        resourceUsageLevel="low"
        onDecodeMapData={handleDecodeMapData}
        onDecodePathData={handleDecodePathData}
      />

      {isEmpty && <EmptyMap />}

      <Loading isLoading={isLoading} />
    </View>
  );
});

export default RjsMap;
