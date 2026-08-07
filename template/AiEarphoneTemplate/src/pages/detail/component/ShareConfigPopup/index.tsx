import React, { useState, useCallback } from 'react';
import { View, Button } from '@ray-js/ray';
import { BottomSheet } from '@ray-js/smart-ui';
import { ExportFormatType } from '../../types';
import RadioOptionGroup, { RadioOption } from '../RadioOptionGroup';
import ConfigSection from '../ConfigSection';

import sharedStyles from '../shared/common.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
}

const Index: React.FC<IProps> = props => {
  const { show, onClose } = props;
  const [exportFormat, setExportFormat] = useState<ExportFormatType>('md');

  // 处理格式选择
  const handleFormatChange = (name: string) => {
    setExportFormat(name as ExportFormatType);
  };

  const formatOptions: RadioOption[] = [
    {
      name: 'video',
      label: '音频',
    },
    {
      name: 'mind',
      label: '思维导图',
    },
  ];

  const handleShareLink = useCallback(() => {}, []);

  return (
    <BottomSheet
      customClass={sharedStyles.bottomSheet}
      show={show}
      onClose={onClose}
      title="分享链接"
    >
      <View className={sharedStyles.content}>
        <ConfigSection title="分享内容">
          <RadioOptionGroup
            value={exportFormat}
            options={formatOptions}
            onChange={handleFormatChange}
          />
        </ConfigSection>
      </View>
      <View className={sharedStyles.buttonWrapper}>
        <Button type="primary" className={sharedStyles.button} onClick={handleShareLink}>
          分享链接
        </Button>
      </View>
    </BottomSheet>
  );
};

export default Index;
