import Strings from '@/i18n';
import { router } from '@ray-js/ray';
import { GridItem, Icon } from '@ray-js/smart-ui';
import React, { FC } from 'react';
import styles from './index.module.less';

const SettingButton: FC = () => {
  return (
    <GridItem
      text={Strings.getLang('dsc_settings')}
      onClick={() => {
        router.push('/setting');
      }}
      className={styles.cleanModeItem}
      slot={{
        icon: <Icon classPrefix="iconfont" name="setting" size="22px" />,
      }}
    />
  );
};

export default SettingButton;
