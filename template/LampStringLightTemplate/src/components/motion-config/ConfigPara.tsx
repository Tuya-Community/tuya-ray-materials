import React from 'react';

import Strings from '@/i18n';
import { ConfigItem } from './ConfigItem';

export const ConfigPara: React.FC<{ value: any; onChange(value: any): void }> = ({
  value,
  onChange,
}) => {
  return (
    <ConfigItem
      value={value}
      onChange={onChange}
      title={Strings.getLang('motion_config_para')}
      tabs={[
        {
          tab: Strings.getLang('motion_config_para_1'),
          tabKey: '0',
        },
        {
          tab: Strings.getLang('motion_config_para_2'),
          tabKey: '1',
        },
      ]}
    />
  );
};
