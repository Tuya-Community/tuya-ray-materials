/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import { Text, View } from '@ray-js/components';
import { Icon } from '@ray-js/icons';
import { defaultProps, IProps } from './props';
// @ts-ignore
import styles from './index.module.less';

function TyNotification(props: IProps) {
  const {
    icon,
    show,
    width,
    height,
    borderRadius,
    backgroundColor,
    top,
    text,
    onHandle,
    onClosed,
    onClick,
    hideCloseBtn,
    renderCustomIcon,
  } = props;
  const trueWidth = width < 320 ? 706 : width;
  return (
    <View
      className={styles['notice-view']}
      style={{ top: show ? `${top}rpx` : `-${height}rpx`, height: `${height}rpx` }}
    >
      <View
        className={styles['notice-content']}
        style={{
          height: `${height}rpx`,
          borderRadius: `${borderRadius}rpx`,
          backgroundColor,
        }}
        onClick={() => typeof onClick === 'function' && onClick()}
      >
        <View className={styles['content']}>
          {renderCustomIcon ? (
            renderCustomIcon()
          ) : (
            <Icon type={icon || 'icon-warning'} size={24} color="#f84438"></Icon>
          )}
          <Text className={styles['text']} style={{ maxWidth: `${trueWidth - 290}rpx` }}>
            {text}
          </Text>
          <View
            className={styles['close-icon']}
            onClick={() => typeof onHandle === 'function' && onHandle()}
          >
            <Icon type="icon-right" size={20} color="rgba(0,0,0,0.2)"></Icon>
          </View>
        </View>
        {!hideCloseBtn && (
          <View
            className={styles['close-icon']}
            onClick={() => typeof onClosed === 'function' && onClosed()}
          >
            <Icon type="icon-xmark" size={20} color="rgba(0,0,0,0.2)"></Icon>
          </View>
        )}
      </View>
    </View>
  );
}

TyNotification.defaultProps = defaultProps;

export default TyNotification;
