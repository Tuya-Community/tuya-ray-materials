import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, View } from '@ray-js/ray';
import useHistoryMapViewParams from '@/hooks/useHistoryMapViewParams';
import { IndoorMap } from '@ray-js/robot-map-component';

import Loading from '../Loading';
import styles from '../MapView/index.module.less';
import { IProps } from '../MapView/type';

const HistoryMapView: React.FC<IProps & { enableGesture?: boolean }> = props => {
  const {
    isFullScreen = false,
    enableGesture = true,
    uiInterFace,
    history,
    snapshotImage,
    pathVisible,
    logPrint = false,
    backgroundColor = '#f2f4f6',
  } = props;

  const idRef = useRef(String(new Date().getTime()));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [snapshotImageLoaded, setSnapshotImageLoaded] = useState(true);

  const handleDecodeMapData = useCallback(data => {
    console.log('onDecodeMapData ==>', data);
    props.onDecodeMapData?.(data);
  }, []);

  const handleDecodePathData = useCallback(data => {
    console.log('onDecodePathData ==>', data);
  }, []);

  const handleSnapshotImageLoad = () => {
    setTimeout(() => {
      setSnapshotImageLoaded(true);
    }, 500);
  };

  useEffect(() => {
    /**
     * 初始无截屏，需要后期从地图组件截屏的情况
     */
    if (!snapshotImage) {
      setSnapshotImageLoaded(false);
    }
  }, [snapshotImage]);

  const mapViewParams = useHistoryMapViewParams({
    pathVisible,
    uiInterFace,
    history,
    mapId: idRef.current,
    backgroundColor,
  });

  const eventCallbacks = useRef({
    onMapId: data => {
      props.onMapId?.(data);
    },
    onLaserMapPoints: data => {
      props.onLaserMapPoints?.(data);
    },
    onClickSplitArea: data => {
      props.onClickSplitArea?.(data);
    },
    onLongPressInAreaView: data => {
      props.onLongPressInAreaView?.(data);
    },
    onClickRoom: data => {
      props.onClickRoom?.(data);
    },
    onLoggerInfo: data => {
      if (logPrint) {
        console.log(data.info || '', data.theme || '', ...Object.values(data.args || {}));
      }
    },
    onClickModel: data => {
      props.onClickModel?.(data);
    },
    onModelLoadingProgress: data => {
      props.onModelLoadingProgress?.(data);
    },
    // 这里特别注意一下
    onMapLoadEnd: data => {
      setMapLoaded(true);
      props.onMapLoadEnd?.(data);
    },
    onGestureChange: data => {
      props.onGestureChange?.(data);
    },
    onClickRoomProperties: data => {
      props.onClickRoomProperties?.(data);
    },
    onPosPoints: data => {
      props.onPosPoints?.(data);
    },
    onClickMapView: data => {
      props.onClickMapView?.(data);
    },
    onScreenSnapshot: data => {
      props.onScreenSnapshot?.(data);
    },
    onRobotPositionChange: data => {
      props.onRobotPositionChange?.(data);
    },
    onVirtualInfoRendered: data => {
      props.onVirtualInfoRendered?.(data);
    },
    onRenderContextLost: data => {
      props.onRenderContextLost?.(data);
    },
    onRenderContextRestored: data => {
      props.onRenderContextRestored?.(data);
    },
    onContainerVisibilityChange: data => {
      props.onContainerVisibilityChange?.(data);
    },
    onVirtualInfoOutOfBoundingBox: data => {
      props.onVirtualInfoOutOfBoundingBox?.(data);
    },
    onClickMaterial: data => {
      props.onClickMaterial?.(data);
    },
  });

  const isLoading = snapshotImage ? false : !mapLoaded || !mapViewParams.mapDataHex;

  console.log('HistoryMapview re-render', snapshotImage, mapViewParams);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'transparent',
        pointerEvents: enableGesture ? 'auto' : 'none',
      }}
    >
      <Loading isLoading={isLoading} />

      {!snapshotImageLoaded && (
        <>
          {isFullScreen && (
            <IndoorMap.Full
              {...eventCallbacks.current}
              {...mapViewParams}
              mapId={idRef.current}
              componentId={idRef.current}
              componentBackground={backgroundColor}
              initUseThread={false}
              resourceUsageLevel="high"
              onDecodeMapData={handleDecodeMapData}
              onDecodePathData={handleDecodePathData}
            />
          )}
          {!isFullScreen && (
            <IndoorMap.Dynamic
              {...eventCallbacks.current}
              {...mapViewParams}
              mapId={idRef.current}
              componentId={idRef.current}
              componentBackground={backgroundColor}
              initUseThread={false}
              resourceUsageLevel="high"
              onDecodeMapData={handleDecodeMapData}
              onDecodePathData={handleDecodePathData}
            />
          )}
        </>
      )}

      {snapshotImage && (
        <View
          className={styles.snapImageView}
          style={{ opacity: snapshotImageLoaded ? 1 : 0, pointerEvents: 'auto' }}
        >
          <Image
            src={snapshotImage.image}
            style={{ width: `${snapshotImage.width}px`, height: `${snapshotImage.height}px` }}
            onLoad={handleSnapshotImageLoad}
          />
        </View>
      )}
    </View>
  );
};

export default HistoryMapView;
