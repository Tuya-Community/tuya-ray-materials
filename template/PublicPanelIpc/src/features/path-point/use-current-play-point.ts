import { useMemo } from 'react';
import { useProps } from '@ray-js/panel-sdk';
import { point_dp_code } from './constant';
import { formatJSONStringDpToObject } from './utils';
import { PointOptions, PointType, PlayState } from './type';

const defaultState = {
  playing: false,
  currentPlayId: undefined,
  pathId: undefined, // 当前节点所属的 pathId
};

export function useCurrentPlayPoint(): typeof defaultState {
  const { dpState } = useProps(state => ({
    dpState: state[point_dp_code],
  }));
  const state = useMemo(() => {
    if (!dpState) return defaultState;
    const dpData = formatJSONStringDpToObject<PointOptions>(dpState);
    if (dpData.type === PointType.PLAY_POINT && dpData?.data.state === PlayState.PLAYING) {
      return {
        playing: true,
        currentPlayId: dpData.data.id,
        pathId: dpData.data.pathId,
      };
    }
    return defaultState;
  }, [dpState]);

  return state;
}
