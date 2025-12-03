import React, { useEffect } from 'react';
import { View, router, Image, showMenuButton } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { useDevice, useActions } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

const entryIcon = getCdnPath('images/entry-img.png');
const graffitiIcon = getCdnPath('images/entry-graffiti.png');
const aiIcon = getCdnPath('images/ai-icon.png');

const Functional = () => {
  const devInfo = useDevice(device => device.devInfo);
  const actions = useActions();

  useEffect(() => {
    showMenuButton();
  }, []);

  return (
    <View className={styles.pageWrap}>
      <NavBar customClass={styles.navBar} leftText={devInfo.name} leftTextType="home" />
      <View className={styles.container}>
        <View className={styles.aiBox} onClick={() => router.push('/native_ai')}>
          <Image className={styles.aiIcon} src={aiIcon} mode="aspectFit" />
          <View className={styles.aiTitle}>{Strings.getLang('aiDrawing')}</View>
        </View>
        <View
          className={styles.aiBox}
          onClick={() => {
            actions?.gadget?.set('tuya');
            router.push('/graffiti');
          }}
        >
          <Image className={styles.aiIcon} src={graffitiIcon} mode="aspectFit" />
          <View className={styles.aiTitle}>{Strings.getLang('pixelGraffiti')}</View>
        </View>
        <View className={styles.aiBox} onClick={() => router.push('/img-select')}>
          <Image className={styles.aiIcon} src={entryIcon} mode="aspectFit" />
          <View className={styles.aiTitle}>{Strings.getLang('image')}</View>
        </View>
      </View>
    </View>
  );
};

export default Functional;
