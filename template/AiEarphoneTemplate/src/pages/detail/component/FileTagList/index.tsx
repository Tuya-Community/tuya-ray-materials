import React, { FC, useCallback, useState } from 'react';
import { View, Text } from '@ray-js/components';
import { router } from '@ray-js/ray';
import { Icon } from '@ray-js/smart-ui';
import plusIcon from '@tuya-miniapp/icons/dist/svg/Plus';
import Strings from '@/i18n';
import styles from './index.module.less';
import { useTagRowLayout } from './useTagRowLayout';
import AddTagBottomSheet from './AddTagBottomSheet';

export interface FileTagListProps {
  /** 标签文案列表 */
  tags?: string[];
  /** 录音 recordId，有值时才可打开编辑弹层 */
  recordId?: string;
  /** 标签变更后同步到详情（接口成功后调用） */
  onTagsChange?: (next: string[]) => void;
}

const AddChip: FC<{ measureId?: string; onClick?: () => void }> = ({ measureId, onClick }) => (
  <View id={measureId} className={styles.addChip} onClick={onClick}>
    <Icon name={plusIcon} size={12} color="var(--color-text-tertiary)" />
    <Text className={styles.addText}>{Strings.getLang('add')}</Text>
  </View>
);

const TagChip: FC<{ label: string; measureId?: string }> = ({ label, measureId }) => {
  const handleTagClick = useCallback(() => {
    const keyword = String(label ?? '').trim();
    if (!keyword) {
      return;
    }
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`, { subpackage: 'pkgEntry' });
  }, []);

  return (
    <View id={measureId} className={styles.chip} onClick={handleTagClick}>
      <Text className={styles.tagText}>{label}</Text>
    </View>
  );
};

const MeasuredExpandChip: FC<{ n: number; measureId: string }> = ({ n, measureId }) => (
  <View id={measureId} className={styles.chip}>
    <Text className={styles.expandText}>+{n}</Text>
  </View>
);

const FileTagList: FC<FileTagListProps> = ({ tags = [], recordId, onTagsChange }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const canEditTags = Boolean(recordId && onTagsChange);
  const openSheet = useCallback(() => {
    if (canEditTags) {
      setSheetOpen(true);
    }
  }, [canEditTags]);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const {
    uid,
    expanded,
    setExpanded,
    handleCollapse,
    visibleTags,
    hiddenCount,
    showExpand,
    showCollapse,
    rowClassName,
  } = useTagRowLayout(tags);

  return (
    <View className={styles.wrap} id={`${uid}_c`}>
      {sheetOpen && recordId && onTagsChange ? (
        <AddTagBottomSheet
          show={sheetOpen}
          recordId={recordId}
          tags={tags}
          onClose={closeSheet}
          onTagsChange={onTagsChange}
        />
      ) : null}
      {tags.length > 0 && (
        <View className={styles.measureRoot}>
          <AddChip measureId={`${uid}_add`} />
          {tags.map((label, i) => (
            // eslint-disable-next-line react/no-array-index-key -- tags 无业务 id，顺序与测量节点一致
            <TagChip key={`${uid}-m-${i}-${label}`} label={label} measureId={`${uid}_m_${i}`} />
          ))}
          {/* 只测「+总数」宽度，计算时作所有 +hidden 的上界，避免 N 个节点与 N 次 query */}
          <MeasuredExpandChip n={tags.length} measureId={`${uid}_e`} />
        </View>
      )}

      <View className={rowClassName}>
        <AddChip onClick={canEditTags ? openSheet : undefined} />
        {visibleTags.map((label, i) => (
          // eslint-disable-next-line react/no-array-index-key -- string[] 无唯一 id
          <TagChip key={`${uid}-v-${expanded ? 'x' : '1'}-${i}-${label}`} label={label} />
        ))}
        {showExpand && (
          <View className={styles.chip} onClick={() => setExpanded(true)}>
            <Text className={styles.expandText}>+{hiddenCount}</Text>
          </View>
        )}
        {showCollapse && (
          <View className={styles.chip} onClick={handleCollapse}>
            <Text className={styles.collapseText}>{Strings.getLang('collapse')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(FileTagList);
