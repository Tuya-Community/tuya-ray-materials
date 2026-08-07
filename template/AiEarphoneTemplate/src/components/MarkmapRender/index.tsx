import React from 'react';
import { View } from '@ray-js/ray';
import Markmap from '@/components/MarkmapRender/Markmap';

interface IProps {
  markdown: string;
  theme?: string;
  style?: React.CSSProperties;
}

const MarkmapRender: React.FC<IProps> = ({ markdown, theme = 'light', style }) => {
  return (
    <View style={{ width: '100%', height: '100%', ...style }}>
      <Markmap markdown={markdown} theme={theme} />
    </View>
  );
};

export default MarkmapRender;
