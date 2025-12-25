/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useRef } from 'react';

import { CommonSlider } from '@/components/common-slider';
import { RandomItem } from '@/components/random-colors/colors';
import { RowList } from '@/components/rowlist';
import { useLocalMusicInit } from '@/hooks/useLocalMusicInit';
import Strings from '@/i18n';
import { DefaultLocalMusicData } from '@/standModel/musicModel/LocalMusic/dpParser/localMusic__dreamlightmic_music_data';
import { getArray } from '@/utils/kit';
import { useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';

import styles from './index.module.less';

export interface LocalMusicProps {
  enableRandom: boolean;
  selectedRandomColors: RandomItem;
  dataSource: {
    icon: any;
    id: number;
    title: string;
    colorArr: {
      hue: number;
      saturation: number;
      brightness?: number;
      temperature?: number;
    }[];
  }[];
}

export const LocalMusic: React.FC<LocalMusicProps> = ({
  dataSource,
  enableRandom,
  selectedRandomColors,
}) => {
  const localMusicList = useStructuredProps(props => props.dreamlightmic_music_data);
  if (localMusicList) {
    localMusicList.v = 1;
  }

  const { onPlay, result, _setCurrentId, onSensitivityChange } = useLocalMusicInit({
    enableRandom,
    selectedRandomColors,
  });

  const structuredActions = useStructuredActions();

  const currentIdRef = useRef(null);

  useEffect(() => {
    if (
      !enableRandom &&
      localMusicList &&
      getArray(selectedRandomColors?.colors).length > 0 &&
      currentIdRef.current !== selectedRandomColors?.id
    ) {
      const nextLocalMusicList = {
        ...DefaultLocalMusicData,
        ...(localMusicList || {}),
        brightness: 100,
      };
      nextLocalMusicList.colors = getArray(selectedRandomColors?.colors); // 关闭随机后，选择默认色盘
      nextLocalMusicList.a = 0;
      structuredActions.dreamlightmic_music_data.set(nextLocalMusicList);
      currentIdRef.current = selectedRandomColors?.id;
    }
  }, [selectedRandomColors?.id, enableRandom, localMusicList]);

  return (
    <View className={styles.contain}>
      <View className={styles.card}>
        <RowList
          current={localMusicList?.id}
          onChange={id => {
            _setCurrentId(`${id}`);

            const dataItem = getArray(dataSource).find(item => +item.id === +id);
            const sensitivity = result[dataItem?.id] || 50;
            onPlay(true, dataItem, +sensitivity);
          }}
          dataSource={getArray(dataSource)}
        />
        <View className={styles.slider}>
          <CommonSlider
            min={0}
            max={100}
            value={localMusicList?.sensitivity}
            onAfterChange={onSensitivityChange}
            eventName="LocalMusic1"
            title={Strings.getLang('sensitivity')}
          />
        </View>
      </View>
    </View>
  );
};
