import React, { FC, useEffect } from 'react';
import { router, Swiper, View } from '@ray-js/ray';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMultiMaps, selectMultiMaps } from '@/redux/modules/multiMapsSlice';
import { NavBar, Toast } from '@ray-js/smart-ui';
import Strings from '@/i18n';

import styles from './index.module.less';
import Item from './Item';

const MultiMap: FC = () => {
  const dispatch = useDispatch();
  const multiMaps = useSelector(selectMultiMaps);

  useEffect(() => {
    dispatch(fetchMultiMaps());
  }, []);

  return (
    <View className={styles.container}>
      <NavBar title={Strings.getLang('dsc_multi_map')} leftArrow onClickLeft={router.back} />
      <Swiper
        dots
        className={styles.swiper}
        dataSource={multiMaps}
        renderItem={(item: MultiMap) => {
          return <Item key={item.id} data={item} />;
        }}
      />
      <Toast id="smart-toast" />
    </View>
  );
};

export default MultiMap;
