import React from 'react';

export interface IProps {
  /**
   * @description.en instanceId
   * @description.zh instanceId
   * @default null
   */
  instanceId?: string;
  /**
   * @description.en event channel eventName
   * @description.zh event channel 事件名
   * @default null
   */
  eventName: string;
  /**
   * @description.en valueStart
   * @description.zh valueStart
   * @default 0
   */
  valueStart?: number;
  /**
   * @description.en valueScale
   * @description.zh valueScale
   * @default 1
   */
  valueScale?: number;
  /**
   * @description.en defaultValue
   * @description.zh 默认值
   * @default ''
   */
  defaultValue?: string | number;
  /**
   * @description.en style
   * @description.zh 样式
   * @default null
   */
  style?: React.CSSProperties;
  className?: string;
  /**
   * @description.en checkEventInstanceId
   * @description.zh 检查event是否为当前instanceId发布的事件
   * @default false
   */
  checkEventInstanceId?: boolean;
  /**
   * @description.en Decimal retention method after valueScale processing
   * @description.zh valueScale处理后的小数保留方式
   * @default round
   */
  valueScaleMathType?: 'round'  | 'ceil' | 'floor'
}

export const defaultProps: IProps = {
  instanceId: null,
  eventName: null,
  className: null,
  valueStart: 0,
  valueScale: 1,
  defaultValue: '',
  style: {},
  checkEventInstanceId: false,
  valueScaleMathType: 'round'
};
