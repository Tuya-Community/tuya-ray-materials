/*
 * @Author: hkc
 * @Date: 2025-12-08 10:58:25
 * @LastEditors: hkc
 * @LastEditTime: 2026-01-14 15:46:15
 * @Description: 新用户引导弹窗
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getStorageSync,
  setStorageSync,
  View,
  Button,
  Video,
  createVideoContext,
} from '@ray-js/ray';
import { BottomSheet, Icon } from '@ray-js/smart-ui';
import arrowIcon from '@tuya-miniapp/icons/dist/svg/ArrowForward';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import clsx from 'clsx';

import Strings from '@/i18n';
import { GUIDE_VIDEO_1, GUIDE_VIDEO_2, GUIDE_VIDEO_3 } from '@/constant/url';
import { getThirdCdnUrl } from '@/utils/url';
import { useAppDispatch, useSelector } from '@/redux';
import { updateUiState } from '@/redux/modules/uiStateSlice';
import Res from '@/res';
import styles from './index.module.less';

interface IProps { }

const Index: React.FC<IProps> = () => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isReady, setIsReady] = useState(false); // 是否准备好播放
  const { regionCode } = useSelector(state => state.userInfo);
  const dispatch = useAppDispatch();
  const videoContextsRef = useRef<any[]>([]);
  // 追踪每个视频是否已准备好播放
  const videoReadyStateRef = useRef<boolean[]>([false, false, false]);
  const handleClose = () => {
    setShow(false);
    setStorageSync({ key: 'hasNewUserGuide', data: 'true' });
    dispatch(updateUiState({ hasNewUserGuide: true }));
  };

  const changePage = (next: number) => {
    if (next === current) return;
    if (videoContextsRef.current[current]) {
      videoContextsRef.current[current]?.stop?.();
    }
    setCurrent(next);
  };

  // 下一页
  const handleNext = () => {
    if (current < dataSource.length - 1) {
      changePage(current + 1);
    } else {
      handleClose();
    }
  };

  const dataSource = useMemo(
    () => [
      {
        id: 1,
        src: getThirdCdnUrl(GUIDE_VIDEO_1, regionCode),
        title: Strings.getLang('new_user_guide_title_1'),
        desc: Strings.getLang('new_user_guide_desc_1'),
        poster: Res.videoPoster1,
      },
      {
        id: 2,
        src: getThirdCdnUrl(GUIDE_VIDEO_2, regionCode),
        title: Strings.getLang('new_user_guide_title_2'),
        desc: Strings.getLang('new_user_guide_desc_2'),
        poster: Res.videoPoster2,
      },
      {
        id: 3,
        src: getThirdCdnUrl(GUIDE_VIDEO_3, regionCode),
        title: Strings.getLang('new_user_guide_title_3'),
        desc: Strings.getLang('new_user_guide_desc_3'),
        poster: Res.videoPoster3,
      },
    ],
    [regionCode]
  );

  const playVideo = useCallback(
    (index: number) => {
      const videoId = `guide-video-${dataSource[index]?.id}`;
      if (!videoId) return;
      // 创建或获取 video context
      if (!videoContextsRef.current[index]) {
        videoContextsRef.current[index] = createVideoContext(videoId);
      }
      const ctx = videoContextsRef.current[index];

      // 只有在视频准备好的情况下才播放
      if (videoReadyStateRef.current[index]) {
        // 每次进入页都从头播放
        ctx?.play?.();
      } else {
        // 如果视频还没准备好，先seek到0，等待canplay事件触发播放
        ctx?.seek?.(0);
      }
    },
    [dataSource]
  );

  useEffect(() => {
    // 根据缓存的hasNewUserGuide字段，判断是否展示引导弹窗，如果有值则不展示
    const hasNewUserGuide = getStorageSync({ key: 'hasNewUserGuide' }) || null;
    dispatch(updateUiState({ hasNewUserGuide: !!hasNewUserGuide }));
    if (!hasNewUserGuide) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    // 滑动到对应页时触发播放，延迟确保 Video 组件完全重新渲染
    const timer = setTimeout(() => {
      playVideo(current);
    }, 200);
    return () => clearTimeout(timer);
  }, [current, playVideo, isReady]);

  // 处理视频准备就绪事件
  const handleVideoCanPlay = useCallback(
    (index: number) => {
      videoReadyStateRef.current[index] = true;

      // 如果是当前显示的视频，立即播放
      if (index === current) {
        const ctx = videoContextsRef.current[index];
        ctx?.play?.();
      }
    },
    [current]
  );

  // 处理视频加载数据事件
  const handleVideoLoadedMetadata = useCallback((index: number) => {
    videoReadyStateRef.current[index] = true;
  }, []);

  return (
    <BottomSheet
      show={show}
      onClose={handleClose}
      customClass={styles.container}
      closeOnClickOverlay={false}
      onAfterEnter={() => setIsReady(true)}
    >
      <View className={styles.videoWrapper}>
        {dataSource.map((item, index) => (
          <Video
            key={`guide-video-${item.id}`}
            id={`guide-video-${item.id}`}
            src={item.src}
            className={clsx(styles.video, { [styles.hidden]: current !== index })}
            autoPause={false}
            muted
            controls={false}
            showCenterPlayBtn={false}
            poster={item.poster}
            onCanplay={() => handleVideoCanPlay(index)}
            onLoadedMetadata={() => handleVideoLoadedMetadata(index)}
          />
        ))}
      </View>
      <View className={styles.swiperWrapper}>
        <View className={styles.content}>
          <View className={styles.title}>{dataSource[current]?.title}</View>
          <View className={styles.desc}>{dataSource[current]?.desc}</View>
        </View>
      </View>
      <View className={styles.bottom}>
        <Button
          className={clsx(styles.next, { [styles.experience]: current === dataSource.length - 1 })}
          onClick={handleNext}
        >
          {current === dataSource.length - 1 ? (
            Strings.getLang('new_user_guide_experience')
          ) : (
            <Icon name={arrowIcon} size={24} color="var(--color-white-solid)" />
          )}
        </Button>

        <View className={styles.dots}>
          {dataSource.map((item, index) => (
            <View
              key={item.id}
              className={clsx(styles.dot, { [styles.active]: current === index })}
              onClick={() => changePage(index)}
            ></View>
          ))}
        </View>
      </View>
      <Icon
        name={closeIcon}
        size={24}
        color="var(--color-text-white-7)"
        customClass={styles.close}
        onClick={handleClose}
      />
    </BottomSheet>
  );
};

export default Index;
