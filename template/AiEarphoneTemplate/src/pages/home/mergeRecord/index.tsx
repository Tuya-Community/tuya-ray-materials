import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, router, showToast } from '@ray-js/ray';
import clsx from 'clsx';
import { Drag, DragItem } from '@ray-js/drag-list';
import dayjs from 'dayjs';

import CustomPopup from '@/components/CustomPopup';
import { useAppDispatch, useSelector } from '@/redux';
import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { formatMilliseconds, formatDurationHoursMinutes } from '@/utils/time';
import { FileListItem, updateRecordTransferResultList } from '@/redux/modules/audioFileSlice';
import { tttCancelMergeRecordList, tttMergeRecordList } from '@/api/ttt';
import type { FileMergeStatusEvent } from '@/api/ttt.interface';
import { getGlobalMergeStatusHandler } from '@/hooks/useFileMergeStatus';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';

import { Icon } from '@ray-js/smart-ui';
import { getMergeErrorMsg } from '@/utils/file';
import { EllipsisText } from '@/components';
import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  selectedRecordIds: number[];
}

interface IDragListItem {
  name: string;
  duration: number;
  recordTime: number;
  recordId: string;
}
const MergeRecordModal: React.FC<IProps> = ({ show, onClose, selectedRecordIds }) => {
  const dispatch = useAppDispatch();
  const { useWindowHeight } = useSelector(state => state.systemInfo);
  const fileList = useSelector(state => state.audioFile.fileList);
  const [dragList, setDragList] = useState<IDragListItem[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isMerging, setIsMerging] = useState(false); // 是否正在合并中
  const [mergeProgress, setMergeProgress] = useState(0); // 合并进度 0-100
  const [isMergeSuccess, setIsMergeSuccess] = useState(false); // 是否合并成功
  const [allFilesDownloaded, setAllFilesDownloaded] = useState(false); // 是否所有文件都已下载
  const [mergedRecordId, setMergedRecordId] = useState<string>(''); // 合并后的文件recordId
  const [loadingDotIndex, setLoadingDotIndex] = useState(0); // 加载动画图片索引 (0, 1, 2 对应 loadingDot1, loadingDot2, loadingDot3)
  const {
    safeArea: { height },
  } = useSelector(state => state.systemInfo);

  // 初始化文件列表
  useEffect(() => {
    if (isMerging || isMergeSuccess) {
      return;
    }
    if (selectedRecordIds.length > 0 && fileList.length > 0) {
      const files = selectedRecordIds
        .map(id => fileList.find(f => f.recordTransferId === id))
        .filter(Boolean) as FileListItem[];
      setDragList(
        files.map(item => {
          const { name, duration, recordTime, recordId } = item;
          return { name, duration, recordTime, recordId };
        })
      );
    }
  }, [selectedRecordIds, fileList, isMerging, isMergeSuccess]);

  // 计算总时长
  const totalDuration = useMemo(() => {
    return dragList.reduce((total, file) => total + (file.duration || 0), 0);
  }, [dragList]);

  // 格式化总时长
  const formattedDuration = useMemo(() => {
    return formatDurationHoursMinutes(totalDuration);
  }, [totalDuration]);

  // 处理开始合并
  const handleStartMerge = () => {
    try {
      setIsMerging(true);
      setMergeProgress(0);
      // 使用 recordId，如果没有则使用 recordTransferId 转换为字符串
      const recordIds = dragList.map(item => item.recordId);
      tttMergeRecordList({ recordIds });
    } catch (error) {
      console.error('handleStartMerge error', error);
      onClose();
    }
  };

  const handleFileMergeStatus = useCallback(
    (response: FileMergeStatusEvent) => {
      const { status, subStatus, progress, recordId } = response;

      if (status === 1) {
        // 执行中
        setIsMerging(true);
        if (subStatus === 10) {
          // 文件下载中，根据 progress 设置进度条，最多90%
          const progressValue = progress ? Math.min(progress, 90) : 0;
          setMergeProgress(progressValue);
        } else if (subStatus === 20) {
          // 文件合并中，进度条直接到90%
          setMergeProgress(90);
          setAllFilesDownloaded(true);
        }
      } else if (status === 2) {
        // 执行结束（合并完成）
        setIsMerging(false);
        setIsMergeSuccess(true);
        setMergeProgress(100);
        dispatch(updateRecordTransferResultList({ source: 'merge_record_success' }));
        if (recordId) {
          setMergedRecordId(recordId);
        }
      } else if (status === 3) {
        // 异常结束，根据错误码显示对应提示
        console.error('Merge failed, errorCode:', response.errorCode);
        setIsMerging(false);
        setIsMergeSuccess(false);
        setMergeProgress(0);
        showToast({
          title: getMergeErrorMsg(response.errorCode),
          icon: 'none',
        });
      }
    },
    [dispatch]
  );

  // 处理取消合并
  const handleCancelMerge = () => {
    try {
      setIsMerging(false);
      setMergeProgress(0);
      setIsMergeSuccess(false);
      tttCancelMergeRecordList();
      onClose();
    } catch (error) {
      onClose();
    }
  };

  // 处理完成按钮点击
  const handleComplete = () => {
    // 回到首页
    router.back();
  };

  // 跳转到合并后文件的详情页
  const handleGoToDetail = () => {
    if (mergedRecordId) {
      router.push(`/detail?recordId=${mergedRecordId}`);
    }
  };

  // 弹窗打开/关闭时切换监听：避免与全局监听重复触发
  useEffect(() => {
    // 弹窗关闭时不注册，避免 cleanup + else 分支双重注册 globalHandler
    if (!show) return undefined;

    // 弹窗打开：先关闭全局监听，再注册弹窗自己的监听
    const globalHandler = getGlobalMergeStatusHandler();
    if (globalHandler) {
      // @ts-ignore
      ty.wear?.offFileMergeStatusEvent?.(globalHandler);
    }
    // @ts-ignore
    ty.wear?.onFileMergeStatusEvent?.(handleFileMergeStatus);

    return () => {
      // 弹窗关闭或组件卸载：关闭弹窗监听，恢复全局监听
      // @ts-ignore
      ty.wear?.offFileMergeStatusEvent?.(handleFileMergeStatus);
      const handler = getGlobalMergeStatusHandler();
      if (handler) {
        // @ts-ignore
        ty.wear?.onFileMergeStatusEvent?.(handler);
      }
    };
  }, [show, handleFileMergeStatus]);

  // 加载动画循环：只在合并进行中时启动定时器
  useEffect(() => {
    if (!isMerging) {
      // 不在合并中时，重置索引，不创建定时器
      setLoadingDotIndex(0);
      return undefined;
    }

    // 合并中：循环切换图片 (0 -> 1 -> 2 -> 0)
    const interval = setInterval(() => {
      setLoadingDotIndex(prev => (prev + 1) % 3);
    }, 500); // 每500ms切换一次

    return () => {
      clearInterval(interval);
    };
  }, [isMerging]);

  const scrollHeight = useMemo(() => {
    const modalHeight = height;
    const headerHeight = 56; // header 高度
    const mergeVisualHeight = isMergeSuccess ? 192 : isMerging ? 223 : 129; // 合并可视化区域高度
    const fileListHeaderHeight = 21; // 文件列表标题高度
    const buttonHeight = 88; // 按钮区域高度
    return modalHeight - headerHeight - mergeVisualHeight - fileListHeaderHeight - buttonHeight;
  }, [useWindowHeight, isMergeSuccess, isMerging]);

  return (
    <CustomPopup
      show={show}
      style={{
        height: `${height}px`,
        maxHeight: `${height}px`,
        backgroundColor: 'var(--color-gray-f9)',
      }}
      renderHeader={() => (
        <View className={styles.header}>
          <Text className={styles.title}>{Strings.getLang('merge_record_title')}</Text>
          <View
            className={styles.closeBtn}
            onClick={
              isMerging
                ? handleCancelMerge
                : isMergeSuccess
                ? handleComplete
                : () => {
                    onClose();
                  }
            }
          >
            <Icon name={closeIcon} size={24} color="var(--color-gray-d8)" />
          </View>
        </View>
      )}
      renderBottom={() => (
        <View className={styles.bottomBtnContainer}>
          <View
            className={clsx(styles.bottomBtn, {
              [styles.cancelBtn]: isMerging,
              [styles.completeBtn]: isMergeSuccess,
              [styles.startBtn]: !isMerging && !isMergeSuccess,
            })}
            onClick={
              isMergeSuccess ? handleComplete : isMerging ? handleCancelMerge : handleStartMerge
            }
          >
            <Text className={styles.bottomBtnText}>
              {isMergeSuccess
                ? Strings.getLang('merge_complete')
                : isMerging
                ? Strings.getLang('merge_cancel')
                : Strings.getLang('merge_start')}
            </Text>
          </View>
        </View>
      )}
    >
      <View className={styles.container}>
        {isMergeSuccess ? (
          <View className={styles.mergeVisual}>
            <ThemedImage
              imageName="mergeNoteSuccessImg"
              src={Res.mergeNoteSuccessImg}
              className={styles.mergeSucess}
            />
          </View>
        ) : (
          <View className={styles.mergeVisual}>
            <View>
              <ThemedImage
                imageName="mergeBookImg"
                src={Res.mergeBookImg}
                className={styles.fileIcon}
              />
            </View>
            <View>
              {isMerging ? (
                <ThemedImage
                  imageName={`loadingDot${loadingDotIndex + 1}Img`}
                  src={
                    loadingDotIndex === 0
                      ? Res.loadingDot1Img
                      : loadingDotIndex === 1
                      ? Res.loadingDot2Img
                      : Res.loadingDot3Img
                  }
                  className={styles.mergeArrow}
                />
              ) : (
                <ThemedImage
                  imageName="loadingDot0Img"
                  src={Res.loadingDot0Img}
                  className={styles.mergeArrow}
                />
              )}
            </View>
            <View>
              <ThemedImage
                imageName="mergeNoteImg"
                src={Res.mergeNoteImg}
                className={styles.folderIcon}
              />
            </View>
          </View>
        )}

        {/* 状态文本和进度条 */}
        {isMergeSuccess ? (
          <View className={styles.mergeStatus}>
            <Text className={styles.successText}>{Strings.getLang('merge_success')}</Text>
            <View className={styles.durationText}>
              <Text className={styles.durationLabel}>
                {Strings.getLang('merge_total_duration_after').replace('{0}', '')}
              </Text>
              <Text className={styles.durationValue}>{formattedDuration}</Text>
              {mergedRecordId && (
                <Text className={styles.goToViewLink} onClick={handleGoToDetail}>
                  {Strings.getLang('merge_go_to_view')}
                </Text>
              )}
            </View>
          </View>
        ) : isMerging ? (
          <View className={styles.mergeStatus}>
            <Text className={styles.statusText}>
              {allFilesDownloaded
                ? Strings.getLang('merge_merging')
                : Strings.getLang('merge_downloading')}
            </Text>
            <View className={styles.durationText}>
              <Text className={styles.durationLabel}>
                {Strings.getLang('merge_total_duration_after').replace('{0}', '')}
              </Text>
              <Text className={styles.durationValue}>{formattedDuration}</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${mergeProgress}%` }} />
            </View>
          </View>
        ) : null}

        {/* 文件列表 */}
        <View className={styles.fileListContainer}>
          <View className={styles.fileListHeader}>
            <Text className={styles.headerText}>
              {Strings.formatValue('merge_file_list_header', dragList.length)}
            </Text>
          </View>

          <ScrollView
            scrollY={scrollEnabled}
            style={{
              display: 'flex',
              width: '100%',
              height: `${scrollHeight}px`,
              flexDirection: 'column',
              background: 'var(--color-gray-f9)',
            }}
          >
            {isMerging || isMergeSuccess ? (
              // 合并中或合并成功：普通列表，不可拖拽
              <View>
                {dragList.map(item => (
                  <View key={item.recordId} className={styles.fileItem}>
                    <View className={styles.fileInfo}>
                      <EllipsisText className={styles.fileName} text={item.name} />
                      <View className={styles.fileMeta}>
                        <Text className={styles.fileDate}>
                          {dayjs(item.recordTime * 1000).format('YYYY/MM/DD HH:mm')}
                        </Text>
                        <View className={styles.divider} />
                        <Text className={styles.fileDuration}>
                          {formatMilliseconds(item.duration)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              // 未合并：可拖拽列表
              <Drag
                list={dragList}
                touchStart={() => {
                  setScrollEnabled(false);
                }}
                activeClassName={styles.active}
                keyId="recordId"
                dragStartDelay={300}
                style={{
                  height: (154 + 24) * dragList.length,
                }}
                handleSortEnd={data => {
                  setScrollEnabled(true);
                  data?.detail && setDragList([...data.detail] as IDragListItem[]);
                }}
              >
                {dragList.map(item => (
                  <DragItem
                    item={item}
                    key={item.recordId}
                    id={item.recordId}
                    className={styles.dragItem}
                    dragIconNode={
                      <View className={styles.dragIcon}>
                        <ThemedImage
                          imageName="dragHandleImg"
                          src={Res.dragHandleImg}
                          className={styles.dragIconImg}
                        />
                      </View>
                    }
                  >
                    <View className={styles.fileItem}>
                      <View className={styles.fileInfo}>
                        <EllipsisText className={styles.fileName} text={item.name} />
                        <View className={styles.fileMeta}>
                          <Text className={styles.fileDate}>
                            {dayjs(item.recordTime * 1000).format('YYYY/MM/DD HH:mm')}
                          </Text>
                          <View className={styles.divider} />
                          <Text className={styles.fileDuration}>
                            {formatMilliseconds(item.duration)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </DragItem>
                ))}
              </Drag>
            )}
          </ScrollView>
        </View>
      </View>
    </CustomPopup>
  );
};

export default MergeRecordModal;
