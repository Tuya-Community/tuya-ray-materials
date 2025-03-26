/* eslint-disable no-shadow */
import React, { useMemo } from 'react';
import { useActions, useProps } from '@ray-js/panel-sdk';

import { ControlBar as ControlBarCom } from '@/components';
import { lampSchemaMap } from '@/devices/schema';
import { devices } from '@/devices';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTab, updateCurrentTab } from '@/redux';
import { useCdnImgUrl } from '@/utils/getCdnImgUrl';
import { useDebugPerf } from '@/hooks';

const { paint_colour_data, music_data, dreamlightmic_music_data } = lampSchemaMap;

enum EActionType {
  Dimmer = 'dimmer',
  Scene = 'scene',
  Music = 'music',
  Clip = 'clip',
  Timer = 'timer',
  More = 'more',
}

export const ControlBar = () => {
  const actions = useActions();
  const dispatch = useDispatch();
  useDebugPerf(ControlBar);
  const updateTab = (type: EActionType) => {
    dispatch(updateCurrentTab(type));
  };

  const icon_dimmer = useCdnImgUrl('icon_dimmer.png');
  const icon_dimmer_active = useCdnImgUrl('icon_dimmer_active.png');
  const icon_scene = useCdnImgUrl('icon_scene.png');
  const icon_scene_active = useCdnImgUrl('icon_scene_active.png');
  const icon_music = useCdnImgUrl('icon_music.png');
  const icon_music_active = useCdnImgUrl('icon_music_active.png');
  const icon_more = useCdnImgUrl('icon_more.png');
  const icon_more_active = useCdnImgUrl('icon_more_active.png');
  const icon_power = useCdnImgUrl('power.png');

  const tabList = useMemo(() => {
    const list = [
      {
        // title: '调光',
        key: EActionType.Dimmer,
        icon: icon_dimmer,
        activeIcon: icon_dimmer_active,
        visible: true,
        callback: () => updateTab(EActionType.Dimmer),
      },
      {
        // title: '场景',
        key: EActionType.Scene,
        icon: icon_scene,
        activeIcon: icon_scene_active,
        visible: devices.lamp.model.abilities.support.isSupportDp(paint_colour_data?.code),
        callback: () => updateTab(EActionType.Scene),
      },
      {
        // title: '音乐律动',
        key: EActionType.Music,
        icon: icon_music,
        activeIcon: icon_music_active,
        visible: devices.lamp.model.abilities.support.isSupportDp(dreamlightmic_music_data.code),
        callback: () => updateTab(EActionType.Music),
      },
    ];
    // 默认更多按钮
    // title: '更多',
    list.push({
      key: EActionType.More,
      icon: icon_more,
      activeIcon: icon_more_active,
      visible: true,
      callback: () => updateTab(EActionType.More),
    });
    return list.filter(i => i.visible);
  }, [
    icon_dimmer,
    icon_dimmer_active,
    icon_scene,
    icon_scene_active,
    icon_music,
    icon_music_active,
    icon_more,
    icon_more_active,
  ]);

  const currentTab = useSelector(selectCurrentTab);
  const powerItem = {
    key: 'power',
    icon: icon_power,
    activeIcon: icon_power,
    callback: () => {
      actions.switch_led?.toggle({ throttle: 300 });
    },
  };

  const power = useProps(p => p.switch_led);
  return (
    <ControlBarCom tabList={tabList} tabActive={currentTab} powerItem={powerItem} power={power} />
  );
};

export default ControlBar;
