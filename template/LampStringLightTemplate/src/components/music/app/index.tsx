/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { RowList } from '@/components/rowlist';
import { getArray, isNotNullOrUndefined } from '@/utils/kit';
import { useActions, useProps, useStructuredActions } from '@ray-js/panel-sdk';
import { View } from '@ray-js/ray';

import { useCloudStorageKey } from '@/hooks/useCloudStorageKey';
import { CLOUD_KEY_APP_MUSIC_ID } from '@/constant';
import { useSelector } from '@/redux';
import { RandomItem } from '@/components/random-colors/colors';
import { calcPosition } from '@ray-js/panel-sdk/lib/utils';
import { devices } from '@/devices';
import { offMusic2RgbChange, onMusic2RgbChange } from './sdk';
import styles from './index.module.less';
import { defaultAppMusicList } from './resource';

export interface AppMusicProps {
  enableRandom: boolean;
  selectedRandomItemRef: React.MutableRefObject<RandomItem>;
  enableRandomRef: React.MutableRefObject<boolean>;
  selectedRandomColors: RandomItem;
  dataSource: {
    icon: any;
    id: number;
    title: string;
    mode: number;
    colorArr?: {
      hue: number;
      saturation: number;
      value?: number;
      brightness?: number;
      temperature?: number;
    }[];
  }[];
}

export const AppMusic: React.FC<AppMusicProps> = ({
  dataSource,
  enableRandom,
  selectedRandomColors,
  selectedRandomItemRef,
  enableRandomRef,
}) => {
  const structuredActions = useStructuredActions();
  const actions = useActions();

  const switch_led = useProps(state => state?.switch_led);
  const work_mode = useSelector(state => state?.common?.inner_work_mode);

  // -1表示还在请求数据
  // 空表示没有设置过
  // 有值表示设置过
  // const {
  //   value: _currentId,
  //   setValue: _setCurrentId,
  //   inited,
  // } = useCloudStorageKey(CLOUD_KEY_APP_MUSIC_ID, {
  //   defaultValue: '-1',
  // });
  const [currentId, _setCurrentId] = useState(-1);
  const currentIdRef = useRef(currentId);

  const isStarted = useRef(false);

  // 选择音乐种类
  const setCurrentId = (id: number, noPlay = false) => {
    if (!isStarted.current) {
      isStarted.current = true;
      if (noPlay) {
        // noop
      } else {
        onPlay();
      }
    }

    if (isNotNullOrUndefined(id) && +id !== -1) {
      actions.work_mode.set('music');
    }
    currentIdRef.current = id;
    _setCurrentId(id);
  };

  // 注册监听
  const onPlay = () => {
    onMusic2RgbChange(
      data => {
        if (!data) return;

        // 这里面的状态是实时变化的
        // react state 特性会导致这里都是首次的状态, 所以都是从Ref里取

        // 获取当前的颜色组
        // ------------------------
        const currentId = currentIdRef.current;
        const appItem = getArray(dataSource).find(item => item.id === currentId);
        const mode = appItem?.mode ?? 1;
        let colorList: { hue: number; saturation: number; value: number }[];

        const enableRandom = enableRandomRef.current;
        const selectedRandomColors = selectedRandomItemRef.current;
        if (enableRandom) {
          // 开启随机色后，使用app律动回调给的hsv
          colorList = getArray(appItem?.colorArr) as any;
        } else {
          // 关闭随机色后，使用预设颜色
          colorList = getArray(selectedRandomColors?.colors).map(item => ({
            ...item,
            saturation: item.saturation * 10,
            value: item.value * 10,
          }));
        }

        const nextColorList = getArray(colorList).length > 0 ? getArray(colorList) : [];
        // ------------------------

        const musicData = {
          mode: mode as any,
          hue: data?.hue,
          saturation: data?.saturation,
          value: data?.value,
          brightness: data?.bright,
          temperature: data?.temperature,
        };

        const { db, dB } = data?.extra || {};
        const _db = dB || db || 0;

        if (nextColorList.length > 0) {
          // 随机获取colorList中的一个
          // ------------------------
          const randomColor = nextColorList[Math.floor(Math.random() * nextColorList.length)];

          musicData.hue = randomColor.hue;
          musicData.saturation = randomColor.saturation;
          let brightness = randomColor.value;

          const dBRange = [40, 80];
          const [minDB, maxDB] = dBRange;
          const [minBright, maxBright] = [0, 1000];

          if (_db <= minDB) {
            brightness = minBright;
          } else if (_db >= maxDB) {
            brightness = maxBright;
          } else {
            brightness = Math.round(calcPosition(_db, minDB, maxDB, minBright, maxBright));
          }
          musicData.value = brightness;
        }

        const SupportUtils = devices.common.model.abilities.support;
        if (SupportUtils.isSupportColour()) {
          // 支持彩光的时候，去掉白光
          musicData.brightness = 0;
          musicData.temperature = 0;
        }

        structuredActions.music_data.set(musicData, {
          throttle: 300,
        });
      },
      {
        mode: 1,
        colorList: defaultAppMusicList[0].colorArea,
      }
    );
  };

  // // 初始化一个id
  // useEffect(() => {
  //   console.log('switch_led work_mode', switch_led, work_mode, currentId);
  //   // 初始化，这里防止二次执行
  //   if (isStarted.current) return;

  //   // -1 还在获取数据
  //   if (!inited) return;

  //   if (switch_led) {
  //     if (work_mode === 'music') {
  //       if (isNotNullOrUndefined(currentId) && +currentId !== -1) {
  //         console.log('currentId', currentId);
  //         setCurrentId(currentId);
  //       } else {
  //         // 空，表示首次配网，需要设置第一个
  //         const defId = getArray(dataSource)[0]?.id;
  //         if (isNotNullOrUndefined(defId)) {
  //           setCurrentId(defId);
  //         }
  //       }
  //     }
  //   }
  // }, [switch_led, currentId, work_mode, dataSource, inited]);

  // 离开app音乐模式时，关闭app音乐
  useEffect(() => {
    return () => {
      console.log('AppMusic unmount');
      // unmount
      offMusic2RgbChange();
      // setCurrentId(-1, true);
      isStarted.current = false;
    };
  }, [switch_led, work_mode]);

  return (
    <View className={styles.contain}>
      <RowList
        current={currentId}
        onChange={id => setCurrentId(id)}
        dataSource={getArray(dataSource)}
      />
    </View>
  );
};
