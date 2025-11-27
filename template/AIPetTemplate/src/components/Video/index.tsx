import React, { useEffect, useMemo } from 'react';
import {
  createVideoContext,
  Video as VideoBase,
  Image,
  View,
  Input,
  usePageEvent,
  showToast,
  Text,
} from '@ray-js/ray';
import { Button, Transition } from '@ray-js/smart-ui';
import { useMount, useSetState } from 'ahooks';
import clsx from 'clsx';
import { usePlayPause } from '@/hooks/usePlayPause';
// eslint-disable-next-line import/no-cycle
import { clipVideoAsync, fetchVideoThumbnailsAsync } from '@/api/nativeApi';
import { isInIDE, normalizeFilePath } from '@/utils';
import { MAX_TITLE_NUM, VIDEO_CLIP_MAX_TIME } from '@/constant';
import Strings from '@/i18n';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import { getCachedDeviceInfo } from '@/api/getCachedDeviceInfo';
import styles from './index.module.less';
import { VideoSeeker } from '../VideoSeeker';
import { VideoClipper } from '../VideoClipper';
import { GlobalToastInstance } from '../GlobalToast/toast';

const images = {
  play: '/images/icon-play.png',
  pause: '/images/icon-pause.png',
};

type VideoClipperProps = React.ComponentProps<typeof VideoClipper>;

type MetaData = {
  /**
   * 视频宽度
   */
  width: number;
  /**
   * 视频高度
   */
  height: number;
  /**
   * 视频时长，单位毫秒
   */
  duration: number;
};

interface Props {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * Video 实例 id
   */
  id: string;
  /**
   * 当前视频组件的类型，`选择器`、`编辑器`、`预览器`、`纯展示器`
   */
  type: 'selector' | 'editor' | 'previewer' | 'none';
  /**
   * Video source
   */
  src: string;
  /**
   * 视频封面的图片资源地址
   */
  poster?: string;
  /**
   * 是否显示播放暂停按钮
   */
  showPlayPause?: boolean;
  /**
   * 是否自动播放
   */
  autoplay?: boolean;
  /**
   * 视频组件额外内容
   */
  extra?: React.ReactNode;
  /**
   * 仅在 type 为 selector 时有效，点击下一步时触发
   */
  onNextStep?: () => void;
  /**
   * 仅在 type 为 editor 时有效，点击发送到相框时触发
   */
  onSendToFrame?: (params: {
    path: string;
    title: string;
    thumbnail: string;
    originUrl: string; // 原始路径
    videoDuration: number;
  }) => void;
}

const sysInfo = getCachedSystemInfo();

enum ELevel {
  LEVEL_1 = '1',
  LEVEL_2 = '2',
  LEVEL_3 = '3',
  LEVEL_4 = '4',
}

const videoClipMapWithPid = {
  // pid: level
  qivtwntdomzdtmpv: ELevel.LEVEL_1,
};

