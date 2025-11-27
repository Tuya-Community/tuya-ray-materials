import { SmartTouchEvent } from '@ray-js/smart-ui';

export type SelectData = {
  /**
   * 当前操作的照片索引
   */
  id: number;
  /**
   * 当前操作的照片是否选中
   */
  value: boolean;
  /**
   * 当前激活的类型
   */
  activeType: 'image' | 'video';
  /**
   * 当前选中的照片索引集合
   */
  activeMap: Record<number, boolean>;
  /**
   * 当前选中的照片数量
   */
  activeNum: number;
};

export interface Props {
  /**
   * 相片列表的数据源
   */
  dataSource: Array<{
    /**
     * 照片或视频的缩略图地址
     */
    url: string;
    /**
     * 类型
     */
    type: 'image' | 'video';
    /**
     * 视频时长
     */
    duration: number;
  }>;
  /**
   * 最大可选择数量
   * @default 10
   */
  maxCount?: number;
  /**
   * 需求：超过 maxCount 时，禁用其他照片
   * 是否禁用其他照片
   */
  isDisableOtherImg?: boolean;
  /**
   * 照片选择回调方法
   */
  onSelect?: (event: SmartTouchEvent<SelectData>) => void;
  /**
   * 添加按钮点击回调方法
   */
  onAdd?: (type: 'image' | 'video') => void;
  /**
   * 预览照片
   */
  onPreview?: (event: SmartTouchEvent<SelectData>) => void;
}
