import React from 'react';

export interface IProps {
  /**
   * @description.zh 卡片数据
   * @description.en Card data
   * @default null
   */
  data: {
    title: string;
    icon: string;
    colorArr?: string[];
  };
  /**
   * @description.zh 主题
   * @description.en Theme
   * @default 'dark'
   * @version 1.1.0
   */
  theme?: 'dark' | 'light';
  /**
   * @description.zh 是否正在执行
   * @description.en Whether it is executing
   * @default false
   */
  active: boolean;
  /**
   * @description.zh 整体样式
   * @description.en Whole style
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 组件类名
   * @description.en Component className
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 内容样式
   * @description.en Content style
   * @default {}
   */
  contentStyle?: React.CSSProperties;
  /**
   * @description.zh 标题样式
   * @description.en title style
   * @default {}
   */
  titleStyle?: React.CSSProperties;
  /**
   * @description.zh icon颜色
   * @description.en icon color
   * @default {}
   */
  iconColor?: string;
  /**
   * @description.zh icon 背景颜色
   * @description.en icon background color
   * @version 1.0.1
   */
  iconCircleBgColor?: string;
  /**
   * @description.zh 操作时的回调函数
   * @description.en Callback function when the operation
   * @default () => void
   */
  onPlay: (active: boolean) => void;
  /**
   * @description.zh 自定义卡片内容
   * @description.en Custom card content
   * @default () => JSX.Element
   */
  renderCustom?: () => JSX.Element;
  /**
   * @description.en renderFoldIcon
   * @description.zh 渲染折叠icon
   * @default () => JSX.Element
   */
  renderFoldIcon?: (unfold: boolean) => JSX.Element;
}
