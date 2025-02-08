import React from 'react';
import LampBeadStripRjs from './components';
import { getSystemInfoRes } from './utils';
import { defaultProps, IProps } from './props';

const { windowWidth = 375 } = getSystemInfoRes();

const LampBeadStrip = (props: IProps) => {
  const { standardScale = 1, ...rest } = props;
  // 组件缩放能力
  const scale = (windowWidth / 375) * standardScale;
  return <LampBeadStripRjs prop={{ ...rest, scale: rest.scale || scale }} />;
};
LampBeadStrip.defaultProps = defaultProps;
LampBeadStrip.displayName = 'LampBeadStrip';
export default LampBeadStrip;
