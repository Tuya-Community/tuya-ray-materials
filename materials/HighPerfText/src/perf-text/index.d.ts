export interface PerfTextProps {
  instanceId: string;
  eventName: string;
  valueStart?: number;
  valueScale?: number;
  defaultValue?: string;
  textStyle?: React.CSSProperties;
  className?: string;
  checkEventInstanceId?: boolean;
  mathType?: 'round' | 'ceil' | 'floor';
}

export default React.Component<PerfTextProps>;
