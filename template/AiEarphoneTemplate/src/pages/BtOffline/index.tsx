import React from 'react';
import { View, Text, Button, Image, ScrollView } from '@ray-js/ray';
import { TopBar } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';

// @ts-ignore
import styles from './index.module.less';

const Index = () => {
  return (
    <View className={styles.container}>
      <TopBar />
      <ScrollView className={styles.scrollViewBox} scrollY>
        <View className={styles.topTitle}>
          <Text>{Strings.getLang('classic_Bluetooth_not_connected')}</Text>
        </View>
        <View className={styles.content}>
          <Text className={styles.stepTitle}>{Strings.getLang('click_to_blue_set')}</Text>
          <View className={styles.box}>
            <Text className={styles.title}>{Strings.getLang('bluetoothSettings')}</Text>
            <View className={styles.imgBox}>
              <Image src={Res.cardBg} className={styles.imgBg} />
            </View>
            <Button className={styles.btn}>
              <View className={styles.btnLeftBox}>
                <Image src={Res.bleIcon} className={styles.leftIcon} />
                <Text>{Strings.getLang('bluetoothSettings')}</Text>
              </View>

              <Image src={Res.rightRow} className={styles.rightIcon} />
            </Button>
          </View>
        </View>
        <View className={`${styles.content} ${styles.mgt80}`}>
          <Text className={styles.stepTitle}>{Strings.getLang('click_ai_buds')}</Text>
          <View className={styles.box}>
            <Text className={styles.title}>{Strings.getLang('selectDevice')}</Text>
            <View className={styles.imgBox}>
              <Image src={Res.cardBg} className={styles.imgBg} />
            </View>
            <Button className={styles.btn}>
              <View className={styles.btnLeftBox}>
                <Image src={Res.earIcon} className={styles.leftEarIcon} />
                <Text>{Strings.getLang('aiBuds')}</Text>
              </View>
              <Image src={Res.adding} className={styles.rightAddIcon} />
            </Button>
          </View>
        </View>
        <View className={`${styles.content} ${styles.mgt80}`}>
          <Text className={styles.stepTitle}>{Strings.getLang('return_app')}</Text>
          <View className={styles.stepDesc}>
            <Text>{Strings.getLang('during_use')}</Text>
          </View>
          <View className={styles.bottomBox}>
            <View className={styles.btLeft}>
              <Image src={Res.imgCallMode} className={styles.callImg} />
              <View className={styles.btmTittle}>
                <Text className={styles.text}>{Strings.getLang('record_type_tag_0')}</Text>
              </View>
              <Text className={styles.btmdesc}>{Strings.getLang('mode_desc_call_recording')}</Text>
            </View>

            <View className={styles.btRight}>
              <View className={styles.mgb12}>
                <Text className={styles.bgTitle}>00:00:22</Text>
              </View>
              <Image src={Res.playBtn} className={styles.playBtn} />
              <View>
                <Text className={styles.saveBtn}>{Strings.getLang('save')}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
