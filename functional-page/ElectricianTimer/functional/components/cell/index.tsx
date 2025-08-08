import React, { CSSProperties, FC } from 'react';
import { View } from '@ray-js/ray';
import Strings from '@/i18n';
import { config } from '@/config';
import clsx from 'clsx';
import styles from './index.module.less';
import SwitchButton from '../switch-button';
import { Icon } from '../icon';

interface Props {
  className?: string;
  style?: CSSProperties;
  title: string;
  subTitle?: string;
  value?: string | boolean;
  placeholder?: string;
  type?: 'normal' | 'switch' | 'desc';
  disabled?: boolean;
  onClick?: () => void;
  onChange?: (v: boolean) => void;
}

const Cell: FC<Props> = ({
  title,
  subTitle,
  style,
  className,
  placeholder,
  type = 'normal',
  value,
  disabled,
  onChange,
  onClick,
}) => {
  return (
    <View
      className={clsx(styles.container, className)}
      hoverClassName={type === 'normal' && !!onClick && !disabled ? 'hover' : null}
      style={style}
      onClick={type === 'normal' && !disabled ? onClick : null}
    >
      <View className={clsx(styles.titleBox, { [styles.descBox]: type === 'desc' })}>
        <View className={styles.title}>{title}</View>
        {!!subTitle && <View className={styles.subTitle}>{subTitle}</View>}
      </View>
      {type !== 'desc' && (
        <View className={styles.right}>
          {type === 'switch' ? (
            <SwitchButton
              disabled={disabled}
              value={!!value}
              onValueChange={onChange}
              onText={Strings.getLang('ret_on')}
              offText={Strings.getLang('ret_off')}
              thumbStyle={{ boxShadow: 'none' }}
            />
          ) : (
            <>
              <View className={clsx(styles.value, { [styles.placeholder]: !value && placeholder })}>
                {value || placeholder}
              </View>
              {!!onClick && <Icon type="arrow" fill="#C3C3C3" size={36} className={styles.arrow} />}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default Cell;
