import React from 'react';
import { View } from '@ray-js/ray';
import './index.less';
import icon from './res/index';
import { updateColor } from '../utils';

type Props = {
  size?: number;
  style?: any;
  type: 'triangleOpen' | 'triangleClose';
  color?: string;
};

const Icon = (props: Props) => {
  const { size = 24, style = {}, type = '', color = '#1082FE' } = props;
  const src = icon[type] || '';
  if (!src) {
    return null;
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundSize: size,
        ...style,
        background: `url("${updateColor(src, color)}") no-repeat center`,
      }}
    />
  );
};

Icon.defaultProps = {
  size: 24,
  style: {},
  color: '#1082FE',
};
export default Icon;
