import React, { FC } from 'react';
import { Text, View, Image, Switch } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
// @ts-ignore
import Styles from './index.module.less';

interface IProps {
  img?: any;
  label: string;
  text?: string;
  actionType?: 'arrow' | 'switch';
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  switchConfig?: {
    checked: boolean;
    disabled: boolean;
    onChange: (event: any) => void;
  };
  renderLeft?: () => React.ReactNode;
  renderRight?: () => React.ReactNode;
  onClick?: () => void;
}

export const ActionRow: FC<IProps> = ({
  img,
  label,
  text,
  actionType,
  style,
  imgStyle,
  textStyle,
  switchConfig,
  onClick,
  renderLeft,
  renderRight,
}) => {
  const iconColor = 'background: rgba(23, 23, 23, 1);';
  const switchColor = '#3678E3';

  return (
    <View className={Styles.arrowMain} style={style} onClick={onClick}>
      {renderLeft ? (
        renderLeft()
      ) : (
        <View className={Styles.left}>
          {img && <Image src={img} className={Styles.img} style={imgStyle} />}
          <Text className={Styles.label}>{label}</Text>
        </View>
      )}

      {renderRight ? (
        renderRight()
      ) : (
        <View className={Styles.right}>
          {text && (
            <Text className={Styles.text} style={textStyle}>
              {text}
            </Text>
          )}
          {actionType === 'arrow' && (
            <Icon type="icon-right" size={16} color={iconColor} style={{ opacity: 0.4 }} />
          )}
          {actionType === 'switch' && switchConfig && (
            <Switch
              disabled={switchConfig?.disabled}
              checked={switchConfig?.checked}
              color={switchColor}
              onChange={switchConfig.onChange}
            />
          )}
        </View>
      )}
    </View>
  );
};

ActionRow.defaultProps = {
  img: null,
  text: '',
  actionType: null,
  style: null,
  imgStyle: null,
  textStyle: null,
  onClick: null,
  switchConfig: null,
  renderLeft: null,
  renderRight: null,
};
