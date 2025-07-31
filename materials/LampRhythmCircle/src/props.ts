import React from 'react';
/* eslint-disable @typescript-eslint/no-empty-function */
export interface IProps {
  /**
   * @description.zh 禁止滑动
   * @description.en Ban sliding
   * @default false
   */
  disable?: boolean;
  /**
   * @description.zh 整体样式
   * @description.en Container Style
   * @default {}
   */
  style?: React.CSSProperties;
  /**
   * @description.zh 背景图片样式
   * @description.en Background Image Style
   * @default {}
   */
  backgroundStyle?: React.CSSProperties;
  /**
   * @description.zh 生物节律节点数据
   * @description.en Rhythm Node Array Data
   * @default []
   */
  data: Array<IData>;
  /**
   * @description.en Icon size (pass in pixels, will be converted to rpx internally)
   * @description.zh 图标尺寸（按px尺寸传, 内部会转化成rpx）
   * @default 16
   * @version 0.0.10
   */
  iconSize?: number;
  /**
   * @description.en Inner circle radius (must be less than outer circle radius, provided in px and will be converted to rpx internally)
   * @description.zh 内圈半径（需小于外圈半径，按px尺寸传, 内部会转化成rpx）
   * @default 107.5
   */
  innerRadius?: number;
  /**
   * @description.en Outer radius (must be greater than the inner radius, passed in px size, will be converted to rpx internally) Outer radius
   * @description.zh 外圈半径（需大于内圈半径 按px尺寸传, 内部会转化成rpx）外圈半径
   * @default 147.5
   */
  radius?: number;
  /**
   * @description.en Is dark theme
   * @description.zh 是否是深色主题
   * @default true
   */
  isDarkTheme?: boolean;
  /**
   * @description.en icon list
   * @description.zh icon 列表，顺序对应 data
   * @default []
   */
  iconList?: string[];
  /**
   * @description.en Center background color (can be transparent)
   * @description.zh 中心背景色(可以为透明)
   * @default '#000'
   * @version 0.0.10
   */
  centerBackground?: string;
  /**
   * @description.en circle background image
   * @description.zh 生物节律背景图片
   */
  backgroundImage?: string;
  /**
   * @description.en The spacing between the outer ring and the whole (measured in pixels, will be converted to rpx internally)
   * @description.zh 外圈和整体的间距（按px尺寸传，内部会转化成rpx）
   * @default 2
   */
  padding?: number;
  /**
   * @description.zh 滑动开始时触发
   * @description.en Triggered at the start of the swipe
   * @default () => {}
   * @version 0.0.10
   */
  onStart?: (v: CanvasData) => void;
  /**
   * @description.zh 滑动时触发
   * @description.en slider Value changes
   * @default () => {}
   */
  onChange?: (v: CanvasData) => void;
  /**
   * @description.zh 手指离开时触发
   * @description.en Values change after the trigger
   * @default () => {}
   */
  onRelease?: (v: CanvasData) => void;
  /**
   * @description.en time interval（Unit:Minute）
   * @description.zh 时间最小间隔（单位：分钟）
   * @default 30
   */
  timeOffset?: number;
}

interface CanvasData {
  /**
   * @description.zh 具体节点数据, 按time从小到大进行排序 8>节点数量>2
   * @description.en time node data, Sort by time from small to large 8>Node Length>2
   */
  value: IData[];
  /**
   * @description.zh 具体触发的index
   * @description.en active index
   */
  activeIndex: number;
}

interface IData {
  /**
   * @description.en Time for each node (unit: minutes)
   * @description.zh 每个节点对应的时间（单位：分钟）
   */
  time: number;
  /**
   * @description.en ActiveColor for each node
   * @description.zh 每个节点对应的渐变颜色（必须传6位的hex）
   */
  activeColor: string;
  /**
   * @description.en Whether each node can be dragged
   * @description.zh 单节点是否可以拖动
   */
  valid?: boolean;
  /**
   * @description.en icon
   * @description.zh icon
   */
  icon?: string;
}

export const defaultProps: IProps = {
  iconSize: 20,
  padding: 2,
  data: [],
  timeOffset: 30,
  isDarkTheme: true,
  disable: false,
  onStart: () => {},
  onChange: () => {},
  onRelease: () => {},
};
