import Strings from '@/i18n';
import { robotIsCleaning } from '@/utils/robotStatus';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';
import { encodeQuickMap0x3c } from '@ray-js/robot-protocol';
import { Button, Col, Row } from '@ray-js/smart-ui';
import React, { FC, useMemo } from 'react';
import { commandTransCode, modeCode, statusCode } from '@/constant/dpCodes';
import { PROTOCOL_VERSION, THEME_COLOR } from '@/constant';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { useSelector } from 'react-redux';

import styles from './index.module.less';

const QuickMapButton: FC = () => {
  const dpActions = useActions();
  const mapSize = useSelector(selectMapStateByKey('mapSize'));
  const { width, height } = mapSize;

  const isEmpty = useMemo(() => {
    return width === 0 || height === 0;
  }, [width, height]);

  const dpMode = useProps(props => props[modeCode]) as Mode;
  const dpStatus = useProps(props => props[statusCode]) as Status;

  /**
   * 下发快速建图指令
   */
  const quickMapFn = () => {
    dpActions[commandTransCode].set(encodeQuickMap0x3c({ version: PROTOCOL_VERSION }));
  };

  const show = isEmpty && !robotIsCleaning(dpMode, dpStatus);
  return show ? (
    <View style={{ width: '100vw' }}>
      <Row>
        <Col span="20" offset={2}>
          <Button
            round
            block
            onClick={quickMapFn}
            color={THEME_COLOR}
            customClass={styles.quickMapBtn}
          >
            {Strings.getLang('dsc_quick_map')}
          </Button>
        </Col>
      </Row>
    </View>
  ) : null;
};

export default QuickMapButton;
