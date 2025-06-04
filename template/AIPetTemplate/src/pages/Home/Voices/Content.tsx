import React, { FC, useEffect, useState } from 'react';
import { Text, View } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import { iconVolumeDec, iconVolumeInc } from '@/res/iconsvg';
import { THEME_COLOR } from '@/constant';
import Slider from '@ray-js/components-ty-slider';
import { useActions, useProps } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import { useThrottleFn } from 'ahooks';

import { useSelector } from 'react-redux';
import { selectAudios } from '@/redux/modules/audiosSlice';
import Strings from '@/i18n';
import styles from './index.module.less';
import AudioItem from './AudioItem';

type Props = {
  ready: boolean;
};

const Volume: FC<Props> = ({ ready }) => {
  const actions = useActions();
  const dpVolumeSet = useProps(props => props[dpCodes.volumeSet]);
  const [volume, setVolume] = useState(dpVolumeSet);

  useEffect(() => {
    if (dpVolumeSet !== volume) {
      setVolume(dpVolumeSet);
    }
  }, [dpVolumeSet]);

  const handleChange = useThrottleFn(
    value => {
      setVolume(value);
    },
    { wait: 100 }
  ).run;

  const handleComplete = value => {
    setVolume(value);
    actions[dpCodes.volumeSet].set(value, { debounce: 500 });
  };

  return (
    <View>
      <View className={styles.volumeHeader}>
        <Text className={styles.title}>{Strings.getDpLang(dpCodes.volumeSet)}</Text>
        <Text className={styles.value}>{volume}%</Text>
      </View>
      <View className={styles.volumeSliderWrapper}>
        <Icon name={iconVolumeDec} size="28rpx" color="rgba(0, 0, 0, 0.3)" />
        {ready && (
          <Slider
            min={0}
            max={100}
            step={1}
            maxTrackWidth="580rpx"
            maxTrackHeight="8rpx"
            minTrackHeight="8rpx"
            thumbHeight="40rpx"
            thumbWidth="40rpx"
            maxTrackColor="rgba(0, 0, 0, 0.05)"
            minTrackColor={THEME_COLOR}
            enableTouch={false}
            onChange={handleChange}
            onAfterChange={handleComplete}
          />
        )}
        <Icon name={iconVolumeInc} size="28rpx" color="rgba(0, 0, 0, 0.3)" />
      </View>
    </View>
  );
};

const Content: FC<Props> = ({ ready }) => {
  const audios = useSelector(selectAudios);
  const [currentAudio, setCurrentAudio] = useState('');

  const handlePlay = fileNo => {
    setCurrentAudio(fileNo);
  };

  return (
    <View className={styles.content}>
      <Volume ready={ready} />
      <View className={styles.list}>
        {audios.map(item => (
          <AudioItem key={item.fileNo} data={item} current={currentAudio} onPlay={handlePlay} />
        ))}
      </View>
    </View>
  );
};

export default Content;
