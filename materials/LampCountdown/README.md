English | [简体中文](./README-zh_CN.md)

# @ray/lamp-countdown

[![latest](https://img.shields.io/npm/v/@ray/lamp-countdown/latest.svg)](https://www.npmjs.com/package/@ray/lamp-countdown) [![download](https://img.shields.io/npm/dt/@ray/lamp-countdown.svg)](https://www.npmjs.com/package/@ray/lamp-countdown)

> lamp-countdown

## Installation

```sh
$ npm install @ray/lamp-countdown
# or
$ yarn add @ray/lamp-countdown
```

## Usage

```tsx
// page/home
import React, { useEffect, useState } from 'react';
import { navigateTo, View } from '@ray-js/ray';

export default function Home() {
  const handleClick = () => {
    navigateTo({
      url: '/pages/countdown/index',
      type: 'half',
      topMargin: 1,
      success(params) {
        console.warn(params);
      },
      fail(params) {
        console.warn(params);
      },
    });
  };

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100vw',
          height: '40px',
          lineHeight: '40px',
          color: '#fff',
          borderRadius: '20px',
          backgroundColor: '#4e80ef',
          marginBottom: '40px',
          textAlign: 'center',
        }}
        onClick={handleClick}
      >
        Countdown Show
      </View>
    </View>
  );
}
```

```tsx
// page/countdown
import React, { useState } from 'react';
import { router } from '@ray-js/ray';
import { useInterval, usePrevious } from 'ahooks';
import CountDown from '@ray/lamp-countdown';

import { useActions, useProps } from '@ray-js/panel-sdk';

export default function Countdown() {
  const countdownDpValue = useProps(d => d.countdown as number);
  const countdownDpValue = 100;
  const [restCountdown, setRestCountdown] = useState<number>(countdownDpValue as number);

  const previousCountdown = usePrevious(countdownDpValue);
  const actions = useActions();

  useEffect(() => {
    if (countdownDpValue === 0) {
      setShowCountdown(false);
    }
  }, [countdownDpValue]);

  const handleCountdownConfirm = (seconds: number) => {
    setRestCountdown(seconds);
    // publish dp
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
    // publish dp
    // actions?.countdown.set(0);
  };

  return (
    <CountDown
      type="hourMinute"
      countdownDp={+countdownDpValue}
      restCountdown={restCountdown}
      bgColor={'#000'}
      onConfirm={handleCountdownConfirm}
      onCancel={handleCountdownCancel}
      onClose={handleCountdownClose}
    />
  );
}
```

## Multi-language key, which can be configured for overwriting in the main application

```md
lp_ct_save: 'Save',
lp_ct_reset: 'Reset',
lp_ct_confirm: 'Confirm',
lp_ct_AM: 'AM',
lp_ct_PM: 'PM',
lp_ct_countdownTitle: 'Countdown',
lp_ct_countdownTips1: 'Please set light to turn {0} the lights of time',
lp_ct_hour: 'h',
lp_ct_minute: 'min',
lp_ct_second: 's',

lp_ct_closeCountdown: 'Close Countdown',
lp_ct_resetting: 'Resetting',
lp_ct_back: 'Back',

lp_ct_countdownOpenedTip: 'The device will automatically {0} after the countdown ends.',

lp_ct_on: 'Open',
lp_ct_off: 'Close',

lp_ct_countdown_less_than_zero: 'Countdown time cannot be 0',
```
