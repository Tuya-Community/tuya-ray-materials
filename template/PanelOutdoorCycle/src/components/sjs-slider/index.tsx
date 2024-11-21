/* eslint-disable no-restricted-syntax */
import { string } from 'to-style';
import React, { useRef, FC } from 'react';
import { IProps } from './props';
import SjsSlider from './slider';

export const toStyle = obj => {
  const result = {};
  for (const key in obj) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return string(result);
};

const Slider: FC<IProps> = ({
  isVertical = false,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  maxTrackWidth = '100%',
  maxTrackHeight = '4px',
  maxTrackRadius = '4px',
  minTrackWidth = '28px',
  minTrackHeight = '4px',
  minTrackRadius = 'inherit',
  thumbWidth = '28px',
  thumbHeight = '28px',
  thumbRadius = '28px',
  thumbBorderStyle = '0px solid #ffffff',
  thumbBoxShadowStyle = '0px 0.5px 4px rgba(0, 0, 0, 0.12), 0px 6px 13px rgba(0, 0, 0, 0.12)',
  isShowTicks = false,
  tickWidth = '4px',
  tickHeight = '12px',
  tickRadius = '2px',
  thumbStyleRenderValueScale = 1,
  thumbStyleRenderFormatter = null,
  thumbStyleRenderValueStart = 0,
  thumbStyleRenderValueReverse = false,
  hideThumbButton = null,
  className = '',
  currentDpValue = false,
  value = 0,
  onChange = null,
  onBeforeChange = null,
  onAfterChange = null,
  maxTrackColor = '#d8d8d8',
  trackStyle = {},
  minTrackColor = '#158CFB',
  barStyle = {},
  thumbColor = '#ffffff',
  thumbStyle = {},
  enableTouch = true,
  thumbWrapStyle = {},
  maxTrackTickColor = '#158CFB',
  minTrackTickColor = '#ffffff',
}) => {
  const instanceId = useRef(
    `Color_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(-2)}`
  );
  return (
    <SjsSlider
      currentDpValue={currentDpValue}
      instanceId={instanceId.current}
      className={className}
      direction={isVertical ? 'vertical' : 'horizontal'}
      end={value}
      min={min}
      reverse={isVertical}
      max={max}
      step={step}
      thumbStyleRenderValueScale={thumbStyleRenderValueScale}
      thumbStyleRenderFormatter={thumbStyleRenderFormatter}
      thumbStyleRenderValueStart={thumbStyleRenderValueStart}
      thumbStyleRenderValueReverse={thumbStyleRenderValueReverse}
      hideThumbButton={hideThumbButton}
      disable={disabled}
      bindmove={event => {
        if (onChange) {
          onChange(event.detail.end, event.detail.from);
        }
      }}
      bindstart={event => {
        if (onBeforeChange) {
          onBeforeChange(event.detail.end);
        }
      }}
      bindend={event => {
        if (onAfterChange) {
          onAfterChange(event.detail.end, event.detail.from);
        }
      }}
      trackStyle={toStyle({
        width: maxTrackWidth,
        height: maxTrackHeight,
        borderRadius: maxTrackRadius,
        background: maxTrackColor,
        ...(trackStyle || {}),
      })}
      barStyle={toStyle({
        width: minTrackWidth,
        height: minTrackHeight,
        borderRadius: minTrackRadius,
        background: minTrackColor,
        ...(barStyle || {}),
      })}
      thumbStyle={toStyle({
        width: thumbWidth,
        height: thumbHeight,
        borderRadius: thumbRadius,
        background: thumbColor,
        borderStyle: thumbBorderStyle,
        boxShadow: thumbBoxShadowStyle,
        ...(thumbStyle || {}),
      })}
      enableTouch={enableTouch ?? true}
      thumbWrapStyle={thumbWrapStyle}
      showSteps={isShowTicks}
      stepStyle={toStyle({
        width: tickWidth,
        height: tickHeight,
        borderRadius: tickRadius,
        background: maxTrackTickColor,
      })}
      activeStepStyle={toStyle({
        width: tickWidth,
        height: tickHeight,
        borderRadius: tickRadius,
        background: minTrackTickColor,
      })}
    />
  );
};

export default Slider;
