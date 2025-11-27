/* eslint-disable import/no-cycle */
import { noop } from 'lodash-es';
import React from 'react';
// @ts-ignore
import Seeker from './seeker/index';

type Detail = {
  /**
   * 当前进度条的 x 坐标，即拖动距离，单位 px
   */
  x: number;
  /**
   * 当前进度条相对于视频时长的值，单位 ms
   */
  progress: number;
  /**
   * 当前进度条相对于视频时长的百分比，单位 %
   */
  percent: number;
};

type Event<T extends string> = {
  type: T;
  detail: Detail;
  stopPropagation: () => void;
  timeStamp: number;
};

interface Props {
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * Video 实例 id，用于监听视频的播放进度
   */
  videoId: string;
  /**
   * 视频地址
   */
  src: string;
  /**
   * 视频播放时长，单位毫秒
   */
  duration: number;
  /**
   * 视频缩略图数量
   */
  thumbnailCount?: number;
  /**
   * 视频缩略图宽度，单位 rpx
   */
  thumbnailWidth?: number;
  /**
   * 视频缩略图高度，单位 rpx
   */
  thumbnailHeight?: number;
  /**
   * 视频进度条开始变更事件
   */
  onBeforeChange?: (evt: Event<'onBeforeChange'>) => void;
  /**
   * 视频进度条变更事件
   */
  onChange?: (evt: Event<'onChange'>) => void;
  /**
   * 视频进度条结束变更事件
   */
  onAfterChange?: (evt: Event<'onAfterChange'>) => void;
}

export const VideoSeeker: React.FC<Props> = ({
  onBeforeChange,
  onChange,
  onAfterChange,
  ...props
}) => {
  return (
    <Seeker
      {...props}
      bind:onBeforeChange={onBeforeChange || noop}
      bind:onChange={onChange || noop}
      bind:onAfterChange={onAfterChange || noop}
    />
  );
};
