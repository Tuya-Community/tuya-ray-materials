import React, { useState, useRef } from 'react';
import Strings from '@/i18n';
import { View, Image, router } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux';
import { Dialog, Toast, NavBar } from '@ray-js/smart-ui';
import { selectPhotos, addPhotosAsync, deletePhotosAsync } from '@/redux/modules/albumSlice';
import { MAX_CHOOSE_IMAGE_NUM, IMAGE_NUM } from '@/utils/constants';
import { authorizeAsync, chooseImageAsync } from '@/api/nativeApi';
import { globalLoading, globalToast, md5 } from '@/utils';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

const uploadIcon = getCdnPath('images/upload.png');
const garbageIcon = getCdnPath('images/garbage.png');

const PhotoAlbum = () => {
  const dispatch = useAppDispatch();
  const photos = useSelector(selectPhotos);
  const [showDialog, setShowDialog] = useState(false);
  const currentItem = useRef(null);

  const handleClick = () => {
    const lave = IMAGE_NUM - photos.length;
    const count = lave > MAX_CHOOSE_IMAGE_NUM ? MAX_CHOOSE_IMAGE_NUM : lave;
    // 权限请求, 写入相册权限
    authorizeAsync({ scope: 'scope.writePhotosAlbum' })
      .then(() => {
        return chooseImageAsync({
          count,
          sizeType: ['original'],
        });
      })
      .then(res => {
        globalLoading.show(Strings.getLang('loading'));
        const newPhotos = (res.tempFiles || []).map(item => {
          return {
            ...item,
            id: 60,
            md5: md5(item.path),
          };
        });
        // 筛选出 newPhotos 与 photos 相同的照片
        const _newPhotos = newPhotos.filter(item => !photos.find(old => old.md5 === item.md5));

        if (_newPhotos.length < newPhotos.length) {
          globalToast.success(
            Strings.getLang('theAlreadySelectedImageHasBeenChosenAndItHasBeenFiltered')
          );
        }

        if (_newPhotos.length > 0) {
          dispatch(addPhotosAsync(_newPhotos));
        }
        globalLoading.hide();
      })
      .catch(err => {
        console.log('=== authorizeAsync or chooseImageAsync err', err);
        globalLoading.hide();
      });
  };

  const handleDelete = async () => {
    setShowDialog(false);
    try {
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }
    dispatch(deletePhotosAsync(currentItem.current));
  };

  const clickDelete = item => {
    currentItem.current = item;
    setShowDialog(true);
  };

  return (
    <>
      <View className={styles.pageWrap}>
        <NavBar
          customClass={styles.navBar}
          title={Strings.getLang('album')}
          leftArrow
          onClickLeft={() => router.back()}
        />
        <View className={styles.container}>
          {photos.length < IMAGE_NUM && (
            <View className={styles.uploadBox} onClick={handleClick}>
              <Image className={styles.uploadIcon} src={uploadIcon} mode="aspectFill" />
            </View>
          )}
          {photos.map((item, index) => {
            return (
              <View className={styles.imgBox} key={index}>
                <Image
                  className={styles.img}
                  src={item.path}
                  mode="aspectFill"
                  onClick={() => {
                    router.push(`/cropping/${item.md5}`);
                  }}
                />
                <View
                  className={styles.deleteBox}
                  onClick={e => {
                    e.origin.stopPropagation();
                    clickDelete(item);
                  }}
                >
                  <Image className={styles.deleteIcon} src={garbageIcon} mode="aspectFill" />
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <Dialog
        useSlot
        useTitleSlot
        width="311px"
        show={showDialog}
        showCancelButton
        useConfirmButtonSlot
        useCancelButtonSlot
        onClose={() => setShowDialog(false)}
      >
        <View className={styles.textTitle}>{Strings.getLang('areYouSureYouWantToDeleteIt')}</View>
        <View className={styles.cancel} onClick={() => setShowDialog(false)}>
          {Strings.getLang('cancel')}
        </View>
        <View className={styles.saveText} onClick={handleDelete}>
          {Strings.getLang('confirm')}
        </View>
      </Dialog>
      <Toast id="gif-toast" />
    </>
  );
};

export default PhotoAlbum;
