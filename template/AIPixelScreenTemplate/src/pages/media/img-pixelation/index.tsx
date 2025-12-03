import React, { useState } from 'react';
import { useAppDispatch } from '@/redux';
import { useSelector } from 'react-redux';
import { updateMyActiveTab, selectCropedFile } from '@/redux/modules/otherSlice';
import { addDiysAsync } from '@/redux/modules/diySlice';
import { View, Image, navigateBack } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import PixelImage from '@/components/PixelImage';
import { sendPackets } from '@/api/sendData';
import globalStorage from '@/redux/storage';
import md5 from 'md5';
import Strings from '@/i18n';
import { utils, useStructuredActions } from '@ray-js/panel-sdk';
import { authorizeAsync } from '@/api/nativeApi';
import { getCdnPath } from '@/utils/getCdnPath';
import gridImg from '@/assets/images/gezi.png';
import styles from './index.module.less';

const previewIcon = getCdnPath('images/preview.png');
const saveIcon = getCdnPath('images/save.png');

export function ImgPixelation() {
  const dispatch = useAppDispatch();
  const dpActions = useStructuredActions();
  const cropedFile = useSelector(selectCropedFile);
  const [imgSrc, setImgSrc] = useState(cropedFile);
  const isGif = cropedFile.startsWith('data:image/gif;base64,');

  const getPixelData = (e: any) => {
    if (isGif) return;
    const { base64Data } = e.detail;
    setImgSrc(base64Data);
  };

  const save = async () => {
    try {
      // @ts-ignore
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }
    const fileName = `${new Date().getTime().toString()}.gif`;
    const data = imgSrc.split(',')[1];
    const filePath = await globalStorage.set({ key: fileName, data, encoding: 'base64' });
    const hexData = utils.base64ToRaw(data);
    // 发送数据到设备
    await preview();
    const _newDiys = [
      {
        path: filePath,
        id: 60,
        md5: md5(imgSrc),
        rawData: hexData,
      },
    ];
    dispatch(addDiysAsync(_newDiys)).then(() => {
      dispatch(updateMyActiveTab('diy'));
      navigateBack({ delta: 4 });
    });
  };

  const preview = async () => {
    const md5Id = md5(imgSrc);
    const base64Data = imgSrc.split(',')[1];
    const hexData = utils.base64ToRaw(base64Data);

    await sendPackets({
      data: hexData,
      dpCode: 'gif_pro',
      params: { md5Id },
      sendDp: () => {
        dpActions.gif_pro.set({ md5Id });
      },
    });
  };

  const handleBack = () => {
    navigateBack({ delta: 4 });
  };

  return (
    <View className={styles.pageWrap}>
      <NavBar
        customClass={styles.navBar}
        title={Strings.getLang('image')}
        leftArrow
        onClickLeft={handleBack}
      />
      <View className={styles.container}>
        <View className={styles.box}>
          <Image className={styles.grid} src={gridImg} mode="aspectFit" />
          <Image className={styles.img} src={imgSrc} mode="aspectFill" />
        </View>
        {!isGif && <PixelImage bindgetPixelData={getPixelData} path={cropedFile} />}
      </View>
      <View className={styles.footer}>
        <View className={`${styles.btn} ${styles.preview}`} onClick={preview}>
          <Image className={styles.icon} src={previewIcon} mode="aspectFill" />
          {Strings.getLang('preview')}
        </View>
        <View className={styles.btn} style={{ width: '344rpx' }} onClick={save}>
          <Image className={styles.icon} src={saveIcon} mode="aspectFill" />
          {Strings.getLang('save')}
        </View>
      </View>
    </View>
  );
}

export default ImgPixelation;
