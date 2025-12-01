import React, { useEffect, useRef, useState, FC, useCallback } from 'react';
import { View, Button, Text, Image, usePageEvent, createInnerAudioContext } from '@ray-js/ray';
import Res from '@/res';
import { convertMillisecondsToTime, convertSecondsToTime } from '@/utils';
import Slider from '@ray-js/components-ty-slider';
import { PLAY_STATUS } from '@/pages/Detail';
import EventEmitter from '@/utils/emitter';
import PlaybackRateModal from './PlaybackRateModal';

// @ts-ignore
import styles from './index.module.less';

interface Props {
  wavFilePath: string;
  duration: number; // 总时长
  amplitudes: string; // 音波数据 '0.1,0.0,...'
  playerStatus: PLAY_STATUS; // 播放状态
  onPlayerStatusChange: (status: PLAY_STATUS) => void;
  onInnerAudioContext: (context: any) => void;
  onPlayerTimeUpdate: (time: number) => void;
}

export const playerEmitter = new EventEmitter();

const Player: FC<Props> = ({
  wavFilePath,
  duration, // 总时长 毫秒
  amplitudes,
  playerStatus,
  onPlayerStatusChange,
  onInnerAudioContext,
  onPlayerTimeUpdate,
}) => {
  // 播放速度
  const [playbackRate, setPlaybackRate] = useState<0.5 | 1 | 2>(1);
  const [showRateModal, setShowRateModal] = useState(false);
  const innerAudioContextRef = useRef<any>(null);
  const [amplitudesList, setAmplitudesList] = useState([]);
  // 当前播放进度 0->1
  const currPlayerValue = useRef(0);
  // 当前播放秒数
  const [playerSecond, setPlayerSecond] = useState(0);

  const valueChangeClockTimeoutRef = useRef<any>(null);
  const valueChangeClock = useRef(false);

  // 缓存下这两个值 用于优化交互体验 临时
  const durationValue = useRef(0);
  const playerSecondValue = useRef(0);
  useEffect(() => {
    durationValue.current = duration;
  }, [duration]);
  useEffect(() => {
    playerSecondValue.current = playerSecond;
  }, [playerSecond]);
  // 监听播放进度事件
  const handlePlayTimeUpdate = data => {
    if (typeof data?.time === 'undefined') return;
    const v = data?.time; // 百分比
    currPlayerValue.current = v;
    if (v === 1) {
      onPlayerStatusChange(PLAY_STATUS.Initial);
      setPlayerSecond(0);
      onPlayerTimeUpdate(0);
    } else {
      if (typeof data?.current === 'undefined') return;
      const second = Math.ceil(data.current);
      // 向外传递播放进度
      onPlayerTimeUpdate(second);
      if (playerSecondValue.current !== second && !valueChangeClock.current) {
        setPlayerSecond(second);
      }
    }
  };
  // 监听音频播放状态事件
  const handlePlayerStatusUpdate = d => {
    /** 播放状态回调, 0暂停, 1缓存中, 2播放中 */
    switch (d.status) {
      case 0:
        if (currPlayerValue.current === 1) {
          onPlayerStatusChange(PLAY_STATUS.Initial);
          currPlayerValue.current = 0;
        } else {
          onPlayerStatusChange(PLAY_STATUS.Pause);
        }
        break;
      case 2:
        onPlayerStatusChange(PLAY_STATUS.Playing);
        break;
      default:
        break;
    }
  };

  const play = ({
    playbackRate,
    startTime,
    successCb,
  }: {
    playbackRate?: number;
    startTime?: number;
    successCb: any;
  }) => {
    if (!innerAudioContextRef.current) return;
    const param: any = {
      src: wavFilePath,
      success: successCb,
    };
    if (typeof playbackRate !== 'undefined') param.playbackRate = playbackRate;
    if (typeof startTime !== 'undefined') param.startTime = startTime;
    const playAudio = () => {
      innerAudioContextRef.current.play(param);
    };
    // 播放前先destroy 防止重复创建事件
    innerAudioContextRef.current.destroyPlayer({
      success: playAudio,
      fail: () => { },
    });
  };

  usePageEvent('onUnload', () => {
    if (innerAudioContextRef.current) {
      innerAudioContextRef.current.offTimeUpdate(handlePlayTimeUpdate);
      innerAudioContextRef.current.offPlayerStatusUpdate(handlePlayerStatusUpdate);
      innerAudioContextRef.current.stop({
        fail: e => {
          console.log(e);
        },
      });
      innerAudioContextRef.current.destroyPlayer();
    }
  });

  useEffect(() => {
    ty.hideMenuButton();
    try {
      innerAudioContextRef.current = createInnerAudioContext();
      onInnerAudioContext(innerAudioContextRef.current);
      innerAudioContextRef.current.onTimeUpdate(handlePlayTimeUpdate);
      innerAudioContextRef.current.onPlayerStatusUpdate(handlePlayerStatusUpdate);
    } catch (error) {
      console.log('error');
    }
  }, []);

  useEffect(() => {
    const arr = amplitudes.split(',');
    setAmplitudesList(arr.slice(0, 100));
  }, [amplitudes]);

  const handlePlayControl = () => {
    if (!wavFilePath) return;
    switch (playerStatus) {
      case PLAY_STATUS.Initial: // 未开始
        play({
          playbackRate,
          successCb: () => {
            onPlayerStatusChange(PLAY_STATUS.Playing);
          },
        });
        break;
      case PLAY_STATUS.Playing: // 播放中
        innerAudioContextRef.current.pause({
          success: () => {
            onPlayerStatusChange(PLAY_STATUS.Pause);
          },
        });
        break;
      case PLAY_STATUS.Pause: // 暂停中
        innerAudioContextRef.current.resume({
          success: () => {
            onPlayerStatusChange(PLAY_STATUS.Playing);
          },
        });
        break;
      default:
        break;
    }
  };

  const handleChangePlaybackRate = useCallback(
    rate => {
      setShowRateModal(false);
      if (!wavFilePath || !innerAudioContextRef.current) return;
      const second = Math.floor((currPlayerValue.current * durationValue.current) / 1000);
      play({
        playbackRate: rate,
        startTime: second,
        successCb: () => {
          onPlayerStatusChange(PLAY_STATUS.Playing);
          setPlaybackRate(rate);
        },
      });
    },
    [wavFilePath]
  );

  const handleChangePlayTime = (millisecond: number, withoutUpdateState?: boolean) => {
    let newTime = millisecond;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration - 100;
    // 前进后退单位为秒(小数点后三位)
    const seekTime = parseFloat((newTime / 1000).toFixed(3));
    if (playerStatus === PLAY_STATUS.Initial) {
      // 未开始
      play({
        startTime: seekTime,
        playbackRate,
        successCb: () => {
          onPlayerStatusChange(PLAY_STATUS.Playing);
        },
      });
    } else {
      innerAudioContextRef.current.seek({
        position: seekTime,
        success: () => {
          valueChangeClock.current = true;
          if (!valueChangeClockTimeoutRef.current) {
            valueChangeClock.current = true;
            valueChangeClockTimeoutRef.current = setTimeout(() => {
              valueChangeClock.current = false;
              valueChangeClockTimeoutRef.current = null;
            }, 1000);
          }
          if (!withoutUpdateState) {
            setPlayerSecond(Math.floor(newTime / 1000));
          }
        },
        fail: () => {
          valueChangeClock.current = false;
        },
      });
    }
  };

  const handlePlayerSeek = ({ second }) => {
    handleChangePlayTime(second * 1000);
  };

  useEffect(() => {
    playerEmitter.on('seek', handlePlayerSeek);
    return () => {
      playerEmitter.off('seek', handlePlayerSeek);
    };
  }, [wavFilePath, duration, playerStatus, playbackRate, onPlayerStatusChange]);

  // 后退15s
  const handlePlayBack15s = () => {
    const currPlayTime = currPlayerValue.current * duration;
    handleChangePlayTime(currPlayTime - 15 * 1000);
  };

  // 前进15s
  const handlePlayForward15 = () => {
    const currPlayTime = currPlayerValue.current * duration;
    handleChangePlayTime(currPlayTime + 15 * 1000);
  };

  // sliderValue
  const onEnd = (sliderValue: number) => {
    const currPlayTime = duration * (sliderValue / 100); // 毫秒
    setPlayerSecond(Math.floor(currPlayTime / 1000));
    handleChangePlayTime(currPlayTime, true);
  };

  const playerSliderValue = Math.floor((playerSecond / (duration / 1000)) * 100);

  const renderWaveForm = () => {
    return (
      <View className={styles.waveform}>
        {amplitudesList.map((item, idx) => {
          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={styles.waveBar}
              style={{
                height: Math.max(85 * item * 10, 1),
              }}
            />
          );
        })}
        <View className={styles.waveMask} style={{ width: `${100 - playerSliderValue}%` }} />
      </View>
    );
  };

  return (
    <View className={styles.player}>
      <View className={styles.waveformBox}>
        {renderWaveForm()}
        <Slider
          min={0}
          max={100}
          renderType="sjs"
          minTrackRadius="12px"
          minTrackHeight="85px"
          maxTrackRadius="12px"
          maxTrackHeight="85px"
          minTrackColor="transparent"
          maxTrackColor="transparent"
          value={playerSliderValue}
          onChange={() => {
            if (playerStatus === PLAY_STATUS.Playing) {
              valueChangeClock.current = true;
            }
          }}
          onAfterChange={onEnd}
          thumbWidth={1}
          thumbHeight={85}
          thumbRadius={2}
          thumbStyle={{
            background: 'rgb(255, 70, 70)',
            border: '1px solid rgb(255, 70, 70)',
            boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.5)',
          }}
        />
        <View className={styles.timeBar}>
          <Text className={styles.time}>{convertSecondsToTime(playerSecond || 0)}</Text>
          <Text className={styles.time}>{convertMillisecondsToTime(duration || 0)}</Text>
        </View>
      </View>
      <View className={styles.controlBox}>
        <Button
          className={styles.controlBtn}
          onClick={() => {
            setShowRateModal(true);
          }}
        >
          <Text className={styles.rateText}>{`x${playbackRate.toFixed(1)}`}</Text>
        </Button>
        <Button className={styles.controlBtn} onClick={handlePlayBack15s}>
          <Image className={styles.icon} src={Res.imgBack15} />
        </Button>
        <Button className={styles.controlBtn} onClick={handlePlayControl}>
          <Image
            className={styles.startIcon}
            src={playerStatus === PLAY_STATUS.Playing ? Res.imgStop : Res.imgStart}
          />
        </Button>
        <Button className={styles.controlBtn} onClick={handlePlayForward15}>
          <Image className={styles.icon} src={Res.imgForward15} />
        </Button>
        <Button className={styles.controlBtn}>
          {/* <Image className={styles.icon} src={Res.imgNoiseReduction} /> */}
        </Button>
      </View>
      <PlaybackRateModal
        show={showRateModal}
        currPlaybackRate={playbackRate}
        onClickOverlay={() => {
          setShowRateModal(false);
        }}
        onConfirm={handleChangePlaybackRate}
      />
    </View>
  );
};

export default React.memo(Player);
