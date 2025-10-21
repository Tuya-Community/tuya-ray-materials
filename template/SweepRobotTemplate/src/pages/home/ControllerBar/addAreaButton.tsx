// 充电按钮
import Strings from '@/i18n';
import store, { useSelector } from '@/redux';
import { GridItem, Icon } from '@ray-js/smart-ui';
import React, { FC } from 'react';
import { selectMapApiByKey } from '@/redux/modules/mapApisSlice';
import { nanoid } from '@reduxjs/toolkit';
import { updateMapState } from '@/redux/modules/mapStateSlice';
import { useDispatch } from 'react-redux';
import { offsetPointsToAvoidOverlap } from '@ray-js/robot-map';

import styles from './index.module.less';

const AddAreaButton: FC = () => {
  const mapApi = useSelector(selectMapApiByKey('home'));
  const dispatch = useDispatch();

  /**
   * 新增划区框
   */
  const handleAddCleanZone = async () => {
    const existCleanZones = store.getState().mapState.cleanZones;

    const zonePoints = await mapApi.getCleanZonePointsByViewportCenter({
      size: 1.6,
    });

    offsetPointsToAvoidOverlap(
      zonePoints,
      existCleanZones.map(zone => zone.points)
    );

    const newId = nanoid();

    dispatch(
      updateMapState({
        cleanZones: [
          ...existCleanZones,
          {
            points: zonePoints,
            id: newId,
          },
        ],
        editingCleanZoneIds: [newId],
      })
    );
  };

  return (
    <GridItem
      text={Strings.getLang('dsc_zone_add')}
      onClick={handleAddCleanZone}
      className={styles.cleanModeItem}
      slot={{
        icon: <Icon classPrefix="iconfont" name="addArea" />,
      }}
    />
  );
};

export default AddAreaButton;
