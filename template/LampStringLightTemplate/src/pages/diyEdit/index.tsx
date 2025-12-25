import React, { useEffect, useRef, useState } from 'react';

import { TopBar } from '@/components';
import { BaseColors } from '@/components/base-colors';
import { CellSelect } from '@/components/cell-select';
import { InputNameCard } from '@/components/input-name-card';
import { MotionConfig } from '@/components/motion-config';
import { CLOUD_KEY_DIY_SCENE, maxSelectedColorNum } from '@/constant';
import { DEFAULTOPTIONS, getCHANGE_TYPE } from '@/constant/scenes';
import { SceneData } from '@/constant/type';
import { useAddNameDialog } from '@/hooks/useAddNameDialog';
import { decodeCloudSceneData, encodeCloudSceneData } from '@/hooks/useCloudDrawToolList';
import { useCloudStorageCombinedList } from '@/hooks/useCloudStorageCombinedList';
import { useSceneSet } from '@/hooks/useSceneSet';
import { useToast } from '@/hooks/useToast';
import Strings from '@/i18n';
import { actions, useAppDispatch, useSelector } from '@/redux';
import res from '@/res';
import { Dispatcher } from '@/utils/event';
import { getDataId, isDataId } from '@/utils/getDataId';
import { getToggleAppendColor } from '@/utils/getToggleAppendColor';
import { getArray } from '@/utils/kit';
import { pushHalf } from '@/utils/pushHalf';
import { showConfirmBackModal, showConfirmDeleteModal } from '@/utils/showConfirmModal';
import {
  hideLoading,
  Image,
  router,
  ScrollView,
  showLoading,
  Text,
  useQuery,
  View,
} from '@ray-js/ray';

import { useNavBack } from '@/hooks/useNavBack';
import styles from './index.module.less';

export interface DiyEditPageProps {}

