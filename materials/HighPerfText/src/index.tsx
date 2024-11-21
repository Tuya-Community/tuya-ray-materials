import React, { useRef } from 'react';
import './index.less';
import { defaultProps, IProps } from './props';
import InnerText from './perf-text';

const PerfText: React.FC<IProps> = props => {
  const ref = useRef(props.instanceId || `perf-text-${Date.now()}`);

  return (
    <InnerText
      instanceId={ref.current}
      eventName={props.eventName}
      valueStart={props.valueStart}
      valueScale={props.valueScale}
      defaultValue={String(Math.ceil(+props.defaultValue))}
      textStyle={props.style}
      className={props.className}
      checkEventInstanceId={props.checkEventInstanceId}
      mathType={props.valueScaleMathType}
    />
  );
};

PerfText.defaultProps = defaultProps;
PerfText.displayName = 'PerfText';

export default PerfText;
