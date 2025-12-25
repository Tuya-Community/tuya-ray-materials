import { useCallback, useEffect, useMemo, useState } from 'react';

import { dpCodes } from '@/constant/dpCodes';
import { DrawColor } from '@/constant/type';
import { protocols } from '@/devices/protocols';
import { getArray } from '@/utils/kit';
import { brightKelvin2rgba } from '@/utils/tempcolor';
import { useProps } from '@ray-js/panel-sdk';
import { hsv2rgbString } from '@ray-js/panel-sdk/lib/utils';

// 负责保存和获取 灯珠数据
export const useLightStripDataList = (diy_scene_str: string) => {
  // 当前的灯带数据
  const [currentLightStripDataList, setCurrentLightStripDataList] = useState([]);
  const diy_scene = useMemo(
    () => diy_scene_str && protocols.diy_scene.parser(diy_scene_str),
    [diy_scene_str]
  );

  const [inited, setInited] = useState(false);

  // default: 0
  // const ledNumber = useLedNumber();
  const ledNumber = useProps(p => p[dpCodes.led_number_set]);

  // 灯珠数据需要存一下
  // 因为下发只设置选中灯珠的数据
  useEffect(() => {
    if (diy_scene) {
      if (getArray(diy_scene?.segments).length) {
        let segments = getArray(diy_scene?.segments);
        if (segments?.length < ledNumber) {
          segments = segments.concat(
            new Array(ledNumber - segments?.length).fill(0).map(i => ({
              isWhite: false,
              hue: 0,
              saturation: 1000,
              value: 1000,
              brightness: 0,
              temperature: 0,
            }))
          );
        }
        setCurrentLightStripDataList(
          getArray(segments).map(item => {
            if (item.isWhite) {
              const { brightness, temperature } = item;
              return brightKelvin2rgba(brightness, temperature);
            }
            const { hue = 0, saturation = 1000, value = 1000 } = item;
            const color = hsv2rgbString(hue, Math.round(saturation / 10), Math.round(value / 10));
            return color?.replaceAll(/\s+/g, '');
          })
        );
        setInited(true);
      } else {
        updateStripDataList({ hue: 0, saturation: 1000, value: 1000, isWhite: false }, true);
      }
    } else {
      updateStripDataList({ hue: 0, saturation: 1000, value: 1000, isWhite: false }, true);
    }
  }, [diy_scene]);

  // 选中的灯珠
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());

  // 初始化和更新灯带数据
  const updateStripDataList = useCallback(
    (newHsv: DrawColor, isSectionAll = false) => {
      const currentStripLen = currentLightStripDataList?.length;
      // 如果选中的灯带数量大于当前灯带数量，直接补全
      // 这里是初始化
      if (currentStripLen < ledNumber) {
        console.log('[updateStripDataList]~ init:', newHsv, isSectionAll, ledNumber);
        const newLightStripDataList1 = new Array(ledNumber).fill(1).map((item, index) => {
          if (newHsv.isWhite) {
            const { brightness, temperature } = newHsv;
            return brightKelvin2rgba(brightness, temperature);
          }
          const { hue = 0, saturation = 1000, value = 1000 } = newHsv;
          const color = hsv2rgbString(hue, Math.round(saturation / 10), Math.round(value / 10));
          return color?.replaceAll(/\s+/g, '');
        });
        setCurrentLightStripDataList(newLightStripDataList1);
        return newLightStripDataList1;
      }

      console.log('[updateStripDataList]~ update:', newHsv, isSectionAll, ledNumber, checkedSet);
      // 分段/全段更新数据
      const newLightStripDataList = currentLightStripDataList
        .map((item, index) => {
          if (checkedSet.has(index) || isSectionAll) {
            if (newHsv.isWhite) {
              const { brightness, temperature } = newHsv;
              return brightKelvin2rgba(brightness, temperature);
            }
            const { hue = 0, saturation = 1000, value = 1000 } = newHsv;
            const color = hsv2rgbString(hue, Math.round(saturation / 10), Math.round(value / 10));
            return color?.replaceAll(/\s+/g, '');
          }
          return item;
        })
        .slice(0, ledNumber);
      console.log('[updateStripDataList]~ update new list:', newLightStripDataList);
      setCurrentLightStripDataList(newLightStripDataList);
      return newLightStripDataList;
    },
    [ledNumber, checkedSet, currentLightStripDataList]
  );

  return {
    currentLightStripDataList,
    ledNumber,
    updateStripDataList,
    setCheckedSet,
    checkedSet,
    inited,
  };
};
