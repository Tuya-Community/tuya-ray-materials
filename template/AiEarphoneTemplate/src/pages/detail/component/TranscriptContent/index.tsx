import React, { FC, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View } from '@ray-js/components';
import { useDispatch } from 'react-redux';
import { usePageEvent, usePageInstance } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import { OutlineItem, TranscriptSegment } from '@/types/file';
import DynamicScrollView from '@/components/DynamicScrollView';
import { RecordType } from '@/redux/modules/audioFileSlice';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import Res from '@/res';
import Strings from '@/i18n';
import { GenerateType, updateFileDetail } from '@/redux/modules/fileDetailSlice';
import { TransferStatus, TranslateStatus } from '@/constant/enums';
import { useSelector } from '@/redux';
import { getDomRectTop } from '@/utils/dom';
import ThemedImage from '@/components/ThemedImage';
import ModifySpeakerDialog from '../ModifySpeakerDialog';
import Outline from '../Outline/index';
import EmptyContent from '../EmptyContent';
import ListItem from './ListItem';
import AnimationLoading from './AnimationLoading';
import FileInfo from '../FileInfo';
import FileTagList from '../FileTagList';
import OutlinePopup from '../OutlinePopup';

import FileDetailContext from '../../context';
import { getSpeakerColorMap } from '../../util';
import { fileEmitter } from '../../index';

// 导入自定义 Hooks
import { useSegmentedList } from './hooks/useSegmentedList';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useScrollToItem } from './hooks/useScrollToItem';
import { useOutlineVisibility } from './hooks/useOutlineVisibility';
import { useSpeakerModification } from './hooks/useSpeakerModification';

// 导入工具函数和常量
import { findItemIndexByTime } from './utils';
import { WRAPPER_ID, OUTLINE_COMPONENT_ID } from './constants';

import styles from './index.module.less';

interface Props {
  updateSummary: (params: { title: string; summary?: string }) => Promise<void>;
  outlineList: OutlineItem[];
  footer?: React.ReactNode;
  /** 标签编辑成功后写回详情（本地） */
  onFileTagsChange?: (tags: string[]) => void;
}

