import { Text, View } from '@ray-js/ray';
import React, { FC } from 'react';
import Strings from '@/i18n';
import clsx from 'clsx';

import './index.less';

const prefixCls = 'map-loading';

type Props = {
  isLoading: boolean;
};

const Loading: FC<Props> = ({ isLoading }) => {
  return (
    <View className={clsx(prefixCls, isLoading && 'visible')}>
      <View className={clsx(`${prefixCls}-anim`)} />
      <Text className={clsx(`${prefixCls}-text`)}>{Strings.getLang('dsc_map_loading')}</Text>
    </View>
  );
};

export default Loading;
