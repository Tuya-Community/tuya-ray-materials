/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';

import { SceneData } from '@/constant/type';
import { DiySceneData } from '@/devices/protocols/DiySceneFormatter';
import { decodeCloudSceneData } from '@/hooks/useCloudDrawToolList';
import { useCutDrawDiySceneSet } from '@/hooks/useCutDrawDiyScene';
import { UseDiySceneInitApi } from '@/hooks/useDiySceneInit';
import { useSceneSet } from '@/hooks/useSceneSet';
import { useToast } from '@/hooks/useToast';
import Strings from '@/i18n';
import res from '@/res';
import { Dispatcher } from '@/utils/event';
import { getArray } from '@/utils/kit';
import { showConfirmDeleteModal } from '@/utils/showConfirmModal';
import { useStructuredActions } from '@ray-js/panel-sdk';
import { hideLoading, Image, router, showLoading, Text, View } from '@ray-js/ray';

import { useDiyTypeModal } from '../diy-type-modal';
import { getDefaultScenes } from '../scene/scenes';
import { DiySceneCard } from './diy-scene-card';
import styles from './index.module.less';

export interface TabDiyProps {
  api: UseDiySceneInitApi;
}

export const TabDiy: React.FC<TabDiyProps> = ({ api }) => {
  const [isEdit, setIsEdit] = useState(false);

  const { isNil, diySceneList, current, setCurrent, storage } = api;

  useEffect(() => {
    const handle = async dataId => {
      setCurrent(String(dataId));
      await storage.refresh();
    };
    Dispatcher.instance.addEventListener('diyCreated', handle);
    return () => {
      Dispatcher.instance.removeEventListener('diyCreated', handle);
    };
  }, []);

  const sceneApi = useSceneSet({
    notSetSceneMode: true,
  });

  const structuredActions = useStructuredActions();
  const TipApi = useToast();

  const isDiyMountedRef = useRef(false);
  useEffect(() => {
    return () => {
      console.log('diy unmount');
      isDiyMountedRef.current = false;
    };
  }, []);

  const cutDrawDiySceneSet = useCutDrawDiySceneSet();

  useEffect(() => {
    const handle = () => setIsEdit(false);
    Dispatcher.instance.addEventListener('cancelSceneEdit', handle);
    return () => {
      Dispatcher.instance.removeEventListener('cancelSceneEdit', handle);
    };
  }, [isEdit]);

  const resetScene = (
    list: {
      id: number;
      value: any;
    }[]
  ) => {
    const firstScene = getArray(list)[0];
    if (firstScene) {
      const props = decodeCloudSceneData(firstScene.value);
      if (props.type === 'scene') {
        sceneApi.set(props.ret);
      }
      if (props.type === 'draw') {
        cutDrawDiySceneSet(props?.ret);
      }
    } else {
      const defaultScenes = getDefaultScenes();
      const defaultScene = defaultScenes?.scenery?.[0];
      if (defaultScene) {
        structuredActions.rgbic_linerlight_scene.set(defaultScene);
      }
    }
  };

  const DiyTypeModalApi = useDiyTypeModal({
    onShowTip(tip) {
      TipApi.show({
        show: true,
        content: (
          <View className={styles.tipWrap}>
            <Image src={res.icon_warn} className={styles.tipIcon} />
            <View className={styles.tipText}>{tip}</View>
          </View>
        ),
      });
    },
  });

  return (
    <View className={styles.contain}>
      <View className={styles.head}>
        <Text className={styles.title}>{Strings.getLang('diyScene')}</Text>
        {isNil ? (
          <View className="nil-wrapper" />
        ) : (
          <View className={styles.edit} onClick={() => setIsEdit(!isEdit)}>
            <Image className={styles.editIcon} src={isEdit ? res.cancel_edit : res.pancil} />
            <View className={styles.editText} hoverClassName="button-hover">
              {isEdit ? Strings.getLang('cancelEdit') : Strings.getLang('edit')}
            </View>
          </View>
        )}
      </View>
      {!isNil ? (
        <View className={styles.list}>
          {diySceneList.map((scenes, i) => (
            <View key={i} className={styles.row} style={{ marginTop: i === 0 ? '32rpx' : '16rpx' }}>
              {scenes.map((item, j) => {
                if (item.cloudType === 'scene' && item?.data) {
                  const scene = item?.data as SceneData;
                  const type = scene.dataType === 0 ? 'diy' : 'ai';
                  return (
                    <DiySceneCard
                      key={String(item.dataId)}
                      onClick={() => {
                        setCurrent(String(item.dataId));
                        sceneApi.set(scene);
                      }}
                      isActive={current ? +current === +item.dataId : false}
                      style={{ marginLeft: j > 0 ? '12rpx' : '' }}
                      isEdit={isEdit}
                      name={scene.name}
                      type={type}
                      colors={
                        getArray(scene.colors).map(color => ({
                          h: color.hue,
                          s: color.saturation * 10,
                          v: color.value * 10,
                        })) as any
                      }
                      onDelete={() => {
                        showConfirmDeleteModal({
                          content: Strings.getLang('deleteSceneTip'),
                          async success(res) {
                            if (res.confirm) {
                              showLoading({ title: '', mask: true });
                              await storage.delItem(item.dataId);
                              resetScene(await storage.refresh());
                              hideLoading();
                            }
                          },
                        });
                      }}
                      onEdit={() => {
                        setIsEdit(false);
                        router.push(`/diyEdit?dataId=${item.dataId}`);
                      }}
                    />
                  );
                }
                if (item.cloudType === 'draw' && item?.data) {
                  const scene = item?.data as DiySceneData;
                  return (
                    <DiySceneCard
                      key={String(item.dataId)}
                      onClick={() => {
                        setCurrent(String(item.dataId));
                        cutDrawDiySceneSet(scene);
                      }}
                      isActive={current ? +current === +item.dataId : false}
                      style={{ marginLeft: j > 0 ? '12rpx' : '' }}
                      isEdit={isEdit}
                      name={scene.name}
                      type="diy"
                      colors={getArray(scene.segments)
                        .slice(0, 4)
                        .map(item => ({
                          h: item.hue,
                          s: item.saturation,
                          v: item.value,
                        }))}
                      onDelete={() => {
                        showConfirmDeleteModal({
                          content: Strings.getLang('deleteSceneTip'),
                          async success(res) {
                            if (res.confirm) {
                              await storage.delItem(item?.dataId);
                              resetScene(await storage.refresh());
                            }
                          },
                        });
                      }}
                      onEdit={() => {
                        setIsEdit(false);
                        router.push(`/staticDiyEdit?dataId=${item?.dataId}`);
                      }}
                    />
                  );
                }
              })}
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.empty}>
          <Image mode="aspectFit" className={styles.emptyImg} src={res.empty} />
        </View>
      )}
      <View
        className={styles.addColor}
        hoverClassName="button-hover"
        onClick={() => {
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
          } else {
            DiyTypeModalApi.setShow(true);
          }
        }}
      >
        <Image className={styles.addColorIcon} src={res.plus} />
        <View className={styles.addColorLabel}>{Strings.getLang('addDiyScene')}</View>
      </View>
      {DiyTypeModalApi.modal}
      {TipApi.modal}
    </View>
  );
};
