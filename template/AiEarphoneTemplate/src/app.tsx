import React, { useEffect } from 'react';
import 'ray';
import { exitMiniProgram } from '@ray-js/ray';
import { Provider } from 'react-redux';
import DelayedHooksContainer from '@/components/DelayedHooksContainer';
import '@/icon/iconfont.css';
import '@/global.less';
import { applyCdnImageVars } from '@/utils/cdnImageVars';
import { tttOperateRecordingFloat } from '@/api/ttt';
import store from './redux';
import { useAppReShow } from './hooks/useAppReShow';
import { useAppInitialization } from './hooks/useAppInitialization';
import { usePageReady } from './hooks/usePageReady';
import {
  getCredentialListByCatalogCode,
  getSubscriptionPackages,
} from './redux/modules/shopInfoSlice';
import { useSystemInfo } from './hooks/useSystemInfo';

/**
 * 设备面板 App 壳：initDevInfo 完成后再渲染 children，不使用 View 包裹 children
 */
const App = ({ children }) => {
  const { initialized } = useAppInitialization();
  useSystemInfo();

  const isPageReady = usePageReady();

  useEffect(() => {
    applyCdnImageVars();
  }, []);

  useEffect(() => {
    // 小程序关闭时，调用ttt关闭app悬浮组件
    // @ts-ignore
    ty.onAppClose(() => {
      // 关闭小程序时，打开app录音悬浮窗
      tttOperateRecordingFloat({ isVisible: true });
      exitMiniProgram();
    });
  }, []);

  // 应用初始化时获取订阅套餐
  useEffect(() => {
    store.dispatch(getSubscriptionPackages());
  }, []);

  // 应用重新显示时获取凭证列表和订阅套餐
  useAppReShow(() => {
    store.dispatch(getCredentialListByCatalogCode());
  });

  return (
    <Provider store={store}>
      {initialized ? children : null}
      {/* 延迟加载的应用级别 hooks，等待页面加载完成后再执行 */}
      {initialized && isPageReady && <DelayedHooksContainer />}
    </Provider>
  );
};

export default App;
