import React, { FC, useState } from 'react';
import { Button, Text, View, Image } from '@ray-js/components';
import clsx from 'clsx';
import { Popup } from '@ray-js/smart-ui';
import { DevInfo } from '@/types';
import Strings from '@/i18n';
import Res from '@/res';
import styles from './index.module.less';

const prefix = 'select-popup';

interface Option extends DevInfo {
  name: string;
  devId: string;
  disabled?: boolean;
}

interface SelectPopupProps {
  className?: string;
  show?: boolean;
  title?: string;
  subtitle?: string;
  options?: Option[];
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  showConfirm?: boolean;
  onConfirm?: (option: Option) => void;
  onCancel?: () => void;
  onSelect?: (option: Option) => void;
  onClickOverlay?: () => void;
}

const SelectPopup: FC<SelectPopupProps> = ({
  className,
  show,
  title,
  subtitle,
  options,
  confirmText,
  cancelText,
  showCancel,
  showConfirm,
  onConfirm,
  onCancel,
  onSelect,
  onClickOverlay,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option>({} as Option);

  const handleConfirmClick = () => {
    typeof onConfirm === 'function' && onConfirm(selectedOption);
  };

  const handleCancelClick = () => {
    typeof onCancel === 'function' && onCancel();
  };

  const selectOption = (option: Option) => {
    setSelectedOption(pre => (pre.devId === option.devId ? ({} as Option) : option));
    typeof onSelect === 'function' && onSelect(option);
  };

  return (
    <Popup
      show={show}
      position="center"
      round
      onClickOverlay={onClickOverlay}
      customStyle={{ width: '90%', paddingTop: '56rpx' }}
      className={clsx(styles[`${prefix}`], className)}
    >
      {!!title && <View className={styles[`${prefix}-title`]}>{title}</View>}
      {!!subtitle && <View className={styles[`${prefix}-subtitle`]}>{subtitle}</View>}
      <View className={styles[`${prefix}-options`]}>
        {options.map(option => {
          const { name, devId, disabled = false } = option;
          return (
            <View
              key={devId}
              className={styles[`${prefix}-option`]}
              onClick={() => selectOption(option)}
            >
              <View className={styles[`${prefix}-option-left`]}>
                <Text className={styles[`${prefix}-option-label`]}>{name}</Text>
              </View>
              <Image
                className={styles[`${prefix}-option-checkbox`]}
                src={selectedOption?.devId === devId ? Res.checkboxChecked : Res.checkBoxUnchecked}
                mode="aspectFit"
              />
            </View>
          );
        })}
      </View>

      <View className={styles[`${prefix}-bottom-button`]}>
        {showCancel && (
          <Button className={styles[`${prefix}-bottom-button-left`]} onClick={handleCancelClick}>
            {cancelText}
          </Button>
        )}
        {showConfirm && (
          <Button className={styles[`${prefix}-bottom-button-right`]} onClick={handleConfirmClick}>
            {confirmText}
          </Button>
        )}
      </View>
    </Popup>
  );
};

SelectPopup.defaultProps = {
  className: '',
  show: false,
  title: '',
  subtitle: '',
  options: [],
  confirmText: Strings.getLang('confirm'),
  cancelText: Strings.getLang('cancel'),
  showCancel: true,
  showConfirm: true,
  onConfirm: () => ({}),
  onCancel: () => ({}),
  onSelect: () => ({}),
  onClickOverlay: () => ({}),
};

export default SelectPopup;
