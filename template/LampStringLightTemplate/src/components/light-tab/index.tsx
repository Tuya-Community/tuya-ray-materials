import React from 'react';

import Strings from '@/i18n';
import res from '@/res';
import { WORK_MODE } from '@/types';
import { useActions } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';

import { ControlTabs } from '../control-tabs';
import styles from './index.module.less';

enum Road {
  road1 = 'road1',
  road2 = 'road2',
  road3 = 'road3',
  road4 = 'road4',
  road5 = 'road5',
}
export interface LightTabProps {
  colorContent: React.ReactNode;
  whiteContent: React.ReactNode;
  colorMode: string;
  road: Road;
  onChangeColorMode: (colorMode: string) => void;
}

export const LightTab: React.FC<LightTabProps> = ({
  colorContent,
  whiteContent,
  colorMode,
  road,
  onChangeColorMode,
}) => {
  const handleChangeColorMode = name => {
    onChangeColorMode && onChangeColorMode(name);
  };

  const isWhite = colorMode === 'white';
  const isShowTab = road === Road.road4 || road === Road.road5;
  return (
    <View className={styles.contain}>
      <View className={styles.main}>
        {isShowTab && (
          <View className={styles.tabWrap}>
            <ControlTabs
              activeKey={colorMode}
              tabs={[
                {
                  tab: Strings.getLang('colour'),
                  tabKey: WORK_MODE.colour,
                },
                {
                  tab: Strings.getLang('white'),
                  tabKey: WORK_MODE.white,
                },
              ]}
              onChange={handleChangeColorMode}
            />
          </View>
        )}
        <View className={styles.content}>{!isWhite ? colorContent : whiteContent}</View>
      </View>
    </View>
  );
};
