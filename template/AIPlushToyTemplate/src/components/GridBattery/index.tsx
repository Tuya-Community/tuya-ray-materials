import React from 'react';
import { View } from '@ray-js/ray';
import styles from './index.module.less';

interface GridBatteryProps {
  /**
   * 电池电量 0-100
   */
  value: number;
  /**
   * 电池方向 horizontal | vertical
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 电池尺寸
   */
  size?: number;
  status: string;
}

export const GridBattery: React.FC<GridBatteryProps> = ({
  value = 0,
  direction = 'horizontal',
  size = 40,
  status = 'none',
}) => {
  const gridCount = 5;
  const activeGrids = Math.ceil((value / 100) * gridCount);

  const getBatteryColor = (isActive: boolean) => {
    if (!isActive) return '#E5E5E5';

    switch (activeGrids) {
      case 1:
        return '#F04C4C'; // 红色 - 电量极低
      case 2:
        return '#FFA000'; // 橙色 - 电量低
      default:
        return '#408CFF'; // 蓝色 - 电量正常
    }
  };

  const getGridStyle = (index: number) => {
    const isActive = index < activeGrids;
    return {
      backgroundColor: getBatteryColor(isActive),
      width: direction === 'horizontal' ? `${Math.ceil(size / 9)}px` : `${Math.ceil(size / 3)}px`,
      height: direction === 'horizontal' ? `${Math.ceil(size / 3)}px` : `${Math.ceil(size / 9)}px`,
    };
  };

  return (
    <View
      className={`${styles.container} ${styles[direction]}`}
      style={{
        width: direction === 'horizontal' ? `${size}px` : `${size / 2}px`,
        height: direction === 'horizontal' ? `${size / 2}px` : `${size}px`,
        padding: status === 'charging' ? '0' : '2px',
        border: value === 0 ? '1px solid #F04C4C' : '1px solid #5d5d5d',
      }}
    >
      <View
        className={styles.grids}
        style={{
          borderRadius: status === 'charging' ? '3px' : '0',
          backgroundColor: status !== 'charging' ? 'transparent' : '#1ABC0D',
        }}
      >
        {status !== 'charging' &&
          [...Array(gridCount)].map((_, index) => (
            <View key={index} className={styles.grid} style={getGridStyle(index)} />
          ))}
      </View>
      <View
        className={styles.head}
        style={{
          width:
            direction === 'horizontal' ? `${Math.round(size / 20)}px` : `${Math.round(size / 5)}px`,
          height:
            direction === 'horizontal' ? `${Math.round(size / 5)}px` : `${Math.round(size / 20)}px`,
          top: direction === 'horizontal' ? '50%' : `-${Math.round(size / 5)}px`,
          right: direction === 'horizontal' ? `-${Math.round(size / 20)}px` : '50%',
          transform: direction === 'horizontal' ? 'translate(0, -50%)' : 'translate(-50%, 0)',
          backgroundColor: value === 0 ? '#F04C4C' : '#5d5d5d',
        }}
      />
    </View>
  );
};
