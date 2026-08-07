/*
 * @Author: hkc
 * @Date: 2026-01-19 20:28:56
 * @LastEditors: hkc
 * @LastEditTime: 2026-03-26 19:37:05
 * @Description: 智能章节组件
 */
import { View, Image, Text, vibrateShort } from '@ray-js/ray';
import React, { useContext, useState, useCallback } from 'react';
import clsx from 'clsx';

import EllipsisText from '@/components/EllipsisText';

import Strings from '@/i18n';
import Res from '@/res';
import { formatDurationToTime } from '@/utils/time';
import { OutlineItem } from '@/types/file';
import FileDetailContext from '../../context';
import { fileEmitter } from '../../index';

import styles from './index.module.less';

interface IProps {
  className?: string;
  outlineList: OutlineItem[]; // 章节列表（必填）
  expanded?: boolean; // 受控：展开状态
  onExpandChange?: (expanded: boolean) => void; // 展开状态变化回调
}

const Outline: React.FC<IProps> = ({
  className,
  outlineList = [],
  expanded: controlledExpanded,
  onExpandChange,
}) => {
  // 内部状态（非受控模式）
  const [internalExpanded, setInternalExpanded] = useState(false);
  const { currentPlaySecond } = useContext(FileDetailContext);

  // 实际使用的展开状态（受控/非受控）
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  // 显示的章节数量
  const displayCount = isExpanded ? outlineList.length : Math.min(3, outlineList.length);

  // 判断某个章节是否是当前播放的章节
  const isActiveChapter = useCallback(
    (index: number) => {
      if (currentPlaySecond === null || currentPlaySecond === undefined) return false;

      const currentTime = Number(outlineList[index].time);
      const nextTime =
        index < outlineList.length - 1 ? Number(outlineList[index + 1].time) : Infinity;

      return currentPlaySecond >= currentTime && currentPlaySecond < nextTime;
    },
    [currentPlaySecond, outlineList]
  );

  // 点击章节
  const handleItemClick = (time: number) => {
    vibrateShort({ type: 'light' });

    // 通知播放器跳转
    fileEmitter.emit('onSeekWithoutPlay', time);
    fileEmitter.emit('onRestoreAutoScroll', time);

    // 通知收起弹窗（用于 OutlinePopup）
    fileEmitter.emit('onCollapseOutlinePopup');
  };

  // 切换展开/收起
  const handleToggle = () => {
    vibrateShort({ type: 'light' });
    const newExpanded = !isExpanded;

    // 受控模式：通知外部
    if (controlledExpanded !== undefined) {
      onExpandChange?.(newExpanded);
    } else {
      // 非受控模式：更新内部状态
      setInternalExpanded(newExpanded);
    }
  };

  const hasMore = outlineList.length > 3;

  return (
    <View
      className={clsx(styles.container, className, {
        [styles.hasMore]: hasMore,
      })}
    >
      {/* 标题 */}
      <View className={styles.header}>
        <Image src={Res.outlineIcon} className={styles.icon} />
        {Strings.getLang('detail.outline')}
      </View>

      {/* 章节列表 */}
      <View className={clsx(styles.listWrapper, { [styles.expanded]: isExpanded })}>
        <View className={styles.list}>
          {outlineList.slice(0, displayCount).map((item, index) => {
            const isActive = isActiveChapter(index);
            return (
              <View
                className={styles.item}
                key={item.time}
                onClick={() => handleItemClick(Number(item.time))}
              >
                <Text className={styles.time}>{formatDurationToTime(item.time)}</Text>
                <EllipsisText
                  text={item.title}
                  className={clsx(styles.itemTitle, { [styles.active]: isActive })}
                  numberOfLines={2}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* 展开/收起按钮 */}
      {hasMore && (
        <View className={styles.toggleBtn} onClick={handleToggle}>
          {isExpanded ? Strings.getLang('collapse') : Strings.getLang('expand')}
        </View>
      )}
    </View>
  );
};

export default Outline;
