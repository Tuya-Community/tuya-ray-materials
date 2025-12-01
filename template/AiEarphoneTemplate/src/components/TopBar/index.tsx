import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, router, setNavigationBarBack, showToast } from '@ray-js/ray';
import { TouchableOpacity } from '@/components';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { selectfileSync } from '@/redux/modules/fileSyncSlice';
import Strings from '@/i18n';
import { Icon } from '@ray-js/icons';
// @ts-ignore
import styles from './index.module.less';

interface Props {
  title?: string;
  type?: 'custom' | 'system' | undefined; // 是否需要阻止回退，type为custom时，点击返回按钮不执行onBack回调
  onBack?: () => void;
  isDark?: boolean;
  renderTitle?: () => React.ReactNode;
  renderRight?: () => React.ReactNode;
}

const TopBar: FC<Props> = ({ title, type, onBack, isDark, renderRight, renderTitle }) => {
  const isSyncing = useSelector(selectfileSync);
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  useEffect(() => {
    const backType = isSyncing ? 'custom' : type || 'system';
    setNavigationBarBack({ type: backType });
  }, [isSyncing]);

  const handleBack = () => {
    if (isSyncing) {
      showToast({ title: Strings.getLang('asyncing_no_stop'), icon: 'loading' });
      return;
    }
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className={styles.topBarWrap}>
      <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={styles.topBar}>
        <TouchableOpacity className={styles.btn} onClick={handleBack}>
          <Icon type="icon-left" size={30} color={isDark ? '#dcdcdc' : '#333'} />
        </TouchableOpacity>
        {renderTitle ? (
          renderTitle()
        ) : (
          <Text
            className={styles.title}
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#19191b' }}
          >
            {title || ''}
          </Text>
        )}
        {renderRight && renderRight() ? (
          renderRight()
        ) : (
          <Text className="iconfontpanel icon-panel-arrowLeft" style={{ opacity: 0 }} />
        )}
      </View>
    </View>
  );
};

export default React.memo(TopBar);
