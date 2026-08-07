/*
 * @Author: hkc
 * @Date: 2025-11-21 14:54:13
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-03 18:54:59
 * @Description: 文件批量处理页面
 */
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, usePageEvent, hideMenuButton, showToast, Text, Button } from '@ray-js/ray';
import { Dialog } from '@ray-js/smart-ui';
import clsx from 'clsx';

import { TopBar } from '@/components';
import { useSelector } from '@/redux';
import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { formatDurationHoursMinutes } from '@/utils/time';
import { tttGetFileMergeStatus } from '@/api/ttt';
import { useAppFloatCtrl } from '@/hooks/useAppFloatCtrl';
import MergeRecordModal from '@/pages/home/mergeRecord';
import FileRecycleList from '@/pages/home/component/FileRecycleList';

import styles from './index.module.less';

const Index = () => {
  const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showCannotMergeDialog, setShowCannotMergeDialog] = useState(false);
  const { useWindowHeight, topBarHeight } = useSelector(state => state.systemInfo);
  const fileRecycleListRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const fileList = useSelector(state => state.audioFile.fileList);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const bottomActionsHeight = 75; // 底部操作栏高度（px）

  useAppFloatCtrl(true);
  usePageEvent('onReady', () => {
    hideMenuButton();
  });
  // 设备面板：可能错过宿主 onReady，挂载后兜底隐藏菜单按钮
  useEffect(() => {
    hideMenuButton();
  }, []);

  // 计算选中文件的总时长（单位：毫秒）
  const totalDuration = useMemo(() => {
    if (!selectedRecordIds?.length || !fileList?.length) return 0;
    return selectedRecordIds.reduce((total, recordTransferId) => {
      const file = fileList.find(f => f.recordTransferId === recordTransferId);
      return total + (file?.duration || 0);
    }, 0);
  }, [selectedRecordIds, fileList]);

  // 判断合并按钮是否可用
  const isMergeDisabled = useMemo(() => {
    const count = selectedRecordIds?.length || 0;
    const maxDuration = 5 * 60 * 60 * 1000; // 5小时，单位：毫秒

    return count < 2 || count > 10 || totalDuration > maxDuration;
  }, [selectedRecordIds?.length, totalDuration]);

  // 格式化总时长为"X小时Y分钟"格式
  const formattedDuration = useMemo(() => {
    return formatDurationHoursMinutes(totalDuration);
  }, [totalDuration]);

  // 判断总时长是否超过5小时
  const isDurationExceeded = useMemo(() => {
    const maxDuration = 5 * 60 * 60 * 1000; // 5小时，单位：毫秒
    return totalDuration > maxDuration;
  }, [totalDuration]);

  // 获取选中文件中不支持合并的对话类文件（recordType 2 或 3）
  const unsupportedFiles = useMemo(() => {
    if (!selectedRecordIds?.length || !fileList?.length) return [];
    return selectedRecordIds.reduce<typeof fileList>((acc, recordTransferId) => {
      const file = fileList.find(f => f.recordTransferId === recordTransferId);
      if (file && (file.recordType === 2 || file.recordType === 3)) {
        acc.push(file);
      }
      return acc;
    }, []);
  }, [selectedRecordIds, fileList]);

  // 处理合并按钮点击
  const handleMerge = () => {
    const count = selectedRecordIds?.length || 0;
    const maxDuration = 5 * 60 * 60 * 1000; // 5小时，单位：毫秒

    if (count < 2) {
      showToast({
        title: Strings.getLang('merge_min_files_tip'),
        icon: 'none',
      });
      return;
    }

    if (count > 10) {
      showToast({
        title: Strings.getLang('merge_max_files_tip'),
        icon: 'none',
      });
      return;
    }

    if (totalDuration > maxDuration) {
      showToast({
        title: Strings.getLang('merge_max_duration_tip'),
        icon: 'none',
      });
      return;
    }

    // 存在对话类/通话翻译文件（recordType 2 或 3），不允许合并
    if (unsupportedFiles.length > 0) {
      setShowCannotMergeDialog(true);
      return;
    }
    // 查询是否有正在进行中的合并任务
    tttGetFileMergeStatus()
      .then(response => {
        if (!isMountedRef.current) return; // 组件已卸载，不再更新状态
        if (response?.status === 1) {
          // 上一个合并任务还在进行中，拦截并提示
          showToast({
            title: Strings.getLang('merge_task_in_progress'),
            icon: 'none',
          });
          return;
        }
        // 无进行中任务，显示合并录音弹窗
        setShowMergeModal(true);
      })
      .catch(() => {
        if (!isMountedRef.current) return; // 组件已卸载，不再更新状态
        // 查询失败视为无进行中任务，直接显示合并弹窗
        setShowMergeModal(true);
      });
  };

  // 移除对话类不支持合并的文件
  const handleRemoveUnsupportedFiles = () => {
    const unsupportedIds = unsupportedFiles.map(f => f.recordTransferId);
    setSelectedRecordIds(prev => prev.filter(id => !unsupportedIds.includes(id)));
    setShowCannotMergeDialog(false);
  };

  return (
    <View className={styles.container}>
      <TopBar
        title={
          selectedRecordIds?.length > 0
            ? Strings.formatValue('title_select_count', selectedRecordIds?.length)
            : Strings.getLang('title_batch_file')
        }
      />
      <FileRecycleList
        ref={fileRecycleListRef}
        overScanCount={15}
        scrollThrottleTime={200}
        scrollHeight={useWindowHeight - topBarHeight - bottomActionsHeight}
        isBatchMode
        selectedRecordIds={selectedRecordIds}
        setSelectedRecordIds={setSelectedRecordIds}
      />

      {selectedRecordIds?.length > 0 && !fileRecycleListRef?.current?.hasDeleteFiles && (
        <View className={styles.selectionInfo}>
          <Text className={styles.infoText}>
            {Strings.formatValue('merge_selected_info', selectedRecordIds.length)}
            <Text
              className={clsx(styles.durationText, {
                [styles.durationExceeded]: isDurationExceeded,
              })}
            >
              {formattedDuration}
            </Text>
          </Text>
        </View>
      )}
      <View className={styles.bottomActions}>
        <View
          className={clsx(styles.merge, {
            [styles.disabled]: isMergeDisabled,
          })}
          onClick={handleMerge}
        >
          <View className={styles.inner}>
            <ThemedImage
              imageName="mergeFileImg"
              src={Res.mergeFileImg}
              className={styles.mergeIcon}
            />
            <View>{Strings.getLang('merge')}</View>
          </View>
        </View>
        <View
          className={clsx(styles.delete, {
            [styles.disabled]: !selectedRecordIds?.length,
          })}
          onClick={() => {
            if (selectedRecordIds?.length) {
              fileRecycleListRef.current?.setShowDeleteDialog(true);
            }
          }}
        >
          <View className={styles.inner}>
            <ThemedImage imageName="imgTrash" src={Res.imgTrash} className={styles.deleteIcon} />
            <View>{Strings.getLang('delete')}</View>
          </View>
        </View>
      </View>
      {/* 无法合并弹窗 */}
      <Dialog
        useSlot
        show={showCannotMergeDialog}
        customClass={styles.cannotMergeDialog}
        showConfirmButton={false}
      >
        <View className={styles.cannotMergeContent}>
          <View className={styles.cannotMergeTitle}>{Strings.getLang('cannot_merge_title')}</View>
          <View className={styles.cannotMergeDesc}>{Strings.getLang('cannot_merge_desc')}</View>
          <View className={styles.cannotMergeFileList}>
            {unsupportedFiles.map(file => (
              <View key={file.recordTransferId} className={styles.cannotMergeFileItem}>
                {file.name}
              </View>
            ))}
          </View>
        </View>
        <View className={styles.cannotMergeButtons}>
          <Button
            onClick={() => setShowCannotMergeDialog(false)}
            className={styles.cannotMergeCancel}
          >
            {Strings.getLang('cannot_merge_back')}
          </Button>
          <View className={styles.cannotMergeDivider} />
          <Button onClick={handleRemoveUnsupportedFiles} className={styles.cannotMergeConfirm}>
            {Strings.getLang('cannot_merge_remove')}
          </Button>
        </View>
      </Dialog>
      {showMergeModal && (
        <MergeRecordModal
          show={showMergeModal}
          onClose={() => setShowMergeModal(false)}
          selectedRecordIds={selectedRecordIds}
        />
      )}
    </View>
  );
};

export default Index;
