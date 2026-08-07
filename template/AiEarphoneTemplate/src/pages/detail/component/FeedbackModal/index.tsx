import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Textarea, Button } from '@ray-js/components';
import { onKeyboardHeightChange } from '@ray-js/ray';
import CustomCoverView from '@/components/CustomCoverView';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import Strings from '@/i18n';
import { FeedbackTagItem, FeedbackType } from '@/api/interface';
import { Icon } from '@ray-js/smart-ui';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { useSelector } from '@/redux';
import styles from './index.module.less';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit?: (feedbackType: FeedbackType, data?: { tag?: string; content?: string }) => void;
  feedbackTagList?: FeedbackTagItem[];
}

const FeedbackModal: React.FC<Props> = ({ show, onClose, onSubmit, feedbackTagList }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const platform = useSelector(state => state.systemInfo.platform);

  const handleTextAreaFocus = useCallback(() => setIsKeyboardOpen(true), []);
  const handleTextAreaBlur = useCallback(() => setIsKeyboardOpen(false), []);

  const MIN_KEYBOARD_HEIGHT = 150;
  useEffect(() => {
    const unsubscribe = onKeyboardHeightChange(e => {
      setIsKeyboardOpen(e.height >= MIN_KEYBOARD_HEIGHT);
    });
    return () => {
      unsubscribe?.();
    };
  }, []);

  // 将接口返回的标签数据转换为组件使用的格式
  const feedbackTags = useMemo(
    () =>
      (feedbackTagList ?? []).map(tag => ({
        key: String(tag.id),
        label: tag.tag,
      })),
    [feedbackTagList]
  );

  const handleTagClick = (tagKey: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagKey)) {
        return prev.filter(key => key !== tagKey);
      }
      return [...prev, tagKey];
    });
  };

  const handleContentChange = (e: any) => {
    const value = e?.value ?? e?.detail?.value ?? '';
    if (value.length <= 200) {
      setContent(value);
    }
  };

  const handleSubmit = () => {
    const tagIds = selectedTags.join(',');
    onSubmit?.(1, { tag: tagIds || undefined, content });
    handleClose();
  };

  const handleClose = () => {
    setSelectedTags([]);
    setContent('');
    onClose();
  };

  return (
    <CustomCoverView needCover={show}>
      <BottomSheetWithCustomTitle
        show={show}
        customClass={
          isKeyboardOpen && platform !== 'android'
            ? styles.bottomSheetKeyboardOpen
            : styles.bottomSheet
        }
        renderTitle={() => (
          <View className={styles.header}>
            <Text className={styles.title}>{Strings.getLang('feedback_modal_title')}</Text>
            <Icon name={closeIcon} size={24} color="var(--color-gray-d8)" onClick={handleClose} />
          </View>
        )}
      >
        <View className={styles.container}>
          <Text className={styles.prompt}>{Strings.getLang('feedback_modal_prompt')}</Text>

          <View className={styles.tagsContainer}>
            {feedbackTags.map(tag => (
              <View
                key={tag.key}
                className={`${styles.tag} ${
                  selectedTags.includes(tag.key) ? styles.tagActive : ''
                }`}
                onClick={() => handleTagClick(tag.key)}
              >
                <Text
                  className={`${styles.tagText} ${
                    selectedTags.includes(tag.key) ? styles.textActive : ''
                  }`}
                >
                  {tag.label}
                </Text>
              </View>
            ))}
          </View>

          <View className={styles.textAreaContainer}>
            <Textarea
              className={styles.textArea}
              placeholder={Strings.getLang('feedback_modal_placeholder')}
              value={content}
              onInput={handleContentChange}
              onFocus={handleTextAreaFocus}
              onBlur={handleTextAreaBlur}
              maxLength={200}
            />
            <Text className={styles.charCount}>{content.length}/200</Text>
          </View>

          <Button className={styles.submitBtn} onClick={handleSubmit}>
            <Text className={styles.submitBtnText}>{Strings.getLang('feedback_modal_submit')}</Text>
          </Button>
        </View>
      </BottomSheetWithCustomTitle>
    </CustomCoverView>
  );
};

export default FeedbackModal;
