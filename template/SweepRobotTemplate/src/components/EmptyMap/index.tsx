import React, { FC } from 'react';
import { View, Text, Image } from '@ray-js/ray';
import Res from '@/res';
import Strings from '@/i18n';
import clsx from 'clsx';

import './index.less';

const prefixCls = 'map-empty';

/**
 * 空地图显示
 * @param props
 * @returns
 */
const EmptyMap: FC = () => {
  return (
    <View className={clsx(prefixCls)}>
      <Image className={clsx(`${prefixCls}-img`)} src={Res.mapEmpty} />
      <Text className={clsx(`${prefixCls}-text`)}>{Strings.getLang('dsc_map_is_empty')}</Text>
    </View>
  );
};

export default EmptyMap;
