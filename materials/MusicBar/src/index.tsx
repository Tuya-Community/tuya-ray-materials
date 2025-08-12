import React from 'react';
import { Image, ScrollView, Text, View } from '@ray-js/ray';
import clsx from 'clsx';
import { MusicListItem, TouchableOpacity } from './components';
import { defaultProps, IProps, MusicBtnItem } from './props';
import {
  imgCDBg,
  imgDefaultMusicBg,
  imgMoreMusicIcon,
  imgNextIcon,
  imgPauseIcon,
  imgStopIcon,
} from './res';
import './index.less';

const classPrefix = 'rayui-music-bar';

const MusicBar: React.FC<IProps> = props => {
  const {
    className,
    style,
    currentMusicInfo,
    deviceHasMusic,
    defaultSoundName,
    isPlaying,
    musicList,
    playListShow,
    onPlay,
    onPause,
    onNext,
    onPlayListShow,
  } = props;

  const musicBtns: MusicBtnItem[] = [
    {
      id: 'pause',
      img: isPlaying ? imgStopIcon : imgPauseIcon,
      onPress: isPlaying ? onPause : onPlay,
    },
    {
      id: 'next',
      img: imgNextIcon,
      onPress: onNext,
    },
    {
      id: 'more',
      img: imgMoreMusicIcon,
      onPress: onPlayListShow,
    },
  ];

  return (
    <View className={clsx(classPrefix, `${classPrefix}wrap`, className)} style={style}>
      <View
        className={clsx(
          `${classPrefix}barWrap`,
          currentMusicInfo.trackTitle && deviceHasMusic
            ? `${classPrefix}barWrapBgColor`
            : `${classPrefix}defaultBarWrapBgColor`
        )}
      >
        <View className={`${classPrefix}songInfo`}>
          {currentMusicInfo.trackTitle && deviceHasMusic ? (
            <View className={`${classPrefix}songInfoTextBox`}>
              {currentMusicInfo.trackTitle && currentMusicInfo.trackTitle !== '' && (
                <Text className={`${classPrefix}songName`}>{currentMusicInfo.trackTitle}</Text>
              )}
              {currentMusicInfo.artist && currentMusicInfo.artist !== '' && (
                <Text className={`${classPrefix}singer`}>{currentMusicInfo.artist}</Text>
              )}
            </View>
          ) : (
            <Text className={`${classPrefix}defaultName`}>{defaultSoundName}</Text>
          )}
        </View>
        <View className={`${classPrefix}btnsWrap`}>
          {musicBtns.map(({ id, img, onPress }) => (
            <TouchableOpacity key={id} className={`${classPrefix}btnIcon`} onClick={onPress}>
              <Image src={img} style={{ width: '40rpx', height: '40rpx' }} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View
        className={clsx(
          `${classPrefix}songImgBox`,
          isPlaying ? `${classPrefix}rotationActive` : ''
        )}
      >
        <Image
          src={
            currentMusicInfo.coverUrlLarge && deviceHasMusic
              ? currentMusicInfo.coverUrlLarge
              : imgDefaultMusicBg
          }
          className={`${classPrefix}songImg`}
        />
        <Image src={imgCDBg} className={`${classPrefix}cdBg`} />
      </View>

      {playListShow && (
        <ScrollView
          scrollY
          scrollIntoView={currentMusicInfo.id.toString() ?? '0'}
          className={`${classPrefix}musicListStyles`}
          style={{ backgroundColor: '#fff' }}
        >
          <View id="0" style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }} />
          {musicList.map(
            (
              item: {
                id: number;
                trackId: number;
                trackTitle: string;
                artist: string;
                playableCode: string;
              },
              index
            ) => (
              <View
                id={item?.id.toString()}
                key={item?.trackId.toString()}
                style={{
                  width: '676rpx',
                  height: '96rpx',
                }}
              >
                <MusicListItem
                  key={item?.trackId}
                  indexKey={index + 1}
                  trackTitle={item?.trackTitle}
                  artist={item?.artist}
                  playableCode={item.playableCode}
                  playMusic={() => onPlay(item)}
                />
              </View>
            )
          )}
          <View
            id="9999"
            style={{ width: '1rpx', height: '1rpx', backgroundColor: 'transparent' }}
          />
        </ScrollView>
      )}
    </View>
  );
};

MusicBar.defaultProps = defaultProps;
MusicBar.displayName = 'MusicBar';

export default MusicBar;
