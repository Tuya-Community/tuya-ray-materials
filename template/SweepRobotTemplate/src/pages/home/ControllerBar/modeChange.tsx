import { modeCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { selectMapStateByKey, updateMapState } from '@/redux/modules/mapStateSlice';
import { Grid, GridItem, Icon } from '@ray-js/smart-ui';
import clsx from 'clsx';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapApiByKey } from '@/redux/modules/mapApisSlice';

import styles from './index.module.less';

const ModeChange: FC = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(selectMapStateByKey('currentMode'));
  const mapSize = useSelector(selectMapStateByKey('mapSize'));
  const mapApi = useSelector(selectMapApiByKey('home'));
  const { width, height } = mapSize;

  const isEmpty = useMemo(() => {
    return width === 0 || height === 0;
  }, [width, height]);

  /**
   * 切换清扫模式
   * @param mode
   */
  const handleSwitchMode = async (mode: Mode) => {
    dispatch(updateMapState({ currentMode: mode }));

    let spotPoint = { x: 0, y: 0 };

    if (mode === 'pose') {
      spotPoint = await mapApi.getSpotPointByViewportCenter();
    }

    dispatch(
      updateMapState({
        currentMode: mode,
        selectRoomIds: [],
        spots:
          mode === 'pose'
            ? [
                {
                  id: '0',
                  point: spotPoint,
                },
              ]
            : [],
        cleanZones: mode === 'zone' ? [] : [],
      })
    );
  };

  const modes = useMemo(() => {
    return [
      // 全屋清扫
      {
        mode: 'smart',
        disabled: false,
      },
      // 选区清扫
      {
        mode: 'select_room',
        disabled: isEmpty,
      },
      // 指哪扫哪
      {
        mode: 'pose',
        disabled: isEmpty,
      },
      // 划区清扫
      {
        mode: 'zone',
        disabled: isEmpty,
      },
    ] as const;
  }, [isEmpty]);

  return (
    <Grid customClass={styles.full} border={false}>
      {modes.map(({ mode, disabled }) => {
        const isActive = mode === currentMode;
        return (
          <GridItem
            key={mode}
            text={Strings.getDpLang(modeCode, mode)}
            onClick={() => {
              if (disabled) return;
              handleSwitchMode(mode);
            }}
            className={clsx(
              styles.cleanModeItem,
              isActive && styles.active,
              disabled && styles.disabled
            )}
            slot={{
              icon: (
                <Icon
                  classPrefix="iconfont"
                  name={mode}
                  size="22px"
                  color={isActive ? '#fff' : '#000'}
                />
              ),
            }}
          />
        );
      })}
    </Grid>
  );
};

export default ModeChange;
