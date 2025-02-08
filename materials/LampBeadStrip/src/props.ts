/*
 * @Author: mjh
 * @Date: 2024-09-12 09:55:13
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-22 17:22:42
 * @Description:
 */
export interface IProps {
  /**
   * 样式类
   * @description.zh 样式类
   * @description.en class Name
   * @default ''
   * 同react dom的className
   */
  className?: string;
  /**
   * @description.zh 动画模式 1-16
   * @description.en Animation mode 1-16
   * @default 1
   */
  mode?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
  /**
   * @description.zh canvas唯一标识
   * @description.en canvasId Unique identifier
   */
  canvasId: string | number;
  /**
   * @description.zh canvas父亲盒子样式
   * @description.en canvas father box style
   */
  containerStyle?: string;
  /**
   * @description.zh canvas 盒子样式
   * @description.en canvas Box style
   */
  canvasStyle?: string;
  /**
   * @description.zh 动画颜色列表必须：rgb
   * @description.en Animation Color List must rgb
   */
  colors: string[];
  /**
   * @description.zh 动画速度 1%-100% 对应动画帧刷新间隔 60ms～350ms，速度值越大，间隔越短
   * @description.en The animation speed ranges from 1% to 100%, corresponding to a frame refresh interval of 60ms to 350ms. The larger the speed value, the shorter the interval
   * @default 50
   */
  speed?: number;
  /**
   * @description.zh 是否播放动画
   * @description.en Whether to play the animation.
   * @default true
   */
  ready?: boolean;
  /**
   * @description.zh 缩放比例，适应屏幕
   * @description.en Zoom ratio adapts to the screen
   */
  scale?: number;
  /**
   * @description.zh 详细控制 direction 方向(0/1) segmented 段落(0/1) expand 扩展(0/1/2)
   * @description.en Detailed control of direction (0/1) segmented paragraph (0/1) expand (0/2)
   */
  contentValue?: {
    expand?: 0 | 1 | 2;
    direction?: 0 | 1;
    segmented?: 0 | 1;
  };
  /**
   * @description.zh 关闭灯的颜色
   * @description.en Turn off the color of the light
   * @default 'rgb(58,58,58)'
   */
  closeColor?: string;
  /**
   * @description.zh 自定义动画列表
   * @description.en Custom Animation List
   * @default undefined
   * @version 1.1.0
   */
  customAnimationList?: string[][];
  /**
   * @description.zh 自定义动画切换帧时间，单位毫秒
   * @description.en Custom animation switching frame time, in milliseconds
   * @default 100
   * @version 1.1.0
   */
  customAnimationChangeTime?: number;
  /**
   * @description.zh 标准缩放比例，内部表达式： windowWidth / 375 * standardScale, 目的简化书写
   * @description.en Standard scaling ratio, internal expression: windowWidth / 375 * standardScale,  Purpose: Simplify Writing
   * @default 1
   * @version 1.1.0
   */
  standardScale?: number;
}

export const defaultProps: IProps = {
  mode: 1,
  canvasId: undefined,
  ready: true,
  speed: 50,
  colors: [],
  contentValue: {},
  closeColor: 'rgb(58,58,58)',
  className: '',
  customAnimationChangeTime: 100,
  standardScale: 1,
};
