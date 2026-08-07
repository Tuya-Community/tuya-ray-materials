import React, { useState, useEffect } from 'react';
import { View, Button } from '@ray-js/ray';
import { BottomSheet } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { ContentType } from '../../types';
import { CONTENT_TYPE } from '../../constants';
import RadioOptionGroup, { RadioOption } from '../RadioOptionGroup';
import SwitchOptionGroup, { SwitchOption } from '../SwitchOptionGroup';
import ConfigSection from '../ConfigSection';

import sharedStyles from '../shared/common.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  shareType: string[];
  setShareType: (types: string[]) => void;
  isTranslateAvailable: boolean;
  isSpeakerLabelAvailable: boolean;
  onSuccess?: () => void; // 配置成功后的回调
}

// 定义所有 trans 相关的配置项
const ALL_TRANS_CONFIGS = [
  CONTENT_TYPE.ORIGINAL,
  CONTENT_TYPE.TRANSLATION,
  CONTENT_TYPE.ORIGINAL_AND_TRANSLATION,
  CONTENT_TYPE.TRANSCRIPT_PARAGRAPH_TIME,
  CONTENT_TYPE.TRANSCRIPT_SPEAKER,
];

const Index: React.FC<IProps> = props => {
  const {
    statusBarHeight,
    safeArea: { height },
  } = useSelector(state => state.systemInfo);
  const {
    show,
    onClose,
    isTranslateAvailable,
    isSpeakerLabelAvailable,
    shareType,
    setShareType,
    onSuccess,
  } = props;
  const [contentType, setContentType] = useState<ContentType>();
  const [showParagraphTime, setShowParagraphTime] = useState(false);
  const [showSpeakerLabel, setShowSpeakerLabel] = useState(false);

  // 弹窗打开时，根据 shareType 初始化配置
  useEffect(() => {
    if (show) {
      // 检查是否包含段落时间
      setShowParagraphTime(shareType.includes(CONTENT_TYPE.TRANSCRIPT_PARAGRAPH_TIME));
      // 检查是否包含说话人标签
      setShowSpeakerLabel(shareType.includes(CONTENT_TYPE.TRANSCRIPT_SPEAKER));
      // 检查内容类型
      if (shareType.includes(CONTENT_TYPE.ORIGINAL_AND_TRANSLATION)) {
        setContentType(CONTENT_TYPE.ORIGINAL_AND_TRANSLATION);
      } else if (shareType.includes(CONTENT_TYPE.TRANSLATION)) {
        setContentType(CONTENT_TYPE.TRANSLATION);
      } else if (shareType.includes(CONTENT_TYPE.ORIGINAL)) {
        setContentType(CONTENT_TYPE.ORIGINAL);
      } else {
        setContentType(undefined);
      }
    }
  }, [show, shareType]);

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

    // 如果取消选中内容类型，则同时取消所有 switch 选项
    if (!name) {
      setShowParagraphTime(false);
      setShowSpeakerLabel(false);
    }

    setContentType(name as ContentType);
  };

  const handleParagraphTimeChange = (checked: boolean) => {
    setShowParagraphTime(checked);
    // 如果开启且没有选中任何内容类型，则默认选中原文
    if (checked && !contentType) {
      setContentType(CONTENT_TYPE.ORIGINAL);
    }
  };

  const handleSpeakerChange = (checked: boolean) => {
    if (!isSpeakerLabelAvailable && checked) {
      ty.showToast({
        title: Strings.getLang('copyTranscriptionConfigPopup_speakerNotEnabled'),
        icon: 'none',
      });
      return;
    }
    setShowSpeakerLabel(checked);
    // 如果开启且没有选中任何内容类型，则默认选中原文
    if (checked && !contentType) {
      setContentType(CONTENT_TYPE.ORIGINAL);
    }
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
      onChange: handleParagraphTimeChange,
    },
    {
      key: 'speakerLabel',
      label: Strings.getLang('copyTranscriptionConfigPopup_speakerLabel'),
      checked: showSpeakerLabel,
      onChange: handleSpeakerChange,
    },
  ];

  const handleSetConfig = () => {
    // 构建新的 trans 配置
    const newTransConfigs = [];
    if (showParagraphTime) {
      newTransConfigs.push(CONTENT_TYPE.TRANSCRIPT_PARAGRAPH_TIME);
    }
    if (showSpeakerLabel) {
      newTransConfigs.push(CONTENT_TYPE.TRANSCRIPT_SPEAKER);
    }
    if (contentType) {
      newTransConfigs.push(contentType);
    }

    // 分离 trans 相关配置和其他配置（audio, summary, mindmap 等）
    const otherItems = shareType.filter(
      item => !ALL_TRANS_CONFIGS.includes(item as ContentType) && item !== 'trans'
    );

    let uniqueResult: string[];

    // 如果有配置项，则包含 'trans'；否则不包含（取消选中）
    if (newTransConfigs.length > 0) {
      // 合并结果：其他配置 + 新的 trans 配置 + 'trans'
      const result = [...otherItems, ...newTransConfigs, 'trans'];
      uniqueResult = Array.from(new Set(result));
    } else {
      // 没有选择任何 trans 配置，移除 'trans'
      uniqueResult = otherItems;
    }

    setShareType(uniqueResult);

    // 通知父组件状态已更新
    onSuccess?.();

    onClose();
  };

  return (
    <BottomSheet
      contentHeight={`${height - statusBarHeight}px`}
      customClass={sharedStyles.bottomSheet}
      show={show}
      onClose={onClose}
      title={Strings.getLang('share_link_modal_trans_config_title')}
    >
      <View className={sharedStyles.content}>
        {/* 内容 */}
        <ConfigSection title={Strings.getLang('share_link_modal_trans_config_title')}>
          <RadioOptionGroup
            value={contentType}
            options={contentTypeOptions}
            allowDeselect
            onChange={handleContentTypeChange}
          />
        </ConfigSection>

        {/* 正文内容 */}
        <ConfigSection title={Strings.getLang('copyTranscriptionConfigPopup_bodyContent')}>
          <SwitchOptionGroup options={switchOptions} />
        </ConfigSection>
      </View>
      <View className={sharedStyles.buttonWrapper}>
        <Button type="primary" className={sharedStyles.button} onClick={handleSetConfig}>
          {Strings.getLang('confirm')}
        </Button>
      </View>
    </BottomSheet>
  );
};

export default Index;
