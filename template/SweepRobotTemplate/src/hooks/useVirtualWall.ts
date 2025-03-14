// 虚拟墙
import {
  ALL_ZONE_MUN_MAX,
  DEFAULT_VIRTUAL_WALL_CONFIG,
  DEFAULT_VIRTUAL_WALL_LINE_COLOR,
  DEFAULT_VIRTUAL_WALL_LINE_WIDTH,
} from '@/constant';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { checkMapPointNumber, createLimitByNum, getFirNum } from '@/utils';
import { addLaserMapArea, getMapPointsInfo } from '@/utils/openApi';
import { convertColorToArgbHex } from '@ray-js/robot-protocol';
import { ENativeMapStatusEnum, Point } from '@ray-js/robot-sdk-types';
import { isUndefined } from 'lodash-es';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export const useCreateVirtualWall = () => {
  const mapSize = useSelector(selectMapStateByKey('mapSize'));
  const curPos = useSelector(selectMapStateByKey('curPos'));
  const origin = useSelector(selectMapStateByKey('origin'));
  const lastTempAreaRef = useRef<{ points: Point[] }>();
  const { width: mapWidth, height: mapHeight } = mapSize;
  const [lineColor, setLineColor] = useState(DEFAULT_VIRTUAL_WALL_LINE_COLOR);
  const [lineWidth, setLineWidth] = useState(DEFAULT_VIRTUAL_WALL_LINE_WIDTH);
  const [maxLength, setMaxLength] = useState(5);
  const createNewWallPoints = (mapId: string): Promise<{ points: Point[] }> => {
    return new Promise((resolve, reject) => {
      let points: Point[] = [];
      const lastTempArea = lastTempAreaRef.current;
      checkMapPointNumber(ALL_ZONE_MUN_MAX, 0, mapId)
        .then(() => {
          if (lastTempArea) {
            // 如果有临时区域，以上一个为准来偏移
            const [p1, p2] = lastTempArea.points;
            points = [
              { x: p1.x - 10, y: p1.y + 10 },
              { x: p2.x - 10, y: p2.y + 10 },
            ];
          } else if (mapHeight && mapWidth) {
            // 如果有高度和宽度
            const { x: ox, y: oy } = origin;
            const originX = Math.round(mapWidth / 2 - ox);
            const originY = Math.round(mapHeight / 2 - oy);

            points = [
              { x: originX - 30, y: originY - 30 },
              { x: originX + 30, y: originY - 30 },
            ];
          } else {
            const { x: ox, y: oy } = origin;
            const { x: px, y: py } = curPos;

            const originX = getFirNum([px, ox, 0]);
            const originY = getFirNum([py, oy, 0]);

            points = [
              { x: originX - 30, y: originY - 30 },
              { x: originX + 30, y: originY - 30 },
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

  const getVirtualWallConfig = (points: Point[]) => {
    const areaZone = {
      ...DEFAULT_VIRTUAL_WALL_CONFIG,
      line: {
        bgColor: lineColor,
        lineWidth,
      },
      vertex: {
        showVertexImage: false,
        vertexType: 'square',
        vertexColor: convertColorToArgbHex(lineColor),
        radius: 3,
        vertexExtendTimes: 3,
      },
      points,
    };
    return areaZone;
  };

  const updateConfig = (cfg: { lineColor: string; lineWidth: number; countLimit: number }) => {
    const { lineColor: lColor, lineWidth: lWidth, countLimit: count } = cfg;
    if (!isUndefined(lineColor)) {
      setLineColor(lColor);
    }
    if (!isUndefined(lWidth)) {
      setLineWidth(lWidth);
    }
    if (!isUndefined(count)) {
      setMaxLength(count);
    }
  };

  const drawOneVirtualWall = async (mapId: string, points?: Point[]) => {
    try {
      let renderPoints = points;
      if (isUndefined(renderPoints)) {
        const { points: newPoints } = await createNewWallPoints(mapId);
        renderPoints = newPoints;
      }
      const { data } = await getMapPointsInfo(mapId);
      // @ts-ignore
      const existVirtualBox = data.filter(i => i.extend.isWall);
      const countLimit = createLimitByNum(
        existVirtualBox,
        maxLength,
        'dsc_max_virtual_walls_number'
      );

      if (countLimit) {
        return null; // Consider throwing an error or returning a specific message instead of returning null for better error handling.
      }

      const config = getVirtualWallConfig(renderPoints);
      await addLaserMapArea(mapId, config);

      return { area: { ...config, type: ENativeMapStatusEnum.areaSet } };
    } catch (error) {
      console.error('Error drawing virtual wall:', error); // Logging the error for debugging
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  return {
    createNewWallPoints,
    drawOneVirtualWall,
    updateConfig,
    getVirtualWallConfig,
  };
};
