import React, { useState } from 'react';
import { View, Swiper, Image } from '@ray-js/ray';
import { isEmpty } from 'lodash';
import styles from './index.module.less';

export const SwiperView = ({ bannerData = [] }) => {
  const [current, setCurrent] = useState(0);

  const goToUrl = url => {
    if (url === '') return;
    ty.openInnerH5({ url });
  };
  return (
    <View className={styles.container}>
      {isEmpty(bannerData) && <View />}
      {!isEmpty(bannerData) && (
        <View className={styles.bannerContainer}>
          {bannerData.length > 1 && (
            <Swiper
              current={current}
              dots
              autoplay
              circular
              dotActiveColor="#36D100"
              dotColor="#fff"
              interval={5000}
              className={styles.swiper}
              dataSource={bannerData}
              renderItem={(item, index) => {
                return (
                  <Image
                    className={styles.swiperItem}
                    src={item?.sourceList[0]?.image}
                    onClick={i => goToUrl(item?.sourceList[0]?.url)}
                  />
                );
              }}
              onChange={event => {
                const { current: _current } = event?.detail;
                setCurrent(_current);
              }}
            />
          )}
          {bannerData.length === 1 && (
            <Image
              src={bannerData[0]?.sourceList[0]?.image}
              className={styles.swiperItem}
              onClick={() => goToUrl(bannerData[0]?.sourceList[0]?.url)}
            />
          )}
        </View>
      )}
    </View>
  );
};
