/*
 * @Author: mjh
 * @Date: 2024-12-26 11:14:29
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-09 18:04:32
 * @Description:
 */
import { updateCollectColors, updateCollectWhites } from '@/redux/modules/cloudStateSlice';
import { updateCustomColor, upDateStyleData } from '@/redux/modules/uiStateSlice';
import { usePageInstance } from '@ray-js/ray';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PowerMemory } from '@/devices/protocols/parsers/PowerMemoryFormatter';
import { PowerMemoryFunctionalData } from '../types';

/**
 * @name: 初始化 功能页参数
 * @desc:
 * @return {*}
 */
export const useInitPresetData = (powerMemory: Partial<PowerMemory>) => {
  const [presetData, setPresetData] = useState<PowerMemoryFunctionalData>();
  const page = usePageInstance();
  const dispatch = useDispatch();
  useEffect(() => {
    const presetData: PowerMemoryFunctionalData = page.getPresetData() || {};
    setPresetData(presetData);
    const { collectColors, collectWhites, customColor = {} } = presetData;
    const newCustomColor = {
      ...(powerMemory?.mode === 2
        ? powerMemory.brightness
          ? {
              brightness: powerMemory.brightness,
              temperature: powerMemory.temperature,
              colorMode: 'white',
            }
          : {
              hue: powerMemory.hue,
              saturation: powerMemory.saturation,
              value: powerMemory.value,
              colorMode: 'colour',
            }
        : {}),
      ...customColor,
    };
    dispatch(updateCustomColor(newCustomColor));
    dispatch(
      upDateStyleData({
        bgStyle: presetData.bgStyle,
        smartUIThemeVars: presetData.smartUIThemeVars,
        themeColor: presetData.themeColor,
        tabLineStyle: presetData.tabLineStyle,
        tabLineActiveStyle: presetData.tabLineActiveStyle,
        background: presetData.background,
        collectBorderColor: presetData.collectBorderColor,
        fontColor: presetData.fontColor,
        cardStyle: presetData.cardStyle,
        dynamicDistribute: presetData.dynamicDistribute,
      })
    );
    dispatch(updateCollectColors(collectColors));
    dispatch(updateCollectWhites(collectWhites));
  }, [page, JSON.stringify(powerMemory || {})]);
  return presetData;
};