// ============= 主组件 =============
const SttContent: FC<Props> = ({ updateSummary, outlineList = [], footer, onFileTagsChange }) => {
  // ============= 基础状态 =============
  const { useWindowHeight } = useSelector(selectSystemInfo);
  const { devId = '' } = useSelector(state => state.devInfo);
  const dispatch = useDispatch();
  const page = usePageInstance();

  // ============= Context 状态 =============
  const {
    transferList,
    setTransferList,
    fileDetail,
    originTransferListRef,
    originRecognizeListRef,
    currentPlaySecond,
    playStatus,
    setScrollVisibleChapterTime,
  } = useContext(FileDetailContext);
  const transferStatus = fileDetail?.transfer;

  // ============= UI 状态 =============
  const [scrollHeight, setScrollHeight] = useState(useWindowHeight);
  const [refresherTriggered, setRefresherTriggered] = useState(false); // 下拉刷新状态
  const [manualScrollTop, setManualScrollTop] = useState<number | undefined>(undefined);
  // const manualScrollTopRef = useRef<number | undefined>(undefined); // 手动控制scrollTop
  // const [, forceScrollTopUpdate] = useState(0);
  const [enableScrollAnimation, setEnableScrollAnimation] = useState(true); // 控制scrollWithAnimation
  // 回到播放位置 / 翻译中 二选一显示，后出现的覆盖先出现的
  const [lastFloatingShown, setLastFloatingShown] = useState<
    'backToPlay' | 'translateLoading' | null
  >(null);

  // ============= Refs =============
  const programmaticScrollRef = useRef<boolean>(false); // 标记是否为程序触发的滚动
  const userTouchingRef = useRef<boolean>(false); // 标记用户是否在触摸滚动
  const currentScrollTopRef = useRef<number>(0); // 记录当前scrollTop
  const chunkHeightMapRef = useRef<Record<number, number>>({}); // 记录每个chunk的高度
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const visibleUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageVisibleRef = useRef<boolean>(true);
  const addTimeout = useCallback((handler: () => void, delay: number) => {
    const id = setTimeout(handler, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // ============= 自定义 Hooks =============

  // 分段渲染列表
  const {
    segmentList,
    renderList,
    loading,
    loadChunks,
    handleScrollToLower,
    handleScrollToUpper,
    renderListStartIndex,
  } = useSegmentedList(transferList);

  // 说话人颜色映射
  const speakerColorMap = useMemo(() => {
    return getSpeakerColorMap(transferList);
  }, [transferList]);

  // 说话人修改
  const {
    open: speakerDialogOpen,
    selectedSpeaker,
    handleClickSpeaker,
    handleConfirm: handleConfirmSpeaker,
    handleClose: handleCloseSpeakerDialog,
  } = useSpeakerModification({
    devId,
    fileDetail,
    transferList,
    originRecognizeListRef,
    originTransferListRef,
    setTransferList,
  });

  // 大纲可见性监听
  const { showOutlinePopup, updateVisibleChapterTime } = useOutlineVisibility({
    page,
    wrapperId: WRAPPER_ID,
    transferList,
    outlineList,
    setScrollVisibleChapterTime,
    isPageActiveRef: pageVisibleRef,
    outlineVisible: renderListStartIndex === 0,
  });

  // 收起 OutlinePopup
  const handleCollapseOutlinePopup = useCallback(() => {
    fileEmitter.emit('onCollapseOutlinePopup');
  }, []);

  // 滚动到指定项
  const { scrollIntoViewId, scrollToItem, debouncedScrollToItem, lastScrollItemIndexRef } =
    useScrollToItem({
      transferList,
      wrapperId: WRAPPER_ID,
      page,
      currentPlaySecond,
      segmentList,
      renderList,
      loadChunks,
      setScrollVisibleChapterTime,
      programmaticScrollRef,
      renderListStartIndex,
    });

  // 自动滚动控制
  const {
    autoScrollEnabled,
    handleScroll: handleUserScroll,
    handleEnableAutoScroll,
    handleBackToPlayPosition,
  } = useAutoScroll({
    playStatus,
    showOutlinePopup,
    currentPlaySecond,
    transferList,
    onCollapseOutlinePopup: handleCollapseOutlinePopup,
    onSuppressNextAutoScroll: () => {
      suppressNextAutoScrollRef.current = true;
    },
    scrollToItem,
  });

  const initialAutoScrollDoneRef = useRef(false);
  const suppressNextAutoScrollRef = useRef(false);

  const transferListRef = useRef(transferList);
  const scrollToItemRef = useRef(scrollToItem);
  const debouncedScrollToItemRef = useRef(debouncedScrollToItem);
  const handleUserScrollRef = useRef(handleUserScroll);
  transferListRef.current = transferList;
  scrollToItemRef.current = scrollToItem;
  debouncedScrollToItemRef.current = debouncedScrollToItem;
  handleUserScrollRef.current = handleUserScroll;

  const handleTouchMove = useCallback(() => {
    userTouchingRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    userTouchingRef.current = false;
  }, []);

  // 处理下拉刷新（用于加载上一个chunk）
  const handleRefresherRefresh = useCallback(() => {
    if (renderListStartIndex > 0 && !refresherTriggered) {
      setRefresherTriggered(true);

      // 1. 禁用滚动动画
      setEnableScrollAnimation(false);

      // 记录当前的scrollTop
      const previousScrollTop = currentScrollTopRef.current;

      // 2. 先标记要加载的chunk
      const prevChunkIndex = renderListStartIndex - 1;
      const cachedHeight = chunkHeightMapRef.current[prevChunkIndex];
      // const cachedHeights = Object.values(chunkHeightMapRef.current).filter(height => height > 0);
      // const averageHeight = cachedHeights.length
      //   ? Math.round(cachedHeights.reduce((sum, height) => sum + height, 0) / cachedHeights.length)
      //   : 0;
      // const fallbackHeight = Math.max(200, Math.round(Number(scrollHeight || 0) * 0.5));
      const estimatedHeight = cachedHeight || 0;

      // setUpperRefreshing(!estimatedHeight);

      if (estimatedHeight) {
        // 有估算高度时先修正scrollTop，避免出现白屏
        setManualScrollTop(previousScrollTop + estimatedHeight);
      }

      // 3. 此时hiddenChunkIndex已经同步更新，立即加载chunk
      handleScrollToUpper();

      // 4. 等待chunk渲染完成，查询高度
      // @ts-ignore
      ty?.nextTick(async () => {
        if (!page) return;

        const chunkId = `${WRAPPER_ID}_chunk_${prevChunkIndex}`;

        page
          .createSelectorQuery()
          .select(`#${chunkId}`)
          .boundingClientRect()
          .exec((res: any) => {
            const chunkHeight = res?.[0]?.height || 0;

            // 设置scrollTop
            setManualScrollTop(previousScrollTop + chunkHeight);
            setEnableScrollAnimation(true);
            setRefresherTriggered(false);
          });
      });
    }
  }, [
    renderListStartIndex,
    handleScrollToUpper,
    page,
    addTimeout,
    refresherTriggered,
    scrollHeight,
  ]);

  // 处理滚动事件（合并用户滚动和可视章节更新）
  const handleScroll = useCallback(
    (event: any) => {
      handleUserScrollRef.current(event, userTouchingRef.current);
      updateVisibleChapterTime();
    },
    [updateVisibleChapterTime]
  );

  // ============= 业务逻辑函数 =============

  // 转写
  const handleTranscribe = useCallback(() => {
    dispatch(
      updateFileDetail({
        generateType: GenerateType.Transcribe,
        selectTemplateShow: true,
      })
    );
  }, [dispatch]);

  // 获取滚动高度
  const getScrollHeight = useCallback(async () => {
    const rectTop = await getDomRectTop('transfer-content');
    setScrollHeight(useWindowHeight - rectTop);
  }, [useWindowHeight]);

  // ============= 副作用 =============

  // 初始化滚动高度
  useEffect(() => {
    getScrollHeight();
  }, [getScrollHeight]);

  // 回到播放位置 / 翻译中：谁后出现就显示谁，用于二选一覆盖逻辑
  const showBackToPlay = useMemo(() => {
    return !autoScrollEnabled && transferList.length > 0;
  }, [autoScrollEnabled, transferList]);
  const showTranslateLoading = useMemo(() => {
    return fileDetail?.translateState === TranslateStatus.Process;
  }, [fileDetail?.translateState]);
  useEffect(() => {
    if (showTranslateLoading) setLastFloatingShown('translateLoading');
  }, [showTranslateLoading]);
  useEffect(() => {
    if (showBackToPlay) setLastFloatingShown('backToPlay');
  }, [showBackToPlay]);

  // 监听播放进度变化，自动滚动到对应列表项
  // transferList / scrollToItem / debouncedScrollToItem 通过 ref 读取，避免大对象闭包泄漏
  useEffect(() => {
    if (suppressNextAutoScrollRef.current) {
      suppressNextAutoScrollRef.current = false;
      return;
    }
    if (!autoScrollEnabled || !segmentList?.length) return;
    if (!pageVisibleRef.current) return;
    if (!currentPlaySecond || currentPlaySecond <= 0) return;
    const itemIndex = findItemIndexByTime(transferListRef.current, currentPlaySecond);
    if (itemIndex >= 0) {
      if (!initialAutoScrollDoneRef.current) {
        scrollToItemRef.current(itemIndex, true);
        initialAutoScrollDoneRef.current = true;
        return;
      }
      if (itemIndex !== lastScrollItemIndexRef.current) {
        debouncedScrollToItemRef.current(itemIndex);
      }
    }
  }, [currentPlaySecond, autoScrollEnabled, segmentList]);

  usePageEvent('onShow', () => {
    pageVisibleRef.current = true;
  });

  usePageEvent('onHide', () => {
    pageVisibleRef.current = false;
  });

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
      if (visibleUpdateTimeoutRef.current) {
        clearTimeout(visibleUpdateTimeoutRef.current);
        visibleUpdateTimeoutRef.current = null;
      }
    };
  }, []);

  // ============= 渲染函数 =============

  // FileInfo 组件
  const fileInfoComponent = useMemo(
    () => <FileInfo updateSummary={updateSummary} />,
    [updateSummary]
  );

  // 是否已加载完全部分段内容
  const isAllContentLoaded = useMemo(() => {
    return renderListStartIndex + renderList.length >= segmentList.length;
  }, [segmentList.length, renderList.length, renderListStartIndex]);

  // footer 延迟 500ms 渲染：等内容全部加载完毕且无加载中状态后再显示
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    if (!loading && isAllContentLoaded) {
      const timer = setTimeout(() => setShowFooter(true), 500);
      return () => clearTimeout(timer);
    }
    // 条件不满足时重置，确保下次重新计时
    setShowFooter(false);
    return undefined;
  }, [loading, isAllContentLoaded]);

  // 底部加载中 + footer（footer 仅在全部内容加载完毕且不在加载中时显示）
  const renderBottom = useCallback(() => {
    return (
      <View className={styles.bottom}>
        {loading && Strings.getLang('content_loading')}
        {showFooter && footer}
      </View>
    );
  }, [loading, footer, showFooter]);

  // 渲染内容
  const renderContent = () => {
    // 转写中状态
    if (transferStatus === TransferStatus.Process) {
      return (
        <>
          {fileInfoComponent}
          <EmptyContent
            image={Res.fileTranscribe}
            title={Strings.getLang('file_tip_transcribing')}
          />
        </>
      );
    }

    // 未转写且非pro文件，显示未转写状态
    if (
      (transferStatus === TransferStatus.Initial &&
        fileDetail?.recordType !== RecordType.FaceToFacePro) ||
      (!fileDetail?.cloudTranscription && transferStatus === TransferStatus.Initial)
    ) {
      return (
        <>
          {fileInfoComponent}
          <EmptyContent
            image={Res.fileTranscribe}
            desc={Strings.getLang('file_tip_not_transcribe')}
            buttonTitle={Strings.getLang('generate')}
            onClick={handleTranscribe}
          />
        </>
      );
    }

    // 转写失败状态
    if (transferStatus === TransferStatus.Fail) {
      return (
        <>
          {fileInfoComponent}
          <EmptyContent
            image={Res.fileFailed}
            title={Strings.getLang('file_tip_transcribe_failed')}
            buttonTitle={Strings.getLang('file_re_transcribe')}
            onClick={handleTranscribe}
          />
        </>
      );
    }

    // 转写完成或者stt有值，显示内容
    if (transferStatus === TransferStatus.Success || transferList.length) {
      return (
        <>
          {transferList.length > 0 ? (
            <DynamicScrollView
              className={styles.content}
              contentClassName={styles.list}
              bounces={false}
              renderList={renderList}
              renderListStartIndex={renderListStartIndex}
              // upperRefreshing={upperRefreshing}
              scrollHeight={scrollHeight}
              onScrollToLower={handleScrollToLower}
              onScroll={handleScroll}
              renderBottom={renderBottom}
              lowerThreshold={50}
              rootMargin={scrollHeight}
              // debug={true}
              wrapperId={WRAPPER_ID}
              scrollIntoView={scrollIntoViewId}
              scrollIntoViewOffset={Math.round(-(scrollHeight / 5))}
              refresherThreshold={50}
              scrollWithAnimation={enableScrollAnimation} // 动态控制动画
              // 手动控制scrollTop（用于下拉加载后保持位置）
              scrollTop={manualScrollTop}
              // 下拉刷新配置（用于加载上一个chunk）
              refresherEnabled={renderListStartIndex > 0}
              refresherTriggered={refresherTriggered}
              upperThreshold={20}
              onRefresherrefresh={handleRefresherRefresh}
              onScrollToUpper={handleRefresherRefresh}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              refresherBackground="transparent"
              // renderSkeleton={height => (
              //   <View style={{ '--skeleton-row-height': `${height / 10}px` } as any}>
              //     <Skeleton
              //       row={10}
              //       rowWidth={Array(10).fill('100%')}
              //       customClass={styles.skeleton}
              //     />
              //   </View>
              // )}
              renderTop={() => (
                <>
                  {/* 只在第0个chunk加载时显示原本的renderTop内容 */}
                  {renderListStartIndex === 0 && (
                    <>
                      {/* 部分转写提示 */}
                      {fileDetail?.transcriptionStatus === 2 && (
                        <View className={styles.partial}>
                          <View className={styles.tip}>
                            {Strings.getLang('partial_transcript_tip')}
                          </View>
                          <Button customClass={styles.toTranscribeBtn} onClick={handleTranscribe}>
                            {Strings.getLang('to_transcribe')}
                          </Button>
                        </View>
                      )}
                      <FileInfo updateSummary={updateSummary} />
                      <FileTagList
                        recordId={fileDetail?.recordId}
                        tags={fileDetail?.tags ?? []}
                        onTagsChange={onFileTagsChange}
                      />
                      {/* 智能章节 */}
                      {outlineList?.length > 0 && (
                        <View id={OUTLINE_COMPONENT_ID}>
                          <Outline className={styles.outline} outlineList={outlineList} />
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
              renderItem={(item: TranscriptSegment, chunkIndex: number, indexInChunk: number) => {
                // 计算全局chunk索引，用于生成唯一的id和key
                const globalChunkIndex = renderListStartIndex + chunkIndex;
                // 计算在原始 transferList 中的全局索引，用于编辑、说话人修改等逻辑
                const globalIndex =
                  segmentList
                    .slice(0, globalChunkIndex)
                    .reduce((sum, chunk) => sum + chunk.length, 0) + indexInChunk;

                return (
                  <ListItem
                    id={`item_${globalChunkIndex}_${indexInChunk}`}
                    key={`item_${globalChunkIndex}_${indexInChunk}`}
                    data={item}
                    index={globalIndex}
                    speakerColorMap={speakerColorMap}
                    onClickSpeaker={handleClickSpeaker}
                    onEnableAutoScroll={handleEnableAutoScroll}
                  />
                );
              }}
            />
          ) : (
            <>
              {fileInfoComponent}
              <EmptyContent image={Res.fileFailed} title={Strings.getLang('file_tip_empty')} />
            </>
          )}
        </>
      );
    }

    return null;
  };

  // ============= 主渲染 =============
  return (
    <>
      <View id="transfer-content" style={{ height: `${scrollHeight}px` }}>
        {renderContent()}
      </View>

      {/* 回到播放位置按钮 / 翻译加载动画：二选一，后出现的覆盖先出现的 */}
      {showTranslateLoading && showBackToPlay ? (
        lastFloatingShown === 'translateLoading' ? (
          <AnimationLoading />
        ) : (
          <View className={styles.backToPlayBtn} onClick={handleBackToPlayPosition}>
            <ThemedImage
              imageName="backPositionIcon"
              src={Res.backPositionIcon}
              className={styles.icon}
            />
            {Strings.getLang('detail.back_to_play_position')}
          </View>
        )
      ) : showTranslateLoading ? (
        <AnimationLoading />
      ) : (
        showBackToPlay && (
          <View className={styles.backToPlayBtn} onClick={handleBackToPlayPosition}>
            <ThemedImage
              imageName="backPositionIcon"
              src={Res.backPositionIcon}
              className={styles.icon}
            />
            {Strings.getLang('detail.back_to_play_position')}
          </View>
        )
      )}

      {/* 说话人修改弹窗 */}
      <ModifySpeakerDialog
        open={speakerDialogOpen}
        onClose={handleCloseSpeakerDialog}
        defaultValue={selectedSpeaker}
        onConfirm={handleConfirmSpeaker}
      />

      {/* 大纲弹窗：仅在有转写内容且非失败/转写中状态时显示 */}
      <OutlinePopup
        show={
          showOutlinePopup &&
          transferList.length > 0 &&
          transferStatus !== TransferStatus.Fail &&
          transferStatus !== TransferStatus.Process
        }
        outlineList={outlineList}
      />
    </>
  );
};

export default React.memo(SttContent);
