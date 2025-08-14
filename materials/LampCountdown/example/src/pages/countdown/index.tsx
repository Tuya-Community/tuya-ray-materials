import React, { useState } from 'react';
import { router } from '@ray-js/ray';
import { useInterval, usePrevious } from 'ahooks';
import CountDown from '@ray/lamp-countdown';

import { useActions, useProps } from '@ray-js/panel-sdk';

export default function Home() {
  // const power = useProps(d => d.swich_led as boolean);
  const power = true;
  // const countdownDpValue = useProps(d => d.countdown as number);
  const countdownDpValue = 600;

  const [restCountdown, setRestCountdown] = useState<number>(countdownDpValue as number);

  const previousCountdown = usePrevious(countdownDpValue);
  // const actions = useActions();

  // useEffect(() => {
  //   if (countdownDpValue === 0) {
  //     setShowCountdown(false);
  //   }
  // }, [countdownDpValue]);

  const handleCountdownConfirm = (seconds: number) => {
    setRestCountdown(seconds);
    // 下发 dp
    // actions?.countdown.set(seconds);
  };

  const handleCountdownCancel = () => {
    router.back();
  };

  const clear = useInterval(() => {
    restCountdown > 0 && setRestCountdown(restCountdown - 1);
    if (restCountdown <= 0) {
      clear && clear();
    }
  }, 1000);

  const handleCountdownClose = () => {
    clear && clear();
    setRestCountdown(0);
    // 下发 dp
    // actions?.countdown.set(0);
  };

  return (
    <CountDown
      isDarkTheme={true}
      type="hourMinute"
      countdownDp={+countdownDpValue}
      restCountdown={restCountdown}
      // bgColor={'#000'}
      // fontColor="#fff"
      // themeColor="#3b82f7"
      onConfirm={handleCountdownConfirm}
      onCancel={handleCountdownCancel}
      onClose={handleCountdownClose}
    />
  );
}
