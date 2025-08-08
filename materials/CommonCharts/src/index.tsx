import React, { useMemo, useCallback } from 'react';
import CommonCharts from '@tuya-miniapp/common-charts';
import { defaultProps, IProps } from './props';

const UpperCase = /([A-Z])/g;
const noop = () => { };
function Template(props: IProps) {
  const style = useMemo(() => {
    if (!props.customStyle) return '';

    if (typeof props.customStyle === 'string') {
      throw new TypeError('only Support the Object type!');
    }

    if (typeof props.customStyle === 'object') {
      return Object.entries(props.customStyle)
        .filter(([key]) => typeof key === 'string')
        .map(([key, value]) => {
          return `${key.replace(UpperCase, '-$1').toLowerCase()}:${value}`;
        })
        .join(';');
    }

    throw new TypeError('only Support the Object type!');
  }, [props.customStyle]);

  const eventBind = useCallback(
    e => {
      const { eventName, params } = e.detail;
      if (!props.on) return;
      if (!props.on[eventName]) return;
      // @ts-ignore
      const callback = props.on[eventName]?.callback || props.on[eventName];
      if (typeof callback === 'function') callback(params);
    },
    [props.on]
  );

  const bindInit = useCallback(
    e => {
      if (!props.getEchartsProxy) return;
      props.getEchartsProxy(e.detail);
    },
    [props.getEchartsProxy]
  );


  return (
    <CommonCharts
      option={props.option}
      theme={props.theme}
      unit={props.unit}
      opts={props.opts}
      supportFullScreen={props.supportFullScreen}
      loadingText={props.loadingText}
      customStyle={style}
      customClass={props.customClass}
      on={props.on || {}}
      onLoad={props.onLoad}
      onRender={props.onRender}
      errMsg={props.errMsg}
      iconError={props.iconError}
      iconLoading={props.iconLoading}
      iconFullScreen={props.iconFullScreen}
      iconExitFullScreen={props.iconExitFullScreen}
      notMerge={props.notMerge}
      getEchartsProxy={props.getEchartsProxy}
      bindevent={eventBind}
      bindInit={bindInit}
      usingPlugin={props.usingPlugin}
      loading={props.loading}
      injectVars={props.injectVars}
      blurAutoHideTooltip={props.blurAutoHideTooltip}
      bindblur={props.onBlur || noop}
      bindfocus={props.onFocus || noop}
    />
  );
}

Template.defaultProps = defaultProps;
Template.displayName = 'CommonCharts';

export default Template;
