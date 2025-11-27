/* eslint-disable import/no-cycle */
import { noop } from 'lodash-es';
import React from 'react';
// @ts-ignore
import Clipper from './clipper/index';

type Detail = {
  /**
   * 触发事件变更的来源，`leftHandler` 左侧滑块、`rightHandler` 右侧滑块、`bg` 背景、`indicator` 指示器
   */
  tag: 'leftHandler' | 'rightHandler' | 'bg' | 'indicator';
  /**
   * 视频当前进度条的定位时间，单位秒
   */
  progress: number;
  /**
   * 视频剪切的开始时间和结束时间，单位秒
   */
  clipTimes: [number, number];
};

export type EventClipper<T extends string> = {
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
   * 视频剪切最小时长，单位秒
   *
   * @default 3
   */
  clipMinTime?: number;
  /**
   * 视频剪切最大时长，单位秒
   *
   * @default 15
   */
  clipMaxTime?: number;
  /**
   * 视频缩略图数量
   */
  thumbnailCount?: number;
  /**
   * 视频缩略图高度，单位 rpx
   */
  thumbnailHeight?: number;
  /**
   * 视频裁减器开始变更事件
   */
  onBeforeChange?: (evt: EventClipper<'onBeforeChange'>) => void;
  /**
   * 视频裁减器变更时间
   */
  onChange?: (evt: EventClipper<'onChange'>) => void;
  /**
   * 视频裁减器结束变更事件
   */
  onAfterChange?: (evt: EventClipper<'onAfterChange'>) => void;
}

export const VideoClipper: React.FC<Props> = ({
  onBeforeChange,
  onChange,
  onAfterChange,
  ...props
}) => {
  return (
    <Clipper
      {...props}
      bind:onBeforeChange={onBeforeChange || noop}
      bind:onChange={onChange || noop}
      bind:onAfterChange={onAfterChange || noop}
    />
  );
};
