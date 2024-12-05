/* eslint-disable react/require-default-props */
import React from 'react';
import type { SjsSliderProps } from './slider/index.d';
import InnerSjsSlider from './slider';

// eslint-disable-next-line prettier/prettier
export const SjsSlider: React.FC<SjsSliderProps> = props => (
  <InnerSjsSlider
    instanceId={props.instanceId}
    className={props.className}
    disable={props.disable}
    end={props.end}
    min={props.min}
    max={props.max}
    step={props.step}
    thumbStyle={props.thumbStyle}
    thumbWrapStyle={props.thumbWrapStyle}
    enableTouch={props.enableTouch}
    trackStyle={props.trackStyle}
    barStyle={props.barStyle}
    hidden={props.hidden}
    parcelMargin={props.parcelMargin}
    parcel={props.parcel}
    parcelThumbHeight={props.parcelThumbHeight}
    parcelThumbWidth={props.parcelThumbWidth}
    stepStyle={props.stepStyle}
    activeStepStyle={props.activeStepStyle}
    showSteps={props.showSteps}
    direction={props.direction}
    bindmove={props.bindmove}
    bindend={props.bindend}
    bindstart={props.bindstart}
    reverse={props.reverse}
    hotAreaStyle={props.hotAreaStyle}
    hideThumbButton={props.hideThumbButton}
    thumbStyleRenderFormatter={props.thumbStyleRenderFormatter}
    thumbStyleRenderValueScale={props.thumbStyleRenderValueScale}
    thumbStyleRenderValueStart={props.thumbStyleRenderValueStart}
    thumbStyleRenderValueReverse={props.thumbStyleRenderValueReverse}
    startEventName={props.startEventName}
    moveEventName={props.moveEventName}
    endEventName={props.endEventName}
    // @ts-ignore
    trackBgColor={props.trackBgColor}
    inferThumbBgColorFromTrackBgColor={props.inferThumbBgColorFromTrackBgColor}
  />
);

SjsSlider.defaultProps = {
  instanceId: 'slider' + Math.random(),
  className: '',
  disable: false,
  end: 30,
  min: 0,
  max: 100,
  step: 1,
  thumbStyle: null,
  thumbWrapStyle: null,
  enableTouch: true,
  trackStyle: null,
  barStyle: null,
  stepStyle: null,
  activeStepStyle: null,
  showSteps: false,
  direction: 'horizontal',
  bindmove: null,
  bindstart: null,
  bindend: null,
  reverse: false,
  hotAreaStyle: null,
  hideThumbButton: null,
  thumbStyleRenderFormatter: null,
  thumbStyleRenderValueScale: 1,
  thumbStyleRenderValueStart: 0,
  thumbStyleRenderValueReverse: false,
  startEventName: null,
  endEventName: null,
  moveEventName: null,
  trackBgColor: null,
  hidden: false,
  parcelMargin: 0,
  parcel: false,
  parcelThumbWidth: null,
  parcelThumbHeight: null,
  inferThumbBgColorFromTrackBgColor: false,
} as SjsSliderProps;

export default SjsSlider;
