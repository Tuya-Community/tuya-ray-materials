import { MapData, MapHeader } from '@/typings';
import { decodeMapHeader, getMapProtocolVersion } from './decodeMapHeader';
import { decodeMapData } from './decodeMapData';
import { decodeMapStructured } from './decodeMapStructured';

/**
 * 解析地图数据 version: 0x00,0x01,0x02,0x03
 * @param mapStr 原始地图字符串
 * @returns 地图数据
 */
export const decodeMap = (
  mapStr: string
): {
  /**
   * 地图Header
   */
  mapHeader: MapHeader;
  /**
   * 地图数据
   */
  mapData: MapData;
} | null => {
  try {
    if (!mapStr) {
      console.error('<ray-robot-protocol> decodeMap: map data is empty');
      return null;
    }

    const mapHeader = decodeMapHeader(mapStr);
    const mapData = decodeMapData(mapStr, mapHeader);

    return {
      mapHeader,
      mapData,
    };
  } catch (err) {
    console.error('<ray-robot-protocol> decodeMap:', err);
    return null;
  }
};

export { decodeMapHeader, decodeMapData, getMapProtocolVersion, decodeMapStructured };
