import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, View, showToast } from '@ray-js/ray';
import { Icon, Loading, Slider } from '@ray-js/smart-ui';
import clsx from 'clsx';
import isNumber from 'lodash/isNumber';
import { useUpdateEffect, useDebounceFn } from 'ahooks';

import pauseIcon from '@tuya-miniapp/icons/dist/svg/Pause';
import palyIcon from '@tuya-miniapp/icons/dist/svg/Play';
import { convertMillisecondsToTime, convertSecondsToTime } from '@/utils/index';
import { useSelector } from '@/redux';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { SingleCloudSyncStatus } from '@/constant/enums';
import { tttDownloadNoteAudio } from '@/api/ttt';
import Strings from '@/i18n';
import CustomCoverView from '@/components/CustomCoverView';
import { PlaybackRate, playbackRateList, PlayStatus } from '../../enum';
import HistoryDetailContext from '../../context';
import PlaybackRateModal from './PlaybackRateModal';
import { fileEmitter } from '../../index';

import styles from './index.module.less';

const defaultAmplitudeList = new Array(100).fill(0);

const Index: React.FC<{ showCoverView: boolean }> = ({ showCoverView }) => {
  const {
    playerShow,
    setPlayerShow,
    playStatus,
    setPlayStatus,
    audioContext,
    currentPlaySecond = 0,
    setCurrentPlaySecond,
    audioDownloadStatus,
    fileDetail,
    setAudioDownloadStatus,
    updateFileDetailLocal,
  } = useContext(HistoryDetailContext);
  const [playerAnimation, setPlayerAnimation] = useState(false); // 播放器显示
  const [startTouchY, setStartTouchY] = useState(0); // 拖动条开始触摸位置 Y轴
  const [endTouchY, setEndTouchY] = useState(0); // 拖动条结束触摸位置 Y轴
  const [playbackRate, setPlaybackRate] = useState(PlaybackRate.normal); // 播放速率
  const [showRateModal, setShowRateModal] = useState(false); // 显示播放速率弹窗
  const [sliderShow, setSliderShow] = useState(false); // 是否显示滑动条
  const sliderValueRef = useRef(0); // slider实时的值
  const currentPlaySecondRef = useRef(0); // 当前播放秒数
  const isSliderMovingRef = useRef(false); // 是否正在拖动slider
  const isSeekingRef = useRef(false); // 是否正在seek
  const { statusBarHeight } = useSelector(state => state.systemInfo);
  const timerRef = useRef<any>(null);
  const pendingTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const safeSetTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      pendingTimersRef.current.delete(id);
      fn();
    }, delay);
    pendingTimersRef.current.add(id);
    return id;
  }, []);

  // 组件卸载时清理所有 pending timer
  useEffect(() => {
    return () => {
      pendingTimersRef.current.forEach(id => clearTimeout(id));
      pendingTimersRef.current.clear();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const amplitudeList = useMemo(() => {
    return fileDetail?.amplitudes
      ? fileDetail?.amplitudes?.split(',').slice(0, 100).map(Number)
      : defaultAmplitudeList;
  }, [fileDetail?.amplitudes]);

  useUpdateEffect(() => {
    if (audioDownloadStatus === SingleCloudSyncStatus.DownloadFailed) {
      showToast({
        title: Strings.getLang('audio_download_failed'),
        icon: 'error',
      });
    }
  }, [audioDownloadStatus]);

  // 是否有本地文件
  const playableAudioPath = useMemo(() => {
    return fileDetail?.filePath;
  }, [fileDetail?.filePath]);

  // 是否有本地文件
  const hasLocalFile = useMemo(() => {
    return !!playableAudioPath;
  }, [playableAudioPath]);

  // 总秒数
  const totalSecond = useMemo(() => {
    return Math.floor(fileDetail?.duration / 1000);
  }, [fileDetail?.duration]);

  // 操作
  const operation = (
    ops: 'play' | 'pause' | 'stop' | 'resume' | 'seek',
    params?: {
      startTime?: number;
      success?: () => void;
      complete?: () => void;
      [key: string]: any;
    }
  ) => {
    if (Object.values(PlayStatus).includes(ops as PlayStatus)) {
      setPlayStatus(ops);
    }
    audioContext[ops]?.({
      success: () => {
        params?.success?.();
      },
      ...params,
      complete: () => {
        if (!timerRef.current) {
          isSeekingRef.current = true;
          timerRef.current = setTimeout(() => {
            isSeekingRef.current = false;
            timerRef.current = null;
          }, 1000);
        }

        params?.complete?.();
      },
    });
  };

  // 播放控制
  const { run: handlePlayControl } = useDebounceFn(
    async () => {
      // 如果没有本地文件且下载状态不是下载中，则下载音频文件
      if (
        !hasLocalFile &&
        audioDownloadStatus !== SingleCloudSyncStatus.Downloading &&
        audioDownloadStatus !== SingleCloudSyncStatus.DownloadSuccess
      ) {
        setAudioDownloadStatus(SingleCloudSyncStatus.Downloading);
        updateFileDetailLocal?.(prev =>
          prev ? { ...prev, cloudSyncStatus: SingleCloudSyncStatus.Downloading } : prev
        );
        await tttDownloadNoteAudio({
          fileId: fileDetail?.fileId,
          recordId: fileDetail?.recordId,
        });
        return;
      }

      if (audioDownloadStatus === SingleCloudSyncStatus.Downloading) return;
      // 下载成功但本地路径尚未回填时，暂不响应播放控制
      if (!hasLocalFile && audioDownloadStatus === SingleCloudSyncStatus.DownloadSuccess) return;

      switch (playStatus) {
        case PlayStatus.Initial:
          if (!playableAudioPath) return;
          operation('play', {
            src: playableAudioPath,
            playbackRate,
            startTime: currentPlaySecond || 0,
          });
          break;
        case PlayStatus.Play:
        case PlayStatus.Resume:
          operation('pause');
          break;
        case PlayStatus.Pause:
          operation('resume');
          break;
        default:
          break;
      }
    },
    { wait: 300, leading: true, trailing: false }
  );

  // 快进或者后退
  const handleSeek = (type: 'forward' | 'backward') => {
    const second = type === 'forward' ? currentPlaySecond + 15 : currentPlaySecond - 15;
    const position = type === 'forward' ? Math.min(second, totalSecond) : Math.max(second, 0);
    isSeekingRef.current = true;
    operation('seek', {
      position,
    });
    setCurrentPlaySecond(position);
  };

  // 修改播放速率
  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    setShowRateModal(false);
    if (!playableAudioPath) return;
    operation('pause', {
      success: () => {
        operation('play', {
          src: playableAudioPath,
          playbackRate: rate,
          startTime: currentPlaySecondRef.current,
        });
      },
    });
  };

  useEffect(() => {
    currentPlaySecondRef.current = currentPlaySecond;
  }, [currentPlaySecond]);

  // 监听音频播放进度更新事件
  const handleTimeUpdate = res => {
    // res.current在安卓为整秒，ios为小数，所以使用Math.floor取整
    const second = Math.floor(res?.current);
    if (res?.time && second !== currentPlaySecondRef.current && !isSeekingRef.current) {
      setCurrentPlaySecond(second);
    }
    if (res?.time === 1) {
      safeSetTimeout(() => {
        setPlayStatus(PlayStatus.Initial);
        setCurrentPlaySecond(0);
      }, 100);
    }
  };

  // 转写记录列表点击播放
  const handleAsrClick = (startSecond: number) => {
    if (!isNumber(startSecond) || startSecond < 0) return;
    if (!playableAudioPath) return;
    isSeekingRef.current = true;
    setCurrentPlaySecond(startSecond);
    if (playStatus === PlayStatus.Play) {
      operation('seek', {
        position: startSecond,
      });
    } else {
      operation('play', {
        src: playableAudioPath,
        playbackRate,
        startTime: startSecond,
      });
    }
  };

  // 只 seek 不改变播放状态（用于大纲点击等场景）
  const handleSeekWithoutPlay = (startSecond: number) => {
    if (!isNumber(startSecond) || startSecond < 0) return;
    isSeekingRef.current = true;
    setCurrentPlaySecond(startSecond);

    // 如果正在播放，需要 seek 到新位置继续播放
    if (playStatus === PlayStatus.Play) {
      operation('seek', {
        position: startSecond,
      });
    }
    // 其他状态（暂停、初始等）只更新时间，不触发任何音频操作
  };

  useEffect(() => {
    fileEmitter.on('onAsrClick', handleAsrClick);
    fileEmitter.on('onSeekWithoutPlay', handleSeekWithoutPlay);

    return () => {
      fileEmitter.off('onAsrClick', handleAsrClick);
      fileEmitter.off('onSeekWithoutPlay', handleSeekWithoutPlay);
    };
  }, [playableAudioPath, playbackRate, playStatus]);

  useEffect(() => {
    if (!audioContext) return () => {};
    audioContext?.onTimeUpdate(handleTimeUpdate);

    return () => {
      audioContext?.offTimeUpdate(handleTimeUpdate);
      audioContext?.destroyPlayer();
    };
  }, [audioContext]);

  // 滑动条关闭弹窗
  useEffect(() => {
    if (!startTouchY || !endTouchY) return;
    if (startTouchY - endTouchY > 30) {
      setPlayerShow(false);
    }
  }, [startTouchY, endTouchY]);

  // 波形颜色常量
  const WAVE_COLORS = {
    active1: 'var(--color-blue-3dcad4)',
    active2: 'var(--color-blue-3c56ff)',
    active3: 'var(--color-purple-b85aff)',
    inactive: 'var(--color-gray-d9)',
  };

  // 根据索引获取波形颜色
  const getBarColor = useCallback(
    (index: number, activeBars: number, colorSplitPoint1: number, colorSplitPoint2: number) => {
      const currentIndex = index + 1;
      if (currentIndex <= colorSplitPoint1) return WAVE_COLORS.active1;
      if (currentIndex <= colorSplitPoint2) return WAVE_COLORS.active2;
      if (currentIndex <= activeBars) return WAVE_COLORS.active3;
      return WAVE_COLORS.inactive;
    },
    []
  );

  // 预计算合并后的振幅列表（每2个一组取最大值）
  const mergedAmplitudes = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < amplitudeList.length; i += 2) {
      const val1 = Number(amplitudeList[i]) || 0;
      const val2 = Number(amplitudeList[i + 1]) || 0;
      result.push(Math.max(val1, val2));
    }
    return result;
  }, [amplitudeList]);

  // 渲染顶部播放器振幅（预计算样式数组）
  const miniWaveform = useMemo(() => {
    const percent = totalSecond > 0 ? currentPlaySecond / totalSecond : 0;
    const activeBars = Math.floor(mergedAmplitudes.length * percent);
    const colorSplitPoint1 = Math.floor(activeBars * 0.33);
    const colorSplitPoint2 = Math.floor(activeBars * 0.66);

    return mergedAmplitudes.map((item, index) => ({
      height: `${Math.max(34 * item, 2)}px`,
      backgroundColor: getBarColor(index, activeBars, colorSplitPoint1, colorSplitPoint2),
    }));
  }, [mergedAmplitudes, currentPlaySecond, totalSecond, getBarColor]);

  // 渲染顶部播放器振幅
  const renderMiniWaveForm = useCallback(() => {
    return (
      <View className={styles.miniWaveForm}>
        {/* 波形条仅为位置渲染，顺序固定，可用 index 作为 key */}
        {miniWaveform.map((style, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={index} className={styles.miniWaveForm_bar} style={style} />
        ))}
      </View>
    );
  }, [miniWaveform]);

  // 渲染弹窗播放器振幅
  const waveform = useMemo(() => {
    const percent = totalSecond > 0 ? currentPlaySecond / totalSecond : 0;
    const activeBars = Math.floor(amplitudeList.length * percent);
    const colorSplitPoint1 = Math.floor(activeBars * 0.33);
    const colorSplitPoint2 = Math.floor(activeBars * 0.66);

    return amplitudeList.map((item, index) => ({
      height: `${Math.max(85 * item, 1)}px`,
      backgroundColor: getBarColor(index, activeBars, colorSplitPoint1, colorSplitPoint2),
    }));
  }, [currentPlaySecond, totalSecond, amplitudeList, getBarColor]);

  // 当前倍率图标
  const currentRateIcon = useMemo(() => {
    const { icon } = playbackRateList.find(item => item.value === playbackRate);
    return icon;
  }, [playbackRate]);
  const currentRateIconName = useMemo(() => {
    const { iconName } = playbackRateList.find(item => item.value === playbackRate);
    return iconName;
  }, [playbackRate]);

  useUpdateEffect(() => {
    if (playerShow) {
      safeSetTimeout(() => {
        setSliderShow(true);
      }, 200);
    } else {
      setSliderShow(false);
    }
  }, [playerShow]);

  // 渲染音频下载状态和播放状态图标
  const audioBtnIcon = useMemo(() => {
    if (hasLocalFile) {
      const isPlaying = playStatus === PlayStatus.Play || playStatus === PlayStatus.Resume;
      return (
        <Icon
          name={isPlaying ? pauseIcon : palyIcon}
          color={playerShow ? 'var(--color-white-solid)' : 'var(--color-primary)'}
          size={24}
        />
      );
    }

    if (audioDownloadStatus === SingleCloudSyncStatus.Downloading) {
      return <Loading size={24} className={playerShow ? styles.white : styles.blue} />;
    }

    return (
      <ThemedImage
        src={playerShow ? Res.downloadIcon : Res.downloadBlueIcon}
        className={styles.downloadIcon}
        imageName={playerShow ? 'downloadIcon' : 'downloadBlueIcon'}
      />
    );
  }, [hasLocalFile, playStatus, audioDownloadStatus, playerShow]);

  return (
    <View className={styles.container}>
      <View
        className={clsx(styles.miniPlayer, {
          [styles.hidden]: playerShow,
        })}
      >
        <View className={styles.button} onClick={handlePlayControl}>
          {audioBtnIcon}
        </View>
        <View
          className={styles.progress}
          onClick={() => {
            setPlayerShow(true);
            setPlayerAnimation(true);
          }}
        >
          {renderMiniWaveForm()}
        </View>
      </View>

      <CustomCoverView
        needCover={showCoverView && playerShow}
        onTouchMove={() => {
          setPlayerShow(false);
        }}
      >
        <View
          className={clsx(styles.player, {
            [styles.showAnimation]: playerShow && playerAnimation,
            [styles.hiddenAnimation]: !playerShow && playerAnimation,
            [styles.hidden]: !playerAnimation,
          })}
          style={{
            marginTop: `${statusBarHeight + 2}px`,
          }}
          onClick={e => {
            e.origin.stopPropagation();
          }}
        >
          <View className={styles.waveformBox}>
            <View className={styles.waveform}>
              {/* 波形条仅为位置渲染，顺序固定，可用 index 作为 key */}
              {waveform.map((style, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <View key={index} className={styles.waveBar} style={style} />
              ))}
            </View>
            <Slider
              forceStep={0}
              deps={[sliderShow]}
              renderType="ray"
              minTrackRadius="12px"
              minTrackHeight="85px"
              maxTrackRadius="12px"
              maxTrackHeight="85px"
              minTrackColor="transparent"
              maxTrackColor="transparent"
              min={0}
              max={totalSecond}
              value={currentPlaySecond}
              onChange={value => {
                sliderValueRef.current = value;
                isSeekingRef.current = true;
                isSliderMovingRef.current = true;
              }}
              onAfterChange={value => {
                isSliderMovingRef.current = false;
                const position = Math.floor(value);
                setCurrentPlaySecond(position);
                if (playStatus !== PlayStatus.Initial) {
                  operation('seek', {
                    position,
                  });
                }

                // 触发恢复自动滚动，传入目标时间
                fileEmitter.emit('onRestoreAutoScroll', position);

                // 拖动后关闭播放器
                setPlayerShow(false);
              }}
              thumbWidth={1}
              thumbHeight={85}
              thumbRadius={2}
              thumbStyle={{
                background: 'rgb(255, 70, 70)',
                border: '1px solid rgb(255, 70, 70)',
                boxShadow: '0px 0px 2px 0px var(--color-text-tertiary)',
              }}
            />
            <View className={styles.timeBar}>
              <View className={styles.time}>
                {convertSecondsToTime(Math.floor(currentPlaySecond) || 0)}
              </View>
              <View className={styles.time}>
                {convertMillisecondsToTime(fileDetail?.duration || 0)}
              </View>
            </View>
          </View>
          <View className={styles.controlBox}>
            <Button
              className={styles.controlBtn}
              onClick={() => {
                setShowRateModal(true);
              }}
            >
              <ThemedImage
                className={styles.rateIcon}
                src={currentRateIcon}
                imageName={currentRateIconName}
              />
            </Button>
            <Button className={styles.controlBtn} onClick={() => handleSeek('backward')}>
              <ThemedImage imageName="imgBack15" className={styles.icon} src={Res.imgBack15} />
            </Button>
            <Button className={styles.playBtn} onClick={handlePlayControl}>
              {audioBtnIcon}
            </Button>
            <Button className={styles.controlBtn} onClick={() => handleSeek('forward')}>
              <ThemedImage
                imageName="imgForward15"
                className={styles.icon}
                src={Res.imgForward15}
              />
            </Button>
            <Button className={styles.controlBtn}>
              {/* <Image className={styles.icon} src={Res.imgNoiseReduction} /> */}
            </Button>
          </View>
          {/* 上滑取消条 */}
          <View
            className={styles.cancelBar}
            onTouchStart={event => {
              setStartTouchY(event.changedTouches[0]?.pageY);
            }}
            onTouchEnd={event => {
              setEndTouchY(event.changedTouches[0]?.pageY);
            }}
          >
            <View className={styles.bar} />
          </View>
        </View>
      </CustomCoverView>
      <PlaybackRateModal
        show={showRateModal}
        currentRate={playbackRate}
        onClickOverlay={() => {
          setShowRateModal(false);
        }}
        onConfirm={handleChangePlaybackRate}
      />
    </View>
  );
};

export default React.memo(Index);
