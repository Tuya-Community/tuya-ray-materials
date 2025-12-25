/* eslint-disable no-unneeded-ternary */
import { RandomItem } from '@/components/random-colors/colors';
import getLocalMusicData from '@/standModel/musicModel/LocalMusic/musicData';
import { DefaultLocalMusicData } from '@/standModel/musicModel/LocalMusic/dpParser/localMusic__dreamlightmic_music_data';
import { getArray, isNotNullOrUndefined } from '@/utils/kit';
import { useActions, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { useCloudStorageKey } from './useCloudStorageKey';
import { CLOUD_KEY_LOCAL_MUSIC_ID } from '@/constant';
import { useEffect, useMemo } from 'react';
import { devices } from '@/devices';
import { LocalMusicList } from '@/components/music/local/resource';
import { useStoreSensitivity } from './useStoreSensitivity';

export interface UseLocalMusicInitOps {
  enableRandom: boolean;
  selectedRandomColors: RandomItem;
}

export const useLocalMusicInit = ({ enableRandom, selectedRandomColors }: UseLocalMusicInitOps) => {
  const dataSource = useMemo(() => {
    return getLocalMusicData(devices.common.getDevInfo() as any).map((item, i) => ({
      ...item,
      mode: 0,
      icon: LocalMusicList[i].icon,
    }));
  }, []);
  const { result, setIdSi, inited: siInited } = useStoreSensitivity();

  const onSensitivityChange = (sensitivity: number) => {
    localMusicList.sensitivity = sensitivity;
    setIdSi(localMusicList?.id, String(sensitivity));
    structuredActions.dreamlightmic_music_data.set(
      {
        ...localMusicList,
        brightness: 100,
      },
      {
        throttle: 100,
      }
    );
  };

  const {
    value: _currentId,
    setValue: _setCurrentId,
    inited,
  } = useCloudStorageKey(CLOUD_KEY_LOCAL_MUSIC_ID, {
    defaultValue: '-1',
  });
  const currentId = Number(_currentId);
  const structuredActions = useStructuredActions();
  const actions = useActions();

  const localMusicList = useStructuredProps(props => props.dreamlightmic_music_data);

  const onPlay = (
    active: boolean,
    item: { id: number; colorArr: any[] },
    sensitivity: number,
    isInitDefault = false
  ) => {
    const nextLocalMusicList = {
      ...DefaultLocalMusicData,
      ...(localMusicList || {}),
      brightness: 100,
      sensitivity,
    };
    // 设置律动颜色
    nextLocalMusicList.power = active;

    if (item) {
      if (active) {
        actions.work_mode.set('music', {
          ignoreDpDataResponse: isInitDefault ? false : true,
        });
      }

      nextLocalMusicList.id = item.id; // 音乐模式编号
      if (enableRandom) {
        nextLocalMusicList.colors = getArray(item.colorArr);
        nextLocalMusicList.a = 1;
      } else {
        nextLocalMusicList.colors = getArray(selectedRandomColors?.colors); // 关闭随机后，选择默认色盘
        nextLocalMusicList.a = 0;
      }
    }
    structuredActions.dreamlightmic_music_data.set(nextLocalMusicList, {
      ignoreDpDataResponse: isInitDefault ? false : true,
    });
  };

  const send = () => {
    if (!inited) return;

    if (isNotNullOrUndefined(currentId) && +currentId !== -1) {
      const item = getArray(dataSource).find(item => +item.id === +currentId);

      const sensitivity = result[item?.id] || 50;

      item && onPlay(true, item, +sensitivity);
    } else {
      const item = getArray(dataSource)[0];
      const sensitivity = result[item?.id] || 50;

      item && onPlay(true, item, +sensitivity, true);
    }
  };

  useEffect(() => {
    if (inited && localMusicList && result) {
      const sensitivity = result[localMusicList?.id] || 50;
      // 检查缓存的si和设备上报的si，如果不一致，则更新缓存
      if (+sensitivity !== +localMusicList?.sensitivity) {
        setIdSi(localMusicList?.id, localMusicList?.sensitivity, false);
      }
    }
  }, [siInited, result, localMusicList?.id, localMusicList?.sensitivity]);

  return {
    initLocalMusic: send,
    onPlay,
    dataSource,
    setIdSi,
    siInited,
    result,
    _setCurrentId,
    onSensitivityChange,
  };
};
