import React, { useMemo } from 'react';
import { View } from '@ray-js/ray';
import { Swiper, Text } from '@ray-js/components';
import { TopBar } from '@/components';
import { useSelector } from 'react-redux';
import { selectUiStateByKey } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import SwiperContent, { defaultConfigs } from '@/components/SwiperContent/index';

// @ts-ignore
import styles from './index.module.less';

export default function Home() {
  // mode的功能点配置
  const modeConfigList = useSelector(selectUiStateByKey('modeConfigList'));
  const productStyle = useSelector(selectUiStateByKey('productStyle'));
  const isBtEntryVersion = useSelector(selectUiStateByKey('isBtEntryVersion'));
  // 卡片设备仅有电话和会议模式
  const isCardStyle = productStyle === 'card';
  const [current, setCurrent] = React.useState(0);

  const guideConfigs = useMemo(() => {
    const datas = defaultConfigs.filter(item => {
      if (!isBtEntryVersion && !isCardStyle) {
        // 非入门版耳机，且非卡片设备，不展示faceToFace
        return item.key !== 'faceToFace';
      }
      if (isCardStyle) {
        const unShowkeys = ['simultaneous', 'realtime'];
        return modeConfigList.includes(item.key) && !unShowkeys.includes(item.key);
      }
      return modeConfigList.includes(item.key);
    });
    console.log('guideConfigs:', datas);
    return datas;
  }, [modeConfigList]);

  const getSwiperItem = (key: string) => {
    const item = guideConfigs.find(config => config.key === key);

    const param = {
      name: item.name,
      desc: item?.desc,
      imgPath: item.imgPath,
    };

    return (
      <View className={styles.swiperItemBox}>
        <SwiperContent {...param} />
      </View>
    );
  };

  const renderTitle = () => {
    return <Text className={styles.title}>{Strings.getLang('useHelp')}</Text>;
  };

  return (
    <View className={styles.main}>
      <TopBar renderTitle={renderTitle} />
      <Swiper
        current={current}
        dots
        className={styles.swiper}
        dataSource={guideConfigs.map(item => item.key)}
        renderItem={getSwiperItem}
        onChange={event => {
          const { current } = event;
          setCurrent(current);
        }}
      />
    </View>
  );
}
