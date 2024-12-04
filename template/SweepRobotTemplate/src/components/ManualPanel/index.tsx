import React, { CSSProperties, FC } from 'react';
import { View } from '@ray-js/ray';
import clsx from 'clsx';
import { Icon } from '@ray-js/smart-ui';
import { iconManualForward, iconManualRight } from '@/res/iconsvg';
import { useActions } from '@ray-js/panel-sdk';
import { directionControlCode } from '@/constant/dpCodes';
import { useThrottleFn } from 'ahooks';

import styles from './index.module.less';

type Props = {
  iconSize?: string;
  panelSize?: string;
  gap?: string;
  showCenter?: boolean;
};

const ManualPanel: FC<Props> = ({
  iconSize = '0.48rem',
  panelSize = '5.08rem',
  gap = '0.12rem',
  showCenter = true,
}) => {
  const actions = useActions();

  const handleTop = useThrottleFn(
    () => {
      actions[directionControlCode].set('forward');
    },
    { wait: 1000, trailing: false }
  ).run;

  const handleRight = useThrottleFn(
    () => {
      actions[directionControlCode].set('turn_right');
    },
    { wait: 1000, trailing: false }
  ).run;

  const handleLeft = useThrottleFn(
    () => {
      actions[directionControlCode].set('turn_left');
    },
    { wait: 1000, trailing: false }
  ).run;

  const handleBottom = useThrottleFn(
    () => {
      actions[directionControlCode].set('backward');
    },
    { wait: 1000, trailing: false }
  ).run;

  return (
    <View
      className={styles.panel}
      style={
        {
          '--panel-size': panelSize,
          '--gap': gap,
        } as CSSProperties
      }
    >
      <View
        className={clsx(styles.quarter, styles.topLeft)}
        hoverClassName={styles.touchable}
        onClick={handleTop}
      >
        <Icon
          name={iconManualForward}
          size={iconSize}
          customStyle={{ transform: 'rotate(-45deg)' }}
        />
      </View>
      <View
        className={clsx(styles.quarter, styles.topRight)}
        hoverClassName={styles.touchable}
        onClick={handleRight}
      >
        <Icon
          name={iconManualRight}
          size={iconSize}
          customStyle={{ transform: 'rotate(-45deg)' }}
        />
      </View>
      <View
        className={clsx(styles.quarter, styles.bottomLeft)}
        hoverClassName={styles.touchable}
        onClick={handleLeft}
      >
        <Icon name={iconManualRight} size={iconSize} customStyle={{ transform: 'rotate(45deg)' }} />
      </View>
      <View
        className={clsx(styles.quarter, styles.bottomRight)}
        hoverClassName={styles.touchable}
        onClick={handleBottom}
      >
        <Icon
          name={iconManualForward}
          size={iconSize}
          customStyle={{ transform: 'rotate(135deg)' }}
        />
      </View>
      {showCenter && <View className={styles.center} />}
    </View>
  );
};

export default ManualPanel;
