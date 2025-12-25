import { useRef } from 'react';

import { DrawColor } from '@/constant/type';
import { DiySceneData } from '@/devices/protocols/DiySceneFormatter';
import Strings from '@/i18n';
import { getArray } from '@/utils/kit';
import { useActions, useStructuredActions, useStructuredProps } from '@ray-js/panel-sdk';

import { useLightStripDataList } from './useLightStripDataList';
import { useCutDrawDiySceneSet } from './useCutDrawDiyScene';

export interface UpdateStripDataListAllOps {
  isMoving: boolean;
  color: DrawColor;
  isSectionAll: boolean;
}

export const useDrawToolDataList = (diy_scene_str: string) => {
  const res = useLightStripDataList(diy_scene_str);

  const { checkedSet, updateStripDataList, ledNumber } = res;

  const actions = useActions();

  const preUpdateCloudDataRef = useRef(null);

  const diy_scene = useStructuredProps(props => props.diy_scene);
  const structuredActions = useStructuredActions();
  const cutDrawDiySceneSet = useCutDrawDiySceneSet();
  const updateStripDataListAll = ({ isMoving, color, isSectionAll }: UpdateStripDataListAllOps) => {
    if (!color) {
      return;
    }
    if (!isSectionAll && checkedSet.size === 0) {
      ty.showToast({
        title: Strings.getLang('checkLightTip'),
        icon: 'none',
      });
    }
    if (isMoving) {
      // 滑动时实时，更新灯带颜色
      updateStripDataList(color);
      return;
    }
    // 全段控制时 下发dp 更新颜色
    if (isSectionAll) {
      const res: DiySceneData = {
        ...(diy_scene || {}),
        ...(color || {}),
        effect: 1,
        daubType: 'all',
        // 所有段都更新为这个颜色
        segments: new Array(ledNumber).fill(0).map(i => ({
          index: i,
          ...color,
        })),
      };

      console.log('[diy_scene] set:', res);
      cutDrawDiySceneSet(res, {
        success() {
          const newLightStripDataList = updateStripDataList(color, isSectionAll);
          preUpdateCloudDataRef.current = newLightStripDataList;
        },
        fail(e) {
          console.error('fail', e);
        },
      });
      return;
    }
    // 松手时，下发 dp 数据
    // 如果外部有颜色传入并且存在选中的灯珠那么更新选中的灯珠颜色
    if (checkedSet.size > 0) {
      const indexs = Array.from(checkedSet);
      const curSegments = getArray(diy_scene?.segments);
      const res: DiySceneData = {
        ...(diy_scene || {}),
        daubType: 'single',
        segments: new Array(ledNumber)
          .fill(0)
          .map((_, index) => {
            const item = curSegments[index] || {
              isWhite: false,
              hue: 0,
              saturation: 1000,
              value: 1000,
              brightness: 0,
              temperature: 0,
            };
            // 编辑选中的颜色
            if (indexs.includes(index)) {
              item.brightness = color.brightness;
              item.hue = color.hue;
              item.isWhite = color.isWhite;
              item.saturation = color.saturation;
              item.value = color.value;
              item.temperature = color.temperature;
            }
            return item;
          })
          .slice(0, ledNumber),
      };
      console.log('[diy_scene] set:', res);
      cutDrawDiySceneSet(res, {
        success() {
          const newLightStripDataList = updateStripDataList(color, false);
          preUpdateCloudDataRef.current = newLightStripDataList;
        },
        fail(params) {
          console.error('__checkedSet fail', params);
        },
      });
    }
  };

  const resetDraw = () => {
    updateStripDataListAll({
      isMoving: false,
      color: {
        hue: 0,
        saturation: 1000,
        value: 1000,
        isWhite: false,
      },
      isSectionAll: true,
    });
  };

  const getDefault = () => {
    const scene: DiySceneData = {
      version: 0,
      id: 0,
      daubType: 'all',
      effect: 1,
      segments: new Array(ledNumber).fill(0).map(i => ({
        index: i,
        isWhite: false,
        hue: 0,
        saturation: 1000,
        value: 1000,
        brightness: 0,
        temperature: 0,
      })),
    };
    return scene;
  };

  return {
    ...res,
    updateStripDataListAll,
    resetDraw,
    getDefault,
  };
};
