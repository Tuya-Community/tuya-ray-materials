import { MapHeader } from '@/typings';
import { scaleNumber, transformChargeXY } from '@/utils';

/**
 * 获取Map协议的版本 对应第一个Byte
 * @param mapStr
 */

export const getMapProtocolVersion = (mapStr: string): number => {
  const version = parseInt(mapStr.slice(0, 2), 16);
  return version;
};

/**
 * 解析地图Header version: 0x00,0x01,0x02
 * @param mapStr 原始地图字符串
 * @returns 地图Header数据
 */
export const decodeMapHeader = (mapStr: string): MapHeader => {
  // TODO 这里解析的逻辑需要重构下更易读的方式
  const version = parseInt(mapStr.slice(0, 2), 16);
  const mapHeaderStr = mapStr.slice(0, version === 3 ? 52 : 48);

  let i = 2;
  const id = parseInt(mapHeaderStr.slice(i, i + 4), 16);

  i += 4;
  const mapStable = parseInt(mapHeaderStr.slice(i, i + 2), 16) === 1;

  i += 2;
  const mapWidth = parseInt(mapHeaderStr.slice(i, i + 4), 16);

  i += 4;
  const mapHeight = parseInt(mapHeaderStr.slice(i, i + 4), 16);

  i += 4;
  const originX = scaleNumber(1, parseInt(mapHeaderStr.slice(i, i + 4), 16));

  i += 4;
  const originY = scaleNumber(1, parseInt(mapHeaderStr.slice(i, i + 4), 16));

  i += 4;
  const mapResolution = scaleNumber(2, parseInt(mapHeaderStr.slice(i, i + 4), 16));

  i += 4;
  const chargeX = scaleNumber(1, parseInt(mapHeaderStr.slice(i, i + 4), 16));

  i += 4;
  const chargeY = scaleNumber(1, parseInt(mapHeaderStr.slice(i, i + 4), 16));

  let chargeDirection;
  if (version === 3) {
    i += 4;
    chargeDirection = parseInt(mapHeaderStr.slice(i, i + 4), 16);
  }

  i += 4;
  const dataLengthBeforeCompress = parseInt(mapHeaderStr.slice(i, i + 8), 16);

  i += 8;
  const dataLengthAfterCompress = parseInt(mapHeaderStr.slice(i, i + 4), 16);

  const chargePositionTransformed = transformChargeXY({ chargeX, chargeY }, { originX, originY });

  return {
    mapHeaderStr,
    version,
    id,
    mapStable,
    mapWidth,
    mapHeight,
    originX,
    originY,
    mapResolution,
    chargeX,
    chargeY,
    chargeDirection,
    chargePositionTransformed,
    dataLengthBeforeCompress,
    dataLengthAfterCompress,
  };
};
