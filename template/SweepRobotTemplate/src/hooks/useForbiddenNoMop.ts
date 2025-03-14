// 禁拖

import { ALL_ZONE_MUN_MAX, DEFAULT_VIRTUAL_AREA_NO_MOP_CONFIG } from '@/constant';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import base64Imgs from '@/res/base64Imgs';
import { checkMapPointNumber, createLimitByNum, getFirNum } from '@/utils';
import { addLaserMapArea, getMapPointsInfo } from '@/utils/openApi';
import { useRef, useState } from 'react';
import { ENativeMapStatusEnum, Point } from '@ray-js/robot-sdk-types';
import { convertColorToArgbHex } from '@ray-js/robot-protocol';
import { useSelector } from 'react-redux';
import { isUndefined } from 'lodash-es';

export const useForbiddenNoMop = () => {
  const lastTempAreaRef = useRef<{ points: Point[] }>();
  const mapSize = useSelector(selectMapStateByKey('mapSize'));
  const curPos = useSelector(selectMapStateByKey('curPos'));
  const origin = useSelector(selectMapStateByKey('origin'));
  const { width: mapWidth, height: mapHeight } = mapSize;
  const [minAreaWidth, setMinAreaWidth] = useState(10);
  const [bgColor, setBgColor] = useState('rgba(254, 138, 7, 0.2)');
  const [borderColor, setBorderColor] = useState('rgba(254, 138, 7, 1)');
  const [maxLength, setMaxLength] = useState(5);

  const createAreaPoints: (mapId: string) => Promise<{ points: Point[] }> = (mapId: string) => {
    return new Promise((resolve, reject) => {
      let points: { x: number; y: number }[] = [];
      checkMapPointNumber(ALL_ZONE_MUN_MAX, 0, mapId)
        .then(() => {
          const lastTempArea = lastTempAreaRef.current;

          if (lastTempArea) {
            // 如果有临时区域，以上一个为准来偏移
            const [p1, p2, p3, p4] = lastTempArea.points;
            points = [
              { x: p1.x - 10, y: p1.y + 10 },
              { x: p2.x - 10, y: p2.y + 10 },
              { x: p3.x - 10, y: p3.y + 10 },
              { x: p4.x - 10, y: p4.y + 10 },
            ];
          } else if (mapHeight && mapWidth) {
            // 如果有高度和宽度
            const { x: ox, y: oy } = origin;
            const originX = Math.round(mapWidth / 2 - ox);
            const originY = Math.round(mapHeight / 2 - oy);
            points = [
              { x: originX - minAreaWidth, y: originY - minAreaWidth },
              { x: originX + minAreaWidth, y: originY - minAreaWidth },
              { x: originX + minAreaWidth, y: originY + minAreaWidth },
              { x: originX - minAreaWidth, y: originY + minAreaWidth },
            ];
          } else {
            const { x: ox, y: oy } = origin;
            const { x: px, y: py } = curPos;
            const originX = getFirNum([px, ox, 0]);
            const originY = getFirNum([py, oy, 0]);
            points = [
              { x: originX - minAreaWidth, y: originY - minAreaWidth },
              { x: originX + minAreaWidth, y: originY - minAreaWidth },
              { x: originX + minAreaWidth, y: originY + minAreaWidth },
              { x: originX - minAreaWidth, y: originY + minAreaWidth },
            ];
          }
          lastTempAreaRef.current = { points };
          resolve({ points });
        })
        .catch(() => {
          reject();
        });
    });
  };

  const updateConfig = (cfg: {
    areaWidth?: number;
    borderColor?: string;
    maxLength?: number;
    bgColor?: string;
  }) => {
    const { areaWidth } = cfg;
    if (!isUndefined(areaWidth)) {
      setMinAreaWidth(areaWidth);
    }
    if (!isUndefined(cfg.borderColor)) {
      setBorderColor(cfg.borderColor);
    }
    if (!isUndefined(cfg.maxLength)) {
      setMaxLength(cfg.maxLength);
    }
    if (!isUndefined(cfg.bgColor)) {
      setBgColor(cfg.bgColor);
    }
  };

  const getForbiddenNoMopConfig = (points: Point[]) => {
    const config = {
      ...DEFAULT_VIRTUAL_AREA_NO_MOP_CONFIG,
      box: {
        bgColor: convertColorToArgbHex(bgColor),
        borderColor: convertColorToArgbHex(borderColor),
        isDash: false,
        minAreaWidth,
      },
      content: {
        text: '',
        textColor: convertColorToArgbHex('#fff'),
        textSize: 10,
        renameEnable: false,
        rotateEnable: true,
      },
      unit: {
        // 如果不支持单位显示，就设置为透明色字号
        textColor: borderColor,
      },
      points,
    };
    return config;
  };

  const drawOneForbiddenNoMop = async (mapId: string, points?: Point[]) => {
    let renderPoints = points;
    if (isUndefined(renderPoints)) {
      const { points: newPoints } = await createAreaPoints(mapId);
      renderPoints = newPoints;
    }
    const { data } = await getMapPointsInfo(mapId);
    const existVirtualBox = data.filter(i => i.extend.forbidType === 'mop');
    const countLimit = createLimitByNum(existVirtualBox, maxLength, 'dsc_max_forbid_mop_number');
    if (countLimit) {
      return null; // Consider throwing an error or returning a specific message instead of returning null for better error handling.
    }
    const config = getForbiddenNoMopConfig(renderPoints);
    await addLaserMapArea(mapId, config);
    return { area: { ...config, type: ENativeMapStatusEnum.areaSet } };
  };

  const clearLastForbiddenNoMop = () => {
    lastTempAreaRef.current = undefined;
  };

  return {
    drawOneForbiddenNoMop,
    updateConfig,
    createAreaPoints,
    getForbiddenNoMopConfig,
    clearLastForbiddenNoMop,
  };
};
