import React, { useState, useRef } from 'react';
import Strings from '@/i18n';
import { View, Image } from '@ray-js/ray';
import { Dialog } from '@ray-js/smart-ui';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux';
import { selectDiyList, deleteDiyAsync } from '@/redux/modules/diySlice';
import { sendPackets } from '@/api/sendData';
import { useStructuredActions } from '@ray-js/panel-sdk';
import { authorizeAsync } from '@/api/nativeApi';
import { getCdnPath } from '@/utils/getCdnPath';
import styles from './index.module.less';

const garbageIcon = getCdnPath('images/garbage.png');
const emptyIcon = getCdnPath('images/empty.png');

const Diy = () => {
  const dispatch = useAppDispatch();
  const dpActions = useStructuredActions();
  const diyList = useSelector(selectDiyList);
  const [showDialog, setShowDialog] = useState(false);
  const currentItem = useRef(null);

  const onClickImg = async item => {
    try {
      // @ts-ignore
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }
    await sendPackets({
      data: item.rawData,
      dpCode: 'gif_pro',
      params: { md5Id: item.md5 },
      sendDp: () => {
        dpActions.gif_pro.set({ md5Id: item.md5 });
      },
    });
  };

  const handleDelete = async () => {
    setShowDialog(false);
    try {
      // @ts-ignore
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }
    dispatch(deleteDiyAsync(currentItem.current));
  };

  const clickDelete = item => {
    currentItem.current = item;
    setShowDialog(true);
  };

  // 页面高度 - 顶部状态栏高度 - 导航栏高度 44px - 页面的contanier padding-top 16px - tabs高度 40px -组件 wrap padding-top 16px - 底部tabbar高度 78px - 安全区域底部高度 env(safe-area-inset-bottom)
  const scrollHeight = `calc(100vh - var(--app-device-status-height, 20px) - 44px - 16px - 40px - 16px - 78px - env(safe-area-inset-bottom))`;

  return (
    <>
      <View className={styles.diyWrap} style={{ maxHeight: scrollHeight }}>
        <View className={styles.contanier} style={{ maxHeight: scrollHeight }}>
          {diyList.length > 0 ? (
            diyList.map((item, index) => {
              return (
                <View className={styles.imgBox} key={index} onClick={() => onClickImg(item)}>
                  <Image className={styles.img} src={item.path} mode="aspectFill" />
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
            })
          ) : (
            <View className={styles.empty} style={{ height: scrollHeight }}>
              <Image className={styles.emptyImg} src={emptyIcon} mode="aspectFill" />
              <View className={styles.emptyText}>{Strings.getLang('noImg')}</View>
            </View>
          )}
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
    </>
  );
};

export default Diy;
