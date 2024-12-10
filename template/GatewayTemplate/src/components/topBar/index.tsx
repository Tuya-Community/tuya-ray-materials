import React, { FC, useMemo, useEffect } from 'react';
import { Text, View, Icon, navigateBack, platform, exitMiniProgram } from '@ray-js/ray';
import clsx from 'clsx';
import { hooks } from '@ray-js/panel-sdk';
import { DevInfo } from '@/types';

import styles from './index.module.less';

type Props = {
  title?: string;
};
const { useDevInfo } = hooks;

const TopBar: FC<Props> = ({ title }) => {
  const { safeArea } = useMemo(() => ty.getSystemInfoSync(), []);
  const devInfo = useDevInfo() || ({} as DevInfo);

  useEffect(() => {
    ty.hideMenuButton();
    ty.hideHomeButton();
  }, []);

  const handleBack = () => {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      navigateBack();
      return;
    }
    if (platform.isTuya) {
      exitMiniProgram();
    } else {
      navigateBack();
    }
  };

  return (
    <View className={clsx(styles.topBar)} style={{ marginTop: `${safeArea?.top ?? 48}px` }}>
      <View onClick={handleBack}>
        <Icon size={25} type="icon-left" />
      </View>
      <Text className={styles.title}>{title ?? devInfo.name}</Text>
      {/* 占位，只是为了设置在中间。。 */}
      <View />
    </View>
  );
};

export default TopBar;
