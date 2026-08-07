/*
 * @Author: hkc
 * @Date: 2025-11-21 14:41:25
 * @LastEditors: hkc
 * @LastEditTime: 2026-03-20 10:05:14
 * @Description: 文件长列表
 */
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { router, View } from '@ray-js/ray';
import RecycleView from '@/components/RecycleView';
import { Empty } from '@ray-js/smart-ui';
import clsx from 'clsx';
import { useRequest } from 'ahooks';
import FloatButton from '@/components/FloatButton';

import { useAppDispatch, useSelector } from '@/redux';
import { getDomClientRect } from '@/utils/dom';
import Strings from '@/i18n';
import { tttRemoveFiles } from '@/api/ttt';
import {
  NoteFileConvertStateType,
  removeFileListItem,
  updateRecordTransferResultList,
} from '@/redux/modules/audioFileSlice';
import { SingleCloudSyncStatus } from '@/constant/enums';
import Res from '@/res';
import ListItem from './ListItem';
import DeleteDialog from '../History/component/DeleteDialog';
import styles from './index.module.less';

interface ScrollEvent {
  type: 'scroll';
  scrollLeft: number;
  scrollTop: number;
  scrollHeight: number;
  scrollWidth: number;
  deltaX: number;
  deltaY: number;
  origin: any;
}

const PAGE_SIZE = 10;
/** 触底加载阈值：距底部该距离时触发加载 */
const LOAD_MORE_THRESHOLD = 150;
/** 列表项基础高度 */
const DEFAULT_ITEM_HEIGHT = 88;
/** 有标签时额外增加的高度（上边距 6px + 标签行 24px） */
const TAG_ROW_HEIGHT = 30;

/**
 * 列表项是否禁用（转码中 / 转码失败）。
 * 与 ListItem 的视觉 disabled 状态保持一致，用于事件代理层拦截 click / long-press。
 */
const isItemDisabled = (item: { noteFileConvertState?: NoteFileConvertStateType }): boolean =>
  item?.noteFileConvertState === NoteFileConvertStateType.ING ||
  item?.noteFileConvertState === NoteFileConvertStateType.FAIL;

interface IProps {
  scrollHeight: number;
  renderHeader?: () => React.ReactElement;
  headerHeight?: number;
  renderExtraHeader?: () => React.ReactElement;
  extraHeaderHeight?: number;
  isBatchMode?: boolean;
  overScanCount?: number;
  selectedRecordIds?: number[];
  setSelectedRecordIds?: (selectedRecordIds: number[]) => void;
  onScroll?: (event: ScrollEvent) => void;
  scrollThrottleTime?: number;
}

