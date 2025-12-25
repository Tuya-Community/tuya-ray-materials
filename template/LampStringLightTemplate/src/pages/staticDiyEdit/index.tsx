import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TopBar } from '@/components';
import { BrightSlider } from '@/components/bright-slider';
import { ColorSlider } from '@/components/color-slider';
import { ControlTabs } from '@/components/control-tabs';
import { InputNameCard } from '@/components/input-name-card';
import { SmearLight } from '@/components/light/SmearLight';
import { MyColors } from '@/components/my-colors';
import { TempColors } from '@/components/temp-colors';
import { TempSlider } from '@/components/temp-slider';
import { CLEAR_COLOR, CLOUD_KEY_DIY_SCENE } from '@/constant';
import { DrawColor } from '@/constant/type';
import { devices } from '@/devices';
import { DiySceneData } from '@/devices/protocols/DiySceneFormatter';
import { useAddNameDialog } from '@/hooks/useAddNameDialog';
import { decodeCloudSceneData, encodeCloudSceneData } from '@/hooks/useCloudDrawToolList';
import { useCloudStorageCombinedList } from '@/hooks/useCloudStorageCombinedList';
import { useCutDrawDiySceneSet } from '@/hooks/useCutDrawDiyScene';
import { useDrawToolDataList } from '@/hooks/useDrawToolDataList';
import { useScrollControl } from '@/hooks/useScrollControl';
import { useToast } from '@/hooks/useToast';
import Strings from '@/i18n';
import res from '@/res';
import { Dispatcher } from '@/utils/event';
import { getDataId, isDataId } from '@/utils/getDataId';
import { getArray } from '@/utils/kit';
import { showConfirmBackModal, showConfirmDeleteModal } from '@/utils/showConfirmModal';
import { useActions, useProps, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';
import {
  hideLoading,
  Image,
  router,
  ScrollView,
  showLoading,
  Text,
  usePageEvent,
  useQuery,
  View,
} from '@ray-js/ray';
import { useNavBack } from '@/hooks/useNavBack';
import { useSceneSet } from '@/hooks/useSceneSet';

import styles from './index.module.less';

export interface DiyEditPageProps {}

// 灯带组件只是渲染灯带颜色和选择灯珠
// 下发是在选择颜色时下发
// 灯带数据需要存一下
const DiyEditPage: React.FC<DiyEditPageProps> = ({}) => {
  const SupportUtils = devices.common.model.abilities.support;
  const isSupportBright = SupportUtils.isSupportBright();
  const isSupportTemp = SupportUtils.isSupportTemp();
  const isSupportColour = SupportUtils.isSupportColour();
  const isSupportWhite = isSupportBright || isSupportTemp;

  const [diy_scene_str, setdiy_scene_str] = useState<string>();
  const diy_scene = useStructuredProps(props => props.diy_scene);

  const query = useQuery();
  const dataId = getDataId(query?.dataId);

  const [currentSmearMode, setCurrentSmearMode] = useState(1);

  const { scrollable, scrollTop, setScrollTop } = useScrollControl();

  // 滚动只需更新最后一次停止的位置即可
  const setScrollTopDebounce = useCallback(
    debounce((e: any) => {
      setScrollTop(e.detail.scrollTop);
    }, 300),
    [setScrollTop]
  );

  const [currentColorMode, setCurrentColorMode] = useState(isSupportColour ? 'colour' : 'white');
  const [hsv, setHSV] = useState<{ hue: number; saturation: number; value: number }>({
    hue: 0,
    saturation: 1000,
    value: 1000,
  });
  const hsArr = useMemo(() => [hsv?.hue, hsv?.saturation], [hsv]);
  const [temp, setTemp] = useState<number>(1000);
  const [bright, setBright] = useState<number>(1000);

  const structuredActions = useStructuredActions();

  const isWhiteMode = currentColorMode === 'white';
  const isSectionAll = currentSmearMode === 0;

  console.log('[diy_scene]~', diy_scene_str);

  const onBrightChange = (bright: number, isMoving = false) => {
    if (isWhiteMode) {
      setBright(bright);
    } else {
      setHSV({
        ...(hsv || ({} as any)),
        value: bright,
      });
    }
    updateStripDataListAll({
      isSectionAll,
      color: isWhiteMode
        ? {
            isWhite: true,
            brightness: bright,
            temperature: temp,
          }
        : {
            isWhite: false,
            hue: hsv?.hue,
            saturation: hsv?.saturation,
            value: bright,
          },
      isMoving,
    });
  };

  const onTempChange = (temp: number, isMoving = false) => {
    if (!isWhiteMode) return;
    setTemp(temp);
    updateStripDataListAll({
      isSectionAll,
      color: {
        isWhite: true,
        brightness: bright,
        temperature: temp,
      },
      isMoving,
    });
  };

  const onColorChange = (hs: DrawColor, isMoving = false) => {
    setHSV({
      ...(hsv || ({} as any)),
      ...hs,
    });
    updateStripDataListAll({
      isSectionAll,
      color: {
        isWhite: false,
        ...hs,
      },
      isMoving,
    });
  };

  const {
    ledNumber,
    currentLightStripDataList,
    updateStripDataListAll,
    checkedSet,
    setCheckedSet,
    resetDraw,
  } = useDrawToolDataList(diy_scene_str);

  const TipApi = useToast();

  const [sceneName, setSceneName] = useState<string>();

  const storage = useCloudStorageCombinedList(CLOUD_KEY_DIY_SCENE, {
    idStart: 1,
  });

  const all_scenes_length = getArray(storage?.list).length;

  const AddNameApi = useAddNameDialog({
    title: Strings.getLang('sceneName'),
    getDefaultName: async () => {
      const nextId = await storage.getNextId();
      return `${Strings.getLang('custom')}${nextId || '1'}`;
    },
    onSave: async name => {
      if (all_scenes_length >= 12) {
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

      // 有名称才保存
      if (name) {
        await handleSave(name).catch(err => console.log(err));
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
        if (data?.type === 'draw') {
          const scene = data?.ret;
          setSceneName(scene.name);
          setdiy_scene_str(data?.raw);
        }
      }
    }
  }, [storage?.list, dataId]);

  useEffect(() => {
    if (!isDataId(dataId)) {
      resetDraw();
    }
  }, [dataId]);

  const cutDrawDiySceneSet = useCutDrawDiySceneSet();

  const handleSave = async (sceneName: string) => {
    const params: DiySceneData = {
      name: sceneName,
      ...(diy_scene || ({} as DiySceneData)),
      segments: diy_scene?.segments,
    };
    console.log('[handleSave]:', params);
    if (isDataId(dataId)) {
      await storage.updateItem(dataId, encodeCloudSceneData(params));
      cutDrawDiySceneSet(params);
      Dispatcher.instance.dispatch('diyCreated', dataId);
    } else {
      showLoading({ title: '', mask: true });

      const newDataId = await storage.addItem(encodeCloudSceneData(params));
      if (typeof newDataId === 'number') {
        cutDrawDiySceneSet(params);
        Dispatcher.instance.dispatch('diyCreated', newDataId);
        hideLoading();
      } else {
        hideLoading();
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

  // 选中的灯珠
  const selectList = useMemo(() => Array.from(checkedSet), [checkedSet]);

  const isEdit = isDataId(dataId);

  const onHandleSelectChange = useCallback((value: Set<number>) => {
    setCheckedSet(new Set(value));
  }, []);

  const onCancelSelect = useCallback(() => {
    setCheckedSet(new Set());
  }, []);

  const onModeChange = useCallback((value: number) => {
    setCurrentSmearMode(value);
  }, []);

  const onClear = () => {
    updateStripDataListAll({
      isMoving: false,
      color: {
        isWhite: false,
        ...CLEAR_COLOR,
      },
      isSectionAll,
    });
  };

  const { enableNavBack } = useNavBack();
  const sceneApi = useSceneSet();

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
            async success(res) {
              if (res.confirm) {
                showLoading({ title: '', mask: true });
                await storage.delItem(dataId);
                hideLoading();
                enableNavBack();
                router.back();
              }
            },
          });
        }}
        onLeftClick={() => {
          showConfirmBackModal(() => {
            enableNavBack();
            // 恢复预览
            sceneApi.cancelPreview();
          });
        }}
      />
      <ScrollView
        scrollY={scrollable}
        refresherTriggered={false}
        className={styles.content}
        onScroll={setScrollTopDebounce}
      >
        {isEdit && (
          <InputNameCard value={sceneName} onChange={setSceneName} style={{ marginTop: '48rpx' }} />
        )}
        <View className={styles.contentBox} style={{ marginTop: '16px' }}>
          <View className={styles.SmearLightWrap}>
            <SmearLight
              bright={bright}
              mode={currentSmearMode as any}
              lightColorMaps={currentLightStripDataList}
              lightPixelNumber={ledNumber}
              selectList={selectList}
              onSelectChange={onHandleSelectChange}
              onCancelSelect={onCancelSelect}
              onModeChange={onModeChange}
              onClear={() => onClear()}
              showControl
            />
          </View>
          <View className={styles.controlWrap}>
            {isSupportWhite && isSupportColour && (
              <ControlTabs
                tabs={[
                  {
                    tab: Strings.getLang('color'),
                    tabKey: 'colour',
                  },
                  {
                    tab: Strings.getLang('white'),
                    tabKey: 'white',
                  },
                ]}
                activeKey={isWhiteMode ? 'white' : 'colour'}
                onChange={mode => {
                  setCurrentColorMode(mode);
                }}
              />
            )}
          </View>
          <BrightSlider
            eventName="SliderColorV"
            value={bright}
            valueScale={1 / 10}
            onAfterChange={bright => onBrightChange(bright, false)}
          />
          {isWhiteMode ? (
            <TempSlider
              min={1}
              max={1000}
              eventName="DrawSliderTemp"
              value={temp}
              onAfterChange={temp => onTempChange(temp, false)}
            />
          ) : (
            <ColorSlider
              hs={hsArr}
              onHSChange={hs => {
                onColorChange(
                  {
                    hue: hs[0],
                    saturation: hs[1],
                    value: hsv?.value,
                    isWhite: false,
                  },
                  false
                );
              }}
            />
          )}
          {isWhiteMode ? (
            <TempColors
              isRead
              onClick={temp => {
                setTemp(temp);
                updateStripDataListAll({
                  color: {
                    temperature: temp,
                    brightness: bright,
                    isWhite: true,
                  },
                  isSectionAll,
                  isMoving: false,
                });
              }}
            />
          ) : (
            <MyColors
              style={{
                paddingTop: '8px',
              }}
              hasTitle
              isRead
              selectable
              onClick={hs => {
                setHSV({
                  ...(hsv || ({} as any)),
                  hue: hs.h,
                  saturation: hs.s,
                  value: hs.v,
                });
                setBright(hs.v);
                updateStripDataListAll({
                  color: {
                    hue: hs.h,
                    saturation: hs.s,
                    value: hs.v,
                    isWhite: false,
                  },
                  isSectionAll,
                  isMoving: false,
                });
              }}
            />
          )}
        </View>
      </ScrollView>
      <View className={styles.bottom}>
        <View
          className={styles.bottomBtn}
          hoverClassName="button-hover"
          style={{
            background: '#0d84ff',
            margin: '0 16rpx',
            opacity: 1,
          }}
          onClick={async () => {
            if (isEdit) {
              // 有颜色和名称才保存
              if (sceneName) {
                await handleSave(sceneName).catch(err => console.log(err));
                enableNavBack();
                router.back();
              }
            } else {
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
