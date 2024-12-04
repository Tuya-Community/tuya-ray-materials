import log4js from '@ray-js/log4js';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDevice } from '@ray-js/panel-sdk';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { setStorageSync } from '@ray-js/ray';
/**
 * 接收路径数据并解析
 * @returns
 */
export default function usePathData() {
  const pathDataCache = useRef('');
  const { devId } = useDevice(device => device.devInfo);

  const dispatch = useDispatch();

  const onPathData = (pathDataStr: string) => {
    if (pathDataStr !== pathDataCache.current) {
      log4js.info('路径数据', pathDataStr);

      pathDataCache.current = pathDataStr;

      dispatch(updateMapData({ originPath: pathDataStr }));

      setStorageSync({
        key: `path_${devId}`,
        data: pathDataStr,
      });
    }
  };

  return { onPathData };
}
