import React from 'react';
import { View, router, Image } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

const uploadIcon = getCdnPath('images/upload-icon.png');

export function ImgSelect() {
  return (
    <View className={styles.pageWrap}>
      <NavBar
        customClass={styles.navBar}
        title={Strings.getLang('image')}
        leftArrow
        onClickLeft={() => router.back()}
      />
      <View className={styles.container}>
        <View className={styles.title}>{Strings.getLang('uploadImage')}</View>
        <View className={styles.desc}>{Strings.getLang('chooseAPictureFromTheAlbum')}</View>
        <View
          className={styles.box}
          onClick={() => {
            router.push('/photo-album');
          }}
        >
          <Image className={styles.icon} src={uploadIcon} mode="aspectFill" />
          <View className={styles.text}>{Strings.getLang('clickToUpload')}</View>
        </View>
      </View>
    </View>
  );
}

export default ImgSelect;
