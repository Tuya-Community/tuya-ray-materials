import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TopBar } from '@/components';
import { HomeHead } from '@/components/home-head';
import { Light } from '@/components/light';
import { More as MoreComponent } from '@/components/more';
import { Music } from '@/components/music';
import { Scene } from '@/components/scene';
import { TabDiy } from '@/components/tab-diy';
import { WorkMode } from '@/components/work-mode';
import {
  CLOUD_KEY_MUSIC_MODE,
  WORK_MODE_PRE_COLOR_MODE,
  WORK_MODE_SCENE_MODE,
  WORK_MODE_SCENE_MODE_DIY,
} from '@/constant';
import { dpCodes } from '@/constant/dpCodes';
import { devices } from '@/devices';
import { protocols } from '@/devices/protocols';
import { useCloudStorageKey } from '@/hooks/useCloudStorageKey';
import { useFixedWorkMode } from '@/hooks/useFIxedWorkMode';
import { useIsSupport } from '@/hooks/useIsSupport';
import { useLocalMusicInit } from '@/hooks/useLocalMusicInit';
import { useSceneInit } from '@/hooks/useSceneInit';
import { useScrollControl } from '@/hooks/useScrollControl';
import { actions, useSelector } from '@/redux';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useActions, useProps, useSupport } from '@ray-js/panel-sdk';
import { mapDps2DpState } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit/core/mapDps2DpState';
import { View } from '@ray-js/ray';
import Strings from '@/i18n';
import { Dialog, Sticky, DialogInstance, Loading } from '@ray-js/smart-ui';
import { getGroupDeviceListFromDevInfo } from '@/utils/getGroupDeviceListFromDevInfo';
import { useDiySceneInit } from '@/hooks/useDiySceneInit';

import styles from './index.module.less';

