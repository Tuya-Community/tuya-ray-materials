import React, { FC } from 'react';
import { View, Button, router } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { DeviceManageOptions } from '@/types';
import styles from './index.module.less';

interface IProps {
  visible: boolean;
  deviceManageOptions: {
    label: string;
    value: DeviceManageOptions;
  }[];
  handleClose: () => void;
  handleClickItem: (v: DeviceManageOptions) => void;
}

const ActionPopup: FC<IProps> = ({
  visible,
  deviceManageOptions,
  handleClose,
  handleClickItem,
}) => {
  const toGuidePage = () => {
    router.push('/guide');
  };

  const renderCustomHeader = () => {
    return (
      <View className={styles['custom-header']}>
        <View className={styles['custom-header-title']}>{Strings.getLang('deviceManagement')}</View>
        <Button className={styles['custom-header-guide-button']} onClick={toGuidePage}>
          {Strings.getLang('operationGuide')}
        </Button>
      </View>
    );
  };

  return (
    <Popup
      show={visible}
      position="bottom"
      round
      customStyle={{ marginBottom: 0 }}
      onClose={handleClose}
    >
      <View className={styles.popContent}>
        {renderCustomHeader()}
        {deviceManageOptions.map(item => {
          return (
            <View
              key={item.value}
              className={styles.popItem}
              onClick={() => handleClickItem(item.value)}
            >
              {item.label}
            </View>
          );
        })}
        <View className={styles.popItem} onClick={handleClose}>
          {Strings.getLang('cancel')}
        </View>
      </View>
    </Popup>
  );
};

export default ActionPopup;
