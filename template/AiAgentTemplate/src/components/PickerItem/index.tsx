/* eslint-disable import/no-cycle */
import React, { CSSProperties, FC, ReactNode } from 'react';
import { Image, Text, View } from '@ray-js/ray';
import { Icon, SmartEvent, Switch } from '@ray-js/smart-ui';
import clsx from 'clsx';
import { TouchableOpacity } from '@/components';
import { themeColor } from '@/constant';
import { imgRightArrow } from '@/res';
import { iconWarning } from '@/res/iconsvg';
import styles from './index.module.less';

type Props = {
  title: string | ReactNode;
  subTitle?: string;
  width?: string;
  height?: string;
  iconSource?: string;
  subIconSource?: string;
  isShowRightArrow?: boolean;
  isDiySubTitle?: boolean;
  isLeftSubTitle?: boolean;
  switchState?: boolean;
  innerContainerStyle?: CSSProperties;
  outerContainerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  subTitleStyle?: CSSProperties;

  tipsText?: string;
  openTitle?: string;
  closeTitle?: string;
  openCodeStr?: string;
  closeCodeStr?: string;
  onClick?: () => void;
  onChangeSwitch?: (e: SmartEvent<boolean>) => void;
};

const PickerItem: FC<Props> = ({
  title,
  subTitle,
  iconSource,
  width = '686rpx',
  height = '140rpx',
  subIconSource,
  isShowRightArrow = true,
  isDiySubTitle,
  isLeftSubTitle,
  innerContainerStyle,
  outerContainerStyle,
  titleStyle,
  subTitleStyle,
  openTitle,
  closeTitle,
  openCodeStr,
  closeCodeStr,
  switchState,
  tipsText,
  onClick,
  onChangeSwitch,
}) => {
  return (
    <TouchableOpacity
      onClick={onClick}
      className={styles.outerContainerStyle}
      style={outerContainerStyle}
      isShowHover={!!onClick}
    >
      <View
        className={clsx(styles.container)}
        style={{ width, minHeight: height, ...innerContainerStyle }}
      >
        <View className={styles.leftContainer}>
          {iconSource && <Image src={iconSource} className={styles.icon} />}
          <View className={clsx(styles.title)} style={titleStyle}>
            {title}
          </View>
          {subTitle && isLeftSubTitle && (
            <Text className={styles.subTitle} style={subTitleStyle}>
              {subTitle}
            </Text>
          )}
        </View>
        <View className={styles.rightContainer}>
          {subIconSource && <Image src={subIconSource} className={styles.icon} />}
          {subTitle && !isDiySubTitle && !isLeftSubTitle && (
            <Text className={styles.rightSubTitle}>{subTitle}</Text>
          )}
          {subTitle && isDiySubTitle && !isLeftSubTitle && (
            <View className={styles.diyBox}>
              <Text className={styles.subTitle} style={{ color: '#00B39E' }}>
                {subTitle}
              </Text>
            </View>
          )}
          {isShowRightArrow && <Image src={imgRightArrow} className={styles.rightArrow} />}
          {onChangeSwitch && (
            <View>
              <Switch
                checked={switchState}
                size="22px"
                activeColor={themeColor}
                onChange={onChangeSwitch}
              />
            </View>
          )}
        </View>
      </View>
      <View className={styles.bottomContent}>
        {openTitle && (
          <View
            className={clsx(styles.container)}
            style={{
              width: '622rpx',
              height: '112rpx',
              backgroundColor: '#F8F8F8',
              marginBottom: '12px',
              ...innerContainerStyle,
            }}
          >
            <View className={styles.leftContainer}>
              <Text className={clsx(styles.title)} style={titleStyle}>
                {openTitle}
              </Text>
            </View>
            <View className={styles.rightContainer}>
              <View className={styles.diyBox}>
                <Text className={styles.subTitle} style={{ color: '#00B39E' }}>
                  {openCodeStr}
                </Text>
              </View>
            </View>
          </View>
        )}
        {closeTitle && (
          <View
            className={clsx(styles.container)}
            style={{
              width: '622rpx',
              height: '112rpx',
              backgroundColor: '#F8F8F8',
              marginBottom: '34rpx',
              ...innerContainerStyle,
            }}
          >
            <View className={styles.leftContainer}>
              <Text className={clsx(styles.title)} style={titleStyle}>
                {closeTitle}
              </Text>
            </View>
            <View className={styles.rightContainer}>
              <View className={styles.diyBox}>
                <Text className={styles.subTitle} style={{ color: '#00B39E' }}>
                  {closeCodeStr}
                </Text>
              </View>
            </View>
          </View>
        )}
        {tipsText && (
          <View className={styles.tipsBox}>
            <Icon name={iconWarning} size="30rpx" color="#FFA000" />
            <Text className={styles.tipsText}>{tipsText}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PickerItem;
