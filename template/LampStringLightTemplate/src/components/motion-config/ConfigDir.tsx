import React from 'react';

import Strings from '@/i18n';
import { ConfigItem } from './ConfigItem';

export const ConfigDir: React.FC<{ value: any; onChange(value: any): void }> = ({
  value,
  onChange,
}) => {
  return (
    <ConfigItem
      value={value}
      onChange={onChange}
      title={Strings.getLang('motion_config_dir')}
      tabs={[
        {
          tab: Strings.getLang('motion_config_dir_1'),
          tabKey: '0',
        },
        {
          tab: Strings.getLang('motion_config_dir_2'),
          tabKey: '1',
        },
      ]}
    />
  );
};
