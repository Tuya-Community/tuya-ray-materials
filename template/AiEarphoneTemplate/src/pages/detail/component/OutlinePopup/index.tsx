/*
 * @Author: hkc
 * @Date: 2026-01-20 16:47:01
 * @LastEditors: hkc
 * @LastEditTime: 2026-02-03 17:53:38
 * @Description: 大纲弹窗组件
 */
import React, { FC, useContext, useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, vibrateShort } from '@ray-js/ray';
import { Transition } from '@ray-js/smart-ui';
import clsx from 'clsx';

import EllipsisText from '@/components/EllipsisText';
import { formatDurationToTime } from '@/utils/time';
import Strings from '@/i18n';
import { OutlineItem } from '@/types/file';
import { useSelector } from '@/redux';
import Outline from '../Outline';

import { fileEmitter } from '../../index';
import FileDetailContext from '../../context';

import styles from './index.module.less';

interface IProps {
  show: boolean;
  outlineList: OutlineItem[];
}

const OutlinePopup: FC<IProps> = ({ show, outlineList }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollVisibleChapterTime } = useContext(FileDetailContext);
  const { topBarHeight } = useSelector(state => state.systemInfo);

  // 保存前一个章节，用于退出动画
  const [prevChapter, setPrevChapter] = useState<OutlineItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const animationTimerRef = useRef<any>(null);

  // 查找当前滚动可视区域对应的章节
  const currentChapter = useMemo(() => {
    if (!outlineList.length) return null;

    // 如果没有滚动章节时间，默认返回第一个章节
    if (scrollVisibleChapterTime == null) {
      return outlineList[0];
    }

    // 根据滚动章节时间查找对应章节
    for (let i = 0; i < outlineList.length; i++) {
      const currentTime = Number(outlineList[i].time);
      const nextTime = i < outlineList.length - 1 ? Number(outlineList[i + 1].time) : Infinity;

      if (scrollVisibleChapterTime >= currentTime && scrollVisibleChapterTime < nextTime) {
        return outlineList[i];
      }
    }

    // 如果没找到匹配的章节，返回第一个章节
    return outlineList[0];
  }, [scrollVisibleChapterTime, outlineList]);

  // 监听章节变化，触发过渡动画
  useEffect(() => {
    // 首次设置
    if (currentChapter && !prevChapter) {
      setPrevChapter(currentChapter);
      return undefined;
    }

    // 章节变化
    if (currentChapter && prevChapter && currentChapter.time !== prevChapter.time) {
      // 清除之前的动画定时器（如果存在）
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }

      // 如果已经在动画中，跳过动画直接切换（避免重叠）
      if (isTransitioning) {
        // 立即完成当前动画，直接更新到新章节（无动画）
        setIsTransitioning(false);
        setPrevChapter(currentChapter);
        return undefined;
      }

      // 正常开始新动画
      setIsTransitioning(true);
      animationTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setPrevChapter(currentChapter);
        animationTimerRef.current = null;
      }, 300);
    }

    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [currentChapter]);

  // 监听外部事件，自动收起弹窗
  useEffect(() => {
    const handleCollapse = () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    // 监听收起弹窗事件（章节点击或手动滚动时触发）
    fileEmitter.on('onCollapseOutlinePopup', handleCollapse);

    return () => {
      fileEmitter.off('onCollapseOutlinePopup', handleCollapse);
    };
  }, [isExpanded]);

  // 点击缩略卡片展开
  const handleExpand = () => {
    vibrateShort({ type: 'light' });
    setIsExpanded(true);
  };

  // 展开状态变化回调
  const handleExpandChange = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  return (
    <Transition
      show={show}
      name="fade-up"
      customClass={styles.container}
      customStyle={{
        top: `${topBarHeight + 60}px`,
      }}
    >
      <View className={clsx(styles.outlineWrapper, { [styles.compact]: !isExpanded })}>
        <Outline
          className={clsx(styles.outline, { [styles.show]: isExpanded })}
          outlineList={outlineList}
          expanded
          onExpandChange={handleExpandChange}
        />

        {/* 缩略模式遮罩层：点击展开 */}
        {!isExpanded && currentChapter && (
          <View className={styles.compactOverlay} onClick={handleExpand}>
            <View className={styles.compactContent}>
              <View className={styles.info}>
                {/* 旧章节：向上淡出 */}
                {isTransitioning && prevChapter && (
                  <View
                    className={clsx(styles.chapterSlide, styles.slideOut)}
                    key={prevChapter.time}
                  >
                    <Text className={styles.time}>{formatDurationToTime(prevChapter.time)}</Text>
                    <EllipsisText text={prevChapter.title} className={styles.title} />
                  </View>
                )}

                {/* 新章节：从下方滑入 */}
                <View
                  className={clsx(styles.chapterSlide, styles.slideIn, {
                    [styles.initialShow]: !isTransitioning,
                  })}
                  key={currentChapter.time}
                >
                  <Text className={styles.time}>{formatDurationToTime(currentChapter.time)}</Text>
                  <EllipsisText text={currentChapter.title} className={styles.title} />
                </View>
              </View>
              <View className={styles.expandHint}>{Strings.getLang('expand')}</View>
            </View>
          </View>
        )}
      </View>
    </Transition>
  );
};

export default OutlinePopup;
