/* eslint-disable react/require-default-props */
import React, { CSSProperties, FC } from 'react';
import { Image, Text, View } from '@ray-js/ray';
import TouchableOpacity from '../TouchableOpacity';
import { imgMusicIcon } from '../../res';
import './index.less';

interface Props {
  containerStyle?: CSSProperties;
  themeColor?: string;
  playableCode: string;
  trackTitle: string;
  artist: string;
  indexKey: number;
  isPlaying?: boolean;
  playMusic: () => void;
}

const classPrefix = 'rayui-music-bar';

const MusicListItem: FC<Props> = ({
  containerStyle = {},
  themeColor = '#408CFF',
  playableCode = '',
  indexKey,
  trackTitle = '',
  artist = '',
  isPlaying = false,
  playMusic,
}) => {
  return (
    <View className={`${classPrefix}itemContainer`} style={containerStyle}>
      <TouchableOpacity
        className={`${classPrefix}leftContent`}
        style={{ opacity: playableCode !== '0' && playableCode !== '2' ? 0.5 : 1 }}
        onClick={playMusic}
      >
        {isPlaying ? (
          <View>
            <Image src={imgMusicIcon} className={`${classPrefix}musicPic`} />
          </View>
        ) : (
          <Text className={`${classPrefix}number`}>{indexKey}</Text>
        )}
        <View className={`${classPrefix}musicInfo`}>
          <Text
            className={`${classPrefix}musicName`}
            style={{ color: isPlaying ? themeColor : '#000000' }}
          >
            {trackTitle}
          </Text>
          <View className={`${classPrefix}musicExtraInfo`}>
            {playableCode === '2' && <Text className={`${classPrefix}vip`}>VIP</Text>}
            <Text
              className={`${classPrefix}musicOtherInfo`}
              style={{ color: isPlaying ? themeColor : '#808080' }}
            >
              {artist}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MusicListItem;
