import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, exitMiniProgram, router, usePageEvent } from '@ray-js/ray';
import { Dialog, NavBar, Toast } from '@ray-js/smart-ui';
import { useDevice } from '@ray-js/panel-sdk';
import { getFitBleKeyList } from '@ray-js/lock-sdk';
import Strings from '@/i18n';
import useUserPermission from '@/hooks/useUserPermission';
import { HomeTopView } from './homeTopView';
import { HomeMiddleView } from './homeMiddleView';
import { HomeBottomView } from './homeBottomView';
import styles from './index.module.less';

export function Home() {
  const devInfo = useDevice(d => d.devInfo);
  const { loaded, isManager, isShare } = useUserPermission();
  const [showBleKeyDialog, setShowBleKeyDialog] = useState(false);
  const checkingBleKeyRef = useRef(false);
  const dialogVisibleRef = useRef(false);

  const supportsBleKey = (devInfo?.schema || []).some(
    (item: { code?: string }) => item.code === 'bluetooth_unlock_kit'
  );

  /**
   * 支持蓝牙钥匙的配件，仅管理员且非分享用户在无有效钥匙时显示引导弹框。
   */
  const checkBleKeyList = useCallback(async () => {
    if (
      !loaded ||
      !supportsBleKey ||
      !isManager ||
      isShare ||
      checkingBleKeyRef.current ||
      dialogVisibleRef.current
    ) {
      return;
    }

    checkingBleKeyRef.current = true;
    try {
      const list = await getFitBleKeyList();
      if (!list?.length) {
        dialogVisibleRef.current = true;
        setShowBleKeyDialog(true);
      }
    } catch (error) {
      // 查询失败不阻断首页使用；下次页面重新显示时会再次检查。
      console.log('=== getFitBleKeyList error', error);
    } finally {
      checkingBleKeyRef.current = false;
    }
  }, [loaded, supportsBleKey, isManager, isShare]);

  // 首次进入时 onShow 可能早于当前用户加载完成，因此权限就绪后再补查一次。
  useEffect(() => {
    checkBleKeyList();
  }, [checkBleKeyList]);

  // 页面重新展示时检查蓝牙钥匙。
  usePageEvent('onShow', () => {
    checkBleKeyList();
  });

  const closeBleKeyDialog = useCallback(() => {
    dialogVisibleRef.current = false;
    setShowBleKeyDialog(false);
  }, []);

  const handleBleKeyCancel = useCallback(() => {
    closeBleKeyDialog();
    // 取消引导时关闭当前配件面板。
    exitMiniProgram({
      fail: () => router.back(),
    });
  }, [closeBleKeyDialog]);

  const handleBleKeyConfirm = useCallback(() => {
    closeBleKeyDialog();
    router.replace('/openMode?fromBleKeyGuide=1');
  }, [closeBleKeyDialog]);

  return (
    <View className={styles.page}>
      <NavBar
        border={false}
        leftText={devInfo?.name || 'Bluetooth Accessory'}
        leftTextType="home"
      />
      <HomeTopView />
      <HomeMiddleView />
      <HomeBottomView />
      <Dialog
        show={showBleKeyDialog}
        title={Strings.getLang('pleaseAddBleUnlock')}
        message={Strings.getLang('pleaseAddBleUnlockSub')}
        messageAlign="center"
        showCancelButton
        cancelButtonText={Strings.getLang('cancel')}
        confirmButtonText={Strings.getLang('toAddBleUnlock')}
        closeOnClickOverlay={false}
        onClose={closeBleKeyDialog}
        onCancel={handleBleKeyCancel}
        onConfirm={handleBleKeyConfirm}
      />
      <Toast id="smart-toast" />
    </View>
  );
}

export default Home;