const DiyEditPage: React.FC<DiyEditPageProps> = ({}) => {
  const [current, setCurrent] = useState(0);

  const scrollable = useSelector(state => state?.common?.scrollable);

  const TipApi = useToast();

  const [values, setValues] = useState<Partial<SceneData>>({});

  const [sceneName, setSceneName] = useState<string>();

  const isSavedRef = useRef(false);

  const diyEditColors = useSelector(state => getArray(state?.common?.diyEditColors));
  const dispatch = useAppDispatch();

  const storage = useCloudStorageCombinedList(CLOUD_KEY_DIY_SCENE, {
    idStart: 1,
  });

  const query = useQuery();
  const dataId = getDataId(query?.dataId);

  const sceneApi = useSceneSet();

  const AddNameApi = useAddNameDialog({
    title: Strings.getLang('sceneName'),
    getDefaultName: async () => {
      const nextId = await storage.getNextId();
      return `${Strings.getLang('custom')}${nextId || '1'}`;
    },
    onSave: async name => {
      if (getArray(storage.list).length >= 12) {
        TipApi.show({
          show: true,
          content: (
            <View className={styles.tipWrap}>
              <Image src={res.icon_warn} className={styles.tipIcon} />
              <View className={styles.tipText}>{Strings.getLang('diy_scene_max_12')}</View>
            </View>
          ),
        });
        return;
      }

      // 有颜色和名称才保存
      if (name && getArray(diyEditColors).length > 0) {
        const res = await handleSave(name).catch(err => console.log(err));
        if (res === -1) {
          return;
        }
        isSavedRef.current = true;
        clearTempColors();
        enableNavBack();
        router.back();
      }
    },
  });

  useEffect(() => {
    if (isDataId(dataId)) {
      const item = getArray(storage.list).find(item => +item.id === +dataId);
      if (item) {
        const data = decodeCloudSceneData(item?.value);
        if (data?.type === 'scene') {
          const scene = data?.ret;
          setSceneName(scene.name);
          setCurrent(+scene.changeType);
          setValues({
            ...scene,
          });
          dispatch(
            actions.common.updateDiyEditColors(
              getArray(scene.colors).map(color => ({
                h: color.hue,
                s: color.saturation * 10,
                v: color.value * 10,
              }))
            )
          );
        }
      }
    } else {
      setValues({
        setA: 0,
      });
    }
    return () => {
      clearTempColors();
    };
  }, [storage?.list, dataId]);

  const handlePreview = async () => {
    // 添加了颜色才可以预览
    if (getArray(diyEditColors).length > 0) {
      const params = {
        ...DEFAULTOPTIONS,
        ...values,
        name: sceneName || '',
        changeType: current,
        colors: getArray(diyEditColors).map(color => ({
          hue: color.h,
          saturation: Math.floor(color.s / 10),
          value: Math.floor(color.v / 10),
          brightness: 0,
          temperature: 0,
        })),
        dataType: 0,
      } as SceneData;
      await sceneApi.preview(params);
    } else {
      TipApi.show({
        show: true,
        content: (
          <View className={styles.tipWrap}>
            <Image src={res.icon_warn} className={styles.tipIcon} />
            <View className={styles.tipText}>{Strings.getLang('needColorTip')}</View>
          </View>
        ),
      });
    }
  };

  const handleSave = async (sceneName: string) => {
    const params = {
      ...DEFAULTOPTIONS,
      ...values,
      key: 100,
      name: sceneName || '',
      changeType: current,
      colors: getArray(diyEditColors).map(color => ({
        hue: color.h,
        saturation: Math.floor(color.s / 10),
        value: Math.floor(color.v / 10),
        brightness: 0,
        temperature: 0,
      })),
      dataType: 0,
    } as SceneData;

    if (isDataId(dataId)) {
      await storage.updateItem(dataId, encodeCloudSceneData(params));
      sceneApi.set(params);
      Dispatcher.instance.dispatch('diyCreated', dataId);
    } else {
      showLoading({
        title: '',
        mask: true,
      });
      const newDataId = await storage.addItem(encodeCloudSceneData(params), {
        dedup: (a, b) => {
          try {
            return JSON.parse(a).name === JSON.parse(b).name;
          } catch (error) {
            return false;
          }
        },
      });
      hideLoading();
      if (typeof newDataId === 'number') {
        sceneApi.set(params);
        Dispatcher.instance.dispatch('diyCreated', newDataId);
      } else {
        TipApi.show({
          show: true,
          content: (
            <View className={styles.tipWrap}>
              <Image src={res.icon_warn} className={styles.tipIcon} />
              <View className={styles.tipText}>{Strings.getLang('name_dedup')}</View>
            </View>
          ),
        });
        return -1;
      }
    }
  };

  const clearTempColors = () => dispatch(actions.common.updateDiyEditColors([]));

  const isEdit = isDataId(dataId);

  const { enableNavBack } = useNavBack();

  return (
    <View className={styles.contain}>
      <TopBar
        isShowMenu={false}
        titleClassName={styles.title}
        cancelClassName={styles.cancel}
        leftText={Strings.getLang('cancel')}
        title={isEdit ? Strings.getLang('editDiy') : Strings.getLang('addDiyScene')}
        rightTitle={Strings.getLang('delete')}
        rightClassName={styles.delete}
        disableLeftBack
        isShowRight={isEdit}
        onRightClick={() => {
          showConfirmDeleteModal({
            content: Strings.getLang('deleteSceneTip'),
            success(res) {
              if (res.confirm) {
                storage.delItem(dataId);
                enableNavBack();
                router.back();
              }
            },
          });
        }}
        onLeftClick={() => {
          showConfirmBackModal(() => {
            sceneApi.cancelPreview();
            clearTempColors();
            enableNavBack();
          });
        }}
      />
      <ScrollView scrollY={scrollable} refresherTriggered={false} className={styles.content}>
        {isEdit && (
          <InputNameCard value={sceneName} onChange={setSceneName} style={{ marginTop: '48rpx' }} />
        )}
        <View className={styles.card} style={{ marginTop: '24rpx' }}>
          <Text className={styles.cardTitle}>{Strings.getLang('motion')}</Text>
          <View>
            <CellSelect
              current={current}
              onChange={setCurrent}
              modalTitle={Strings.getLang('motion')}
              list={getCHANGE_TYPE()}
            />
          </View>
          <MotionConfig motionId={current} values={values} onChange={setValues} />
        </View>
        <BaseColors
          autoInEdit
          disableDelCheck
          data={getArray(diyEditColors)}
          onDel={item => {
            dispatch(
              actions.common.updateDiyEditColors(
                getToggleAppendColor(getArray(diyEditColors), item, true)
              )
            );
          }}
          onEdit={(item, idx) => {
            pushHalf(`/addColor?dataId=${idx}&isDiy=true`);
          }}
          maxSize={maxSelectedColorNum}
          title={Strings.getLang('diyColorTitle')}
          onAdd={() => {
            pushHalf('/addColor?isDiy=true');
          }}
          className={styles.card}
          style={{ background: '#232222', marginTop: '24rpx', marginBottom: '48rpx' }}
        />
      </ScrollView>
      <View className={styles.bottom}>
        <View
          className={styles.bottomBtn}
          style={{ background: 'rgba(0, 206, 82, 0.1)' }}
          onClick={handlePreview}
          hoverClassName="button-hover"
        >
          <Image className={styles.bottomBtnIcon} src={res.icon_preview} />
          <Text className={styles.bottomBtnText} style={{ color: '#00ce52' }}>
            {Strings.getLang('preview')}
          </Text>
        </View>
        <View
          className={styles.bottomBtn}
          hoverClassName="button-hover"
          style={{ background: '#0d84ff', marginLeft: '16rpx' }}
          onClick={async () => {
            if (getArray(diyEditColors).length === 0) {
              TipApi.show({
                show: true,
                content: (
                  <View className={styles.tipWrap}>
                    <Image src={res.icon_warn} className={styles.tipIcon} />
                    <View className={styles.tipText}>{Strings.getLang('needColorTip')}</View>
                  </View>
                ),
              });
              return;
            }

            if (isEdit) {
              // 有颜色和名称才保存
              if (sceneName && getArray(diyEditColors).length > 0) {
                const res = await handleSave(sceneName).catch(err => console.log(err));
                if (res === -1) {
                  return;
                }
                isSavedRef.current = true;
                clearTempColors();
                enableNavBack();
                router.back();
              }
            } else if (getArray(diyEditColors).length > 0) {
              AddNameApi.setShow(true);
            }
          }}
        >
          <Image className={styles.bottomBtnIcon} src={res.diy_save} />
          <Text className={styles.bottomBtnText} style={{ color: '#fff' }}>
            {Strings.getLang('save')}
          </Text>
        </View>
      </View>
      {AddNameApi.modal}
      {TipApi.modal}
    </View>
  );
};

export default DiyEditPage;
