import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Image,
  Text,
  usePageEvent,
  analyzePetFeature,
  getAnalyzePetFeatureResult,
} from '@ray-js/ray';
import { Button, Popup } from '@ray-js/smart-ui';
import { imgArrowLeft, imgPetHeadSample, imgPetHeadAddition, imgSuccess, imgFailed } from '@/res';
import { AGENT_ID } from '@/constant';
import CatLoading from '@/components/CatLoading';
import useSetState from '@/hooks/useSetState';
import { selectHomeId } from '@/redux/modules/homeInfoSlice';
import { selectMiniAppId } from '@/redux/modules/accountInfoSlice';
import { emitter } from '@/utils';
import { chooseImage, uploadImage } from '@/utils/file';
import { AbortController, sleep } from '@/utils/time';
import Strings from '@/i18n';
import styles from './index.module.less';

type Props = {
  onBack?: () => void;
  goNext?: () => void;
};

type Stage = 'upload' | 'analyzing' | 'failed' | 'success';
enum AnalysType {
  Profile = '0',
  MatchPet = '2',
}

const PetAnalytics: FC<Props> = ({ onBack, goNext }) => {
  const homeId = useSelector(selectHomeId());
  const miniAppId = useSelector(selectMiniAppId());

  const controllerRef = useRef<AbortController>();

  usePageEvent('onUnload', () => {
    controllerRef.current?.abort();
  });

  const [state, setState] = useSetState<{
    similarShow: boolean;
    stage: Stage;
    analyzingText: string;
    animating: boolean;
    petResInfo: any;
  }>({
    similarShow: false,
    stage: 'upload',
    analyzingText: '',
    animating: false,
    petResInfo: null,
  });

  const [animClass, setAnimClass] = useSetState<{
    upload: string;
    analyzing: string;
    failed: string;
    success: string;
  }>({
    upload: styles.entered,
    analyzing: styles.exited,
    failed: styles.exited,
    success: styles.exited,
  });

  useEffect(() => {
    if (state.stage !== 'analyzing') {
      emitter.emit('changeShowBack', true);
    } else {
      emitter.emit('changeShowBack', false);
    }
  }, [state.stage]);

  const enter = (next: Stage) => {
    console.log(next);
    // 使用 set 取最新状态
    setState(prevState => {
      const current = prevState.stage;
      if (!state.animating) {
        (async () => {
          setState({
            animating: true,
          });
          setAnimClass({
            [current]: styles.exit,
          });
          await sleep(200);
          setAnimClass({
            [current]: styles.exited,
            [next]: styles.enter,
          });

          await sleep(600);
          setAnimClass({
            [next]: styles.entered,
          });
          setState({
            stage: next,
            animating: false,
          });
        })();
      }
      return prevState;
    });
  };

  const loopGetAnalysisResult = async ({
    taskId,
    controller,
    type,
  }: {
    taskId: string;
    controller: any;
    type: AnalysType;
  }) => {
    for (let i = 0; i < 20; i++) {
      // eslint-disable-next-line no-await-in-loop
      const res = await getAnalyzePetFeatureResult({ type, taskId });

      if (controller.signal.aborted) {
        return null;
      }

      if (res?.analysisResult === 1) {
        // MatchPet 解析出错可以忽略
        if (type === AnalysType.MatchPet) {
          return {
            matchedPets: [],
          };
        }
        throw new Error(`Analysis Failed, AnalysType: ${type}`);
      }
      if (res?.analysisResult === 2) {
        if (type === AnalysType.Profile) {
          const { petType, images, features } = res;
          return {
            idPhotos: images.map(d => ({
              objectKey: d.objectKey,
              angle: d.angle,
            })),
            features,
            petType,
          };
        }
        if (type === AnalysType.MatchPet) {
          return {
            matchedPets: res.matchedPets,
          };
        }
      }
      // eslint-disable-next-line no-await-in-loop
      await sleep(3000);
      if (controller.signal.aborted) {
        return null;
      }
    }
  };

  const handleChooseImg = async () => {
    let paths = [];
    try {
      paths = await chooseImage(3);
    } catch (err) {
      return;
    }

    // 先进入下一阶段
    enter('analyzing');

    setState({
      analyzingText: Strings.getLang('add_pet_analytics_upload_img'),
    });

    const controller = new AbortController();
    controllerRef.current = controller;

    let images: Array<{ objectKey: string }> = [];
    try {
      images = (await Promise.all(paths.map(p => uploadImage(p, 'petFeature')))).map(d => ({
        objectKey: d.cloudKey,
      }));
      if (controller.signal.aborted) {
        return;
      }
    } catch (error) {
      enter('failed');
      return;
    }

    let idx = 0;
    const tips = [
      Strings.getLang('add_pet_analytics_upload_tip1'),
      Strings.getLang('add_pet_analytics_upload_tip2'),
      Strings.getLang('add_pet_analytics_upload_tip3'),
      Strings.getLang('add_pet_analytics_upload_tip4'),
      Strings.getLang('add_pet_analytics_upload_tip5'),
    ];

    const id = setInterval(() => {
      setState({
        analyzingText: tips[idx++ % tips.length],
      });
    }, 3000);

    try {
      const taskId = await analyzePetFeature({
        ownerId: homeId,
        images,
        miniAppId,
        agentId: AGENT_ID,
      });

      const [infoRes] = await Promise.all([
        loopGetAnalysisResult({
          taskId,
          controller,
          type: AnalysType.Profile,
        }),
      ]);
      if (infoRes) {
        emitter.emit('selectProfile', infoRes);
        enter('success');
      } else {
        // 超时
        enter('failed');
      }
    } catch (error) {
      enter('failed');
      return;
    } finally {
      clearInterval(id);
    }
  };

  const afterSimilarClick = () => {
    setState({
      similarShow: false,
    });

    if (state.petResInfo) {
      enter('success');
    }
  };

  return (
    <>
      {/* 上传前 */}
      <View className={`${styles.upload} ${animClass.upload} `}>
        <View className={styles.wrap}>
          <View className={styles.box}>
            {onBack && <Image src={imgArrowLeft} className={styles.back} onClick={onBack} />}
            <View className={styles['main-title']}>
              {Strings.getLang('add_pet_analytics_title')}
            </View>
            <View className={styles.desc}>{Strings.getLang('add_pet_analytics_subTitle')}</View>
            <View className={styles.sample}>
              <Image src={imgPetHeadSample} className={styles.img} />
              <View className={`${styles.tips} space-y-4`}>
                <View className={styles.tip}>{Strings.getLang('add_pet_analytics_tips1')}</View>
                <View className={styles.tip}>{Strings.getLang('add_pet_analytics_tips2')}</View>
                <View className={styles.tip}>{Strings.getLang('add_pet_analytics_tips3')}</View>
                <View className={styles.tip}>{Strings.getLang('add_pet_analytics_tips4')}</View>
              </View>
            </View>
          </View>
          <View className={styles['addition-title']}>
            <View className={styles.hr} />
            <View className={styles.title}>
              <Text>{Strings.getLang('add_pet_analytics_addition_title')}</Text>
            </View>
          </View>
          <View className={styles.box}>
            <Image className={styles['addition-img']} src={imgPetHeadAddition} />
            <View className={styles.desc}>{Strings.getLang('add_pet_analytics_addition_tip')}</View>
          </View>
        </View>
        <View className={styles.bottom}>
          {goNext && (
            <View className={styles['not-upload']} onClick={goNext}>
              {Strings.getLang('add_pet_analytics_not_upload')}
            </View>
          )}
          <Button type="primary" size="large" block round onClick={handleChooseImg}>
            {Strings.getLang('add_pet_analytics_select_img')}
          </Button>
        </View>
      </View>

      {/* 上传中 */}
      <View className={`${styles.analyzing} ${animClass.analyzing} `}>
        <View className={styles.wrap}>
          <CatLoading className={styles.cat} />
          <View className={styles.desc}>{Strings.getLang('add_pet_analytics_analyzing')}</View>
          <View className={styles.desc}>{Strings.getLang('add_pet_analytics_tipMain2')}</View>
          <View className={styles.desc}>{state.analyzingText}</View>
        </View>
      </View>

      {/* 上传失败 */}
      <View className={`${styles.failed} ${animClass.failed} `}>
        <View className={styles.wrap}>
          <Image src={imgFailed} className={styles['failed-img']} />
          <View className={styles.desc}>{Strings.getLang('add_pet_analytics_failed')}</View>
          <Button
            type="primary"
            round
            onClick={() => {
              enter('upload');
            }}
          >
            {Strings.getLang('add_pet_analytics_retry')}
          </Button>
          {goNext && (
            <Button
              round
              customStyle={{ background: '#E2E2E2', marginTop: '40rpx', border: 'none' }}
              onClick={goNext}
            >
              {Strings.getLang('add_pet_analytics_not_upload')}
            </Button>
          )}
        </View>
      </View>

      {/* 上传成功 */}
      <View className={`${styles.success} ${animClass.success} `}>
        {onBack && <Image src={imgArrowLeft} className={styles.back} onClick={onBack} />}
        <View className={styles.wrap}>
          <Image src={imgSuccess} className={styles['failed-img']} />
          <View className={styles.desc}>{Strings.getLang('add_pet_analytics_success')}</View>
        </View>
      </View>

      <Popup show={state.similarShow} className={styles.pop}>
        <View className={styles['pop-content']}>
          <View className={styles['tips-icon']}>
            <View className={styles['icon-bg']} />
          </View>
          <View className={styles.tips}>{Strings.getLang('tips')}</View>
          <View className={styles['tip-content']}>{Strings.getLang('similar_pet_tips')}</View>
          <View className={styles['tip-sub-content']}>{Strings.getLang('similar_pet_tks')}</View>
          <View style={{ width: '100%' }}>
            <Button round size="large" type="primary" onClick={afterSimilarClick}>
              {Strings.getLang('know')}
            </Button>
          </View>
        </View>
      </Popup>
    </>
  );
};

export default PetAnalytics;
