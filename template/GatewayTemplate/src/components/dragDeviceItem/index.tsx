import React, { FC } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Button, View, Image } from '@ray-js/components';
import Strings from '@/i18n';
import Res from '@/res';
import { selectThemeByKey } from '@/redux/modules/themeSlice';
import styles from './index.module.less';

const prefix = 'device-item';

interface DeviceItemProps {
  className?: string;
  itemKey: string;
  name: string;
  icon: string;
  isOnline: boolean;
  selectable?: boolean;
  checked?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  isClickableWhenDisabled?: boolean;
  onItemClick?: (key: string) => void;
}

const DeviceItem: FC<DeviceItemProps> = ({
  className,
  itemKey,
  name,
  icon,
  isOnline,
  selectable,
  checked,
  disabled,
  disabledReason,
  isClickableWhenDisabled,
  onItemClick,
}) => {
  const themeType = useSelector(selectThemeByKey('type'));

  const handClick = () => {
    if (disabled && disabledReason) {
      ty.showToast({
        title: disabledReason,
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    typeof onItemClick === 'function' && onItemClick(itemKey);
  };
  return (
    <Button
      className={clsx(styles[`${prefix}`], disabled && styles[`${prefix}-disabled`], className)}
      disabled={disabled && !isClickableWhenDisabled}
      onClick={handClick}
    >
      <View className={styles[`${prefix}-left`]}>
        <Image src={icon} className={styles[`${prefix}-icon`]} mode="aspectFit" />
        <View className={styles[`${prefix}-main-info`]}>
          <View className={styles[`${prefix}-name`]}>{name}</View>
          <View
            className={clsx(
              styles[`${prefix}-online-state-tag`],
              !isOnline && styles[`${prefix}-offline`]
            )}
          >
            {Strings.getLang(isOnline ? 'deviceOnlineText' : 'deviceOfflineText')}
          </View>
        </View>
      </View>

      {selectable && (
        <Image
          className={styles[`${prefix}-checkbox-icon`]}
          mode="aspectFit"
          src={checked ? Res.checkboxChecked : Res[themeType].unChecked}
        />
      )}
    </Button>
  );
};

DeviceItem.defaultProps = {
  className: '',
  selectable: true,
  checked: false,
  disabled: false,
  disabledReason: '',
  isClickableWhenDisabled: true,
  onItemClick: () => ({}),
};

export default React.memo(DeviceItem);
