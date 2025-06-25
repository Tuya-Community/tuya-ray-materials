import React from 'react';
import { View, router, Text } from '@ray-js/ray';
import { Button, Cell, CellGroup, Icon } from '@ray-js/smart-ui';
import { useProps, useActions } from '@ray-js/panel-sdk';
import Strings from '@/i18n/index';
import clsx from 'clsx';
import { iconMap, iconMore, iconPause, iconRecharge, iconStart } from '@/res/iconsvg';

import styles from './index.module.less';
import Mode from './Mode';

const Panel = () => {
  const actions = useActions();
  const dpSwitchGo = useProps(props => props.switch_go);
  const dpStatus = useProps(props => props.status);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Button
          block
          round
          type="info"
          color="var(--theme-color)"
          onClick={() => {
            actions.switch_go.toggle();
          }}
          customClass={styles.button}
          disabled={dpStatus === 'goto_charge'}
        >
          <View className={styles.buttonContent}>
            <Icon name={dpSwitchGo ? iconPause : iconStart} size="48rpx" color="#fff" />

            <Text className={styles.buttonText}>{Strings.getDpLang('switch_go', !dpSwitchGo)}</Text>
          </View>
        </Button>
        <Button
          customClass={clsx(styles.button, styles.charge)}
          color="var(--theme-color)"
          block
          round
          plain
          disabled={dpStatus === 'charge_done' || dpStatus === 'charging'}
          type="info"
          onClick={() => {
            actions.mode.set(dpStatus === 'goto_charge' ? 'standby' : 'chargego');
          }}
        >
          <View className={styles.buttonContent}>
            <Icon
              name={dpStatus === 'goto_charge' ? iconPause : iconRecharge}
              size="48rpx"
              color="var(--theme-color)"
            />
            <Text className={styles.buttonText}>
              {dpStatus === 'goto_charge'
                ? Strings.getLang('chargePause')
                : Strings.getLang('charge')}
            </Text>
          </View>
        </Button>
      </View>
      <Mode />
      <View className={styles.footer}>
        <CellGroup border inset>
          <Cell
            customClass={styles.cell}
            titleClass={styles.title}
            title={Strings.getLang('map')}
            isLink
            slot={{
              icon: <Icon name={iconMap} size="72rpx" />,
            }}
            onClick={() => {
              router.push('/map');
            }}
          />
          <Cell
            customClass={styles.cell}
            titleClass={styles.title}
            title={Strings.getLang('more')}
            isLink
            slot={{
              icon: <Icon name={iconMore} size="72rpx" />,
            }}
            url="/pages/more/index"
          />
        </CellGroup>
      </View>
    </View>
  );
};
export default Panel;
