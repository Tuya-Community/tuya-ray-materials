import log4js from '@ray-js/log4js';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDevice } from '@ray-js/panel-sdk';
import { updateMapData } from '@/redux/modules/mapStateSlice';
import { StreamDataNotificationCenter } from '@ray-js/robot-data-stream';
import { setStorageSync } from '@ray-js/ray';
import { AIObject, AiPicInfo, decodeAiPicData } from '@ray-js/robot-protocol';
import base64Imgs from '@/res/base64Imgs';

// 0x00 到 0x07 为默认协议数据，若需要新增，则对应增加枚举值和配套的图片
const materialObjEnum = [
  base64Imgs.aiWire, // 0x00：电线
  base64Imgs.aiShoes, // 0x01：鞋子
  base64Imgs.aiSock, // 0x02：袜子
  base64Imgs.aiToy, // 0x03：玩具
  base64Imgs.aiChair, // 0x04：椅子
  base64Imgs.aiTable, //  0x05：桌子
  base64Imgs.aiAshcan, // 0x06：垃圾桶
  base64Imgs.aiFlowerpot, // 0x07：盆栽
];
/**
 * 接收AI Vision 数据并解析（小程序IDE 不支持调试AI数据，需要使用真机进行调试）
 * @returns
 */
export default function useVisionData() {
  const visionDataCache = useRef('');
  const { devId } = useDevice(device => device.devInfo);
  const aiObjectsCache = useRef<AIObject[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleAIVisionData = (visionStr: string) => {
      if (visionStr !== visionDataCache.current) {
        log4js.info('AI Vision Data', visionDataCache);

        visionDataCache.current = visionStr;

        const visionData: AiPicInfo[] = decodeAiPicData({
          str: visionStr,
        });

        let materialObject: {
          materialMaps: { [key: string]: IMaterialMaterialMaps };
          materials: IMaterialMaterials;
        } = {
          materialMaps: {},
          materials: [],
        };

        const materialMaps = {};

        // 宽高需要保持一致
        const materialObjWidth = 60;
        const materialObjHeight = 60;

        if (visionData) {
          materialObjEnum.forEach((item: string, index: number) => {
            materialMaps[`obj${index}`] = {
              uri: item,
              width: materialObjWidth,
              height: materialObjHeight,
              scale: 0.03,
            };
          });

          const materials = visionData.map((itm: AiPicInfo, index: number) => ({
            id: `materialObjData${index}`,
            type: `obj${itm.object}`,
            x: itm.position.x,
            y: itm.position.y,
            extends: JSON.stringify({
              type: itm.object,
              x: itm.position.x,
              y: itm.position.y,
              xHex: itm.xHex,
              yHex: itm.yHex,
            }),
          }));
          materialObject = {
            materialMaps,
            materials,
          };
        }

        log4js.info('vision materialObject', materialObject);
        dispatch(updateMapData({ originVision: visionStr, materialObject }));

        setStorageSync({
          key: `vision_${devId}`,
          data: visionStr,
        });
      }
    };

    const handleAIVisionDataFromDp = (aiObjects: AIObject[]) => {
      if (aiObjects !== aiObjectsCache.current) {
        log4js.info('AI Vision Data', visionDataCache);

        aiObjectsCache.current = aiObjects;

        let materialObject: {
          materialMaps: { [key: string]: IMaterialMaterialMaps };
          materials: IMaterialMaterials;
        } = {
          materialMaps: {},
          materials: [],
        };

        const materialMaps = {};

        // 宽高需要保持一致
        const materialObjWidth = 76;
        const materialObjHeight = 86;

        if (aiObjects?.length > 0) {
          materialObjEnum.forEach((item: string, index: number) => {
            materialMaps[`obj${index}`] = {
              uri: item,
              width: materialObjWidth,
              height: materialObjHeight,
              scale: 0.04,
            };
          });

          const materials = aiObjects.map(({ point, type }, index: number) => ({
            id: `materialObjData${index}`,
            type: `obj${type}`,
            x: point.x,
            y: point.y,
            extends: JSON.stringify({
              type,
              x: point.x,
              y: point.y,
            }),
          }));
          materialObject = {
            materialMaps,
            materials,
          };
        }

        log4js.info('vision materialObject', materialObject);
        dispatch(updateMapData({ materialObject }));

        setStorageSync({
          key: `vision_${devId}`,
          data: JSON.stringify(aiObjects),
        });
      }
    };

    StreamDataNotificationCenter.on('receiveAIPicData', handleAIVisionData);
    StreamDataNotificationCenter.on('receiveAIPicDataFromDp', handleAIVisionDataFromDp);

    return () => {
      StreamDataNotificationCenter.off('receiveAIPicData');
      StreamDataNotificationCenter.off('receiveAIPicDataFromDp');
    };
  }, []);
  return {};
}
