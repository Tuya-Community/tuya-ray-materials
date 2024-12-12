import React from 'react';
import { IScrollProps } from '../RecycleView/props';

export interface IProps<T> extends IScrollProps {
  /**
   * @description.zh 类名
   * @description.en class name
   */
  className?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 列表项数据
   * @description.en List item data
   */
  data: T[][];
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
}

export const defaultProps: IProps<null> = {
  data: [],
  renderItem: () => null,
  rootMargin: 1000,
  debug: false,
  wrapperId: 'recycleWrapper',
  scrollY: true,
  scrollX: false,
};
