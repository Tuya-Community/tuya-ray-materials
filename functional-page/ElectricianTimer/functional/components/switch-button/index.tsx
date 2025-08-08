import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'clsx';
import { View } from '@ray-js/ray';
import { Icon } from '../icon';
// @ts-ignore
import styles from './index.module.less';

const DEFAULT_SIZE = {
  width: 96,
  height: 56,
  activeSize: { width: 48, height: 48 },
  margin: 4,
};

const DEFAULT_GRADIENT_SIZE = {
  width: 198,
  height: 76,
  activeSize: { width: 92, height: 64 },
  margin: 6,
};

// for android，默认overflow: hidden会导致阴影被裁，效果很差;
const EXTRA_WIDTH = 4;
const EXTRA_HEIGHT = 6;

export interface SwitchButtonProps {
  /**
   * 容器样式
   */
  style?: CSSProperties;
  className?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 当前选中的值，设置了该属性即为受控组件
   */
  value?: boolean;
  /**
   * 默认选中的值
   */
  defaultValue?: boolean;
  /**
   * 设置switchButton的大小
   */
  size?: {
    width?: number;
    height?: number;
    activeSize?: { width: number; height: number };
    margin?: number;
    borderRadius?: number;
  };
  /**
   * 改变switchButton值时执行此回调
   */
  onValueChange?: (value: boolean) => void;
  /**
   * 指定thumb的样式
   */
  thumbStyle?: CSSProperties;

  /**
   * switchButton的value值为false时左侧显示的字符,超过3个字符则显示显示2个字符，其余显示…
   */
  onText?: string;
  /**
   * switchButton的value值为true时右侧显示的字符，超过3个字符则显示显示2个字符，其余显示…
   */
  offText?: string;
  /**
   * switchButton的value值为false时左侧显示的字符样式
   */
  onTextStyle?: CSSProperties;
  /**
   * switchButton的value值为true时右侧显示的字符样式
   */
  offTextStyle?: CSSProperties;
  /**
   * 滑块上的图标路径
   */
  d?: string;
  /**
   * 滑块上的图标大小
   */
  iconSize?: number | string;
  /**
   * 滑块上的图标颜色
   */
  iconColor?: string;
  /**
   * Switch 开关类型，默认不传，特殊情况传值 thumbMore
   */
  switchType?: 'thumbMore';
  /**
   * 当 switchType = 'thumbMore' 时，开关左右定位的滑块样式
   */
  smallThumbStyle?: CSSProperties;
}

