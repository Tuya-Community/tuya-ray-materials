import { View } from '@ray-js/ray';
import React, { CSSProperties, FC } from 'react';
import clsx from 'clsx';

import './index.less';

const prefixCls = 'map-loading';

type Props = {
  isLoading: boolean;
  style?: CSSProperties;
};

const Loading: FC<Props> = ({ isLoading, style }) => {
  return (
    <View className={clsx(prefixCls, isLoading && 'visible')} style={style}>
      <View className={clsx(`${prefixCls}-anim`)} />
    </View>
  );
};

export default Loading;
