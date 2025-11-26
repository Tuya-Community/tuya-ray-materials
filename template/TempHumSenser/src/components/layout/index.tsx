import React, { useCallback } from 'react';
import { router, ScrollView, Text, View } from '@ray-js/ray';
import { IconFont } from '@/components';
import clsx from 'clsx';
import { useAppConfig } from '@/hooks/useAppConfig';
import { NavBar } from '@ray-js/smart-ui';
import { getStatusBarHeight, rpx2pxNum } from '@/utils';
import Styles from './index.module.less';
import topImage from './res/top.png';

interface LayoutProps {
  title: string;
  children?: React.ReactNode;
  showBack?: boolean;
}

export function Layout(props: LayoutProps) {
  const { primaryColor } = useAppConfig();

  const back = useCallback(() => {
    router.back();
  }, []);

  return (
    <View
      className={clsx(Styles.appMain)}
      style={{
        backgroundImage: `url(${topImage}), linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor}99 790rpx, #EEF1F5 1062rpx)`,
      }}
    >
      <NavBar
        leftArrow={props.showBack}
        title={props.title}
        fixed
        border={false}
        customClass={Styles.navBar}
        onClickLeft={back}
        placeholder
      />
      <ScrollView
        refresherTriggered={false}
        refresherEnabled={false}
        scrollY
        refresherBackground={primaryColor}
        className={Styles.scrollView}
        id="scrollView"
      >
        {props.children}
      </ScrollView>
    </View>
  );
}

export default Layout;
