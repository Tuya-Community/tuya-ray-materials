import React, { FC } from 'react';
import { View, Text, Button } from '@ray-js/components';
import Popup from '@ray-js/components-ty-popup';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  show: boolean;
  title?: string;
  bottomBtnText?: string;
  onBottomBtnClick?: () => void;
  onClickOverlay: () => void;
  children: React.ReactNode;
  hideBottomBtn?: boolean;
  style?: any;
  renderHeader?: () => React.ReactNode;
  renderBottom?: () => React.ReactNode;
}

const CustomPopup: FC<Props> = ({
  show,
  title,
  bottomBtnText,
  onBottomBtnClick,
  onClickOverlay,
  hideBottomBtn,
  children,
  style = {},
  renderHeader,
  renderBottom,
}) => {
  return (
    <Popup
      show={show}
      onClickOverlay={onClickOverlay}
      position="bottom"
      round
      customStyle={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      <View className={styles.modalContainer}>
        {renderHeader ? (
          renderHeader()
        ) : (
          <View className={styles.header}>
            <Text className={styles.title}>{title || ''}</Text>
          </View>
        )}
        {children}
        {renderBottom && renderBottom()}
        {!hideBottomBtn && !renderBottom && (
          <Button
            className={styles.bottomBtn}
            onClick={() => {
              onBottomBtnClick?.();
            }}
          >
            <Text className={styles.bottomBtnText}>{bottomBtnText || ''}</Text>
          </Button>
        )}
      </View>
    </Popup>
  );
};

export default CustomPopup;
