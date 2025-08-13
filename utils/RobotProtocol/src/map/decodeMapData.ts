import {
  ROOM_NAME_LENGTH,
  ROOM_PROPERTY_LENGTH,
  ROOM_VERTICES_NUM_LENGTH,
  BITMAP_TYPE_HEX_MAP,
  MAP_VERSION_MAP,
} from '@/constant/map';
import { MapData, MapHeader, RoomDecoded } from '@/typings';
import { combineTwoBinaryToHex, hexStringToNumber, hexToUriDecodedString } from '@/utils';
import { lz4Uncompress } from '@/utils/lz4';

/**
 * 解析房间数据
 * @param mapRoomStr 地图房间字符串
 * @param version 地图协议版本
 * @returns 房间数据
 */
export const decodeMapRooms = (mapRoomStr: string, version = 1): RoomDecoded[] => {
  if (!mapRoomStr) {
    return [];
  }

  const roomsTotal = parseInt(mapRoomStr.slice(2, 4), 16);
  const roomsStr = mapRoomStr.slice(4);

  const rooms: RoomDecoded[] = [];
  let pos = 0;

  for (let i = 0; i < roomsTotal; i++) {
    const roomInfoStr = roomsStr.slice(
      pos,
      pos + (ROOM_PROPERTY_LENGTH + ROOM_NAME_LENGTH + ROOM_VERTICES_NUM_LENGTH) * 2
    );

    const roomId = parseInt(roomInfoStr.slice(0, 4), 16);
    const order = parseInt(roomInfoStr.slice(4, 8), 16);
    const sweepTimes = parseInt(roomInfoStr.slice(8, 12), 16);
    const mopTimes = parseInt(roomInfoStr.slice(12, 16), 16);
    const colorOrder = parseInt(roomInfoStr.slice(16, 18), 16);
    const sweepForbidden = parseInt(roomInfoStr.slice(18, 20), 16) === 1;
    const mopForbidden = parseInt(roomInfoStr.slice(20, 22), 16) === 1;
    const suction = parseInt(roomInfoStr.slice(22, 24), 16);
    const cistern = parseInt(roomInfoStr.slice(24, 26), 16);
    const yMop = parseInt(roomInfoStr.slice(26, 28), 16) === 1;
    const floorMaterial = parseInt(roomInfoStr.slice(28, 30), 16);

    const roomNameLength = parseInt(
      roomInfoStr.slice(ROOM_PROPERTY_LENGTH * 2, ROOM_PROPERTY_LENGTH * 2 + 2),
      16
    );
    const roomNameStr = roomInfoStr.slice(
      ROOM_PROPERTY_LENGTH * 2 + 2,
      ROOM_PROPERTY_LENGTH * 2 + 2 + roomNameLength * 2
    );

    const name = roomNameLength > 0 ? hexToUriDecodedString(roomNameStr) : '';

    const verticesNum = parseInt(
      roomInfoStr.slice(
        (ROOM_PROPERTY_LENGTH + ROOM_NAME_LENGTH) * 2,
        (ROOM_PROPERTY_LENGTH + ROOM_NAME_LENGTH) * 2 + 2
      ),
      16
    );

    /**
     * TODO
     * 还有顶点数据的解析 业务暂时没用到
     */

    pos +=
      (ROOM_PROPERTY_LENGTH + ROOM_NAME_LENGTH + ROOM_VERTICES_NUM_LENGTH + verticesNum * 4) * 2;

    // 放在这里，还是业务代码里？
    const pointHex = combineTwoBinaryToHex(
      roomId.toString(2),
      MAP_VERSION_MAP[version].typeMap.sweep
    );

    rooms.push({
      roomId,
      pointHex,
      name,
      order,
      suction,
      cistern,
      colorOrder,
      sweepTimes,
      mopTimes,
      sweepForbidden,
      mopForbidden,
      yMop,
      floorMaterial,
      originStr: roomInfoStr,
      reservedStr: roomInfoStr.slice(30, 52),
    });
  }
  return rooms;
};

