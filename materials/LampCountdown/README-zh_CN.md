[English](./README.md) | 简体中文

# @ray/lamp-countdown

[![latest](https://img.shields.io/npm/v/@ray/lamp-countdown/latest.svg)](https://www.npmjs.com/package/@ray/lamp-countdown) [![download](https://img.shields.io/npm/dt/@ray/lamp-countdown.svg)](https://www.npmjs.com/package/@ray/lamp-countdown)

> 照明倒计时组件

## 安装

```sh
$ npm install @ray/lamp-countdown
// 或者
$ yarn add @ray/lamp-countdown
```

## 使用

```tsx
// page/home
import React, { useEffect, useState } from 'react';
import { navigateTo, View } from '@ray-js/ray';

export default function Home() {
  const handleClick = () => {
    navigateTo({
      url: '/pages/countdown/index',
      type: 'half', // 以弹窗新式弹出
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
        展示倒计时
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

## 多语言 key，可在主应用中配置覆盖

```md
lp_ct_confirm: '确定',
lp_ct_reset: '重置',
lp_ct_save: '保存',
lp_ct_AM: '上午',
lp_ct_PM: '下午',
lp_ct_countdownTitle: '倒计时',
lp_ct_countdownTips1: '请设置灯的{0}灯时间',
lp_ct_hour: '小时',
lp_ct_minute: '分',
lp_ct_second: '秒',

lp_ct_closeCountdown: '关闭倒计时',
lp_ct_resetting: '重新设定',
lp_ct_back: '返回',

lp_ct_countdownOpenedTip: '设备将在倒计时结束后自动{0}',

lp_ct_on: '开',
lp_ct_off: '关',
lp_ct_countdown_less_than_zero: '倒计时时间不能为 0',
```
