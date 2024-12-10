import React, { FC } from 'react';
import { Button, View } from '@ray-js/components';
import { utils } from '@ray-js/panel-sdk';
import clsx from 'clsx';
import Strings from '@/i18n';
import styles from './index.module.less';

const { hex2rgbString } = utils;
const prefix = 'bottom-button';

interface BottomButtonProps {
  containerClassName?: string;
  buttonStyle?: React.CSSProperties;
  themeColor?: string;
  background?: string;
  text?: string;
  onClick?: () => void;
}

const BottomButton: FC<BottomButtonProps> = ({
  containerClassName,
  buttonStyle,
  background,
  themeColor,
  text,
  onClick,
}) => {
  return (
    <View className={clsx(styles[`${prefix}`])}>
      <View className={styles[`${prefix}-placeholder`]} />

      <View
        className={clsx(styles[`${prefix}-content`], containerClassName)}
        style={{ backgroundColor: background }}
      >
        <Button
          className={clsx(styles[`${prefix}-button`])}
          style={{
            backgroundColor: themeColor,
            boxShadow: `6rpx 4rpx 18rpx ${hex2rgbString(themeColor, 0.5)}`,
            ...buttonStyle,
          }}
          onClick={typeof onClick === 'function' ? onClick : undefined}
        >
          {text}
        </Button>
      </View>
    </View>
  );
};

BottomButton.defaultProps = {
  containerClassName: '',
  buttonStyle: {},
  themeColor: 'var(--theme-color)',
  background: 'var(--index-main-bg)',
  text: Strings.getLang('button'),
  onClick: () => ({}),
};

export default BottomButton;