export function Home() {
  const switchLed = useProps(state => state?.switch_led);

  const work_mode_ref = useRef<string>();

  const support = useSupport();

  const dispatch = useDispatch();
  const { value: work_mode, setValue: setWorkMode } = useCloudStorageKey(WORK_MODE_SCENE_MODE, {
    defaultValue: support.isSupportColour() ? 'colour' : 'white',
  });

  const {
    value: work_mode_diy,
    setValue: setWorkModeDiy,
    inited: initedWorkModeDiy,
  } = useCloudStorageKey(WORK_MODE_SCENE_MODE_DIY, {
    defaultValue: 'scene',
  });

  const DiySceneInitApi = useDiySceneInit();

  const deviceActions = useActions();
  const { value: musicMode, setValue: setMusicMode } = useCloudStorageKey(CLOUD_KEY_MUSIC_MODE, {});

  const colorMode = useFixedWorkMode();

  useEffect(() => {
    setColorModeRes(colorMode);
  }, [colorMode]);

  const [colorModeRes, setColorModeRes] = useState(colorMode);

  useEffect(() => {
    const handleDpDataChange = (res: any) => {
      const dps = res?.dps;
      const dpState = mapDps2DpState(dps, devices.common.getDevInfo() as any);
      const new_work_mode = dpState[dpCodes.work_mode];
      const refwork_mode = work_mode_ref.current;

      if (new_work_mode) {
        // 处理工作模式变更
        if (!((work_mode === 'diy' || refwork_mode === 'diy') && new_work_mode === 'scene')) {
          dispatch(actions.common.updateInnerWorkMode(new_work_mode));
          if (work_mode !== new_work_mode) {
            setWorkMode(new_work_mode);
          }
        }
      }

      // 处理本地音乐数据
      const dreamlightmic_music_data = dpState[dpCodes.dreamlightmic_music_data];
      if (typeof dreamlightmic_music_data === 'string') {
        const data = protocols.dreamlightmic_music_data.parser(dreamlightmic_music_data);
        if (data?.power === false) {
          return;
        }

        if (musicMode !== 'local') {
          setMusicMode('local');
        }
        if (work_mode !== 'music') {
          setWorkMode('music');
        }
      }
    };

    const unsubscribe = devices.common.onDpDataChange(handleDpDataChange);
    return () => devices.common.offDpDataChange(unsubscribe);
  }, [work_mode, musicMode]);

  const [groupListLoading, setGroupListLoading] = useState(false);

  const devInfo = devices.common.getDevInfo();

  useEffect(() => {
    const devInfo = devices.common.getDevInfo();
    const groupId = devInfo?.groupId;
    if (groupId) {
      setGroupListLoading(true);
      getGroupDeviceListFromDevInfo({
        groupId,
        success(res) {
          setGroupListLoading(false);
          const { deviceList = [] } = res;
          if (!deviceList.length) {
            return;
          }
          // 如果设备列表中的某个设备的schema中不包含 paint_colour_1, 则进行提示，组成的群组存在不支持的设备，并给出具体的不支持的设备名称
          const notSupportDeviceList = [];
          deviceList.forEach(item => {
            const { schema } = item as unknown as {
              schema: {
                code: string;
              }[];
            };
            if (!schema.some(item => item.code === 'paint_colour_1')) {
              notSupportDeviceList.push(item.name);
            }
          });
          if (notSupportDeviceList.length) {
            const title =
              notSupportDeviceList.length > 3
                ? `${Strings.getLang('group_not_support_device')}: ${notSupportDeviceList.join(
                    ','
                  )}...`
                : `${Strings.getLang('group_not_support_device')}: ${notSupportDeviceList.join(
                    ','
                  )}`;
            DialogInstance.alert({
              title,
            });
          }
        },
      });
    }
  }, []);

  // init scene
  const { initScene, onChangeSceneId } = useSceneInit();
  const { initLocalMusic } = useLocalMusicInit({
    enableRandom: true,
    selectedRandomColors: null,
  });
  const isSupport = useIsSupport();
  const { setValue: setPreColorOrWhiteMode } = useCloudStorageKey(WORK_MODE_PRE_COLOR_MODE, {
    defaultValue: ['colour', 'white'].includes(work_mode) ? work_mode : 'colour',
  });

  const routes = {
    colour: (
      <Light
        colorMode={colorModeRes}
        onChangeColorMode={colorMode => {
          setColorModeRes(colorMode);
          setPreColorOrWhiteMode(colorMode);
        }}
      />
    ),
    music: <Music musicMode={musicMode} onMusicModeChange={setMusicMode} />,
    scene: <Scene onChangeSceneId={onChangeSceneId} />,
    diy: <TabDiy api={DiySceneInitApi} />,
  };
  if (!isSupport.isSupportLight) {
    routes.colour = null;
  }
  if (!isSupport.isSupportMusic) {
    routes.music = null;
  }
  if (!isSupport.isSupportScene) {
    routes.scene = null;
    routes.diy = null;
  }

  let currentRoute = work_mode;
  if (['colour', 'white'].includes(work_mode)) {
    currentRoute = 'colour';
  }
  if (['scene'].includes(work_mode)) {
    currentRoute = work_mode;
  }
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const { scrollable } = useScrollControl();

  const [isFixed, setIsFixed] = useState(false);

  const content = (
    <View
      style={{
        transition: 'all 0.9s linear',
        opacity: switchLed ? 1 : 0,
        height: switchLed ? 'inherit' : '0px',
        overflow: 'hidden',
      }}
    >
      <Sticky
        offsetTop={statusBarHeight + 44 + 24}
        onScroll={e => setIsFixed(!!e?.detail?.isFixed)}
      >
        <WorkMode
          isFixed={isFixed}
          current={work_mode}
          onChange={mode => {
            work_mode_ref.current = mode;
            if (['colour', 'white', 'scene', 'music'].includes(mode)) {
              deviceActions.work_mode.set(mode);
            }
            if (mode === 'diy') {
              DiySceneInitApi.initDiyScene();
              setWorkModeDiy('diy');
            }
            if (mode === 'scene') {
              initScene(true);
              setWorkModeDiy('scene');
            }
            if (mode === 'music') {
              initLocalMusic();
            }
            setWorkMode(mode);
          }}
        />
      </Sticky>
      <View className={styles.content}>{routes[currentRoute]}</View>
    </View>
  );
  if (groupListLoading) {
    return <Loading />;
  }
  return (
    <View className={styles.view}>
      <TopBar
        style={{
          justifyContent: 'flex-start',
        }}
        titleStyle={{
          textAlign: 'left',
        }}
        title={devInfo.name}
        isShowLeft={false}
      />
      <View className={styles.scroll} style={{ overflowY: scrollable ? 'auto' : 'hidden' }}>
        <HomeHead />
        {content}
        <MoreComponent />
      </View>

      <Dialog id="smart-dialog" />
    </View>
  );
}

export default Home;
