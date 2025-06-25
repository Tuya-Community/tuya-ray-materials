import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import CircleHandle from '@ray-js/circlehandle';
import { Icon, NavBar } from '@ray-js/smart-ui';
import { View } from '@ray-js/ray';
import { useActions } from '@ray-js/panel-sdk';
import { router } from 'ray';
import { useInterval } from 'ahooks';
import Strings from '@/i18n/index';
import { iconStart } from '@/res/iconsvg';

import styles from './index.module.less';
import Header from './Header';

// 定义方向控制类型
type DirectionControl = 'forward' | 'turn_right' | 'backward' | 'turn_left' | 'stop';
type Direction = 'top' | 'right' | 'bottom' | 'left';

// 方向映射表
const directionMap: Record<Direction, DirectionControl> = {
  top: 'forward',
  right: 'turn_right',
  bottom: 'backward',
  left: 'turn_left',
};

export function Manual() {
  const actions = useActions();
  const continuous = true; // 根据业务需要使用连续/单次控制

  // 用于存储单次模式下的定时器ID
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 用于连续模式下跟踪当前按下的方向
  const [continuousDirection, setContinuousDirection] = useState<Direction | null>(null);

  // 跟踪当前是否是长按操作
  const isLongPressRef = useRef(false);

  // 清除单次模式的停止定时器
  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  // 发送方向控制指令
  const sendDirection = useCallback(
    (direction: Direction) => {
      const controlDirection = directionMap[direction];
      console.log('发送方向控制:', controlDirection);
      actions.direction_control.set(controlDirection);
    },
    [actions]
  );

  // 发送停止指令
  const sendStop = useCallback(() => {
    console.log('发送停止指令');
    actions.direction_control.set('stop');
  }, [actions]);

  // 使用 useInterval 在连续模式下按照指定频率发送方向指令
  useInterval(
    () => {
      if (continuousDirection) {
        sendDirection(continuousDirection);
      }
    },
    continuousDirection ? 500 : null // 当有方向时启动定时器，否则暂停
  );

  // 单次模式：发送方向后延迟发送停止
  const handleSinglePress = useCallback(
    (direction: Direction) => {
      // 如果是长按过程中，不处理点击事件
      if (isLongPressRef.current) return;

      // 清除之前的停止定时器
      clearStopTimer();

      // 发送方向指令
      sendDirection(direction);

      // 200ms后发送停止指令
      stopTimerRef.current = setTimeout(() => {
        sendStop();
      }, 200);
    },
    [sendDirection, sendStop, clearStopTimer]
  );

  // 连续模式的长按开始处理
  const handleContinuousLongPressStart = useCallback(
    (direction: Direction) => {
      // 立即发送一次方向指令
      sendDirection(direction);
      // 设置当前方向，这将启动 useInterval
      setContinuousDirection(direction);
    },
    [sendDirection]
  );

  // 连续模式的长按结束处理
  const handleContinuousLongPressEnd = useCallback(() => {
    // 清除当前方向，这将暂停 useInterval
    setContinuousDirection(null);
    // 发送停止指令
    sendStop();
  }, [sendStop]);

  // 单次模式的长按开始处理
  const handleSingleLongPressStart = useCallback(
    (direction: Direction) => {
      // 标记为长按状态
      isLongPressRef.current = true;

      // 清除之前的停止定时器
      clearStopTimer();

      // 发送方向指令
      sendDirection(direction);
    },
    [sendDirection, clearStopTimer]
  );

  // 单次模式的长按结束处理
  const handleSingleLongPressEnd = useCallback(() => {
    // 发送停止指令
    sendStop();

    // 延迟重置长按状态，确保后续的onPress不被误触发
    setTimeout(() => {
      isLongPressRef.current = false;
    }, 50);
  }, [sendStop]);

  // 组件卸载时清除单次模式的定时器
  useEffect(() => {
    return () => {
      clearStopTimer();
    };
  }, [clearStopTimer]);

  // 根据模式构建配置对象
  const circleHandleConfig = useMemo(() => {
    const baseConfig = {
      padding: 10,
      outBgColor: 'rgba(255, 255, 255, 0.1)',
      radius: 135,
      centerRadius: 60,
      pointRadius: 4,
      centerStyle: { opacity: 0 },
      offsetContent: 0.05,
      status: {
        top: true,
        bottom: true,
        left: true,
        right: true,
        center: true,
      },
      keyContent: {
        top: (
          <Icon className={styles.top} name={iconStart} color="var(--theme-color)" size="60rpx" />
        ),
        bottom: (
          <Icon
            className={styles.bottom}
            name={iconStart}
            color="var(--theme-color)"
            size="60rpx"
          />
        ),
        left: (
          <Icon className={styles.left} name={iconStart} color="var(--theme-color)" size="60rpx" />
        ),
        right: <Icon name={iconStart} color="var(--theme-color)" size="60rpx" />,
      },
    };

    if (continuous) {
      // 连续控制模式
      return {
        ...baseConfig,
        onLongPressStart: {
          top: () => handleContinuousLongPressStart('top'),
          right: () => handleContinuousLongPressStart('right'),
          bottom: () => handleContinuousLongPressStart('bottom'),
          left: () => handleContinuousLongPressStart('left'),
        },
        onLongPressEnd: {
          top: handleContinuousLongPressEnd,
          right: handleContinuousLongPressEnd,
          bottom: handleContinuousLongPressEnd,
          left: handleContinuousLongPressEnd,
        },
      };
    }
    // 单次控制模式：同时支持点击和长按
    return {
      ...baseConfig,
      onPress: (direction: Direction) => {
        handleSinglePress(direction);
      },
      onLongPressStart: {
        top: () => handleSingleLongPressStart('top'),
        right: () => handleSingleLongPressStart('right'),
        bottom: () => handleSingleLongPressStart('bottom'),
        left: () => handleSingleLongPressStart('left'),
      },
      onLongPressEnd: {
        top: handleSingleLongPressEnd,
        right: handleSingleLongPressEnd,
        bottom: handleSingleLongPressEnd,
        left: handleSingleLongPressEnd,
      },
    };
  }, [
    continuous,
    handleSinglePress,
    handleSingleLongPressStart,
    handleSingleLongPressEnd,
    handleContinuousLongPressStart,
    handleContinuousLongPressEnd,
  ]);

  return (
    <View className={styles.container}>
      <NavBar
        fixed
        placeholder
        customClass={styles.navbar}
        titleClass={styles.title}
        leftArrow
        title={Strings.getLang('manual')}
        onClickLeft={router.back}
      />
      <Header />
      <View className={styles.circleHandleWrapper}>
        <CircleHandle {...circleHandleConfig} />
      </View>
    </View>
  );
}

export default Manual;
