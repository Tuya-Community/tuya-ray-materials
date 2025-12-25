import React, { useMemo, useRef, useState } from 'react';

import { CLOUD_KEY_MUSIC_MODE, CLOUD_RANDOM_COLOR_ID } from '@/constant';
import { dpCodes } from '@/constant/dpCodes';
import { devices } from '@/devices';
import { useCloudStorageKey } from '@/hooks/useCloudStorageKey';
import Strings from '@/i18n';
import getAppMusicData from '@/standModel/musicModel/AppMusic/musicData';
import getLocalMusicData from '@/standModel/musicModel/LocalMusic/musicData';
import { useSupport } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';

import { ControlTabs } from '../control-tabs';
import { RandomColors, RandomColorsProps } from '../random-colors';
import { AppMusic } from './app';
import { defaultAppMusicList } from './app/resource';
import styles from './index.module.less';
import { LocalMusic } from './local';
import { LocalMusicList } from './local/resource';
import { defaultRandomColors } from '../random-colors/colors';

export interface MusicProps {
  musicMode: string;
  onMusicModeChange(musicMode: string): void;
}

export const Music = ({ musicMode, onMusicModeChange: setMusicMode }: MusicProps) => {
  const [enableRandom, setEnableRandom] = useState(true);
  const enableRandomRef = useRef(true);
  const [selectedRandomItem, setSelectedRandomItem] = useState<RandomColorsProps['current']>(null);
  const selectedRandomItemRef = useRef<RandomColorsProps['current']>(null);

  const { setValue: setRandomId } = useCloudStorageKey(CLOUD_RANDOM_COLOR_ID, {
    onGet(val) {
      const target = defaultRandomColors.find(item => +item.id === +val);
      if (target) {
        setSelectedRandomItem(target);
        setEnableRandom(false);
        enableRandomRef.current = false;
        selectedRandomItemRef.current = target;
      }
    },
  });

  const support = useSupport();
  const isSupportLocalMusic = support.isSupportDp(dpCodes.dreamlightmic_music_data);
  const isSupportAppMusic = support.isSupportDp(dpCodes.music_data);

  const data = useMemo(() => {
    if (musicMode === 'app') {
      return defaultAppMusicList.map((item, i) => ({
        ...item,
        title: Strings.getLang(`app_music_name_${item.id}` as any),
        colorArr: item.colorArea,
      }));
    }
    return getLocalMusicData(devices.common.getDevInfo() as any).map((item, i) => ({
      ...item,
      mode: 0,
      icon: LocalMusicList[i].icon,
    }));
  }, [musicMode]);

  const tabs = [
    {
      tab: Strings.getLang('music_local'),
      tabKey: 'local',
      show: isSupportLocalMusic,
    },
    {
      tab: Strings.getLang('music_app'),
      tabKey: 'app',
      show: isSupportAppMusic,
    },
  ].filter(item => item.show);

  return (
    <View className={styles.contain}>
      <View className={styles.card}>
        <ControlTabs activeKey={musicMode} onChange={setMusicMode} tabs={tabs} />
        {musicMode === 'local' && isSupportLocalMusic && (
          <LocalMusic
            selectedRandomColors={selectedRandomItem}
            enableRandom={enableRandom}
            dataSource={data}
          />
        )}
        {musicMode === 'app' && isSupportAppMusic && (
          <AppMusic
            selectedRandomItemRef={selectedRandomItemRef}
            enableRandomRef={enableRandomRef}
            selectedRandomColors={selectedRandomItem}
            enableRandom={enableRandom}
            dataSource={data}
          />
        )}
      </View>
      <View className={styles.margin}>
        {(musicMode === 'local' || musicMode === 'app') && (
          <RandomColors
            current={selectedRandomItem}
            setCurrent={colors => {
              setSelectedRandomItem(colors);
              setRandomId(String(colors?.id));
              selectedRandomItemRef.current = colors;
            }}
            enableRandom={enableRandom}
            onEnableRandomChange={enable => {
              enableRandomRef.current = enable;
              setEnableRandom(enable);
              if (enable) {
                // 开启了随机，要把设置的随机数据清除掉
                setSelectedRandomItem(null);
                setRandomId('-1');
                selectedRandomItemRef.current = null;
              } else {
                // 默认选择第一个
                const colors = defaultRandomColors[0];
                setSelectedRandomItem(colors);
                setRandomId(String(colors?.id));
                selectedRandomItemRef.current = colors;
              }
            }}
          />
        )}
      </View>
    </View>
  );
};
