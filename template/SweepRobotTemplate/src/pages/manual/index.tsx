import React, { FC, useEffect } from 'react';
import {
  CoverView,
  View,
  navigateBack,
  onNavigationBarBack,
  router,
  setNavigationBarBack,
} from '@ray-js/ray';
import Strings from '@/i18n';
import { Dialog, DialogInstance, NavBar } from '@ray-js/smart-ui';
import { useActions } from '@ray-js/panel-sdk';
import { directionControlCode, modeCode } from '@/constant/dpCodes';
import ManualPanel from '@/components/ManualPanel';

import styles from './index.module.less';

const Manual: FC = () => {
  const actions = useActions();

  useEffect(() => {
    // 进入远程控制需要下发手动模式
    actions[modeCode].set('manual');

    setNavigationBarBack({ type: 'custom' });

    onNavigationBarBack(async () => {
      try {
        DialogInstance.close();
        await DialogInstance.confirm({
          context: this,
          title: Strings.getLang('dsc_tips'),
          icon: true,
          message: Strings.getLang('dsc_exit_manual_tips'),
          confirmButtonText: Strings.getLang('dsc_confirm'),
          cancelButtonText: Strings.getLang('dsc_cancel'),
        });

        actions[directionControlCode].set('exit');
        setNavigationBarBack({ type: 'system' });

        setTimeout(() => {
          navigateBack();
        }, 0);
      } catch (err) {
        // do nothing
      }
    });

    return () => {
      setNavigationBarBack({ type: 'system' });
    };
  }, []);

  return (
    <View className={styles.container}>
      <NavBar title={Strings.getLang('dsc_manual')} leftArrow onClickLeft={router.back} />
      <View className={styles.content}>
        <ManualPanel />
      </View>
      <Dialog id="smart-dialog" />
    </View>
  );
};

export default Manual;
