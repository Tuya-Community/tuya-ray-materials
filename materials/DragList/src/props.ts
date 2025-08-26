/*
 * @Author: mjh
 * @Date: 2025-06-16 10:18:17
 * @LastEditors: mjh
 * @LastEditTime: 2025-08-19 17:40:54
 * @Description:
 */
interface handleEvent<T = string, U = any> {
  type: T;
  detail: U;
  timeStamp: number;
  currentTarget: {
    id: string;
    dataset: Record<string, any>;
  };
  target: {
    dataset: Record<string, any>;
  };
}

export type DragProps = {
  /**
   * @description.en list
   * @description.zh 数据源列表
   * @default ""
   */
  list: Array<any>;
  /**
   * @description.en class
   * @description.zh class
   * @version 2.1.0
   */
  className?: string;
  /**
   * @description.en style
   * @description.zh style
   */
  style?: React.CSSProperties;
  /**
   * @description.en Column spacing
   * @description.zh 列间距
   * @default 0
   */
  midOffset?: number | string;
  /**
   * @description.en children
   * @description.zh 子节点
   * @default ""
   */
  children: JSX.Element[];
  /**
   * @description.en Drag and drop node class
   * @description.zh 拖拽节点 class
   * @default ""
   */
  activeClassName?: string;
  /**
   * @description.en The entire node can trigger dragging. If true, the dragIconNode dragging is disabled.
   * @description.zh 整个节点可以触发拖拽 为 true 则 dragIconNode 拖拽失效
   * @version 2.0.1
   * @default false
   */
  bodyDrag?: boolean;
  /**
   * @description.en The display situation of multiple columns
   * @description.zh 一列多个的展示情况
   * @version 2.1.0
   * @default false
   */
  multipleCol?: boolean;
  /**
   * @description.en Identification key name
   * @description.zh 标识key名称
   * @default ""
   */
  keyId: string;
  /**
   * @description.en Drag start touch delay time（ms）
   * @description.zh 拖拽开始触摸延迟时间（ms）
   * @default 300
   */
  dargStartDelay?: number;
  /**
   * @description.en touchStart
   * @description.zh 排序开始
   * @default ""
   */
  touchStart?: (list: handleEvent<'touchStart', Array<Record<string, any>>>) => void;
  /**
   * @description.en Callback function after sorting
   * @description.zh 排序后回调函数
   * @default ""
   */
  handleSortEnd?: (list: handleEvent<'handleSortEnd', Array<Record<string, any>>>) => void;
};

export type DragItemProps = {
  /**
   * @description.en id
   * @description.zh id
   * @default ""
   */
  id: string;
  /**
   * @description.en Column data
   * @description.zh 列的数据
   * @default ""
   */
  item: Record<string, any>;
  /**
   * @description.en children
   * @description.zh 子节点
   * @default ""
   */
  children?: React.ReactNode;
  /**
   * @description.en Drag the icon node
   * @description.zh 拖拽图标节点
   * @default ""
   */
  dragIconNode?: React.ReactNode;
  /**
   * @description.en click event
   * @description.zh 点击事件
   * @version 2.1.0
   */
  onClick?: (e: TouchEvent) => any;
  /**
   * @description.en Drag and drop icon node click event
   * @description.zh 拖拽图标节点点击事件
   * @version 2.1.0
   */
  onDragNodeClick?: (e: TouchEvent) => any;
};
