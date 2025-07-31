import React, { useCallback } from 'react';
import { Text, View, Image } from '@ray-js/ray';
import Svg from '@ray-js/svg';
import { useSelector } from 'react-redux';
import { DynamicNumber } from '@/components';
import { selectThemeType } from '@/redux/modules/themeSlice';
import { getBatInfo } from '@/utils';
import { useProps, useDevInfo } from '@ray-js/panel-sdk';
import { batWarn, batWarnLight } from '@/res';
import useJumpPage from '@/hooks/useJumpPage';
import dpCodes from '@/constant/dpCodes';
import styles from './index.module.less';

export const Battery = () => {
  const batteryDpVal = useProps(props => props[dpCodes.batteryPercentage]);
  const devInfo = useDevInfo() || {};
  const theme = useSelector(selectThemeType);
  const r = 18; // 圆环半径
  const circumference = 2 * Math.PI * r; // 圆环周长
  const progress = Number(batteryDpVal || 0); // 进度百分比
  const strokeColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)'; // 进度条颜色
  const visibleLength = (progress / 100) * circumference; // 可见部分的长度
  const { color, icon } = getBatInfo(progress, theme);

  const { goToRNPage } = useJumpPage(devInfo);

  const batView = useCallback(() => {
    return (
      <View>
        <DynamicNumber counts={progress} point={0} className={styles.batNum} />
        <Text className={styles.util}>%</Text>
      </View>
    );
  }, [progress]);

  return (
    <View className={styles.battery} onClick={() => goToRNPage('0000014j7a')}>
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
            strokeDasharray={`${visibleLength}, ${circumference * 2}`}
            strokeLinecap="round"
            transform="rotate(-90, 48, 48) scaleX(1) scaleY(1)"
          />
        </Svg>
        <Image src={icon} className={styles.batIcon} />
      </View>
      {batView()}
      <Image src={theme === 'dark' ? batWarn : batWarnLight} className={styles.batWarn} />
    </View>
  );
};
