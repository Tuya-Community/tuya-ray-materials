import React, { FC } from 'react';
import clsx from 'clsx';
import { View, Image } from '@ray-js/components';
import { useSelector } from 'react-redux';
import Res from '@/res';
import { selectThemeByKey } from '@/redux/modules/themeSlice';
import styles from './index.module.less';

const prefix = 'device-item';

interface DeviceItemProps {
  className?: string;
  name: string;
  icon: string;
  isOnline?: boolean;
  roomName?: string;
  leftImage?: string;
  leftImageClassName?: string;
  isShowMore?: boolean;
  /** 显示底部的快捷开关 */
  hasBottomQuickSwitch?: boolean;
  /** 底部的快捷开关图片 */
  bottomQuickSwitchImage?: string;
  onMoreClick?: () => void;
  onLeftImageClick?: () => void;
  onBottomQuickSwitchClick?: () => void;
  onItemClick?: () => void;
}

const DeviceItem: FC<DeviceItemProps> = props => {
  const {
    className,
    name,
    icon,
    isOnline,
    roomName,
    leftImage,
    leftImageClassName,
    isShowMore,
    hasBottomQuickSwitch,
    bottomQuickSwitchImage,
    onMoreClick,
    onLeftImageClick,
    onItemClick,
    onBottomQuickSwitchClick,
    ...rest
  } = props;
  const themeType = useSelector(selectThemeByKey('type'));

  const handleItemClick = () => {
    typeof onItemClick === 'function' && onItemClick();
  };

  const handleLeftImageClick = event => {
    typeof onLeftImageClick === 'function' && onLeftImageClick();
    event.origin.stopPropagation();
  };

  const handleMoreClick = event => {
    typeof onMoreClick === 'function' && onMoreClick();
    event.origin.stopPropagation();
  };

  const handleBottomQuickSwitchClick = event => {
    typeof onBottomQuickSwitchClick === 'function' && onBottomQuickSwitchClick();
    event.origin.stopPropagation();
  };

  return (
    <View
      className={clsx(styles[`${prefix}`], !isOnline && styles[`${prefix}-offline`], className)}
      onClick={handleItemClick}
    >
      <View className={styles[`${prefix}-icon-line`]}>
        {leftImage ? (
          <View style={{ fontSize: 0 }} onClick={handleLeftImageClick}>
            <Image src={leftImage} mode="aspectFit" className={leftImageClassName} />
          </View>
        ) : (
          <View />
        )}
        {isShowMore ? (
          <View className={styles[`${prefix}-icon-more-container`]} onClick={handleMoreClick}>
            <Image
              src={Res[themeType].iconMore}
              className={styles[`${prefix}-icon-more`]}
              mode="aspectFit"
            />
          </View>
        ) : (
          <View />
        )}
      </View>

      <View
        className={styles[`${prefix}-device-img-container`]}
        style={{ textAlign: hasBottomQuickSwitch ? 'left' : 'center' }}
      >
        <Image src={icon} className={styles[`${prefix}-device-img`]} mode="aspectFit" />
      </View>

      {hasBottomQuickSwitch ? (
        <View className={styles[`${prefix}-bottom-container`]}>
          <View className={styles[`${prefix}-bottom-left`]}>
            <View className={styles[`${prefix}-bottom-name`]}>{name}</View>
            {!!roomName && <View className={styles[`${prefix}-bottom-room`]}>{roomName}</View>}
          </View>

          {!!bottomQuickSwitchImage && (
            <View style={{ fontSize: 0 }} onClick={handleBottomQuickSwitchClick}>
              <Image
                src={bottomQuickSwitchImage}
                mode="aspectFit"
                className={styles[`${prefix}-quick-switch`]}
              />
            </View>
          )}
        </View>
      ) : (
        <View className={styles[`${prefix}-name`]}>{name}</View>
      )}
    </View>
  );
};

DeviceItem.defaultProps = {
  isShowMore: false,
  className: '',
  leftImage: '',
  leftImageClassName: '',
  isOnline: true,
  hasBottomQuickSwitch: false,
  roomName: '',
  bottomQuickSwitchImage: '',
  onMoreClick: () => ({}),
  onLeftImageClick: () => ({}),
  onItemClick: () => ({}),
  onBottomQuickSwitchClick: () => ({}),
};

export default React.memo(DeviceItem);
