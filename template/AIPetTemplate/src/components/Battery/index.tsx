import React, { FC } from 'react';
import { Image, Text, View } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import { getCdnPath } from '@/utils';
import clsx from 'clsx';

import './index.less';

const prefixCls = 'panel-battery';

type Props = {
  customClassName?: string;
};

const Battery: FC<Props> = ({ customClassName }) => {
  const dpBatteryPercentage = useProps(props => props[dpCodes.batteryPercentage]);

  return (
    <View className={clsx(prefixCls, customClassName)}>
      <View className={clsx(`${prefixCls}-wrapper`)}>
        <Image src={getCdnPath('battery.png')} className={clsx(`${prefixCls}-wrapper-img`)} />
        <View
          className={clsx(`${prefixCls}-wrapper-block`)}
          style={{ width: `${(11 * dpBatteryPercentage) / 100}px` }}
        />
      </View>
      <Text>{dpBatteryPercentage}%</Text>
    </View>
  );
};

export default Battery;
