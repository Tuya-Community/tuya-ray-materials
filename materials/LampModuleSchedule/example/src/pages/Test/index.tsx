/* eslint-disable no-console */
import React from 'react';
import { View, Text } from '@ray-js/components';
import { router } from '@ray-js/ray';

import { useTriggerChildrenFunction } from '../../../../src/index';

export default function Home() {
  const triggerType1 = 'closeAllTimer'; // 触发子组件的方法，支持
  const { run: runCloseAllTimer } = useTriggerChildrenFunction(triggerType1);
  const handleClick = () => {
    console.log('点击了');
    runCloseAllTimer();
    setTimeout(() => {
      router.back();
    }, 4000);
  };
  return (
    <View onClick={handleClick}>
      <Text>返回</Text>
    </View>
  );
}
