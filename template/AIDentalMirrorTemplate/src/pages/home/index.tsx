import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  env,
  showToast,
  chooseImage,
  previewImage,
  showLoading,
  hideLoading,
  navigateTo,
  ai,
} from '@ray-js/ray';
import { Button, NavBar, Dialog, DialogInstance, NoticeBar } from '@ray-js/smart-ui';
import Warning from '@tuya-miniapp/icons/dist/svg/Warning';
import { withUIConfig } from '@/hooks/withUIConfig';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUiState,
  selectUiStateByKey,
  updateAiReport,
  updateAiModelProgress,
} from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import res from '@/res';
import styles from './index.module.less';

const {
  oralDiseaseInit,
  onOralModelDownProgress,
  offOralModelDownProgress,
  oralDiseasePredictionRun,
} = ai;

export function Home() {
  const { init: aiModelInit, progress } = useSelector(selectUiStateByKey('aiModel'));
  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const dispatch = useDispatch();

  const handleOralModelDownProgress = (d: any) => {
    console.log(`===onOralModelDownProgress ===`, d);
    dispatch(updateAiModelProgress(d?.progress || 0));
  };

  useEffect(() => {
    // 初始化模型
    oralDiseaseInit({
      success: () => {
        console.log(`oralDiseaseInit 成功`);
        showToast({
          title: Strings.getLang('ai_model_download_success'),
          icon: 'success',
        });
        dispatch(updateUiState({ aiModel: { init: true, progress: 100 } }));
      },
      fail: () => {
        console.log(`oralDiseaseInit 失败`);
        showToast({
          title: Strings.getLang('ai_model_download_fail'),
          icon: 'error',
        });
        dispatch(updateUiState({ aiModel: { init: false, progress: 0 } }));
      },
    });
    // 监听模型下载进度
    onOralModelDownProgress(handleOralModelDownProgress);
    return () => {
      offOralModelDownProgress(handleOralModelDownProgress);
    };
  }, []);

  // 选择照片
  const handleChooseImage = () => {
    chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('chooseImage success', res);
        setImageSrc(res.tempFilePaths);
      },
      fail: res => {
        console.log('chooseImage fail', res);
      },
    });
  };

  // 预览照片
  const previewChooseImage = (urls, current) => () => {
    previewImage({
      urls,
      current,
      success: res => {
        console.log('previewImage success', res);
      },
      fail: res => {
        console.log('previewImage fail', res);
      },
    });
  };

  const handleClickAnalysis = () => {
    if (imageSrc.length === 0) return;
    if (!aiModelInit) {
      showToast({
        title: Strings.getLang('ai_model_not_init_tip'),
        icon: 'error',
      });
      return;
    }
    showLoading({
      title: Strings.getLang('analysis_loading'),
    });
    const path = imageSrc[0];
    const outputPath = `${env.USER_DATA_PATH}/aiReport/`;
    oralDiseasePredictionRun({
      inputImagePath: path,
      outImagePath: outputPath,
      success: d => {
        console.log('===oralDiseasePredictionRun===', d);
        if (d?.nonOral) {
          DialogInstance.alert({
            message: Strings.getLang('analysis_nonOral'),
            confirmButtonText: Strings.getLang('analysis_nonOral_confirm'),
          }).then(() => {
            // on close
          });
        } else {
          dispatch(updateAiReport(d));
          navigateTo({
            url: '/pages/report/index',
          });
        }
        hideLoading();
      },
      fail: e => {
        console.log('===oralDiseasePredictionRun err===', e);
        showToast({
          title: e && JSON.stringify(e),
          icon: 'error',
        });
        hideLoading();
      },
    });
  };

  return (
    <>
      <Dialog id="smart-dialog" />
      <View className={styles.view}>
        <NavBar
          leftText={Strings.getLang('default_device_title')}
          leftTextType="home"
          customStyle={{ width: '100vw' }}
        />
        <View className={styles.content}>
          {!aiModelInit && (
            <NoticeBar
              wrapable
              type="warning"
              left-icon={Warning}
              custom-style="width: 100vw;"
              text={`${Strings.getLang('ai_model_downloading_tip')} (${+progress || 0}%)`}
            />
          )}
          <View className={styles.preview}>
            {!!imageSrc.length && (
              <View className={styles.previewLabel}>{Strings.getLang('preview')}:</View>
            )}
            {imageSrc.map((item, index) => {
              return (
                <Image
                  src={item}
                  key={index}
                  onClick={previewChooseImage(imageSrc, index)}
                  mode="aspectFill"
                />
              );
            })}
          </View>
          <Text className={styles.tipText}>*{Strings.getLang('photo_detail_analysis_tips')}</Text>
          <View className={styles.bottom}>
            <Button type="primary" round onClick={handleChooseImage}>
              {Strings.getLang('choose_photo')}
            </Button>
            {!!imageSrc.length && (
              <Button round className={styles.analysisBtn} onClick={handleClickAnalysis}>
                <Image src={res.imgAiTagNormal} className={styles.aiTagNormal} mode="aspectFill" />
                <Text className={styles.analysisBtnText}>
                  {Strings.getLang('photo_detail_analysis')}
                </Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

export default withUIConfig(Home);
