import React from 'react';
import { ScrollViewProps } from '@ray-js/adapter';

export interface IProps<T> extends ScrollViewProps {
  /**
   * @description.zh 类名
   * @description.en class name
   */
  className?: string;
  /**
   * @description.zh 内容类名
   * @description.en content class name
   */
  contentClassName?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 渲染列表项
   * @description.en Render list item
   */
  renderItem: (item: T, chunkIndex: number, index: number) => React.ReactNode;
  /**
   * @description.zh 渲染列表底部
   * @description.en Render the bottom of the list
   */
  renderBottom?: () => React.ReactNode;
  /**
   * @description.zh 渲染列表头部
   * @description.en Render the top of the list
   */
  renderTop?: () => React.ReactNode;
  /**
   * @description.zh 提前多少像素触发 chunk 的渲染/移除，需要基础库 >= 2.24.0
   * @description.en How many pixels in advance to trigger the rendering/removal of the chunk, requires baseversion >= 2.24.0
   * @default 1000
   */
  rootMargin?: number;
  /**
   * @description.zh 是否开启调试模式。调试模式会给 chunk 加上边框，并在在控制台打印 log
   * @description.en Whether to enable debug mode. The debug mode will add a border to the chunk and print logs in the console.
   * @default false
   */
  debug?: boolean;
  /**
   * @description.zh root 元素的 id
   * @description.en The id of the root element
   * @default 'recycleWrapper'
   */
  wrapperId?: string;
  /**
   * @description.zh 渲染骨架屏
   * @description.en Render skeleton screen
   * @default false
   */
  renderSkeleton?: (height: number) => React.ReactNode;
  renderList: T[][];
  /**
   * @description.zh renderList的起始索引，用于计算全局chunk索引
   * @description.en Start index of renderList for calculating global chunk index
   * @default 0
   */
  renderListStartIndex?: number;
  /**
   * @description.zh 滚动区域高度
   * @description.en The height of the scrolling area
   */
  scrollHeight?: number | string;
  /**
   * @description.zh 滚动到指定元素的偏移量，用于 scroll-view 的 scroll-into-view 属性
   * @description.en The offset of the specified element, used for scroll-view's scroll-into-view property
   * @default 0
   */
  scrollIntoViewOffset?: number;
}

export const defaultProps: IProps<null> = {
  renderList: [],
  renderItem: () => null,
  rootMargin: 1000,
  debug: false,
  wrapperId: 'recycleWrapper',
  scrollY: true,
  scrollX: false,
};
