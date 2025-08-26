/*
 * @Author: mjh
 * @Date: 2024-12-30 18:36:40
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-09 18:03:01
 * @Description:
 */
import { Button, View, getLaunchOptionsSync } from '@ray-js/ray';
import React, { useEffect } from 'react';
import {
  offPowerMemoryFunctionalChange,
  navigateToPowerMemoryFunctional,
  onPowerMemoryFunctionalChange,
} from '../../../functional/utils';
import { PowerMemoryFunctionalData } from '../../../functional/types';
import styles from './index.module.less';

const defaultColors = [
  { hue: 0, saturation: 1000, value: 1000 },
  { hue: 120, saturation: 1000, value: 1000 },
  { hue: 240, saturation: 1000, value: 1000 },
];

export default () => {
  const { deviceId = 'vdevo173509156484303', groupId } = getLaunchOptionsSync().query;
  const jumpUrl = `functional://LampPowerMemoryFunctional/home?deviceId=${deviceId || ''}&groupId=${
    groupId || ''
  }`;
  // 预设数据
  const data: PowerMemoryFunctionalData = {
    collectColors: [...defaultColors, { hue: 100, saturation: 1000, value: 1000 }],
    collectWhites: [{ brightness: 1000, temperature: 1000 }],
    cardStyle: {
      border: '1px solid red',
    },
    dynamicDistribute: true,
  };

  // 跳转
  const handleNavTo = () => {
    navigateToPowerMemoryFunctional(jumpUrl, data);
  };

  useEffect(() => {
    onPowerMemoryFunctionalChange(res => {
      console.log(res, '-Function Page Return Data');
    });
    return offPowerMemoryFunctionalChange;
  }, []);
  return (
    <View className={styles.container}>
      <Button onClick={handleNavTo} type="primary">
        Enter the function page
      </Button>
    </View>
  );
};
