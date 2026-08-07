/*
 * @Author: hkc
 * @Date: 2025-10-13 19:14:49
 * @LastEditors: xuzhe
 * @LastEditTime: 2026-05-19 12:00:00
 * @Description: 云同步页面
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, showToast } from '@ray-js/ray';
import { Dialog, DialogInstance, Icon, Loading, Switch } from '@ray-js/smart-ui';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import rightIcon from '@tuya-miniapp/icons/dist/svg/Right';

import { TopBar } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { toggleCloudSync } from '@/api/common';
import { tttGetAudioFilesSize, tttRemoveFiles } from '@/api/ttt';
import { useSelector } from '@/redux';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';

import styles from './index.module.less';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
};

const Index = () => {
  const { cloudSyncSwitchStatus } = useSelector(state => state.uiState);
  const [syncStatus, setSyncStatus] = useState(false);
  const [onlyWifiStatus, setOnlyWifiStatus] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<number>();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearing, setClearing] = useState(false);
  useAppFloatCtrl(true);

  const introList = useMemo(
    () => [
      {
        id: 1,
        title: Strings.getLang('cloud_intro_1'),
      },
      {
        id: 2,
        title: Strings.getLang('cloud_intro_2'),
      },
    ],
    []
  );

  // 获取音频文件总占用空间
  const {
    data: audioFilesSize,
    run: fetchAudioFilesSize,
    mutate: mutateAudioFilesSize,
  } = useRequest(tttGetAudioFilesSize, {
    manual: true,
  });

  // 切换云同步状态接口
  const { runAsync: runToggleCloudSync } = useRequest(toggleCloudSync, {
    manual: true,
  });

  // 切换云同步状态
  const handleSyncStatusChange = event => {
    if (!event.detail) {
      DialogInstance.confirm({
        selector: '#cloud-sync-close-dialog',
        title: Strings.getLang('cloud_close_title'),
        message: Strings.getLang('cloud_close_tip'),
        confirmButtonText: Strings.getLang('confirm'),
        cancelButtonText: Strings.getLang('cancel'),
      }).then(() => {
        runToggleCloudSync({
          enabled: event.detail,
          syncType: onlyWifiStatus ? 'wifi' : 'all',
        }).then(() => {
          setSyncStatus(event.detail);
        });
      });
    } else {
      runToggleCloudSync({
        enabled: event.detail,
        syncType: 'wifi',
      }).then(() => {
        setSyncStatus(event.detail);
      });
    }
  };

  // 切换仅在Wi-Fi下同步状态
  const handleWifiStatusChange = event => {
    runToggleCloudSync({
      enabled: syncStatus,
      syncType: event.detail ? 'wifi' : 'all',
    }).then(() => {
      setOnlyWifiStatus(event.detail);
    });
  };

  // 确认清空本地音频
  const handleClearConfirm = useCallback(async () => {
    const sizeBeforeClear = audioFilesSize || 0;
    setClearing(true);
    try {
      await tttRemoveFiles({ fileIds: [], isDeleteAll: false });
      setShowClearDialog(false);
      mutateAudioFilesSize(0);
      showToast({
        title: Strings.formatValue('clear_local_cache_success', formatFileSize(sizeBeforeClear)),
        icon: 'success',
      });
    } catch {
      showToast({
        title: Strings.getLang('clear_local_cache_fail'),
        icon: 'error',
      });
    } finally {
      setClearing(false);
    }
  }, [audioFilesSize, mutateAudioFilesSize]);

  useEffect(() => {
    if (cloudSyncSwitchStatus) {
      setSyncStatus(cloudSyncSwitchStatus?.enabled);
      setOnlyWifiStatus(cloudSyncSwitchStatus?.syncType === 1);
      setLastSyncTime(cloudSyncSwitchStatus?.modifyTime);
    }
  }, [cloudSyncSwitchStatus?.enabled]);

  useEffect(() => {
    fetchAudioFilesSize();
  }, []);

  return (
    <View className={styles.container}>
      <TopBar title={Strings.getLang('cloud_sync')} />
      <View className={styles.inner}>
        <View className={styles.header}>
          <ThemedImage imageName="cloudBannerImg" src={Res.cloudBannerImg} className={styles.img} />
          <View className={styles.title}>{Strings.getLang('cloud_sync')}</View>
        </View>
        <View className={styles.content}>
          <View className={styles.desc}>{Strings.getLang('cloud_desc')}</View>
          {introList.map(item => (
            <View className={styles.intro} key={item.id}>
              {item.title}
            </View>
          ))}
          <View className={styles.divider} />
          <View className={styles.card}>
            <View className={styles.cardContent}>
              <View className={styles.cardTitle}>{Strings.getLang('cloud_sync_title')}</View>
              {lastSyncTime > 0 && (
                <View className={styles.cardSubTitle}>
                  {Strings.getLang('cloud_last_sync')}：
                  {dayjs(lastSyncTime).format('YYYY-MM-DD HH:mm')}
                </View>
              )}
            </View>
            <Switch checked={syncStatus} onChange={handleSyncStatusChange} />
          </View>
          {syncStatus && (
            <View className={styles.card}>
              <View className={styles.cardContent}>
                <View className={styles.cardTitle}>{Strings.getLang('cloud_only_wifi')}</View>
              </View>
              <Switch checked={onlyWifiStatus} onChange={handleWifiStatusChange} />
            </View>
          )}
          <View
            className={styles.card}
            onClick={() => {
              if (!clearing) setShowClearDialog(true);
            }}
          >
            <View className={styles.cardContent}>
              <View className={styles.cardTitle}>{Strings.getLang('clear_local_cache')}</View>
              <View className={styles.cardSubTitle}>
                {Strings.getLang('clear_local_cache_desc')}
              </View>
            </View>
            <View className={styles.cacheSize}>
              {clearing ? <Loading size={20} /> : formatFileSize(audioFilesSize || 0)}
              <Icon
                name={rightIcon}
                size={16}
                color="var(--color-arrow)"
                className={styles.iconRight}
              />
            </View>
          </View>
        </View>
      </View>
      <Dialog id="cloud-sync-close-dialog" />
      {/* 清空本地音频确认弹窗 */}
      <Dialog
        useSlot
        show={showClearDialog}
        customClass={styles.clearDialog}
        showConfirmButton={false}
      >
        <View className={styles.clearDialogContent}>
          <View className={styles.clearDialogTitle}>
            {Strings.getLang('clear_local_cache_dialog_title')}
          </View>
          <View className={styles.clearDialogDesc}>
            {Strings.formatValue(
              'clear_local_cache_dialog_desc',
              formatFileSize(audioFilesSize || 0)
            )}
          </View>
        </View>
        <View className={styles.clearDialogButtons}>
          <View className={styles.clearDialogCancel} onClick={() => setShowClearDialog(false)}>
            {Strings.getLang('cancel')}
          </View>
          <View className={styles.clearDialogDivider} />
          <View className={styles.clearDialogConfirm} onClick={handleClearConfirm}>
            {Strings.getLang('clear_local_cache_confirm')}
          </View>
        </View>
      </Dialog>
    </View>
  );
};

export default Index;
