import { useMemo } from 'react';
import { useProps } from '@ray-js/panel-sdk';
import { path_dp_code } from './constant';
import { formatJSONStringDpToObject } from './utils';
import { PathOptions, PathType, PlayState } from './type';

const defaultState = {
  playing: false,
  currentPlayId: undefined,
};

export function useCurrentPlayPath(): typeof defaultState {
  const { dpState } = useProps(state => ({
    dpState: state[path_dp_code],
  }));
  const state = useMemo(() => {
    if (!dpState) return defaultState;
    const dpData = formatJSONStringDpToObject<PathOptions>(dpState);
    if (dpData.type === PathType.PLAY_PATH && dpData?.data.state === PlayState.PLAYING) {
      return {
        playing: true,
        currentPlayId: dpData.data.pathId,
      };
    }
    return defaultState;
  }, [dpState]);

  return state;
}
