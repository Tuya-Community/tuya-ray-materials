/*
 * @Author: mjh
 * @Date: 2025-01-02 14:17:12
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-03 09:49:34
 * @Description:
 */
export interface ImgCanvasProps {
  /** 图片文件手机内的地址 */
  path?: string;
  /** 自定义 canvas 的id （多个实用的场景） */
  canvasId?: string;
  /** 图片文件的base64 必须path传空才可以 */
  base64?: string;
  /** 提取的颜色数量 */
  pickNum?: number;
  /** 是否保持原色，组件会默认调亮内部的颜色，关闭的话需要传入true */
  isPrimary?: boolean;
  /** 颜色改变的回调 */
  onColorsChange?: (color: string[]) => void;
}

export const defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types
  onColorsChange: () => {},
};