export const Video: React.FC<Props> = ({
  className,
  // id: idOrigin,
  id,
  type,
  src,
  poster,
  extra,
  showPlayPause = true,
  autoplay = false,
  onNextStep,
  onSendToFrame,
}) => {
  const videoCtxRef = React.useRef(null);
  const videoTitleRef = React.useRef('');
  // const [id, setId] = React.useState(idOrigin);
  const [playSrc, setPlaySrc] = React.useState(src);
  const [isClipping, setIsClipping] = React.useState(false);
  const [isPlayState, setIsPlayState] = React.useState(false);
  const [clipTimes, setClipTimes] = React.useState<[number, number]>([
    0,
    VIDEO_CLIP_MAX_TIME * 1000,
  ]);
  const [metaData, setMetaData] = useSetState<MetaData>({} as MetaData);
  const { isPlay, isVisible, play, pause } = usePlayPause();

  useMount(() => {
    const ctx = createVideoContext(id);
    videoCtxRef.current = ctx;
  });

  usePageEvent('onHide', () => {
    // 页面隐藏时，暂停视频，避免后台播放
    setIsPlayState(isPlay);
    videoCtxRef.current?.pause();
  });

  usePageEvent('onUnload', () => {
    // 页面卸载时，暂停视频，避免后台播放
    videoCtxRef.current?.pause();
  });

  usePageEvent('onShow', () => {
    // 页面显示时，重新播放视频
    isPlayState && videoCtxRef.current?.play();
    setIsPlayState(false);
  });

  const handleLoadMetaData = React.useCallback(evt => {
    setMetaData(evt.detail);
    if (evt?.detail?.duration < VIDEO_CLIP_MAX_TIME) {
      setClipTimes([0, Math.floor((evt?.detail?.duration ?? VIDEO_CLIP_MAX_TIME) * 1000)]);
    }
  }, []);

  const handlePlay = React.useCallback(() => {
    play();
  }, []);

  const handlePause = React.useCallback(() => {
    pause();
  }, []);

  const handleClipEnd = React.useCallback<VideoClipperProps['onAfterChange']>(
    evt => {
      const { tag, progress, clipTimes } = evt.detail;
      const clipTimesSecond = clipTimes.map((time: number) => Math.floor(time * 1000)) as [
        number,
        number
      ];
      setClipTimes(clipTimesSecond);
      videoCtxRef.current?.seek(progress);
    },
    [src]
  );

  const handleSeekEnd = React.useCallback(evt => {
    const { progress } = evt.detail;
    videoCtxRef.current?.seek(progress);
  }, []);

  const handleError = React.useCallback(
    evt => {
      console.log('🚀 handleError Video Error:', evt);
      // 某些情况下，t=0.1 会无法播放，兼容一下
      if (playSrc?.includes('#t=0.1')) {
        setPlaySrc(src.replace('#t=0.1', ''));
        return;
      }
      showToast({ title: Strings.getLang('videoPlayError'), icon: 'none' });
    },
    [playSrc]
  );

  const handleClickVideo = React.useCallback(() => {
    if (isPlay) videoCtxRef.current?.pause();
    else videoCtxRef.current?.play();
  }, [isPlay, videoCtxRef.current]);

  const handleSend = React.useCallback(async () => {
    const realPath = normalizeFilePath(src);
    const [startTime, endTime] = clipTimes;
    // smart-ui 的 toast 支持在 clear 之前永不结束
    GlobalToastInstance.loading({
      message: Strings.getLang('editVideoClipping'),
      duration: 0,
      forbidClick: true,
      mask: true,
    });
    setIsClipping(true);

    const deviceInfo = getCachedDeviceInfo();
    // 适配 其他设备厂商的视频规格
    const pid = deviceInfo?.productId;
    clipVideoAsync({ filePath: realPath, startTime, endTime, level: videoClipMapWithPid[pid] || 3 })
      .then(async res => {
        try {
          const thumb = await fetchVideoThumbnailsAsync({
            filePath: res.videoClipPath,
            startTime: 0,
            endTime: 1000,
            thumbnailCount: 1,
            thumbnailWidth: 343 * 3,
            thumbnailHeight: 343 * 3,
          });
          const thumbnail = thumb?.thumbnailsPath?.[0];
          onSendToFrame({
            path: res.videoClipPath,
            title: videoTitleRef.current,
            thumbnail,
            originUrl: src, // 原始路径
            videoDuration: endTime - startTime,
          });
          setIsClipping(false);
          GlobalToastInstance.clear();
        } catch (error) {
          onSendToFrame({
            path: res.videoClipPath,
            title: videoTitleRef.current,
            thumbnail: poster,
            originUrl: src, // 原始路径
            videoDuration: endTime - startTime,
          });
          setIsClipping(false);
          GlobalToastInstance.clear();
        }
      })
      .catch(err => {
        setIsClipping(false);
        GlobalToastInstance.clear();
        showToast({ title: Strings.getLang('editVideoClipFailed'), icon: 'none' });
      });
  }, [src, clipTimes]);

  const handleInput = React.useCallback(
    evt => {
      videoTitleRef.current = evt?.detail?.value ?? '';
    },
    [videoTitleRef]
  );

  useEffect(() => {
    let playSrc: string;
    if (isInIDE) {
      playSrc = '{0}/content-platform/hestia/17203411902f1a66224ff.mp4';
    } else {
      const deviceInfo = getCachedDeviceInfo();
      // iOS 12 不支持首帧预加载，需要兼容下
      const isIos12 = deviceInfo?.system?.includes('iOS 12');
      // t=0.1 可以保证 iOS 首帧视频预加载，提高视频播放体验
      playSrc = sysInfo.platform === 'ios' && !isIos12 ? `${src}#t=0.1` : src;
    }
    setPlaySrc(playSrc);
  }, [src]);

  const videoSrcOrigin = useMemo(() => {
    if (isInIDE) {
      return '{0}/content-platform/hestia/17203411902f1a66224ff.mp4';
    }
    return src;
  }, [src]);

  return (
    <>
      <View className={clsx(styles.video, className)}>
        <VideoBase
          // @ts-ignore // TODO: fix typing
          id={id}
          src={playSrc}
          className={styles['video-player']}
          poster={poster}
          showFullscreenBtn={false}
          showPlayBtn
          showCenterPlayBtn={false}
          autoplay={autoplay}
          objectFit="contain"
          showMuteBtn
          loop
          // @ts-ignore
          bind:loadedmetadata={handleLoadMetaData}
          // TODO: 找人看下
          // onLoadedmetadata={evt => {
          //   console.log('=== onLoadedmetadata', evt);
          // }}
          // onProgress={evt => {
          //   console.log('=== evt progress', evt);
          // }}
          onPlay={handlePlay}
          onPause={handlePause}
          onClick={handleClickVideo}
          onError={handleError}
        />
        <Transition name="fade" show={showPlayPause && isVisible} duration={375}>
          <Image
            className={styles['video-play-pause-btn']}
            src={isPlay ? images.pause : images.play}
            onClick={handleClickVideo}
          />
        </Transition>
        {extra}
      </View>
      {type === 'previewer' && (
        <View className={styles['video-previewer']}>
          <VideoSeeker
            style={{ marginBottom: '18rpx' }}
            videoId={id}
            src={videoSrcOrigin}
            duration={metaData?.duration ?? 0}
            onAfterChange={handleSeekEnd}
          />
        </View>
      )}
      {type === 'selector' && (
        <View className={styles['video-selector']}>
          <View className={styles['video-selector__header']}>
            <Button type="info" onClick={onNextStep}>
              {Strings.getLang('nextStep')}
            </Button>
          </View>
          <VideoSeeker
            style={{ marginBottom: '18rpx' }}
            videoId={id}
            src={videoSrcOrigin}
            duration={metaData?.duration ?? 0}
            onAfterChange={handleSeekEnd}
          />
        </View>
      )}
      {type === 'editor' && (
        <>
          <View className={styles['video-editor']}>
            <VideoClipper
              style={{ marginBottom: '18rpx' }}
              videoId={id}
              src={videoSrcOrigin}
              duration={metaData?.duration ?? 0}
              clipMaxTime={VIDEO_CLIP_MAX_TIME}
              onAfterChange={handleClipEnd}
            />
            <Input
              className={styles['video-editor__input']}
              placeholder={Strings.getLang('editVideoInput')}
              // @ts-ignore
              placeholderStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
              maxLength={MAX_TITLE_NUM}
              onInput={handleInput}
            />
          </View>
          <View className={styles['video-editor__sender']}>
            <Button
              type="info"
              size="large"
              icon="/icons/icon-mail.png"
              loading={isClipping}
              onClick={handleSend}
            >
              <Text style={{ fontSize: '32rpx' }}>{Strings.getLang('editVideoButton')}</Text>
            </Button>
          </View>
        </>
      )}
    </>
  );
};
