import React, { FC, useCallback } from 'react';
import { Image, View, saveImageToPhotosAlbum } from '@ray-js/ray';
import { Popup, ToastInstance } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import styles from './index.module.less';

interface Props {
  show: boolean;
  src: string;
  saveEnabled: boolean;
  onClose: () => void;
}

const PreviewImage: FC<Props> = ({ src, show, onClose, saveEnabled }) => {
  const handleSave = useCallback(() => {
    saveImageToPhotosAlbum({
      filePath: src,
      success: () => {
        console.log('saveImageToPhotosAlbum success');
        ToastInstance.success(Strings.getLang('saveImgSuccess'));
      },
      fail: error => {
        console.log('saveImageToPhotosAlbum fail', error);
        ToastInstance.fail(Strings.getLang('saveImgFail'));
      },
    });
  }, [src]);
  return (
    <Popup
      safeAreaInsetBottom={false}
      show={show}
      position="bottom"
      onClose={onClose}
      onClickOverlay={onClose}
      round
    >
      <View className={styles.container}>
        <View className={styles.header}>
          <View className={styles.close} onClick={onClose}>
            {Strings.getLang('close')}
          </View>
          <View className={styles.title}>{Strings.getLang('preview')}</View>
          {saveEnabled ? (
            <View className={styles.save} onClick={handleSave}>
              {Strings.getLang('saveImg')}
            </View>
          ) : (
            <View className={styles.save} />
          )}
        </View>
        <View className={styles.content}>
          <Image src={src} className={styles.img} mode="aspectFit" />
        </View>
      </View>
    </Popup>
  );
};

export default PreviewImage;