/**
 * 解析地图数据 version: 0x00,0x01,0x02
 * @param mapStr 原始地图字符串
 * @param mapHeader 地图Header数据
 * @returns 地图点集及房间相关数据
 */
export const decodeMapData = (mapStr: string, mapHeader: MapHeader): MapData => {
  const {
    mapWidth,
    mapHeight,
    dataLengthAfterCompress,
    dataLengthBeforeCompress,
    mapHeaderStr,
    version,
  } = mapHeader;
  const MAP_HEADER_LENGTH = mapHeaderStr.length;

  let mapPointsStr = '';
  let mapRoomStr = '';
  const pointsTotal = mapWidth * mapHeight;

  if (dataLengthAfterCompress > 0) {
    const maxBufferLength = dataLengthBeforeCompress * 4;

    const dataArrayCompressed = hexStringToNumber(
      mapStr.slice(MAP_HEADER_LENGTH, MAP_HEADER_LENGTH + dataLengthBeforeCompress * 2)
    );
    const uncompressed = lz4Uncompress(dataArrayCompressed, maxBufferLength);

    if (!uncompressed) {
      // TODO 解压缩失败回调
      return {
        mapRooms: [],
        mapPointsStr: '',
      };
    }

    const dataArrayUncompressed = Array.from(uncompressed);

    if (version === 0) {
      const result = [];

      for (let index = 0; index < dataArrayUncompressed.length; index++) {
        const byte = dataArrayUncompressed[index].toString(2).padStart(8, '0');
        for (let i = 0; i < byte.length; i += 2) {
          const twoBits = byte.substring(i, i + 2);

          result.push(BITMAP_TYPE_HEX_MAP[twoBits]);
        }
      }

      mapPointsStr = result.join('').slice(0, mapWidth * mapHeight * 2);

      mapRoomStr = '';
    } else {
      const mapPointsArray = dataArrayUncompressed.slice(0, pointsTotal);
      mapPointsStr = mapPointsArray.map(d => d.toString(16).padStart(2, '0')).join('');

      const mapRoomArray = dataArrayUncompressed.slice(pointsTotal);
      mapRoomStr = mapRoomArray.map(d => d.toString(16).padStart(2, '0')).join('');
    }
  } else if (version === 0) {
    const pointStrBeforeExpand = mapStr.slice(MAP_HEADER_LENGTH);

    const result = [];

    const pointStrBeforeExpandArray = pointStrBeforeExpand.match(/.{2}/g) || [];

    for (let i = 0; i < pointStrBeforeExpandArray.length; i++) {
      const byte = parseInt(pointStrBeforeExpand[i], 16).toString(2).padStart(8, '0');
      for (let i = 0; i < byte.length; i += 2) {
        const twoBits = byte.substring(i, i + 2);
        result.push(BITMAP_TYPE_HEX_MAP[twoBits]);
      }
    }

    mapPointsStr = result.join('');
    mapRoomStr = '';
  } else {
    mapPointsStr = mapStr.slice(MAP_HEADER_LENGTH, MAP_HEADER_LENGTH + pointsTotal * 2);
    mapRoomStr = mapStr.slice(MAP_HEADER_LENGTH + pointsTotal * 2);
  }

  mapPointsStr = mapPointsStr.toLowerCase();
  if (mapWidth * mapHeight * 2 > mapPointsStr.length) {
    mapPointsStr = mapPointsStr.padStart(mapWidth * mapHeight, 'ff');
  }
  if (mapWidth * mapHeight * 2 < mapPointsStr.length) {
    mapPointsStr = mapPointsStr.slice(mapPointsStr.length - mapWidth * mapHeight * 2);
  }

  const mapRooms = decodeMapRooms(mapRoomStr, version);

  return {
    mapRooms,
    mapPointsStr,
  };
};
