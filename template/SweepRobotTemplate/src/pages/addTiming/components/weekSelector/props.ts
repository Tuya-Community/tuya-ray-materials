export interface WeekSelectorProps {
  /**
   * 必填
   * 受控数据源 [1, 1, 1, 1, 1, 1, 1]
   */
  value: number[];
  /**
   * 文本 [周日，周一，周二，周三，周四，周五，周六]
   */
  texts: string[];
  /**
   * 选择项变化
   */
  onChange: (value: number[]) => void;
}
