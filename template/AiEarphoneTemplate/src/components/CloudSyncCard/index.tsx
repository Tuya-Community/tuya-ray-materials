/*
 * @Author: hkc
 * @Date: 2025-10-15 17:15:49
 * @LastEditors: hkc
 * @LastEditTime: 2026-03-10 11:37:43
 * @Description: 云同步状态卡片
 */
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, router } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import dayjs from 'dayjs';

import { CloudSyncStatus } from '@/constant/enums';
import Res from '@/res';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import clsx from 'clsx';
import ThemedImage from '@/components/ThemedImage';

import styles from './index.module.less';

interface IProps {
  className?: string;
}

const syncIconMap = {
  [CloudSyncStatus.Disabled]: Res.syncCloseIcon,
  [CloudSyncStatus.Success]: Res.syncOpenIcon,
  [CloudSyncStatus.Syncing]: Res.syncingIcon,
  [CloudSyncStatus.Failed]: Res.syncFailedIcon,
};

const syncTitleMap = {
  [CloudSyncStatus.Disabled]: Strings.getLang('cloud_disabled'),
  [CloudSyncStatus.Success]: Strings.getLang('cloud_synced'),
  [CloudSyncStatus.Syncing]: Strings.getLang('cloud_syncing'),
  [CloudSyncStatus.Failed]: Strings.getLang('cloud_failed'),
};

const Index: React.FC<IProps> = ({ className }) => {
  const [lastSyncTime, setLastSyncTime] = useState<number>();
  const { cloudSyncSwitchStatus, cloudSyncStatus } = useSelector(state => state.uiState);

  // 同步暂停：云同步开启 + 仅 Wi-Fi 同步开启 + 当前为同步失败
  const isPaused = useMemo(
    () =>
      !!cloudSyncSwitchStatus?.enabled &&
      cloudSyncSwitchStatus?.syncType === 1 &&
      cloudSyncStatus?.status === CloudSyncStatus.Failed,
    [cloudSyncSwitchStatus, cloudSyncStatus]
  );

  // 同步标题文案
  const syncTitleText = useMemo(() => {
    if (isPaused) return Strings.getLang('cloud_paused');
    return Strings.getLang(syncTitleMap[cloudSyncStatus?.status]);
  }, [isPaused, cloudSyncStatus]);

  // 同步提示文案
  const syncTipText = useMemo(() => {
    if (!cloudSyncStatus) return '';
    const { status, errorCode } = cloudSyncStatus;
    switch (status) {
      case CloudSyncStatus.Disabled:
        return Strings.getLang('cloud_disabled_tip');
      case CloudSyncStatus.Success:
        return (
          lastSyncTime > 0 &&
          `${Strings.getLang('cloud_last_sync')}: ${dayjs(lastSyncTime).format('YYYY-MM-DD HH:mm')}`
        );
      case CloudSyncStatus.Syncing:
        return '';
      case CloudSyncStatus.Failed:
        return errorCode ? Strings[`cloud_code_${errorCode}`] : '';
      default:
        return '';
    }
  }, [cloudSyncStatus, lastSyncTime]);

  // 云同步开关状态变更时，更新状态
  useEffect(() => {
    setLastSyncTime(cloudSyncSwitchStatus?.modifyTime);
  }, [cloudSyncSwitchStatus]);

  const goCloudSetting = () => {
    router.push('/cloud', { subpackage: 'pkgSettings' });
  };

  return (
    <View className={clsx(styles.container, className)} id="home-cloud-sync-card">
      <View className={styles.inner}>
        <ThemedImage
          src={syncIconMap[cloudSyncStatus?.status]}
          className={styles.syncIcon}
          imageName={
            cloudSyncStatus?.status === CloudSyncStatus.Disabled
              ? 'syncCloseIcon'
              : cloudSyncStatus?.status === CloudSyncStatus.Success
              ? 'syncOpenIcon'
              : cloudSyncStatus?.status === CloudSyncStatus.Syncing
              ? 'syncingIcon'
              : 'syncFailedIcon'
          }
        />
        <View className={styles.content}>
          <View className={styles.main}>
            <View className={styles.title}>{syncTitleText}</View>
            <View className={styles.tip}>
              {syncTipText}
              {isPaused && (
                <Text className={styles.goSetting} onClick={goCloudSetting}>
                  {Strings.getLang('cloud_go_setting')}
                </Text>
              )}
            </View>
          </View>
          {cloudSyncStatus?.status === CloudSyncStatus.Disabled && (
            <Button
              customClass={styles.open}
              onClick={() => {
                router.push('/cloud', { subpackage: 'pkgSettings' });
              }}
            >
              {Strings.getLang('open')}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default Index;
