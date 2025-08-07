enum SmearMode {
  all,
  single,
  clear,
}

type HSV = {
  h: number;
  s: number;
  v: number;
};

export interface IProps {
  /**
   * @description.zh 组件宽度
   * @description.en Component width
   * @default 375px
   */
  width?: number;
  /**
   * @description.zh 组件高度
   * @description.en Component height
   * @default 330px
   */
  height?: number;
  /**
   * @description.zh 类名
   * @description.en class name
   * @default ''
   */
  className?: string;
  /**
   * @description.zh 样式
   * @description.en Style
   * @default ''
   */
  style?: React.CSSProperties;

  /**
   * @description.zh 是否禁用操作
   * @description.en Whether to disable the operation
   * @default false
   */
  disabled?: boolean;

  /**
   * @description.zh 当前用于涂抹颜色
   * @description.en Current smear color
   * @default null
   */
  smearedColor: {
    h: number; // 0-360
    s: number; // 0-1000
    v: number; // 0-1000
  };
  /**
   * @description.zh 灯带涂抹颜色映射表
   * @description.en Light smear color mapping table
   * @default null
   */
  lightColorMaps: {
    [idx: number]: string;
  };
  /**
   * @description.zh 涂抹类型：all：全部涂抹，single：单个涂抹，clear：清除
   * @description.en Smear type: all: all smear, single: single smear, clear: clear
   * @default all
   */
  type: SmearMode;
  /**
   * @description.zh 是否渐变
   * @description.en Is gradient
   * @default false
   */
  gradient: boolean; // 是否渐变模式
  /**
   * @description.zh 灯带涂抹变化,lightSet 为涂抹时选中灯带的索引
   * @description.en  Light smear change, lightSet is the index of the selected light strip
   * @default null
   */
  onLightChange: (lightSet: Set<number>) => void;
  /**
   * @description.zh 灯带涂抹结束, lightSet 为涂抹时选中灯带的索引
   * @description.en Light smear end, lightSet is the index of the selected light strip
   * @default null
   */
  onLightEnd: (lightSet: Set<number>) => void;
}

export const defaultProps: IProps = {
  style: {},
  className: '',
  disabled: false,
  smearedColor: { h: 0, s: 1000, v: 1000 },
  lightColorMaps: {},
  type: SmearMode.all,
  gradient: false,
};
