/* eslint-disable react/require-default-props */
import React from 'react';
import { View } from '@ray-js/ray';
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
    forceStep={props.forceStep}
    thumbStyle={props.thumbStyle}
    thumbWrapStyle={props.thumbWrapStyle}
    enableTouch={props.enableTouch}
    trackStyle={props.trackStyle}
    barStyle={props.barStyle}
    parcelMargin={props.parcelMargin}
    parcel={props.parcel}
    useParcelPadding={props.useParcelPadding}
    parcelThumbHeight={props.parcelThumbHeight}
    parcelThumbWidth={props.parcelThumbWidth}
    stepStyle={props.stepStyle}
    // @ts-ignore
    minOrigin={props.minOrigin}
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
    trackBackgroundColorHueEventName={props.trackBackgroundColorHueEventName}
    trackBackgroundColorHueEventNameEnableItems={props.trackBackgroundColorHueEventNameEnableItems}
    trackBackgroundColorHueEventNameTemplate={props.trackBackgroundColorHueEventNameTemplate}
    trackBackgroundColorRenderMode={props.trackBackgroundColorRenderMode}
    deps={props.deps}
  >
    {props.slot?.bar && <View slot="bar">{props.slot?.bar}</View>}
    {props.slot?.thumb && <View slot="thumb">{props.slot?.thumb}</View>}
  </InnerSjsSlider>
);

SjsSlider.defaultProps = {
  instanceId: `slider${Math.random()}`,
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
  parcelMargin: 0,
  parcel: false,
  useParcelPadding: true,
  parcelThumbWidth: null,
  parcelThumbHeight: null,
  inferThumbBgColorFromTrackBgColor: false,
  trackBackgroundColorHueEventName: null,
  minOrigin: 0,
  trackBackgroundColorHueEventNameEnableItems: 'thumb,track',
  trackBackgroundColorHueEventNameTemplate:
    'linear-gradient(to left, #ffffff 0%, hsl($huedeg 100% 50%) 100%)',
  slot: null,
} as SjsSliderProps;

export default SjsSlider;
