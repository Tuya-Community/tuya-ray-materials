import React from 'react';
import { View } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import Diy from './Diy';
import styles from './index.module.less';

function My() {
  return (
    <View className={styles.myPageWrap}>
      <NavBar
        customClass={styles.navBar}
        leftText={Strings.getLang('gallery')}
        leftTextType="home"
      />
      <View className={styles.container}>
        <View className={styles.tabs} id="tabs">
          <Diy />
        </View>
      </View>
    </View>
  );
}

export default My;
