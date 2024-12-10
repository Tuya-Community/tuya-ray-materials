import React, { FC } from 'react';
import clsx from 'clsx';
import { Text, View, Image } from '@ray-js/components';
import Res from '@/res';
import Strings from '@/i18n';
import styles from './index.module.less';

const prefix = 'empty';

interface EmptyProps {
  className?: string;
  imageClassName?: string;
  tipsClassName?: string;
  imageSrc?: string;
  tips?: string;
}

const Empty: FC<EmptyProps> = ({ className, imageClassName, tipsClassName, imageSrc, tips }) => {
  return (
    <View className={clsx(styles[`${prefix}`], className)}>
      <Image
        src={imageSrc}
        className={clsx(styles[`${prefix}-image`], imageClassName)}
        mode="aspectFit"
      />
      <Text className={clsx(styles[`${prefix}-tips`], tipsClassName)}>{tips}</Text>
    </View>
  );
};

Empty.defaultProps = {
  className: '',
  imageClassName: '',
  tipsClassName: '',
  imageSrc: Res.empty,
  tips: Strings.getLang('empty'),
};

export default Empty;
