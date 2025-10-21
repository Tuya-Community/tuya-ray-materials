import log4js from '@ray-js/log4js';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateMapState } from '@/redux/modules/mapStateSlice';
import { setStorageSync } from '@ray-js/ray';
import { devices } from '@/devices';
import { decodeRoomProperties } from '@ray-js/robot-map';

/**
 * 接收地图数据并解析
 * @returns
 */
export default function useMapData() {
  const mapDataStrCache = useRef('');
  const dispatch = useDispatch();

  const onMapData = useCallback((mapDataStr: string) => {
    if (mapDataStr !== mapDataStrCache.current) {
      log4js.info('地图数据', mapDataStr);

      mapDataStrCache.current = mapDataStr;

      dispatch(
        updateMapState({ originMap: mapDataStr, roomProperties: decodeRoomProperties(mapDataStr) })
      );

      setStorageSync({
        key: `map_${devices.common.getDevInfo().devId}`,
        data: mapDataStr,
      });
    }
  }, []);

  return { onMapData };
}
