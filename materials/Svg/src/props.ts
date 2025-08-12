import { Property } from 'csstype';

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
   * @description.zh svg 子元素
   * @description.en svg children
   */
  children?: React.ReactNode;
  /**
   * @description.zh svg 宽度
   * @description.en svg width
   * @default 300px
   */
  width?: Property.Width<string>;
  /**
   * @description.zh svg 高度
   * @description.en svg height
   * @default 150px
   */
  height?: Property.Height<string>;
  /**
   * @description.zh svg 视口
   * @description.zh svg viewBox
   */
  viewBox?: string;
}

export const defaultProps: IProps = {
  width: '300px',
  height: '150px',
};
