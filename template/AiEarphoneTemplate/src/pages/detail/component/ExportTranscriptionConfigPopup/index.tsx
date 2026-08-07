import React, { useState, useCallback } from 'react';
import { View, Button } from '@ray-js/ray';
import Strings from '@/i18n';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import CustomCoverView from '@/components/CustomCoverView';
import { ContentType, ExportFormatType } from '../../types';
import { CONTENT_TYPE, EXPORT_FORMAT } from '../../constants';
import RadioOptionGroup, { RadioOption } from '../RadioOptionGroup';
import SwitchOptionGroup, { SwitchOption } from '../SwitchOptionGroup';
import ConfigSection from '../ConfigSection';

import sharedStyles from '../shared/common.module.less';

// 导出类型供外部使用
export type { ContentType, ExportFormatType };

interface IProps {
  show: boolean;
  isTranslateAvailable: boolean;
  isSpeakerLabelAvailable: boolean;
  onClose: () => void;
  onConfirm: (config: {
    contentType: ContentType;
    showTime: boolean;
    showSpeaker: boolean;
    exportType: ExportFormatType;
  }) => void;
}

// 导出格式选项
const formatOptions: RadioOption[] = [
  {
    name: EXPORT_FORMAT.MD,
    label: Strings.getLang('exportTranscriptionConfigPopup_markdown'),
  },
  {
    name: EXPORT_FORMAT.PDF,
    label: Strings.getLang('exportTranscriptionConfigPopup_pdf'),
  },
  {
    name: EXPORT_FORMAT.DOCX,
    label: Strings.getLang('exportTranscriptionConfigPopup_docx'),
  },
];

const Index: React.FC<IProps> = props => {
  const { show, onClose, onConfirm, isTranslateAvailable, isSpeakerLabelAvailable } = props;
  const [copyContentType, setCopyContentType] = useState<ContentType>(CONTENT_TYPE.ORIGINAL);
  const [showParagraphTime, setShowParagraphTime] = useState(false);
  const [showSpeakerLabel, setShowSpeakerLabel] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormatType>(EXPORT_FORMAT.MD);
  const [loading, setLoading] = useState(false);

  // 内容类型选项
  const contentTypeOptions: RadioOption[] = [
    {
      name: CONTENT_TYPE.ORIGINAL,
      label: Strings.getLang('exportTranscriptionConfigPopup_original'),
    },
    {
      name: CONTENT_TYPE.TRANSLATION,
      label: Strings.getLang('exportTranscriptionConfigPopup_translation'),
      disabled: !isTranslateAvailable,
    },
    {
      name: CONTENT_TYPE.ORIGINAL_AND_TRANSLATION,
      label: Strings.getLang('exportTranscriptionConfigPopup_originalAndTranslation'),
      disabled: !isTranslateAvailable,
    },
  ];

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

  // 处理格式选择
  const handleFormatChange = (name: string) => {
    setExportFormat(name as ExportFormatType);
  };

  const handleSpeakerChange = (checked: boolean) => {
    if (!isSpeakerLabelAvailable) {
      ty.showToast({
        title: Strings.getLang('exportTranscriptionConfigPopup_speakerNotEnabled'),
        icon: 'none',
      });
      return;
    }
    setShowSpeakerLabel(checked);
  };

  // 开关选项
  const switchOptions: SwitchOption[] = [
    {
      key: 'paragraphTime',
      label: Strings.getLang('exportTranscriptionConfigPopup_paragraphTime'),
      checked: showParagraphTime,
      onChange: setShowParagraphTime,
    },
    {
      key: 'speakerLabel',
      label: Strings.getLang('exportTranscriptionConfigPopup_speakerLabel'),
      checked: showSpeakerLabel,
      onChange: handleSpeakerChange,
    },
  ];

  // 处理导出
  const handleExport = useCallback(async () => {
    setLoading(true);
    await onConfirm({
      contentType: copyContentType,
      showTime: showParagraphTime,
      showSpeaker: showSpeakerLabel,
      exportType: exportFormat,
    });
    setLoading(false);
  }, [copyContentType, showParagraphTime, showSpeakerLabel, exportFormat, onConfirm]);

  return (
    <CustomCoverView>
      <BottomSheetWithCustomTitle
        customClass={sharedStyles.bottomSheet}
        show={show}
        maxHeight="100%"
        onClose={onClose}
        title={Strings.getLang('share_modal_export_transcribe')}
      >
        <View className={sharedStyles.content} id="exportTranscriptionConfigPopup">
          {/* 导出内容 */}
          <ConfigSection title={Strings.getLang('exportTranscriptionConfigPopup_contentType')}>
            <RadioOptionGroup
              value={copyContentType}
              options={contentTypeOptions}
              onChange={handleContentTypeChange}
            />
          </ConfigSection>

          {/* 正文内容 */}
          <ConfigSection title={Strings.getLang('exportTranscriptionConfigPopup_bodyContent')}>
            <SwitchOptionGroup options={switchOptions} />
          </ConfigSection>

          {/* 选择格式 */}
          <ConfigSection title={Strings.getLang('exportTranscriptionConfigPopup_selectFormat')}>
            <RadioOptionGroup
              value={exportFormat}
              options={formatOptions}
              onChange={handleFormatChange}
            />
          </ConfigSection>
        </View>
        <View className={sharedStyles.buttonWrapper}>
          <Button
            type="primary"
            className={sharedStyles.button}
            onClick={handleExport}
            loading={loading}
          >
            {loading
              ? Strings.getLang('export_ing')
              : Strings.getLang('exportTranscriptionConfigPopup_export')}
          </Button>
        </View>
      </BottomSheetWithCustomTitle>
    </CustomCoverView>
  );
};

export default Index;
