import React, { useEffect, useCallback, useState } from 'react';
import { View } from '@ray-js/ray';
import { useUnmount } from 'ahooks';
import {
  useProps,
  useStructuredActions,
  kit,
  useStructuredProps,
  useDevice,
} from '@ray-js/panel-sdk';
import { LampMusicCard } from '@ray-js/components-ty-lamp';

import { getMusicData } from './musicData';
import MusicDpParser from './dpParser';

import './index.less';

const { onMusic2RgbChange, offMusic2RgbChange } = kit.music2rgb;

const AppMusic = () => {
  const device = useDevice();
  const [activeId, setActiveId] = useState(-1);
  const power = useProps(dpState => dpState.switch_led);
  const actions = useStructuredActions();

  const handleMusic2RgbChange = useCallback((id: number) => {
    onMusic2RgbChange(data => {
      if (!data) {
        return;
      }
      const musicData = {
        mode: 0,
        hue: data?.hue,
        saturation: data?.saturation,
        value: data?.value,
        brightness: 0,
        temperature: 0,
      };
      actions.music_data?.set(musicData);
    });
  }, []);

  const micMusicData = useStructuredProps(props => props.dreamlightmic_music_data);
  const structuredAction = useStructuredActions();

  useEffect(() => {
    if (!power || activeId === -1) {
      setActiveId(-1);
      offMusic2RgbChange();
      return;
    }

    handleMusic2RgbChange(activeId);
    if (!micMusicData || Object.keys(micMusicData).length === 0) {
      return;
    }
    // 调用下发dp方法
    structuredAction.dreamlightmic_music_data.set({
      ...(micMusicData || {}),
      power: false,
    });
  }, [power, activeId]);

  useUnmount(() => {
    offMusic2RgbChange();
  });

  const handlePlay = item => {
    // 此处可以根据状态进行 dp 的下发
    setActiveId(activeId === item.id ? -1 : item.id);
  };

  const musicData = getMusicData(device?.devInfo);

  return (
    <View className="local-music-container">
      {musicData.map(item => {
        const isActive = false;
        return (
          <LampMusicCard
            key={item.id}
            active={isActive}
            data={item}
            onPlay={() => {
              handlePlay(item);
            }}
          />
        );
      })}
    </View>
  );
};

export { MusicDpParser };

AppMusic.MusicDpParser = MusicDpParser;

export default AppMusic;