const SwitchButton: FC<SwitchButtonProps> = ({
  size,
  onText,
  offText,
  value,
  defaultValue,
  style,
  disabled,
  switchType,
  onValueChange,
  smallThumbStyle,
  onTextStyle,
  offTextStyle,
  d,
  iconColor,
  iconSize,
  thumbStyle,
  className,
}) => {
  const [checked, setChecked] = useState(defaultValue || false);

  const buttonSize = useMemo(() => {
    let result;
    if (!!onText && !!offText) {
      result = { ...DEFAULT_GRADIENT_SIZE, ...size };
    } else {
      result = { ...DEFAULT_SIZE, ...size };
    }
    return Object.keys(result).reduce((res, key) => {
      res[key] = result[key];
      return res;
    }, {} as any);
  }, [offText, onText, size]);
  // 处理样式
  const [contentStyle, bgStyle] = useMemo(() => {
    const width = buttonSize.width + EXTRA_WIDTH;
    const height = Math.max(buttonSize.activeSize.height, buttonSize.height) + EXTRA_HEIGHT;
    const contentStyle: CSSProperties = {
      width,
      height,
    };
    const bgStyle: CSSProperties = {};
    Object.assign(bgStyle, {
      width: buttonSize.width,
      height: buttonSize.height,
      borderRadius: buttonSize.borderRadius || (15.5 / 28) * buttonSize.height,
    });

    return [contentStyle, bgStyle];
  }, [checked, buttonSize]);

  const thumbStyleRes = useMemo(() => {
    const { width, margin, activeSize } = buttonSize;
    // 滑块位置
    const left = checked ? width - (activeSize.width + margin) : margin;
    const translateX = left + EXTRA_WIDTH / 2;
    return {
      width: activeSize.width,
      height: activeSize.height,
      borderRadius: activeSize.height / 2,
      transform: `translateX(${translateX}rpx)`,
      ...thumbStyle,
    };
  }, [thumbStyle, buttonSize, checked]);

  const onTextStyleRes = useMemo(() => {
    const { activeSize, margin } = buttonSize;
    const x = margin + EXTRA_WIDTH / 2;
    return {
      width: activeSize.width,
      height: activeSize.height,
      right: x,
      ...onTextStyle,
    };
  }, [onTextStyle, buttonSize, checked]);

  const offTextStyleRes = useMemo(() => {
    const { activeSize, margin } = buttonSize;
    const x = margin + EXTRA_WIDTH / 2;
    return {
      width: activeSize.width,
      height: activeSize.height,
      left: x,
      ...offTextStyle,
    };
  }, [offTextStyle, buttonSize, checked]);

  const textOn = onText.length > 3 ? `${onText.substr(0, 2)}...` : onText;
  const textOff = offText.length > 3 ? `${offText.substr(0, 2)}...` : offText;
  const onSwitchChange = useCallback(
    (e) => {
      e.origin.stopPropagation();
      if (disabled) return;
      if (typeof value === 'undefined') {
        setChecked(!checked);
      }
      onValueChange && onValueChange(!checked);
    },
    [onValueChange, disabled, checked, value],
  );
  const handleOnChange = useCallback(
    (e) => {
      e.origin.stopPropagation();
      if (disabled) return;
      if (typeof value === 'undefined') {
        setChecked(true);
      }
      onValueChange && onValueChange(true);
    },
    [onValueChange, disabled, value],
  );
  const handleOffChange = useCallback(
    (e) => {
      e.origin.stopPropagation();
      if (disabled) return;
      if (typeof value === 'undefined') {
        setChecked(false);
      }
      onValueChange && onValueChange(false);
    },
    [onValueChange, disabled, value],
  );

  useEffect(() => {
    if (typeof value !== 'undefined') {
      setChecked(value);
    }
  }, [value]);
  return (
    <View
      style={style}
      className={classNames(styles.switch, className, { [styles.disabled]: disabled })}
      onClick={onSwitchChange}
    >
      <View style={contentStyle} className={styles.content}>
        <View style={bgStyle} className={styles.bg} />
        {switchType === 'thumbMore' && (
          <View
            className={classNames(styles.smallThumb, {
              [styles.smallThumbActive]: checked,
            })}
            style={{ ...smallThumbStyle, left: 3 * buttonSize.margin }}
          />
        )}
        {switchType === 'thumbMore' && (
          <View
            className={classNames(styles.smallThumb, {
              [styles.smallThumbActive]: !checked,
            })}
            style={{ ...smallThumbStyle, right: 3 * buttonSize.margin }}
          />
        )}
        {/* 滑块 */}
        <View className={styles.thumb} style={thumbStyleRes}>
          {!!d && <Icon d={d} size={iconSize} color={iconColor} />}
        </View>
        {!!onText && (
          <View
            onClick={handleOnChange}
            className={classNames(styles.text, { [styles.selected]: checked })}
            style={onTextStyleRes}
          >
            {textOn}
          </View>
        )}
        {!!offText && (
          <View
            onClick={handleOffChange}
            className={classNames(styles.text, { [styles.selected]: !checked })}
            style={offTextStyleRes}
          >
            {textOff}
          </View>
        )}
      </View>
    </View>
  );
};

SwitchButton.defaultProps = {
  defaultValue: false,
  disabled: false,
  className: '',
  thumbStyle: null,
  onText: '',
  offText: '',
  onTextStyle: null,
  offTextStyle: null,
  d: null,
  iconSize: 36,
  iconColor: null,
  switchType: null,
  smallThumbStyle: {},
};

export default SwitchButton;
