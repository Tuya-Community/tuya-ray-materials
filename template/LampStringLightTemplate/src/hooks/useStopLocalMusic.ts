import { useProps, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { MicMusicData } from '@ray-js/panel-sdk/lib/protocols/lamp/MicMusicTransformer';
import { useCloudStorageKey } from './useCloudStorageKey';
import { CLOUD_KEY_MUSIC_MODE } from '@/constant';
import { DefaultLocalMusicData } from '@/standModel/musicModel/LocalMusic/dpParser/localMusic__dreamlightmic_music_data';
import { useFixedWorkMode } from './useFIxedWorkMode';

export const useStopLocalMusic = () => {
  const localMusicList = useStructuredProps(
    props => props.dreamlightmic_music_data ?? (DefaultLocalMusicData as Required<MicMusicData>)
  );
  const work_mode = useFixedWorkMode();
  const structuredActions = useStructuredActions();

  const { value: musicMode } = useCloudStorageKey(CLOUD_KEY_MUSIC_MODE, {
    defaultValue: 'local',
  });

  const stop = () => {
    if (localMusicList && localMusicList.power && musicMode === 'local') {
      const nextLocalMusicList = { ...DefaultLocalMusicData, ...(localMusicList || {}) };
      nextLocalMusicList.power = false;
      structuredActions.dreamlightmic_music_data.set(nextLocalMusicList);
    }
  };

  const start = () => {
    if (localMusicList && !localMusicList.power && work_mode === 'music' && musicMode === 'local') {
      const nextLocalMusicList = { ...DefaultLocalMusicData, ...(localMusicList || {}) };
      nextLocalMusicList.power = true;
      structuredActions.dreamlightmic_music_data.set(nextLocalMusicList);
    }
  };

  return { stop, start };
};
