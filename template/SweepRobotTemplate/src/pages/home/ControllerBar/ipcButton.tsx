import Strings from '@/i18n';
import { Image, router } from '@ray-js/ray';
import { GridItem } from '@ray-js/smart-ui';
import React, { FC } from 'react';
import res from '@/res';

import styles from './index.module.less';

const IpcButton: FC = () => {
  return (
    <GridItem
      text={Strings.getLang('dsc_ipc')}
      onClick={() => {
        router.push('/ipc');
      }}
      className={styles.cleanModeItem}
      slot={{
        icon: (
          <Image
            src={res.camera}
            style={{
              height: '64rpx',
              width: '64rpx',
            }}
          />
        ),
      }}
    />
  );
};

export default IpcButton;
