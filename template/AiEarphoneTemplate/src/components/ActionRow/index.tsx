import React, { FC } from 'react';
// import { useSelector } from 'react-redux';
import { Text, View, Switch } from '@ray-js/ray';
import { Icon } from '@ray-js/icons';
// import { selectThemeColorByKey } from '@/redux/modules/themeSlice';
// @ts-ignore
import Styles from './index.module.less';
import ThemedImage from '@/components/ThemedImage';

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
  // const iconColor = useSelector(selectThemeColorByKey('--app-B1-N4'));
  // const switchColor = useSelector(selectThemeColorByKey('--app-M1'));

  const iconColor = 'var(--color-dark-solid)';
  const switchColor = 'var(--color-primary)';

  return (
    <View className={Styles.arrowMain} style={style} onClick={onClick}>
      {renderLeft ? (
        renderLeft()
      ) : (
        <View className={Styles.left}>
          {img && <ThemedImage src={img} className={Styles.img} style={imgStyle} />}
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
            <View style={{ opacity: 0.4 }}>
              <Icon type="icon-right" size={16} color={iconColor} />
            </View>
          )}
          {actionType === 'switch' && switchConfig && (
            <Switch
              disabled={switchConfig?.disabled ?? false}
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
