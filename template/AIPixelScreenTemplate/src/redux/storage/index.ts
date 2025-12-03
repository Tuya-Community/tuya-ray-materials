import { getStorageManager } from './StorageManager';
import { isInIDE } from '../../utils/index';
import { PHOTOS } from '../../utils/constants';

const storage = getStorageManager();

type SetStorageType = {
  key: string;
  data: any;
  encoding?: string;
};

const globalStorage = {
  get: async (key: string) => {
    // TODO: remove it
    if (isInIDE && key === 'photos') {
      return Promise.resolve(PHOTOS);
    }
    const res = await storage.get(key);
    return res;
  },
  set: async (params: SetStorageType): Promise<string> => {
    const { key, data, encoding } = params;
    const res = await storage.set(key, data, encoding);
    return res as string;
  },
  remove: (key: string) => storage.remove(key),
  md5: (path: string) => storage.md5(path),
  readFileBase64: (path: string) => storage.readFileBase64(path),
  getLocalPath: () => storage.getLocalPath(),
};

export default globalStorage;
