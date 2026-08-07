/*
 * @Author: hkc
 * @Date: 2025-09-19 20:24:37
 * @LastEditors: hkc
 * @LastEditTime: 2026-04-22 14:24:38
 * @Description: 商城
 */
import React, { useEffect } from 'react';
import {
  ScrollView,
  usePageEvent,
  View,
  router,
  hideMenuButton,
  getLaunchOptionsSync,
  exitMiniProgram,
} from '@ray-js/ray';
import { useDispatch } from 'react-redux';

import { TopBar } from '@/components';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import {
  getAccountBenefits,
  getAllVasMallData,
} from '@/redux/modules/shopInfoSlice';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import TimePackage from './components/TimePackage';
import SubscribedPackage from './components/SubscribedPackage';
import ActivatedService from './components/ActivatedService';
import styles from './index.module.less';

const Index = () => {
  const querys = getLaunchOptionsSync()?.query || {};
  const fromApp = querys.fromApp || ''; // 是否由其他小程序跳转进入
  const {
    safeArea: { bottom },
    topBarHeight,
  } = useSelector(state => state.systemInfo);
  const { homeId } = useSelector(state => state.devInfo);
  const dispatch = useDispatch();
  useAppFloatCtrl(true);
  useEffect(() => {
    hideMenuButton();
  }, []);

  usePageEvent('onShow', () => {
    // getAllVasMallData 内已含 credentialList，勿再并行 dispatch 凭证接口，否则会用旧 state 覆盖 spuList
    dispatch(getAllVasMallData({ isSupportRealtime: true }));
    if (homeId) {
      dispatch(getAccountBenefits(homeId));
    }
  });

  const handleBack = () => {
    if (fromApp) {
      exitMiniProgram();
      return;
    }

    router.back();
  };
  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('shop_title')} isDark onBack={handleBack} />
      <ScrollView
        className={styles.scrollView}
        scrollY
        style={{ height: `${bottom - topBarHeight}px` }}
      >
        {/* 激活的权益 */}
        <ActivatedService />
        {/* 订阅包 */}
        <SubscribedPackage />
        {/* 流量包 */}
        <TimePackage />
      </ScrollView>
    </View>
  );
};

export default Index;
