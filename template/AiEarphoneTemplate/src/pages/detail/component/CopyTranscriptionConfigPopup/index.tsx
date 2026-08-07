import React, { useState, useCallback } from 'react';
import { View, Button } from '@ray-js/ray';
import Strings from '@/i18n';
import { convertSecondsToTime } from '@/utils';
import { tttSetClipboardData } from '@/api/ttt';
import { TranscriptSegment } from '@/types/file';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import CustomCoverView from '@/components/CustomCoverView';
import { ContentType } from '../../types';
import { CONTENT_TYPE } from '../../constants';
import RadioOptionGroup, { RadioOption } from '../RadioOptionGroup';
import SwitchOptionGroup, { SwitchOption } from '../SwitchOptionGroup';
import ConfigSection from '../ConfigSection';

import sharedStyles from '../shared/common.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  transferList: TranscriptSegment[];
  isTranslateAvailable: boolean;
  isSpeakerLabelAvailable: boolean;
  onSuccess?: () => void; // 复制成功后的回调
}

const Index: React.FC<IProps> = props => {
  const { show, onClose, transferList, onSuccess, isTranslateAvailable, isSpeakerLabelAvailable } =
    props;
  const [copyContentType, setCopyContentType] = useState<ContentType>(CONTENT_TYPE.ORIGINAL);
  const [showParagraphTime, setShowParagraphTime] = useState(false);
  const [showSpeakerLabel, setShowSpeakerLabel] = useState(false);

  // 生成文本（支持配置选项）
  const generateTextWithConfig = useCallback(
    (
      list: TranscriptSegment[],
      config: {
        contentType: ContentType;
        showTime: boolean;
        showSpeaker: boolean;
      }
    ) => {
      return list
        .map(item => {
          const headerParts = [];
          const contentParts = [];

          // 添加说话人标签
          if (config.showSpeaker && item.speaker) {
            headerParts.push(item.speaker);
          }

          // 添加时间
          if (config.showTime) {
            const time = convertSecondsToTime(item.startSecond);
            headerParts.push(time);
          }

          // 添加文本内容
          if (config.contentType === CONTENT_TYPE.ORIGINAL) {
            contentParts.push(item.text);
          } else if (config.contentType === CONTENT_TYPE.TRANSLATION) {
            contentParts.push(item.transText || item.text);
          } else if (config.contentType === CONTENT_TYPE.ORIGINAL_AND_TRANSLATION) {
            contentParts.push(item.text);
            if (item.transText) {
              contentParts.push(item.transText);
            }
          }

          const header = headerParts.length > 0 ? headerParts.join('  ') : '';
          const content = contentParts.join('\n');

          return header ? `${header}\n${content}` : content;
        })
        .join('\n');
    },
    []
  );

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    await tttSetClipboardData(text);
    ty.showToast({
      title: Strings.getLang('share_modal_copy_success_toast'),
      icon: 'success',
    });
    onSuccess?.();
  };

  // 处理内容类型选择
  const handleContentTypeChange = (name: string) => {
    if (
      !isTranslateAvailable &&
      (name === CONTENT_TYPE.TRANSLATION || name === CONTENT_TYPE.ORIGINAL_AND_TRANSLATION)
    ) {
      ty.showToast({
        title: Strings.getLang('action_not_translate_tip'),
        icon: 'none',
      });
      return;
    }
    setCopyContentType(name as ContentType);
  };

  // 处理复制转写（带配置）
  const handleCopyWithConfig = useCallback(async () => {
    try {
      const text = generateTextWithConfig(transferList, {
        contentType: copyContentType,
        showTime: showParagraphTime,
        showSpeaker: showSpeakerLabel,
      });
      await copyToClipboard(text);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }, [transferList, copyContentType, showParagraphTime, showSpeakerLabel, generateTextWithConfig]);

  const handleSpeakerChange = (checked: boolean) => {
    if (!isSpeakerLabelAvailable) {
      ty.showToast({
        title: Strings.getLang('copyTranscriptionConfigPopup_speakerNotEnabled'),
        icon: 'none',
      });
      return;
    }
    setShowSpeakerLabel(checked);
  };

  // 内容类型选项
  const contentTypeOptions: RadioOption[] = [
    {
      name: CONTENT_TYPE.ORIGINAL,
      label: Strings.getLang('copyTranscriptionConfigPopup_original'),
    },
    {
      name: CONTENT_TYPE.TRANSLATION,
      label: Strings.getLang('copyTranscriptionConfigPopup_translation'),
      disabled: !isTranslateAvailable,
    },
    {
      name: CONTENT_TYPE.ORIGINAL_AND_TRANSLATION,
      label: Strings.getLang('copyTranscriptionConfigPopup_originalAndTranslation'),
      disabled: !isTranslateAvailable,
    },
  ];

  // 开关选项
  const switchOptions: SwitchOption[] = [
    {
      key: 'paragraphTime',
      label: Strings.getLang('copyTranscriptionConfigPopup_paragraphTime'),
      checked: showParagraphTime,
      onChange: setShowParagraphTime,
    },
    {
      key: 'speakerLabel',
      label: Strings.getLang('copyTranscriptionConfigPopup_speakerLabel'),
      checked: showSpeakerLabel,
      onChange: handleSpeakerChange,
    },
  ];

  return (
    <CustomCoverView>
      <BottomSheetWithCustomTitle
        customClass={sharedStyles.bottomSheet}
        show={show}
        onClose={onClose}
        title={Strings.getLang('share_modal_copy_transcription')}
      >
        <View className={sharedStyles.content}>
          {/* 复制内容 */}
          <ConfigSection title={Strings.getLang('copyTranscriptionConfigPopup_contentType')}>
            <RadioOptionGroup
              value={copyContentType}
              options={contentTypeOptions}
              onChange={handleContentTypeChange}
            />
          </ConfigSection>

          {/* 正文内容 */}
          <ConfigSection title={Strings.getLang('copyTranscriptionConfigPopup_bodyContent')}>
            <SwitchOptionGroup options={switchOptions} />
          </ConfigSection>
        </View>
        <View className={sharedStyles.buttonWrapper}>
          <Button type="primary" className={sharedStyles.button} onClick={handleCopyWithConfig}>
            {Strings.getLang('copyTranscriptionConfigPopup_copy')}
          </Button>
        </View>
      </BottomSheetWithCustomTitle>
    </CustomCoverView>
  );
};

export default Index;
