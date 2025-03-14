import log4js from '@ray-js/log4js';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { getDevInfo, setStorageSync } from '@ray-js/ray';
/**
 * 接收路径数据并解析
 * @returns
 */
export default function usePathData() {
  const pathDataCache = useRef('');
  const dispatch = useDispatch();

  const onPathData = useCallback((pathDataStr: string) => {
    if (pathDataStr !== pathDataCache.current) {
      log4js.info('路径数据', pathDataStr);

      pathDataCache.current = pathDataStr;

      dispatch(updateMapData({ originPath: pathDataStr }));

      setStorageSync({
        key: `path_${getDevInfo().devId}`,
        data: pathDataStr,
      });
    }
  }, []);

  return { onPathData };
}
