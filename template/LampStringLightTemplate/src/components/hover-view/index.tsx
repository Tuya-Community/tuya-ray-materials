import { ViewProps } from '@ray-js/components/lib/View';
import { View } from '@ray-js/ray';
import React from 'react';

export interface HoverViewProps extends ViewProps {}

export const HoverView: React.FC<HoverViewProps> = props => {
  return <View {...props} hoverClassName="button-hover" />;
};
