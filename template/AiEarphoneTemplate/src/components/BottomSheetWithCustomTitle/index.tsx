import React, { FC } from 'react';
import { View, Text } from '@ray-js/ray';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { BottomSheet, Icon, SmartBottomSheet, SmartEvent } from '@ray-js/smart-ui';

import styles from './index.module.less';

type Props = SmartBottomSheet & {
  renderTitle?: () => React.ReactNode;
};

const BottomSheetWithCustomTitle: FC<Props> = ({
  show,
  onClose,
  title,
  customClass,
  children,
  renderTitle,
  ...restProps
}) => {
  return (
    <BottomSheet
      customClass={customClass || styles.bottomSheet}
      show={show}
      onClose={onClose}
      slot={{
        title: renderTitle ? (
          renderTitle()
        ) : (
          <View className={styles.titleContainer}>
            {renderTitle ? renderTitle() : <Text className={styles.titleText}>{title}</Text>}
            <View
              className={styles.closeArea}
              onClick={e => onClose?.(e as unknown as SmartEvent<unknown>)}
            >
              <Icon name={closeIcon} size={20} />
            </View>
          </View>
        ),
      }}
      {...restProps}
    >
      {children}
    </BottomSheet>
  );
};

export default React.memo(BottomSheetWithCustomTitle);
