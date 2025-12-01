import { IconFontName } from '@ray-js/icons/lib/Icon/props';
import React from 'react';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IProps {
  /**
   * @description.zh 图标
   * @description.en Icon
   * @default null
   */
  icon?: IconFontName;
  /**
   * @description.zh 是否显示
   * @description.en show
   * @default false
   */
  show: boolean;
  /**
   * @description.zh 宽度，最小值为320，小于320则使用默认宽度
   * @description.en Width, minimum value of 320, less than 320 use the default width
   * @default 706
   */
  width: number;
  /**
   * @description.zh 高度
   * @description.en Height
   * @default 112
   */
  height: number;
  /**
   * @description.zh 边框圆角
   * @description.en Border radius
   * @default 64
   */
  borderRadius: number;
  /**
   * @description.zh 背景色
   * @description.en Background Color
   * @default "#ffffff"
   */
  backgroundColor: string;
  /**
   * @description.zh 与顶部的距离
   * @description.en Top
   * @default 30
   */
  top: number;
  /**
   * @description.zh 文本内容
   * @description.en Content
   * @default ""
   */
  text: string;
  /**
   * @description.zh 点击回调事件
   * @description.en Click the callback event
   * @default null
   */
  onHandle?: () => void;
  /**
   * @description.zh 关闭事件
   * @description.en Close the event
   * @default null
   */
  onClosed?: () => void;
  /**
   * @description.zh 隐藏关闭按钮
   * @description.en Hide Close Button
   * @default null
   */
  hideCloseBtn?: boolean;
  /**
   * @description.zh 渲染自定义Icon
   * @description.en Render Custom Icon
   * @default null
   */
  renderCustomIcon?: () => React.ReactChild;
  /**
   * @description.zh 点击事件
   * @description.en Click Event
   * @default null
   */
  onClick?: () => void;
}

export const defaultProps: IProps = {
  show: false,
  width: 706,
  height: 92,
  borderRadius: 92,
  backgroundColor: '#ffffff',
  top: 128,
  text: '',
};
