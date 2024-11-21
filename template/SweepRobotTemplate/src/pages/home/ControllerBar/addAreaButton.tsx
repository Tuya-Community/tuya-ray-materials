// 充电按钮
import { useZoneClean } from '@/hooks';
import Strings from '@/i18n';
import store from '@/redux';
import { GridItem, Icon } from '@ray-js/smart-ui';
import React, { FC } from 'react';

import styles from './index.module.less';

const AddAreaButton: FC = () => {
  const { drawZoneCleanArea } = useZoneClean();

  /**
   * 新增划区框
   * @param params
   * @returns
   */
  const addVirtualArea = () => {
    drawZoneCleanArea(store.getState().mapState.mapId);
  };

  return (
    <GridItem
      text={Strings.getLang('dsc_zone_add')}
      onClick={() => {
        addVirtualArea();
      }}
      className={styles.cleanModeItem}
      slot={{
        icon: <Icon classPrefix="iconfont" name="addArea" />,
      }}
    />
  );
};

export default AddAreaButton;
