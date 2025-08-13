import React, { useRef } from 'react';
import './index.less';
import { defaultProps, IProps } from './props';
import InnerText from './perf-text';
import OriginText from './origin-text';

const PerfText: React.FC<IProps> = props => {
  const ref = useRef(props.instanceId || `perf-text-${Date.now()}`);

  if (props.type === 'origin') {
    return (
      <OriginText
        instanceId={ref.current}
        eventName={props.eventName}
        valueStart={props.valueStart}
        valueScale={props.valueScale}
        defaultValue={String(Math.ceil(+props.defaultValue))}
        textStyle={props.style}
        className={props.className}
        checkEventInstanceId={props.checkEventInstanceId}
        fixNum={props.fixNum}
        min={props.min}
        max={props.max}
      />
    );
  }

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
      fixNum={props.fixNum}
      min={props.min}
      max={props.max}
    />
  );
};

PerfText.defaultProps = defaultProps;
PerfText.displayName = 'PerfText';

export default PerfText;
