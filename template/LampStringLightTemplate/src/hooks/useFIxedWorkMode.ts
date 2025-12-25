import { useProps } from '@ray-js/panel-sdk';
import { useLampRoad } from './useLampRoad';
import { WORK_MODE } from '@/types';

enum Road {
  road1 = 'road1',
  road2 = 'road2',
  road3 = 'road3',
  road4 = 'road4',
  road5 = 'road5',
}

// 修正 work_mode 的值
export const useFixedWorkMode = () => {
  const work_mode = useProps(p => p.work_mode);
  const road = useLampRoad();
  // 异常情况
  if (road === Road.road1 && work_mode === WORK_MODE.colour) {
    return WORK_MODE.white;
  }
  if (road === Road.road2 && work_mode === WORK_MODE.colour) {
    return WORK_MODE.colour;
  }
  if (road === Road.road3 && work_mode === WORK_MODE.white) {
    return WORK_MODE.colour;
  }
  return work_mode;
};
