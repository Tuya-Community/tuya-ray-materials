import React, { FC } from 'react';
import clsx from 'clsx';
import { View } from '@ray-js/ray';
import { getCdnPath } from '@/utils';
import { useSelector } from 'react-redux';
import { selectIpcCommonValue } from '@/redux/modules/ipcCommonSlice';

import styles from './index.module.less';

type Props = {
  visible?: boolean;
};

const BgBones: FC<Props> = ({ visible = true }) => {
  const isFull = useSelector(selectIpcCommonValue('isFull'));

  return (
    <View
      className={clsx(styles.container, isFull && 'hide', visible && styles.visible)}
      style={{
        backgroundImage: `url(${getCdnPath('bones.png')})`,
      }}
    />
  );
};

export default BgBones;
