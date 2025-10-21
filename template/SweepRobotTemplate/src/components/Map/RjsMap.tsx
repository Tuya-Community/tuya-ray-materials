import { View, getSystemInfoSync } from '@ray-js/ray';
import React, { useState } from 'react';
import { RjsRobotMap } from '@ray-js/robot-map';
import { useSelector } from 'react-redux';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { MAP_CONFIG } from '@/constant';

import EmptyMap from '../EmptyMap';
import Loading from '../Loading';
import styles from './index.module.less';

type RobotMapProps = React.ComponentProps<typeof RjsRobotMap>;

type Props = {
  style?: React.CSSProperties;
} & Omit<RobotMapProps, 'map'> & {
    map?: RobotMapProps['map'];
  };

const RjsMap: React.FC<Props> = React.memo(
  props => {
    const [mapLoadEnd, setMapLoadEnd] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const mapFromStore = useSelector(selectMapStateByKey('originMap'));
    const pathFromStore = useSelector(selectMapStateByKey('originPath'));
    const roomPropertiesFromStore = useSelector(selectMapStateByKey('roomProperties'));

    const {
      style,
      map = mapFromStore,
      path = pathFromStore,
      roomProperties = roomPropertiesFromStore,
      config = MAP_CONFIG,
      onMapFirstDrawed,
      onMapDrawed,
      ...restProps
    } = props;

    const isIDE = getSystemInfoSync().brand === 'devtools';

    const isLoading = isIDE ? !mapLoadEnd : !mapLoadEnd || !map;

    return (
      <View className={styles.container} style={style}>
        <RjsRobotMap
          map={map}
          path={path}
          roomProperties={roomProperties}
          config={config}
          onMapFirstDrawed={mapState => {
            setMapLoadEnd(true);
            onMapFirstDrawed?.(mapState);
          }}
          onMapDrawed={mapState => {
            if (mapState.width === 0 || mapState.height === 0) {
              setIsEmpty(true);
            } else {
              setIsEmpty(false);
            }
            onMapDrawed?.(mapState);
          }}
          {...restProps}
        />

        {isEmpty && <EmptyMap />}

        <Loading isLoading={isLoading} />
      </View>
    );
  },
  (prevProps, nextProps) => {
    if (nextProps.map !== undefined && prevProps.map !== undefined) {
      return prevProps.map === nextProps.map && prevProps.path === nextProps.path;
    }
    return false;
  }
);

export default RjsMap;
