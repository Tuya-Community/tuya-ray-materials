/* eslint-disable no-lonely-if */
/* eslint-disable prefer-template */
import { Image, Text, View, router } from '@ray-js/ray';
import React, { useCallback, useMemo, useState } from 'react';
import {
  useActions,
  usePanelConfig,
  useProps,
  useStructuredProps,
  useSupport,
} from '@ray-js/panel-sdk';
import { useStopLocalMusic } from '@/hooks/useStopLocalMusic';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { useAsync } from '@/hooks/useAsync';
import { lampStandardDpCodes } from '@ray-js/panel-sdk/lib/utils';
import { dpCodes } from '@/constant/dpCodes';
import { devices } from '@/devices';

import Res from '../../res';
import styles from './index.module.less';

export const HomeHead = () => {
  const switchLed = useProps(state => state?.switch_led);
  const actions = useActions();

  const LocalMusic = useStopLocalMusic();
  const devInfo = devices.common.getDevInfo();

  const support = useSupport();

  const do_not_disturb = useProps(p => p.do_not_disturb);
  const power = useProps(p => p.switch_led);
  const power_memory = useStructuredProps(p => p.power_memory);

  const handleJumpToAdjustment = () => {
    router.push('/Adjustment');
  };

  const functionalList = useMemo(() => {
    const list = [
      {
        title: Strings.getLang('scheduleTitle'),
        visible:
          support.isSupportCloudTimer() || support.isSupportDp(lampStandardDpCodes.rtcTimerCode),
      },
      {
        title: Strings.getLang('disturbTitle'),
        visible: support.isSupportDp(dpCodes?.do_not_disturb),
      },
      {
        title: Strings.getLang('stripLenTitle'),
        visible: support.isSupportDp(dpCodes?.light_pixel) && power,
      },
      {
        title: Strings.getLang('applyAdjustment'),
        cardType: 'arrow',
        onClick: handleJumpToAdjustment,
        visible:
          support.isSupportDp(dpCodes?.led_number_set) ||
          support.isSupportDp(dpCodes?.segment_num_set),
      },
      {
        title: Strings.getLang('lineSortTitle'),
        visible: support.isSupportDp(dpCodes?.light_bead_sequence),
      },
    ];
    return list.filter(i => i.visible);
  }, [do_not_disturb, power_memory, JSON.stringify(devInfo), power]);

  const handleJumpMore = useCallback(() => {
    router.push('/More');
  }, []);

  const uiConfig = usePanelConfig();

  const [activeBg, setActiveBg] = useState<string>();
  const [unActiveBg, setUnActiveBg] = useState<string>();

  const activeBgFunc = uiConfig?.fun?.tyabiwrk8d;
  const unActiveBgFunc = uiConfig?.fun?.tyabi94tey;

  const isOnline = useSelector(state => state?.common?.isOnNet);

  useAsync(async () => {
    if (isOnline) {
      const activeBg = Res.homeahead_on;
      setActiveBg(activeBg);
      const unActiveBg = Res.homeahead_off;
      setUnActiveBg(unActiveBg);
    } else {
      setActiveBg(Res.homeahead_on);
      setUnActiveBg(Res.homeahead_off);
    }
  }, [uiConfig, activeBgFunc, unActiveBgFunc, isOnline]);

  return (
    <View className={styles.contain}>
      <Image className={styles.head} mode="aspectFill" src={switchLed ? activeBg : unActiveBg} />
      <View className={styles.bottom}>
        <View
          className={`${styles.switch} ${switchLed ? '' : styles.switchOff}`}
          hoverClassName="button-hover"
          onClick={() => {
            actions.switch_led.toggle();
            if (switchLed) {
              // 当前是开灯，toggle就是关灯，同时关闭本地音乐
              LocalMusic.stop();
            } else {
              // 当前是关灯，toggle就是开灯，音乐模式时同时开启本地音乐
              LocalMusic.start();
            }
          }}
        >
          <Image mode="aspectFit" className={styles.switchIcon} src={Res.switch_icon} />
        </View>
        {switchLed && functionalList.length && (
          <View className={styles.more} hoverClassName="button-hover" onClick={handleJumpMore}>
            <Image src={Res.moreIcon} className={styles.moreIcon} />
            <Text className={styles.moreText}>{Strings.getLang('more')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
