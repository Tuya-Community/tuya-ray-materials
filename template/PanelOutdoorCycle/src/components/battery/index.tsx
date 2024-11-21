import React, { useCallback } from 'react';
import { Text, View, Image } from '@ray-js/ray';
import Svg from '@ray-js/svg';
import { useSelector } from 'react-redux';
import { useProps, useDevice } from '@ray-js/panel-sdk';
import TyOutdoorUtils from '@ray-js/ty-outdoor-utils';
import { selectThemeType } from '@/redux/modules/themeSlice';
import Res from '@/res';
import { getBatInfo } from '@/utils';
import dpCodes from '@/constant/dpCodes';
import { DynamicNumber } from '../dynamic-number';
import styles from './index.module.less';

const { batteryPercentage } = dpCodes;
export const Battery = () => {
  const dpState = useProps();
  const devInfo = useDevice(device => device.devInfo);
  const theme = useSelector(selectThemeType);
  const r = 18; // 半径大小
  const circumference = 2 * Math.PI * r;
  const progress = dpState[batteryPercentage] || 0; // 进度百分比
  const strokeColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)'; // 进度条颜色
  const visibleLength = (progress / 100) * circumference; // 可见部分的长度
  const { color, icon } = getBatInfo(progress, theme);

  // 跳转电池二级页
  const toBatteryPage = () => {
    TyOutdoorUtils.jumpSubPage.toBattery({
      deviceId: devInfo.devId,
    });
  };
  const batView = useCallback(() => {
    return (
      <View>
        <DynamicNumber counts={progress} point={0} className={styles.batNum} />
        <Text className={styles.util}>%</Text>
      </View>
    );
  }, [progress]);

  return (
    <View className={styles.battery} onClick={toBatteryPage}>
      <View className={styles.batLeft}>
        <Svg width="96px" height="96px" className={styles.svg}>
          <circle
            cx="48"
            cy="48"
            r={r}
            stroke={strokeColor}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
          <circle
            cx="48"
            cy="48"
            r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            /* strokeDasharray={`${visibleLength}, ${circumference * 2}`} */
            style={`stroke-dasharray: ${visibleLength}, ${circumference * 2}`}
            strokeLinecap="round"
            transform="rotate(-90, 48, 48) scaleX(1) scaleY(1)"
          />
        </Svg>
        <Image src={icon} className={styles.batIcon} />
      </View>
      {batView()}
      <Image src={theme === 'dark' ? Res.batWarn : Res.batWarnLight} className={styles.batWarn} />
    </View>
  );
};
