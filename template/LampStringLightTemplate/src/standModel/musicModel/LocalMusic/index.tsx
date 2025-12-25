import React, { useEffect, useState } from 'react';
import { View } from '@ray-js/ray';
import { useDevice, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { LampMusicCard } from '@ray-js/components-ty-lamp';

import { getMusicData } from './musicData';
import { TMusicData } from './types';
import MusicDpParser from './dpParser';

import './index.less';
import { getMusicDpCode, setMusicDpCode } from './utils';

const LocalMusic = () => {
  const structActions = useStructuredActions();
  // const structuredProps = useStructuredProps();
  const device = useDevice();
  const [musicParser, setMusicParser] = useState(null);

  useEffect(() => {
    const dpCode = setMusicDpCode(device?.dpSchema);
    setMusicParser(new MusicDpParser(dpCode));
  }, [device.dpSchema]);

  const dpCode = getMusicDpCode();
  // const _curMusicData = structuredProps[dpCode] || {};

  const handlePutMusic = (item: TMusicData) => {
    if (!item.rawData) {
      // 需要自行解析数据下发布
      return;
    }
    const dpData = musicParser?.parser(item.rawData);
    // 注意⚠️：如果下发不生效，需要查看 devices/protocols/index.ts 中是否导入对应dp的 parser
    structActions[dpCode]?.set(dpData, {
      checkRepeat: false,
    });
  };

  if (!musicParser) {
    return null;
  }
  const musicData = getMusicData(device?.devInfo);

  return (
    <View className="local-music-container">
      {musicData.map(item => {
        // 根据之前的 dp 判断音乐是否执行中
        const isActive = false;
        return (
          <LampMusicCard
            key={item.id}
            active={isActive}
            data={item}
            onPlay={handlePutMusic(item)}
          />
        );
      })}
    </View>
  );
};

export { MusicDpParser };

LocalMusic.MusicDpParser = MusicDpParser;

export default LocalMusic;
