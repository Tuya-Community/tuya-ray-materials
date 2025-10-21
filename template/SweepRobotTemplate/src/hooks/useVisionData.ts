import log4js from '@ray-js/log4js';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDevice } from '@ray-js/panel-sdk';
import { updateMapState } from '@/redux/modules/mapStateSlice';
import { StreamDataNotificationCenter } from '@ray-js/robot-data-stream';
import { setStorageSync } from '@ray-js/ray';
import { AIObject, AiPicInfo, decodeAiPicData } from '@ray-js/robot-protocol';
import base64Imgs from '@/res/base64Imgs';
import { DetectedObjectParam } from '@ray-js/robot-map';

const OBJECT_IMAGES = [
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

        const visionData: AiPicInfo[] =
          decodeAiPicData({
            str: visionStr,
          }) ?? [];

        const detectedObjects: DetectedObjectParam[] = visionData.map((item: AiPicInfo) => ({
          id: `detectedObject${item.object}`,
          type: `obj${item.object}`,
          height: 60,
          width: 60,
          x: item.position.x,
          y: item.position.y,
          src: OBJECT_IMAGES[item.object],
          customData: {
            xHex: item.xHex,
            yHex: item.yHex,
          },
        }));

        log4js.info('vision detectedObjects', detectedObjects);
        dispatch(updateMapState({ detectedObjects }));

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

        const detectedObjects: DetectedObjectParam[] = aiObjects.map(
          ({ point, type }, index: number) => ({
            id: `materialObjData${index}`,
            type: `obj${type}`,
            height: 86,
            width: 76,
            src: OBJECT_IMAGES[type],
            x: point.x,
            y: point.y,
            customData: {
              xHex: point.x.toString(16).padStart(4, '0'),
              yHex: point.y.toString(16).padStart(4, '0'),
            },
          })
        );

        log4js.info('vision detectedObjects', detectedObjects);
        dispatch(updateMapState({ detectedObjects }));

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
