import React, { useState, useMemo, useEffect } from 'react';
import Strings from '@/i18n';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux';
import { useStructuredActions, utils } from '@ray-js/panel-sdk';
import { authorizeAsync } from '@/api/nativeApi';
import { selectDiyList, addDiysAsync, deleteDiyAsync } from '@/redux/modules/diySlice';
import { readFileBase64 } from '@/utils';
import { sendPackets } from '@/api/sendData';
import md5 from 'md5';
import { getCdnPath } from '@/utils/getCdnPath';
import { View, Image } from '@ray-js/ray';
import PixelImage from '@/components/PixelImage';
import { Toast, ToastInstance } from '@ray-js/smart-ui';
import gridImg from '@/assets/images/gezi.png';
import styles from './index.module.less';

const vectorRedIcon = getCdnPath('images/vector-red.png');
const vectorIcon = getCdnPath('images/vector.png');
const aiPreviewIcon = getCdnPath('images/ai-preview.png');

function ImgCard(props) {
  const { cardData } = props;

  const dispatch = useAppDispatch();
  const dpActions = useStructuredActions();
  const diyList = useSelector(selectDiyList);
  const [tempFilePath, setTempFilePath] = useState('');
  const [base64Src, setBase64Src] = useState('');
  const [md5Id, setMd5Id] = useState('');
  const [rawData, setRawData] = useState('');
  const [type, setType] = useState('');

  const getPixelData = (e: any) => {
    const { base64Data } = e.detail;
    const data = base64Data.split(',')[1];
    const hexData = utils.base64ToRaw(data);
    setRawData(hexData);
    setMd5Id(md5(base64Data));
  };

  useEffect(() => {
    if (rawData) {
      if (type === 'preview') {
        sendPic();
      } else if (type === 'like') {
        addLike();
      }
    }
  }, [rawData]);

  const preview = async () => {
    try {
      // @ts-ignore
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }

    if (md5Id && tempFilePath && rawData) {
      await sendPic();
      return;
    }

    const _tempFilePath = cardData.path;
    const base64 = readFileBase64(_tempFilePath);
    const _base64Src = `data:image/jpg;base64,${base64}`;

    setType('preview');
    setTempFilePath(_tempFilePath);
    setBase64Src(_base64Src);
  };

  const sendPic = async () => {
    try {
      const isSuccess = await sendPackets({
        data: rawData,
        dpCode: 'gif_pro',
        params: { md5Id, programId: 60 },
        sendDp: () => {
          dpActions.gif_pro.set({ md5Id, programId: 60 });
        },
      });
      if (isSuccess === true) {
        ToastInstance({
          selector: `#${cardData.id}native-smart-toast`,
          message: Strings.getLang('sentPleaseCheckTheEffectOnTheDevice'),
          position: 'middle',
        });
        console.log('sendPackets success');
      }
    } catch (error) {
      console.log('sendPackets fail');
    }
  };

  const handleLike = async (item, isLike) => {
    try {
      // @ts-ignore
      await authorizeAsync({ scope: 'scope.writePhotosAlbum' });
    } catch (error) {
      return;
    }
    if (isLike) {
      dispatch(deleteDiyAsync({ ...item, md5: md5Id }));
    } else {
      if (md5Id && tempFilePath && rawData) {
        addLike();
        return;
      }

      const _tempFilePath = item.path;
      const base64 = readFileBase64(_tempFilePath);
      const _base64Src = `data:image/jpg;base64,${base64}`;

      setType('like');
      setTempFilePath(_tempFilePath);
      setBase64Src(_base64Src);
    }
  };

  const addLike = () => {
    const likeData = [
      {
        path: tempFilePath,
        id: 60,
        md5: md5Id,
        rawData,
        originUrl: cardData.path,
      },
    ];
    dispatch(addDiysAsync(likeData));
  };

  const isLike = useMemo(() => {
    const like = diyList.find(old => old.originUrl === cardData.path);
    if (like) {
      setTempFilePath(like.path);
      setRawData(like.rawData);
      setMd5Id(like.md5);
    }
    return Boolean(like);
  }, [diyList, cardData]);

  return (
    <>
      <View className={styles.imgCardWrap}>
        <PixelImage bind:getPixelData={getPixelData} path={base64Src} />
        <Image className={styles.grid} src={gridImg} mode="aspectFit" />
        <Image className={styles.cardImg} src={cardData.path} mode="aspectFit" />
        <View className={styles.cardActions}>
          <View
            className={styles.like}
            onClick={e => {
              e.origin.stopPropagation();
              handleLike(cardData, isLike);
            }}
          >
            <Image
              className={styles.likeIcon}
              src={isLike ? vectorRedIcon : vectorIcon}
              mode="aspectFit"
            />
          </View>
          <View className={styles.preview} onClick={preview}>
            <Image className={styles.previewIcon} src={aiPreviewIcon} mode="aspectFit" />
          </View>
        </View>
      </View>
      <Toast id={`${cardData.id}native-smart-toast`} />
    </>
  );
}

export default ImgCard;