const Index: React.ForwardRefExoticComponent<Omit<IProps, 'ref'> & React.RefAttributes<unknown>> =
  React.forwardRef((props, ref) => {
    const {
      renderHeader,
      headerHeight,
      scrollHeight,
      isBatchMode = false,
      overScanCount = 10,
      selectedRecordIds,
      setSelectedRecordIds,
      onScroll,
      renderExtraHeader,
      extraHeaderHeight,
      scrollThrottleTime,
    } = props;
    const fileList = useSelector(state => state.audioFile.fileList);
    // 统一在父组件订阅一次，替代每个 ListItem 各自的 useSelector，消除 N 个 store 订阅
    const isCloudSyncEnabled = useSelector(state => state.uiState.cloudSyncSwitchStatus.enabled);
    const [pressedRecordTransferId, setPressedRecordTransferId] = useState<number>(null);
    const [position, setPosition] = useState({ top: -1000, right: -1000 });
    const [showPopover, setShowPopover] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showFloatButton, setShowFloatButton] = useState(false);
    const [scrollTop, setScrollTop] = useState(null);
    const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
    const dispatch = useAppDispatch();
    const [hasDeleteFiles, setHasDeleteFiles] = useState(false);
    const [deleteDialogMounted, setDeleteDialogMounted] = useState(false);

    // 瀑布流分页：首次 10 条，触底每次加载 10 条；同时为虚拟列表计算每项高度（有 tags 时 +30px）
    const displayedData = useMemo(() => {
      const count = Math.min(displayedCount, fileList.length);
      return fileList.slice(0, count).map(item => ({
        ...item,
        height:
          item.tags && Array.isArray(item.tags) && item.tags.length > 0
            ? DEFAULT_ITEM_HEIGHT + TAG_ROW_HEIGHT
            : DEFAULT_ITEM_HEIGHT,
      }));
    }, [fileList, displayedCount]);

    const hasMore = displayedCount < fileList.length;

    const handleScrollToLower = useCallback(() => {
      if (!hasMore) return;
      setDisplayedCount(prev => Math.min(prev + PAGE_SIZE, fileList.length));
    }, [hasMore, fileList.length]);

    useImperativeHandle(ref, () => ({
      setShowDeleteDialog: (show: boolean) => {
        if (show) {
          setDeleteDialogMounted(true);
        }
        setShowDeleteDialog(show);
      },
      hasDeleteFiles,
    }));

    // 长按
    const handleLongPress = useCallback(
      async (recordTransferId: number) => {
        if (isBatchMode) return;
        setPressedRecordTransferId(recordTransferId);
        const ItemRect = await getDomClientRect(`file_list_item_${recordTransferId}`);
        const popoverRect = await getDomClientRect('file_list_popover');
        setPosition({ top: ItemRect.bottom - popoverRect.height, right: 16 });
        setShowPopover(true);
      },
      [isBatchMode]
    );

    // 文件点击
    const handleClickItem = useCallback(
      (recordId: string, recordTransferId: number) => {
        if (isBatchMode) {
          const isExist = selectedRecordIds?.includes(recordTransferId);
          if (isExist) {
            setSelectedRecordIds(selectedRecordIds?.filter(id => id !== recordTransferId));
          } else {
            setSelectedRecordIds([...selectedRecordIds, recordTransferId]);
          }
        } else {
          if (showPopover) {
            setShowPopover(false);
          }
          router.push(`/detail?recordId=${recordId}`);
        }
      },
      [isBatchMode, selectedRecordIds, showPopover, setSelectedRecordIds]
    );

    // 弹出层点击
    const handlePopoverClick = useCallback(
      (key: string) => {
        setShowPopover(false);
        switch (key) {
          case 'delete':
            setDeleteDialogMounted(true);
            setShowDeleteDialog(true);
            break;
          case 'batch':
            router.push('/home/batchFileList', { subpackage: 'pkgEntry' });
            break;
          default:
            break;
        }
      },
      [pressedRecordTransferId]
    );

    // 删除文件
    const { run: deleteFiles, loading: deleteLoading } = useRequest(tttRemoveFiles, {
      manual: true,
      onSuccess: (_data, params) => {
        setSelectedRecordIds?.([]);

        if (isBatchMode) {
          dispatch(updateRecordTransferResultList({ source: 'file_recycle_batch_delete' }));
          return;
        }

        const [deleteParams] = params;
        const [deletedRecordTransferId] = deleteParams?.fileIds ?? [];
        if (deletedRecordTransferId !== undefined && deletedRecordTransferId !== null) {
          dispatch(
            removeFileListItem({
              key: 'recordTransferId',
              value: deletedRecordTransferId,
            })
          );
        }
      },
      onFinally: () => {
        setHasDeleteFiles(false);
      },
    });

    // 确认删除文件
    const handleDeleteConfirm = () => {
      const fileIds = (isBatchMode ? selectedRecordIds ?? [] : [pressedRecordTransferId]).filter(
        (id): id is number => id !== undefined && id !== null
      );
      if (!fileIds.length) {
        return;
      }
      setShowDeleteDialog(false);
      setHasDeleteFiles(true);
      deleteFiles({
        fileIds,
        isDeleteAll: true,
      });
    };

    // 弹出层列表
    const menuList = useMemo(() => {
      const list = [
        {
          key: 'delete',
          title: Strings.getLang('delete'),
        },
        {
          key: 'batch',
          title: Strings.getLang('batch_select'),
        },
      ];

      return list;
    }, []);

    // 滚动事件（useCallback 保证引用稳定，避免 RecycleView 内 handleScrollEvent 因此重建）
    const handleScroll = useCallback(
      (event: any) => {
        const { scrollTop } = event?.detail;
        if (showPopover) {
          setShowPopover(false);
        }
        // 值未变化时跳过 setState，避免触发无意义的 re-render 级联
        const shouldShow = scrollTop > 200;
        setShowFloatButton(prev => (prev === shouldShow ? prev : shouldShow));
        setScrollTop(null);
        onScroll?.(event);
      },
      [showPopover, onScroll]
    );

    // ref 持有最新 handler，供事件代理回调读取
    const handleClickItemRef = useRef(handleClickItem);
    const handleLongPressRef = useRef(handleLongPress);
    handleClickItemRef.current = handleClickItem;
    handleLongPressRef.current = handleLongPress;

    // selectedRecordIds / isCloudSyncEnabled 通过 ref 持有，renderItem 无需将其列为依赖
    const selectedRecordIdsRef = useRef(selectedRecordIds);
    selectedRecordIdsRef.current = selectedRecordIds;
    const isCloudSyncEnabledRef = useRef(isCloudSyncEnabled);
    isCloudSyncEnabledRef.current = isCloudSyncEnabled;

    // ─── 事件代理 ───────────────────────────────────────────────────────────────
    // 由 RecycleView 的 onItemClick/onItemLongPress 在 item wrapper 层统一分发。
    // bridge 层全生命周期只注册 2 条 handler，无论滚动多少条都不会累积。
    // 注：转码中/转码失败的 item 在 ListItem 上仅有视觉 disabled（opacity + pointer-events），
    // 事件代理改造后回调挂在外层 wrapper 上，pointer-events 无法约束代理层，
    // 需在此显式拦截，与 ListItem 的视觉 disabled 状态保持一致。
    // - 点击（click）：转码中给出 toast 提示用户等待，转码失败静默拦截
    // - 长按（long-press）：两种状态均静默拦截，避免弹出删除/批量菜单
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onItemClickDelegate = useCallback((item: any) => {
      const state = item?.noteFileConvertState;
      if (state === NoteFileConvertStateType.ING) {
        ty.showToast({
          title: Strings.getLang('action_transforming_tip'),
          icon: 'none',
        });
        return;
      }
      if (state === NoteFileConvertStateType.FAIL) return;
      handleClickItemRef.current(item.recordId, item.recordTransferId);
    }, []); // 通过 ref 访问最新值，引用永不变

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onItemLongPressDelegate = useCallback((item: any) => {
      if (isItemDisabled(item)) return;
      handleLongPressRef.current(item.recordTransferId);
    }, []); // 同上

    const renderItem = useCallback(
      (item: any) => {
        const isSelected = selectedRecordIdsRef.current?.includes(item.recordTransferId) ?? false;
        return (
          <ListItem
            id={`file_list_item_${item.recordTransferId}`}
            isBatchMode={isBatchMode}
            data={item as any}
            isSelected={isSelected}
            isCloudSyncEnabled={isCloudSyncEnabledRef.current}
            isCloudFile={
              item.isFromCloud || item.cloudSyncStatus === SingleCloudSyncStatus.UploadSuccess
            }
          />
        );
      },
      [isBatchMode] // click/longPress 由 RecycleView 事件代理处理，不在 renderItem 中传入
    );

    return (
      <>
        <RecycleView
          // @ts-ignore
          style={{
            height: `${scrollHeight}px`,
          }}
          // placeholderImage={placeholderImg}
          hideScrollBar={false}
          scrollTop={scrollTop}
          onScroll={handleScroll}
          onScrollToLower={handleScrollToLower}
          lowerThreshold={LOAD_MORE_THRESHOLD}
          className={styles.recycleView}
          data={displayedData}
          scrollThrottleTime={scrollThrottleTime}
          overScanCount={overScanCount}
          defaultItemHeight={DEFAULT_ITEM_HEIGHT}
          headerHeight={headerHeight || 0}
          renderHeader={renderHeader}
          renderExtraHeader={renderExtraHeader}
          extraHeaderHeight={extraHeaderHeight}
          itemClass={styles.item}
          bounces={false}
          renderItem={renderItem}
          onItemClick={onItemClickDelegate}
          onItemLongPress={onItemLongPressDelegate}
          bottomHeight={isBatchMode ? 85 : 0}
          renderBottom={
            isBatchMode
              ? () => {
                  return <View style={{ height: 80 }} />;
                }
              : undefined
          }
          renderEmpty={() => (
            <Empty
              image={Res.emptyImg}
              description={Strings.getLang('noData')}
              customClass={clsx(styles.empty, {
                [styles.batchModeEmpty]: isBatchMode,
              })}
            />
          )}
        />
        <View
          className={styles.popover}
          style={{
            opacity: showPopover ? 1 : 0,
            visibility: showPopover ? 'visible' : 'hidden',
            top: `${position.top}px`,
            right: `${position.right}px`,
          }}
          id="file_list_popover"
        >
          {menuList.map(item => (
            <View
              key={item.key}
              className={clsx(styles.popoverItem, {
                [styles.delete]: item.key === 'delete',
              })}
              onClick={() => handlePopoverClick(item.key)}
            >
              {item.title}
            </View>
          ))}
        </View>
        {/* 删除弹窗 */}
        {deleteDialogMounted && (
          <DeleteDialog
            show={showDeleteDialog}
            onConfirm={handleDeleteConfirm}
            onClose={() => setShowDeleteDialog(false)}
            loading={deleteLoading}
            count={isBatchMode ? selectedRecordIds?.length || 1 : 1}
          />
        )}

        {showFloatButton && (
          <FloatButton
            show
            icon={Res.backTopIcon}
            iconName="backTopIcon"
            onClick={() => {
              setScrollTop(0);
            }}
          />
        )}
      </>
    );
  });

export default React.memo(Index);
