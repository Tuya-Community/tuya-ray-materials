import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Input } from '@ray-js/components';
import { Drag, DragItem } from '@ray-js/drag-list';
import { Tag } from '@ray-js/smart-ui';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { selectSystemInfo } from '@/redux/modules/systemInfoSlice';
import { tttUpdateRecordTagResult } from '@/api/ttt';
import { atopGetAudioTagHistory } from '@/api/common';
import { usePageInstance, showToast } from '@ray-js/ray';
import clsx from 'clsx';
import { useRequest } from 'ahooks';
import styles from './AddTagBottomSheet.module.less';

const RECORD_TAG_BIZ_ADD = 0;
const RECORD_TAG_BIZ_REMOVE = 1;
const RECORD_TAG_BIZ_SORT = 2;

type TagDragItem = { id: string; label: string };
const MAX_TAG_LEN = 100;
/** 单篇笔记标签总数上限 */
const MAX_TAGS_PER_NOTE = 10;
/** 标题栏 + 内边距预留（px） */
const ADD_TAG_NEW_PILL_ID = 'add_tag_new_pill';

export interface AddTagBottomSheetProps {
  show: boolean;
  recordId: string;
  tags: string[];
  onClose: () => void;
  onTagsChange: (next: string[]) => void;
}

const AddTagBottomSheet: FC<AddTagBottomSheetProps> = ({
  show,
  recordId,
  tags,
  onClose,
  onTagsChange,
}) => {
  const { statusBarHeight } = useSelector(selectSystemInfo);
  const page = usePageInstance();

  const [draftTags, setDraftTags] = useState<string[]>(tags);
  const [historyTags, setHistoryTags] = useState<string[]>([]);
  const [addingMode, setAddingMode] = useState(false);
  const [inputResetKey, setInputResetKey] = useState(0);
  /** 小程序同帧设 focus 常不生效，进入编辑态后延迟一帧再为 true */
  const [newTagFocus, setNewTagFocus] = useState(false);
  const submittingRef = useRef(false);
  const newTagInputRef = useRef('');
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // 获取历史标签
  const { run: getAudioTagHistory } = useRequest(atopGetAudioTagHistory, {
    manual: true,
    onSuccess: res => setHistoryTags(res),
  });

  const measureNewPill = useCallback(() => {
    if (!page) {
      return;
    }
    const q = page.createSelectorQuery();
    q.select(`#${ADD_TAG_NEW_PILL_ID}`).boundingClientRect();
    q.exec((res: unknown[]) => {
      const rect = res?.[0] as { width?: number } | undefined;
      const w = rect?.width ?? 0;
      setInputWidth(Math.max(1, Math.floor(w)));
      setShowInput(true);
    });
  }, [page]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (addingMode) {
      t = setTimeout(() => setNewTagFocus(true), 50);
    } else {
      setNewTagFocus(false);
    }
    return () => {
      if (t != null) {
        clearTimeout(t);
      }
    };
  }, [addingMode]);

  useEffect(() => {
    setDraftTags([...tags]);
    setAddingMode(false);
    // newTagInputRef.current = '';
    // setInputResetKey(k => k + 1);
    setNewTagFocus(false);
  }, [tags]);

  useEffect(() => {
    if (!show) {
      setScrollEnabled(true);
    }
  }, [show]);

  /** 弹窗展示后测量「新增标签」块宽度（收起态），供输入框宽度 = 外宽 − 左右 padding − 左右边框 */
  useEffect(() => {
    if (!show) {
      return undefined;
    }
    getAudioTagHistory();
    const run = () => {
      measureNewPill();
    };
    const timer = setTimeout(run, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [show, measureNewPill]);

  // 更新标签
  const callUpdate = useCallback(
    async (bizType: number, tagList: string[]) => {
      if (!recordId || submittingRef.current) {
        return false;
      }
      submittingRef.current = true;
      try {
        await tttUpdateRecordTagResult({ recordId, bizType, tags: tagList });
        return true;
      } catch {
        return false;
      } finally {
        submittingRef.current = false;
      }
    },
    [recordId]
  );

  // 删除标签
  const handleRemove = useCallback(
    async (tag: string) => {
      const ok = await callUpdate(RECORD_TAG_BIZ_REMOVE, [tag]);
      if (!ok) {
        return;
      }
      setDraftTags(prev => {
        const next = prev.filter(x => x !== tag);
        onTagsChange(next);
        return next;
      });
    },
    [callUpdate, onTagsChange]
  );

  const tagDragList = useMemo<TagDragItem[]>(
    () => draftTags.map(label => ({ id: label, label })),
    [draftTags]
  );

  const handleTagSortEnd = useCallback(
    async (e: { detail?: Record<string, unknown>[] | false }) => {
      setScrollEnabled(true);
      if (!e || e.detail === false) {
        return;
      }
      const next = e.detail;
      if (!Array.isArray(next) || next.length === 0) {
        return;
      }
      const ordered = next.map(it => String((it as TagDragItem).label));
      const ok = await callUpdate(RECORD_TAG_BIZ_SORT, ordered);
      if (!ok) {
        return;
      }
      setDraftTags(ordered);
      onTagsChange(ordered);
    },
    [callUpdate, onTagsChange]
  );

  // 新增标签
  const submitNewTag = useCallback(async () => {
    const t = newTagInputRef.current.trim();
    if (!t) {
      setAddingMode(false);
      newTagInputRef.current = '';
      setInputResetKey(k => k + 1);
      return;
    }
    if (draftTags.length >= MAX_TAGS_PER_NOTE) {
      showToast({ title: Strings.getLang('tag_max_count'), icon: 'none' });
      return;
    }
    if (draftTags.includes(t)) {
      showToast({ title: Strings.getLang('tag_duplicate_exists'), icon: 'none' });
      newTagInputRef.current = '';
      setInputResetKey(k => k + 1);
      return;
    }
    const ok = await callUpdate(RECORD_TAG_BIZ_ADD, [t]);
    if (!ok) {
      return;
    }
    newTagInputRef.current = '';
    setInputResetKey(k => k + 1);
    setAddingMode(false);
    setDraftTags(prev => {
      if (prev.includes(t)) {
        return prev;
      }
      const next = [...prev, t];
      onTagsChange(next);
      return next;
    });
    getAudioTagHistory();
  }, [draftTags, callUpdate, onTagsChange]);

  // 选择历史标签
  const handlePickHistory = useCallback(
    async (tag: string) => {
      if (draftTags.length >= MAX_TAGS_PER_NOTE) {
        showToast({ title: Strings.getLang('tag_max_count'), icon: 'none' });
        return;
      }
      if (draftTags.includes(tag)) {
        showToast({ title: Strings.getLang('tag_duplicate_exists'), icon: 'none' });
        return;
      }
      const ok = await callUpdate(RECORD_TAG_BIZ_ADD, [tag]);
      if (!ok) {
        return;
      }
      setDraftTags(prev => {
        if (prev.includes(tag)) {
          return prev;
        }
        const next = [...prev, tag];
        onTagsChange(next);
        return next;
      });
    },
    [draftTags, callUpdate, onTagsChange]
  );

  // 关闭弹窗
  const handleClose = useCallback(() => {
    setAddingMode(false);
    newTagInputRef.current = '';
    setInputResetKey(k => k + 1);
    onClose();
  }, [onClose]);

  // 输入框：不做字符过滤，仅限制长度；首尾空格在失焦与提交时用 trim
  const handleNewInput = useCallback((e: { value?: string; detail?: { value?: string } }) => {
    newTagInputRef.current = e?.value ?? e?.detail?.value ?? '';
  }, []);

  return (
    <BottomSheetWithCustomTitle
      show={show}
      onClose={handleClose}
      title={Strings.getLang('tag_add_title')}
      customClass={clsx(
        styles.bottomSheet,
        scrollEnabled ? styles.scrollEnabled : styles.scrollDisabled
      )}
      maxHeight={`calc(100vh - ${Number(statusBarHeight ?? 0)}px)`}
      closeOnClickOverlay
    >
      <View className={styles.editorBox}>
        <Drag
          list={tagDragList}
          keyId="id"
          multipleCol
          bodyDrag
          dragStartDelay={300}
          activeClassName={styles.tagDragActive}
          touchStart={() => {
            setScrollEnabled(false);
          }}
          handleSortEnd={handleTagSortEnd}
          className={styles.tagDragWrap}
        >
          {[
            ...tagDragList.map(tagItem => (
              <DragItem key={tagItem.id} id={tagItem.id} item={tagItem}>
                <Tag
                  closeable
                  color="var(--color-bg-primary)"
                  textColor="var(--color-text-tag)"
                  customClass={styles.sheetTag}
                  onClose={() => handleRemove(tagItem.label)}
                >
                  {tagItem.label}
                </Tag>
              </DragItem>
            )),
            ...(showInput
              ? [
                  <Input
                    key={`new-tag-input-${inputResetKey}`}
                    className={styles.newInput}
                    type="text"
                    placeholder={Strings.getLang('tag_add_placeholder')}
                    placeholderStyle={{
                      color: 'var(--color-blue-3582FA)',
                    }}
                    maxLength={MAX_TAG_LEN}
                    confirmType="done"
                    style={
                      inputWidth != null
                        ? { width: `${inputWidth}px`, maxWidth: '100%' }
                        : undefined
                    }
                    // @ts-ignore
                    focus={newTagFocus}
                    onFocus={() => {
                      setNewTagFocus(true);
                    }}
                    onInput={handleNewInput}
                    onConfirm={submitNewTag}
                    onBlur={() => {
                      setNewTagFocus(false);
                      submitNewTag();
                    }}
                  />,
                ]
              : []),
          ]}
        </Drag>
      </View>

      <Text className={styles.historyLabel}>{Strings.getLang('tag_history')}</Text>
      <View className={styles.historyRow}>
        {historyTags.map((label, i) => (
          <View
            // eslint-disable-next-line react/no-array-index-key
            key={`h-${label}-${i}`}
            className={styles.historyTagHit}
            onClick={() => handlePickHistory(label)}
          >
            <Tag
              color="var(--color-bg-tag)"
              textColor="var(--color-text-tag)"
              customClass={styles.sheetTag}
            >
              {label}
            </Tag>
          </View>
        ))}
      </View>
      <View id={ADD_TAG_NEW_PILL_ID} className={clsx(styles.newPill)}>
        {Strings.getLang('tag_add_placeholder')}
      </View>
    </BottomSheetWithCustomTitle>
  );
};

export default React.memo(AddTagBottomSheet);
