import React, { useEffect } from 'react';
import { View, Image, showMenuButton } from '@ray-js/ray';
import { useAppDispatch } from '@/redux';
import { selectActiveTab, updateActiveTab } from '@/redux/modules/otherSlice';
import { useSelector } from 'react-redux';
import Strings from '@/i18n';
import { getCdnPath } from '@/utils/getCdnPath';
import Functional from '../functional';
import Gallery from '../gallery';
import styles from './index.module.less';

const tabIconFunActiveIcon = getCdnPath('images/tabIcon_fun_active.png');
const tabIconFunIcon = getCdnPath('images/tabIcon_fun.png');
const tabIconMyActiveIcon = getCdnPath('images/tabIcon_my_active.png');
const tabIconMyIcon = getCdnPath('images/tabIcon_my.png');

export const Home = () => {
  const dispatch = useAppDispatch();
  const currentTab = useSelector(selectActiveTab);

  useEffect(() => {
    showMenuButton();
  }, []);

  const targgleTab = tab => {
    dispatch(updateActiveTab(tab));
  };

  return (
    <View className={styles.pageWrap}>
      <View className={styles.contanier}>
        {currentTab === 'functional' && <Functional />}
        {currentTab === 'gallery' && <Gallery />}
      </View>
      <View className={styles.tabBar}>
        <View className={styles.tab} onClick={() => targgleTab('functional')}>
          <Image
            className={styles.icon}
            src={currentTab === 'functional' ? tabIconFunActiveIcon : tabIconFunIcon}
            mode="aspectFill"
          />
          <View className={currentTab === 'functional' ? styles.textActive : styles.text}>
            {Strings.getLang('function')}
          </View>
        </View>
        <View className={styles.tab} onClick={() => targgleTab('gallery')}>
          <Image
            className={styles.icon}
            src={currentTab === 'gallery' ? tabIconMyActiveIcon : tabIconMyIcon}
            mode="aspectFill"
          />
          <View className={currentTab === 'gallery' ? styles.textActive : styles.text}>
            {Strings.getLang('gallery')}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
