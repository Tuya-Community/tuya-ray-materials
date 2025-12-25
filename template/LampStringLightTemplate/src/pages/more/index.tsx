import React from 'react';

import { More as MoreComponent } from '@/components/more';
import { TopBar } from '@/components/top-bar';
import { useDebugPerf } from '@/hooks/useDebugPerf';
import Strings from '@/i18n';
import { router, View } from '@ray-js/ray';

import styles from './index.module.less';

export function More() {
  useDebugPerf(More);
  const alwaysShow = true;
  return (
    <View className={styles.morePageWrapper}>
      <TopBar
        title={Strings.getLang('moreFunction')}
        isShowMenu={false}
        isShowLeft
        leftText={Strings.getLang('cancel')}
        onLeftClick={() => {
          router.back();
        }}
      />
      <MoreComponent alwaysShow={alwaysShow} />
    </View>
  );
}

export default More;
