/* eslint-disable import/no-named-as-default */
/* eslint-disable no-restricted-syntax */
import { string } from 'to-style';
import React, { useRef } from 'react';
import SjsSlider from './SjsSlider';
import { IProps, defaultProps } from './props';

export const toStyle = obj => {
  const result = {};
  for (const key in obj) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return string(result);
};

function Slider(props: IProps) {
  const instanceId = useRef(
    props.instanceId || `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );

  return (
    <SjsSlider
      instanceId={instanceId.current}
      className={props.className}
      hotAreaStyle={toStyle(props.style)}
      direction={props.isVertical ? 'vertical' : 'horizontal'}
      end={props.value - props.min}
      forceStep={props.forceStep}
      min={0}
      // @ts-ignore
      minOrigin={props.min}
      reverse={props.isVertical}
      max={props.max - props.min}
      parcel={props.parcel}
      parcelMargin={props.parcelMargin}
      parcelThumbWidth={typeof props.thumbWidth === 'number' ? props.thumbWidth : 18}
      parcelThumbHeight={typeof props.thumbHeight === 'number' ? props.thumbHeight : 18}
      step={props.step}
      thumbStyleRenderValueScale={props.thumbStyleRenderValueScale}
      thumbStyleRenderFormatter={props.thumbStyleRenderFormatter}
      thumbStyleRenderValueStart={props.thumbStyleRenderValueStart}
      thumbStyleRenderValueReverse={props.thumbStyleRenderValueReverse}
      hideThumbButton={props.hideThumbButton}
      startEventName={props.startEventName}
      moveEventName={props.moveEventName}
      endEventName={props.endEventName}
      useParcelPadding={props.useParcelPadding}
      // @ts-ignore
      trackBgColor={props.maxTrackColor}
      inferThumbBgColorFromTrackBgColor={props.inferThumbBgColorFromTrackBgColor}
      trackBackgroundColorHueEventName={props.trackBackgroundColorHueEventName}
      trackBackgroundColorHueEventNameEnableItems={
        props.trackBackgroundColorHueEventNameEnableItems
      }
      trackBackgroundColorHueEventNameTemplate={props.trackBackgroundColorHueEventNameTemplate}
      disable={props.disabled}
      slot={props.slot}
      trackBackgroundColorRenderMode={props.trackBackgroundColorRenderMode}
      bindmove={event => {
        if (props.onChange) {
          props.onChange(event.detail.end);
        }
      }}
      bindstart={event => {
        if (props.onBeforeChange) {
          props.onBeforeChange(event.detail.end + props.min);
        }
      }}
      bindend={event => {
        if (props.onAfterChange) {
          props.onAfterChange(event.detail.end + props.min);
        }
      }}
      trackStyle={toStyle({
        width: props.maxTrackWidth,
        height: props.maxTrackHeight,
        borderRadius: props.maxTrackRadius,
        background: props.maxTrackColor,
        ...(props.trackStyle || {}),
      })}
      barStyle={toStyle({
        width: props.minTrackWidth,
        height: props.minTrackHeight,
        borderRadius: props.minTrackRadius,
        background: props.minTrackColor,
        ...(props.barStyle || {}),
      })}
      thumbStyle={toStyle({
        width:
          props.parcel && typeof props.thumbWidth === 'number'
            ? props.thumbWidth + props.parcelMargin
            : props.thumbWidth,
        height: props.thumbHeight,
        borderRadius: props.thumbRadius,
        background: props.thumbColor,
        borderStyle: props.thumbBorderStyle,
        boxShadow: props.thumbBoxShadowStyle,
        right: props.parcelMargin ? `${props.parcelMargin}px` : undefined,
        ...(props.thumbStyle || {}),
      })}
      enableTouch={props.enableTouch ?? true}
      thumbWrapStyle={props.thumbWrapStyle}
      showSteps={props.isShowTicks}
      stepStyle={toStyle({
        width: props.tickWidth,
        height: props.tickHeight,
        borderRadius: props.tickRadius,
        background: props.maxTrackTickColor,
      })}
      activeStepStyle={toStyle({
        width: props.tickWidth,
        height: props.tickHeight,
        borderRadius: props.tickRadius,
        background: props.minTrackTickColor,
      })}
      deps={props.deps}
    />
  );
}

Slider.defaultProps = defaultProps;

export default Slider;
