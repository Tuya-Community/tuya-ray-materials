import { SmartDeviceSchema } from '@/typings/sdm';
import {
  SmartDeviceModel,
  SmartGroupModel,
  SmartStorageAbility,
  SmartSupportAbility,
} from '@ray-js/panel-sdk';
import { createDpKit } from '@ray-js/panel-sdk/lib/sdm/interceptors/dp-kit';
import { getLaunchOptionsSync } from '@ray-js/ray';
import { protocols } from '@/devices/protocols';
import { getStorageManager } from '@/utils/StorageManager';
import { isInIDE } from '@/utils';
import { PHOTOS } from '@/constant/mock';
import { ReduxState } from '@/redux';
import { clearVideoThumbnailsAsync } from '@/api/nativeApi';

const isGroupDevice = !!getLaunchOptionsSync()?.query?.groupId;

export const dpKit = createDpKit<SmartDeviceSchema>({ protocols });
type Abilities = { storage: SmartStorageAbility };

const options = {
  interceptors: dpKit.interceptors,
  abilities: [new SmartSupportAbility()],
};

/**
 * SmartDevices 定义来自于 typings/sdm.d.ts，非 TypeScript 开发者可忽略
 * The SmartDevices definition comes from typings/sdm.d.ts and can be ignored by non-TypeScript developers
 */
export const devices = {
  /**
   * 此处建议以智能设备的名称作为键名赋值
   * It is recommended to assign the name of the smart device as the key name.
   */
  // common: new SmartDeviceModel<SmartDeviceSchema>(options),
  common: isGroupDevice
    ? new SmartGroupModel<SmartDeviceSchema>()
    : new SmartDeviceModel<SmartDeviceSchema>(options),
  photoFrame: new SmartDeviceModel<SmartDeviceSchema, Abilities>(options),
};

const storage = getStorageManager();

export const videoThumbnailsStorage = {
  getAll: async () => {
    return storage.get('videoThumbnails').then(res => {
      return (res || {}) as VideoThumbnailsData;
    });
  },
  get: async (videoPath: string, timePath: string) => {
    return storage.get('videoThumbnails').then(res => {
      const allData = res;
      console.log('🚀 ~ videoThumbnailsStorage all Cache:', allData);
      return (allData?.[videoPath]?.[timePath] ?? []) as string[];
    });
  },
  save: async (videoPath: string, timePath: string, thumbnails: string[]) => {
    const curVideoThumbnailsMap = await videoThumbnailsStorage.getAll();
    const newVideoThumbnailsMap = { ...curVideoThumbnailsMap };
    const keys = Object.keys(newVideoThumbnailsMap);
    const cacheLength = JSON.stringify(newVideoThumbnailsMap).length;
    console.log('🚀 ~ videoThumbnailsStorage: ~ cacheLength:', cacheLength);
    if (
      keys.length > MAX_CACHE_VIDEO ||
      cacheLength > MAX_STR_LENGTH / 10 // 这里是为了避免超出存储限制，特意 / 10
    ) {
      const randomVidePath = keys[Math.floor(Math.random() * keys.length)];
      console.log('🚀 ~ videoThumbnailsStorage delete ~ randomVidePath:', randomVidePath);
      delete newVideoThumbnailsMap[randomVidePath];
      // 异步删除缩略图
      clearVideoThumbnailsAsync({ videoName: randomVidePath })
        .then(res => {
          console.log(`clearVideoThumbnailsAsync res ${randomVidePath}`, res);
        })
        .catch(err => {
          console.log(`clearVideoThumbnailsAsync err ${randomVidePath}`, err);
        });
    }
    if (!newVideoThumbnailsMap[videoPath]) {
      newVideoThumbnailsMap[videoPath] = {};
    }
    newVideoThumbnailsMap[videoPath][timePath] = thumbnails;
    return storage.set('videoThumbnails', newVideoThumbnailsMap);
  },
  remove: () => storage.remove('videoThumbnails'),
};

export const photosStorage = {
  get: async () => {
    // TODO: remove it
    if (isInIDE) {
      return Promise.resolve(PHOTOS);
    }
    return storage.get('photos').then(res => res || []);
  },
  save: (photos: ReduxState['album']['photos']) => {
    storage.set('photos', photos);
  },
  remove: () => storage.remove('photos'),
};

type VideoPath = string;
type VideTimePath = string;

type VideoThumbnailsData = Record<VideoPath, Record<VideTimePath, string[]>>;

const MAX_CACHE_VIDEO = 5; // 最大可缓存的视频缩略图数量
const MAX_STR_LENGTH = (1024 * 1024) / 2; // js 一个字符（通常使用 unicode 编码）等于 2 字节，所以 1M 大小的数据，大约为 524288 个字符
