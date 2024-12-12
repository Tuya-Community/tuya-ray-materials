import { getRandomString } from '../../utils';

export interface IProps {
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
   * @description.zh children
   * @description.en children
   */
  children?: React.ReactNode;
  /**
   * @description.zh 唯一标识
   * @description.en Unique identifier
   */
  chunkId?: string;
  /**
   * @description.zh root 元素的 id
   * @description.en The id of the root element
   * @default 'recycleWrapper'
   */
  wrapperId?: string;
  /**
   * @description.zh 提前多少像素触发 chunk 的渲染/移除，默认 1000，需要基础库 >= 2.24.0
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
}

export const defaultProps: IProps = {
  chunkId: getRandomString(),
  wrapperId: 'recycleWrapper',
  rootMargin: 1000,
  debug: false,
};
