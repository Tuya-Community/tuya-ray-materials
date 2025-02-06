import React, { useCallback } from 'react';
import { router, ScrollView, View } from '@ray-js/ray';
import { NavBar } from '@/components';
import clsx from 'clsx';
import { getStatusBarHeight, rpx2pxNum } from '@/utils';
import Styles from './index.module.less';

interface LayoutProps {
  title: string;
  children?: React.ReactNode;
  showBack?: boolean;
}

export default function Layout(props: LayoutProps) {
  const top = getStatusBarHeight() + rpx2pxNum(88); // 状态栏 + 标题栏高度

  const back = useCallback(() => {
    router.back();
  }, []);

  return (
    <View className={Styles.app}>
      <View className={clsx(Styles.appMain, Styles.mainBg)}>
        <View className={Styles.view}>
          <NavBar leftArrow={!!props.showBack} title={props.title} onClickLeft={back} />
          <ScrollView
            refresherTriggered={false}
            refresherEnabled={false}
            scrollY
            refresherBackground="var(--app-M4)"
            style={{ top: `${top}px` }}
            className={Styles.scrollView}
            id="scrollView"
          >
            {props.children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
