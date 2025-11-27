import log4js from '@ray-js/log4js';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateMapState } from '@/redux/modules/mapStateSlice';
import { setStorageSync } from '@ray-js/ray';
import { devices } from '@/devices';
/**
 * 接收路径数据并解析
 * @returns
 */
export default function usePathData() {
  const pathDataCache = useRef('');
  const dispatch = useDispatch();

  const onPathData = useCallback((pathDataStr: string) => {
    if (pathDataStr !== pathDataCache.current) {
      pathDataCache.current = pathDataStr;

      dispatch(updateMapState({ originPath: pathDataStr }));

      setStorageSync({
        key: `path_${devices.common.getDevInfo().devId}`,
        data: pathDataStr,
      });
    }
  }, []);

  return { onPathData };
}
