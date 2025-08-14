import { RenderBlock } from './components/util';

export interface IProps {
  /**
   * @description.zh 更新 blocks 的回调函数
   * @description.en Callback function to update blocks
   */
  onUpdateBlocks: (event: {
    detail: {
      blocks: RenderBlock[];
    };
  }) => void;
  /**
   * @description.zh markdown 渲染内容
   * @description.en Markdown content to be rendered
   */
  input: string;
  /**
   * @description.zh 自定义组件类型列表
   * @description.en List of custom component types
   */
  types: string[];
  /**
   * @description.zh 主题类型
   * @description.en Theme type
   * @default 'light'
   */
  theme: 'light' | 'dark';
  /**
   * @description.zh 外层class
   * @description.en Outer container class name
   */
  className?: string;
  /**
   * @description.zh 外层样式
   * @description.en Outer container style
   */
  containerStyle?: React.CSSProperties;
  /**
   * @description.zh 渲染内容占位符
   * @description.en Render content placeholder
   */
  slot?: React.ReactNode;
}
