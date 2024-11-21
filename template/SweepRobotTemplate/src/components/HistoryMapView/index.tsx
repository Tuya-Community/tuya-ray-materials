import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, View, getSystemInfoSync } from '@ray-js/ray';
import useHistoryMapViewParams from '@/hooks/useHistoryMapViewParams';
import { IndoorMap } from '@ray-js/robot-map-component';
import Strings from '@/i18n';

import Loading from '../Loading';
import styles from '../MapView/index.module.less';
import { IProps } from '../MapView/type';

const HistoryMapView: React.FC<IProps & { enableGesture?: boolean }> = props => {
  const idRef = useRef(String(new Date().getTime()));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [snapshotImageLoaded, setSnapshotImageLoaded] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const onDecodeMapData = useCallback(data => {
    console.log('onDecodeMapData ==>', data);
    const { mapWidth, mapHeight } = data;
    // 如果地图的宽高是0 则认为是空地图
    if (mapWidth === 0 || mapHeight === 0) {
      setIsEmpty(true);
    }
  }, []);

  const onDecodePathData = useCallback(data => {
    console.log('onDecodePathData ==>', data);
  }, []);

  const {
    isFullScreen = false,
    is3d = false,
    showLoading = true,
    enableGesture = true,
    isLite,
    uiInterFace,
    history,
    snapshotImage,
    pathVisible,
    logPrint = false,
  } = props;

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

  const params = {
    pathVisible,
    uiInterFace,
    history,
    is3d,
    mapId: idRef.current,
  };

  const mapViewParams = useHistoryMapViewParams(params);

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

  const isIDE = getSystemInfoSync().brand === 'devtools';

  const isLoading = snapshotImage ? false : !mapViewParams.mapDataHex;

  console.log('HistoryMapview re-render', snapshotImage, mapViewParams);

  if (isIDE) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 64rpx',
        }}
      >
        <Text
          style={{
            fontSize: '40rpx',
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          {Strings.getLang('dsc_ide_history_map_tips')}
        </Text>
      </View>
    );
  }

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
      {isFullScreen && (
        <IndoorMap.Full
          {...eventCallbacks.current}
          {...mapViewParams}
          mapId={idRef.current}
          componentId={idRef.current}
          componentBackground="#f2f4f6"
          initUseThread={false}
          enableAICapability
          resourceUsageLevel="high"
          onDecodeMapData={onDecodeMapData}
          onDecodePathData={onDecodePathData}
        />
      )}
      {!isFullScreen && (
        <IndoorMap.Dynamic
          {...eventCallbacks.current}
          {...mapViewParams}
          mapId={idRef.current}
          componentId={idRef.current}
          componentBackground="#f2f4f6"
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
          mapLoadEnd={mapLoaded || Boolean(snapshotImage)}
          isEmpty={isEmpty}
          isLite={isLite}
        />
      )}
      {snapshotImage && (
        <View
          className={styles.snapImageView}
          style={{ opacity: snapshotImageLoaded ? 1 : 0, pointerEvents: 'auto' }}
        >
          <Image
            src={snapshotImage.image}
            style={{ width: snapshotImage.width, height: snapshotImage.height }}
            onLoad={handleSnapshotImageLoad}
          />
        </View>
      )}
    </View>
  );
};

export default HistoryMapView;
