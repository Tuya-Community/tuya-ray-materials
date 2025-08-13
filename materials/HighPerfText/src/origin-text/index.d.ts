export interface PerfTextProps {
  instanceId: string;
  eventName: string;
  valueStart?: number;
  valueScale?: number;
  defaultValue?: string;
  textStyle?: React.CSSProperties;
  className?: string;
  checkEventInstanceId?: boolean;
  mathType?: 'round' | 'ceil' | 'floor' | 'fix';
  fixNum?: number;
  min?: number;
  max?: number;
  localMap?: any;
}

declare const InnerText: React.FC<PerfTextProps>;

export default InnerText;
