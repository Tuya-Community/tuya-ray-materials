// 定点清扫

import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { addLaserMapPosPoints } from '@/utils/openApi';
import { ENativeMapStatusEnum, Point } from '@ray-js/robot-sdk-types';
import { isUndefined } from 'lodash-es';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const usePoseClean = () => {
  const mapSize = useSelector(selectMapStateByKey('mapSize'));
  const origin = useSelector(selectMapStateByKey('origin'));
  const { width: mapWidth, height: mapHeight } = mapSize;
  const [bgColor, setBgColor] = useState('#195D68FE');
  const [borderColor, setBorderColor] = useState('#FF5D68FE');

  const updateConfig = (cfg: { borderColor?: string; bgColor?: string }) => {
    if (!isUndefined(cfg.borderColor)) {
      setBorderColor(cfg.borderColor);
    }

    if (!isUndefined(cfg.bgColor)) {
      setBgColor(cfg.bgColor);
    }
  };

  const getPoseCleanConfig = (points: Point[]) => {
    const config = {
      points,
      type: ENativeMapStatusEnum.pressToRun,
      pos: {
        meter: 1.6,
        factor: 0.05,
        bgColor,
        borderColor,
        isDash: false,
        lineWidth: 0.5,
        dashSize: 1,
        gapSize: 4,
      },

      unit: {
        // 如果不支持单位显示，就设置为透明色字号
        textColor: borderColor,
      },
      viewType: 'dashEdit',
      extend:
        JSON.stringify({
          forbidType: 'sweep',
        }) || '',
    };
    return config;
  };

  const drawPoseCleanArea = async (mapId: string, points?: Point[]) => {
    if (mapHeight && mapWidth) {
      const { x: ox, y: oy } = origin;
      const originX = Math.round(mapWidth / 2 - ox);
      const originY = Math.round(mapHeight / 2 - oy);

      let renderPoints = points;
      if (isUndefined(renderPoints)) {
        renderPoints = [{ x: originX, y: originY }];
      }

      const config = getPoseCleanConfig(renderPoints);
      await addLaserMapPosPoints(mapId, config);
      return { area: { ...config, type: ENativeMapStatusEnum.areaSet } };
    }
    return null;
  };

  return {
    drawPoseCleanArea,
    updateConfig,
    getPoseCleanConfig,
  };
};
