import { useScrollControl } from '@/hooks/useScrollControl';
import Slider from '@ray-js/components-ty-slider';
import { IProps } from '@ray-js/components-ty-slider/lib/props';
import React from 'react';

export const BaseSlider: React.FC<IProps> = ({ onBeforeChange, onAfterChange, ...props }) => {
  const scroll = useScrollControl();
  return (
    <Slider
      {...props}
      onBeforeChange={value => {
        scroll.disableScroll();
        onBeforeChange && onBeforeChange(value);
      }}
      onAfterChange={value => {
        scroll.enableScroll();
        onAfterChange && onAfterChange(value);
      }}
    />
  );
};
