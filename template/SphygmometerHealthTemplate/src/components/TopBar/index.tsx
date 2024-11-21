import { ComponentProps, memo, ReactNode } from 'react';
import { useDevInfo } from '@ray-js/panel-sdk';
import { exitMiniProgram, openDeviceDetailPage, router, View } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { Icon as Svg } from '@ray-js/svg';
import clsx from 'clsx';

import icons from '@/icons';
import { getDevId } from '@/utils';
import styles from './index.module.less';

type Theme = 'light' | 'dark';

type NavBarProps = ComponentProps<typeof NavBar>;

interface Props extends NavBarProps {
  title?: string;
  theme?: Theme;
  root?: boolean;
  right?: ReactNode;
}

const gotoDetail = (theme: Theme) => (
  <View onClick={() => openDeviceDetailPage({ deviceId: getDevId() })}>
    <Svg color={theme === 'dark' ? '#fff' : '#000'} d={icons.edit} size="32rpx" />
  </View>
);

const back = (theme: Theme) => (
  <View onClick={() => router.back()}>
    <Svg color={theme === 'dark' ? '#fff' : '#000'} d={icons.back} size="32rpx" />
  </View>
);

const exit = (theme: Theme) => (
  <View onClick={() => exitMiniProgram()}>
    <Svg color={theme === 'dark' ? '#fff' : '#000'} d={icons.back} size="32rpx" />
  </View>
);

const TopBar = ({ title, theme = 'light', root = false, right, ...otherProps }: Props) => {
  const { name } = useDevInfo();

  const slot = { right: right ?? gotoDetail(theme), left: root ? exit(theme) : back(theme) };

  return (
    <View className={styles.container}>
      <NavBar
        fixed
        placeholder
        border={false}
        customClass={styles.topBar}
        slot={slot}
        title={title ?? name}
        titleClass={clsx(theme === 'dark' && styles.textWhite)}
        {...otherProps}
      />
    </View>
  );
};

export default memo(TopBar);
