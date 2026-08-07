import React, { useState, useCallback } from 'react';
import { View, Button } from '@ray-js/ray';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import Strings from '@/i18n';
import CustomCoverView from '@/components/CustomCoverView';
import { ExportFormatType } from '../../types';
import { EXPORT_FORMAT } from '../../constants';
import RadioOptionGroup, { RadioOption } from '../RadioOptionGroup';
import ConfigSection from '../ConfigSection';

import sharedStyles from '../shared/common.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (config: { exportType: ExportFormatType }) => void;
}

// 导出格式选项
const formatOptions: RadioOption[] = [
  {
    name: EXPORT_FORMAT.MD,
    label: Strings.getLang('exportSummaryConfigPopup_markdown'),
  },
  {
    name: EXPORT_FORMAT.DOCX,
    label: Strings.getLang('exportSummaryConfigPopup_docx'),
  },
  {
    name: EXPORT_FORMAT.PDF,
    label: Strings.getLang('exportSummaryConfigPopup_pdf'),
  },
  {
    name: EXPORT_FORMAT.JPG,
    label: Strings.getLang('exportSummaryConfigPopup_jpg'),
  },
];

const Index: React.FC<IProps> = props => {
  const { show, onClose, onConfirm } = props;
  const [exportFormat, setExportFormat] = useState<ExportFormatType>(EXPORT_FORMAT.MD);
  const [loading, setLoading] = useState(false);

  // 处理格式选择
  const handleFormatChange = (name: string) => {
    setExportFormat(name as ExportFormatType);
  };

  // 处理导出
  const handleExport = useCallback(async () => {
    setLoading(true);
    await onConfirm({
      exportType: exportFormat,
    });
    setLoading(false);
  }, [exportFormat, onConfirm]);

  return (
    <CustomCoverView>
      <BottomSheetWithCustomTitle
        customClass={sharedStyles.bottomSheet}
        show={show}
        onClose={onClose}
        title={Strings.getLang('share_modal_export_summary')}
      >
        <View className={sharedStyles.content} id="exportSummaryConfigPopup">
          {/* 选择格式 */}
          <ConfigSection title={Strings.getLang('export_format_title')}>
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
            {loading ? Strings.getLang('export_ing') : Strings.getLang('export_format_confirm')}
          </Button>
        </View>
      </BottomSheetWithCustomTitle>
    </CustomCoverView>
  );
};

export default Index;
