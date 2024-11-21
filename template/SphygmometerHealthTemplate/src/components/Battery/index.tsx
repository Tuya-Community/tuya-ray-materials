import { useEffect, useState } from 'react';
import { useProps } from '@ray-js/panel-sdk';
import { Battery as SmartBattery } from '@ray-js/smart-ui';

import { dpCodes } from '@/config';

const { batteryLowCode } = dpCodes;

/**
 * @param value 电量Dp值
 * @returns 电量所对应的top值
 */
const calcBattery = (value: number) => {
  // 电池为100%, top: 3,电量20%: 14.2 ,电量10%: 15.6,电量为0%，top: 17
  const top = 17 - ((17 - 3) * value) / 100;
  return top;
};

// 获取对量所对应的颜色
const calcColor = (top: number) => {
  if (top >= 14.2 && top <= 17) {
    return '#FF6363';
  }
  return '#4CD964';
};

const Battery = () => {
  const [batteryValue, setBatteryValue] = useState(100);
  const dpBatteryLow = useProps(props => props[batteryLowCode]);

  // 获取电量所对应的top值
  const batteryTop = calcBattery(batteryValue);

  useEffect(() => {
    if (dpBatteryLow) {
      setBatteryValue(10);
    } else {
      setBatteryValue(100);
    }
  }, [dpBatteryLow]);

  return <SmartBattery value={batteryValue} onCalcColor={() => calcColor(batteryTop)} />;
};

export default Battery;
