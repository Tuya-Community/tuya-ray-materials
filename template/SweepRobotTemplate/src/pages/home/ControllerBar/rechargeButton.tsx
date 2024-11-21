import { statusCode, switchChargeCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { robotIsCharing, robotIsFullCharge, robotIsToCharing } from '@/utils/robotStatus';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { GridItem, Icon } from '@ray-js/smart-ui';
import React, { FC } from 'react';

import styles from './index.module.less';

const RechargeButton: FC = () => {
  const dpActions = useActions();
  const dpStatus = useProps(props => props[statusCode]) as Status;
  const dpSwitchCharge = useProps(props => props[switchChargeCode]);

  /**
   * 回充
   * @returns
   */
  const handleBackCharge = () => {
    // 扫地机处于寻找充电座状态
    if (robotIsToCharing(dpStatus, dpSwitchCharge)) {
      dpActions[switchChargeCode].set(false);

      return;
    }

    dpActions[switchChargeCode].set(true);
  };

  const iconName = robotIsToCharing(dpStatus, dpSwitchCharge)
    ? 'pause'
    : robotIsCharing(dpStatus) || robotIsFullCharge(dpStatus)
    ? 'charge'
    : 'charge';

  return (
    <GridItem
      text={
        robotIsToCharing(dpStatus, dpSwitchCharge)
          ? Strings.getLang('dsc_stop_charge')
          : robotIsCharing(dpStatus)
          ? Strings.getLang('dsc_charging')
          : robotIsFullCharge(dpStatus)
          ? Strings.getLang('dsc_full_charge')
          : Strings.getLang('dsc_recharge')
      }
      onClick={() => {
        if (!(robotIsCharing(dpStatus) || robotIsFullCharge(dpStatus))) {
          // 扫地机不处于充电中/已充满状态
          handleBackCharge();
        }
      }}
      className={styles.cleanModeItem}
      slot={{
        icon: <Icon classPrefix="iconfont" name={iconName} size="22px" />,
      }}
    />
  );
};

export default RechargeButton;
