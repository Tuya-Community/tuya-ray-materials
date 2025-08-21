import React, { useMemo } from 'react';
import { View, Text, Switch, Image } from '@ray-js/ray';
import { useConfig } from '@ray-js/components-ty-config-provider';
import Res from '../../res';

import './index.less';

type Props = {
  type?: 'arrow' | 'switch';
  label?: string;
  renderIcon?: () => React.ReactElement;
  text?: string;
  style?: any;
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  fontStyle?: {
    titleColor: string;
    textColor: string;
    iconColor: string;
  };
  title?: string;
  titleStyle?: any;
  switchChecked?: boolean;
  onClick?: () => void;
  onSwitchChange?: (checked: boolean) => void;
};

const Card = (props: Props) => {
  const {
    style = {},
    backgroundColor,
    borderColor,
    boxShadow,
    fontStyle,
    type,
    label,
    switchChecked,
    renderIcon,
    text,
    title,
    titleStyle,
    onClick,
    onSwitchChange,
  } = props;
  const renderTitle = () => {
    if (!title) {
      return null;
    }
    return (
      <Text className="titleStyle" style={{ color: _titleColor, ...titleStyle }}>
        {title}
      </Text>
    );
  };
  const handleClick = e => {
    const { origin } = e;
    if (!origin || !origin.target) {
      return;
    }
    const { id } = origin.target;
    if (id === 'card-switch') {
      return;
    }
    onClick && onClick();
  };
  const handleSwitchChange = (e: { value: boolean }) => {
    onSwitchChange && onSwitchChange(e?.value);
  };
  const theme = useConfig();
  const brandColor = theme?.brandColor;
  const cardStyle = theme?.card || {};
  const { titleColor, textColor } = fontStyle;
  const _titleColor = titleColor || cardStyle.textPrimary;
  const onlyTitle = title && !label && !renderIcon();
  let onlyTitleStyle = {};
  if (onlyTitle) {
    onlyTitleStyle = {
      justifyContent: 'center',
    };
  }
  const renderSwitchButton = useMemo(() => {
    if (!title && type !== 'arrow') {
      return (
        <Switch
          key="card-switch"
          id="card-switch"
          color={brandColor}
          checked={switchChecked}
          onChange={handleSwitchChange}
        />
      );
    }
    return null;
  }, [switchChecked]);
  const isDark = theme?.theme === 'dark';
  return (
    <View className="container" onClick={handleClick}>
      <View
        className="itemStyle"
        key={label}
        style={{ ...onlyTitleStyle, background: backgroundColor, borderColor, boxShadow, ...style }}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '114rpx',
            marginRight: '16rpx',
          }}
        >
          {renderIcon && renderIcon()}
          {renderTitle()}
          {!title && (
            <Text className="labelStyle" style={{ color: _titleColor }}>
              {label}
            </Text>
          )}
        </View>
        {!title && type === 'arrow' && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              position: 'relative',
              right: '-12rpx',
            }}
          >
            {text && (
              <Text className="textStyle" style={{ color: textColor }}>
                {text}
              </Text>
            )}
            <Image
              className="card-icon"
              style={{
                width: `${24}rpx`,
                height: `${24}rpx`,
              }}
              mode="scaleToFill"
              src={isDark ? Res.iconRightArrowDark : Res.iconRightArrowLight}
            />
          </View>
        )}
        {renderSwitchButton}
      </View>
    </View>
  );
};

const nilFn = () => null;

Card.defaultProps = {
  onSwitchChange: nilFn,
  onClick: nilFn,
  type: 'arrow',
  text: '',
  label: '',
  title: '',
  titleStyle: {},
  style: {},
  backgroundColor: '',
  borderColor: '',
  boxShadow: '',
  fontStyle: {
    titleColor: '',
    textColor: '',
    iconColor: '',
  },
  switchChecked: false,
  renderIcon: () => null,
};

export default Card;
