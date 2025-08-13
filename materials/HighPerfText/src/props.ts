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
  valueScaleMathType?: 'round' | 'ceil' | 'floor' | 'fix' | 'origin';
  /**
   * @description.en fixNum
   * @description.zh 保留小数
   * @default 1
   */
  fixNum?: number;
  /**
   * @description.en 最大值
   * @description.zh 最小值
   * @default -Number.MAX_SAFE_INTEGER
   */
  min?: number;
  /**
   * @description.en style
   * @description.zh 样式
   * @default +Number.MAX_SAFE_INTEGER
   */
  max?: number;
  type?: 'origin' | 'perf';
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
  valueScaleMathType: 'round',
  fixNum: null,
  min: -Number.MAX_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  type: 'perf',
};
