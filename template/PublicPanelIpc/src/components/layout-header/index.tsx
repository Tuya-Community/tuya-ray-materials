import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';

import clsx from 'clsx';
import { IconFont } from '../icon-font';
import Styles from './index.module.less';

interface IProps {
  title?: string;
  onLeftClick?: () => void;
  style?: React.CSSProperties;
  titlePosition?: 'left' | 'center';
  titleStyle?: string;
}

export const LayoutHeader: React.FC<IProps> = (props: IProps) => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const devInfo = useDevice(device => device.devInfo);
  const { title, onLeftClick, titleStyle } = props;

  return (
    <View className={clsx(Styles.comContainer)} style={{ ...props.style }}>
      <View className={Styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View
        className={clsx(Styles.topBar, {
          [Styles.topBarTitleLeft]: props.titlePosition === 'left',
        })}
        style={{
          ...(props.titlePosition === 'left' && { justifyContent: 'flex-start' }),
        }}
      >
        {onLeftClick && (
          <View className={clsx(Styles.leftBack)} onClick={onLeftClick}>
            <IconFont icon="left-arrow" otherClassName={clsx(Styles.leftArrow)} />
          </View>
        )}

        <Text className={clsx(Styles.title, titleStyle)}>{title || devInfo.name || ''}</Text>
      </View>
    </View>
  );
};

LayoutHeader.defaultProps = {
  titlePosition: 'center',
};
