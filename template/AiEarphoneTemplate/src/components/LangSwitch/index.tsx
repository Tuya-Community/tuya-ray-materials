import React from 'react';
import { View, Text, Image } from '@ray-js/components';
import Res from '@/res';

// @ts-ignore
import styles from './index.module.less';

const Index = ({
  duration,
  setShowChooseLanguagePopup,
  leftLanguage,
  rightLanguage,
  supportLangList,
  reverseLangHandle,
}) => {
  return (
    <View
      className={`${styles.langSwitchBtnBox} ${duration ? styles.langSwitchBtnBoxDisable : ''}`}
      onClick={() => {
        if (duration) return; // 录音中不允许切换语言
        setShowChooseLanguagePopup(true);
      }}
    >
      <View>
        <View className={styles.faceLangSwitchBtn}>
          <View className={styles.lrIcon}>
            <Text>L</Text>
          </View>

          <Text className={styles.langText}>
            {supportLangList?.find(i => i.lang === leftLanguage)?.display || ''}
          </Text>
          <View className={styles.triangleDown} />
        </View>
      </View>
      <View
        className={styles.transImgBox}
        onClick={e => {
          e.origin.stopPropagation(); // 阻止冒泡，避免触发上层的点击事件
          reverseLangHandle();
        }}
      >
        <Image className={styles.langTransIcon} src={Res.imgTransIcon} />
      </View>

      <View className={styles.faceLangSwitchBtn}>
        <View className={styles.lrIcon}>
          <Text>R</Text>
        </View>
        <Text className={styles.langText}>
          {supportLangList?.find(i => i.lang === rightLanguage)?.display || ''}
        </Text>
        <View className={styles.triangleDown} />
      </View>
    </View>
  );
};

export default Index;
