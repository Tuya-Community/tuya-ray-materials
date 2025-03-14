import log4js from '@ray-js/log4js';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { getDevInfo, setStorageSync } from '@ray-js/ray';

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

      dispatch(updateMapData({ originMap: mapDataStr }));

      setStorageSync({
        key: `map_${getDevInfo().devId}`,
        data: mapDataStr,
      });
    }
  }, []);

  return { onMapData };
}
