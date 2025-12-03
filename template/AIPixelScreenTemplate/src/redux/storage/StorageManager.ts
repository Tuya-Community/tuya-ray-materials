import { getDevInfo } from '../../utils/devInfo';
import { globalToast, isInIDE } from '@/utils';
import Strings from '@/i18n';
import md5 from 'md5';

/* eslint-disable @typescript-eslint/no-this-alias */
let fileRoot = '';
try {
  // @ts-ignore
  fileRoot = ty.env.USER_DATA_PATH;
} catch (err) {
  console.error(err);
}

class StorageManager {
  prefixName: string;
  // @ts-ignore
  fileManager: ty.GetFileSystemManagerTask;
  id: string;

  constructor(prefixName?: string) {
    this.prefixName = prefixName || 'storageFolder';
    this.init();
  }

  getPrefixName() {
    if (this.id) {
      return this.prefixName;
    }
    const { devId, groupId } = getDevInfo();
    if (!devId && !groupId) {
      return null;
    }
    this.id = (groupId || devId).slice(-5);
    this.prefixName = `${this.prefixName}${this.id}`;
    return this.prefixName;
  }

  getLocalPath() {
    const thisPrefixName = this.getPrefixName();
    if (!thisPrefixName) {
      return fileRoot;
    }
    const dirPath = `${fileRoot}/${thisPrefixName}`;
    return dirPath;
  }

  async init() {
    if (this.fileManager) {
      return;
    }
    this.fileManager = await ty.getFileSystemManager();
  }

  __access(dirPath) {
    const that = this;
    return new Promise((resolve, reject) => {
      ty.authorize({
        // @ts-ignore
        scope: 'scope.writePhotosAlbum',
        success(res) {
          that.fileManager.access({
            path: dirPath,
            success(res) {
              resolve(true);
            },
            fail(err) {
              that
                .__mkdir(dirPath)
                .then(res => {
                  resolve(true);
                })
                .catch(err => {
                  console.warn('__mkdir err', err);
                  reject(err);
                });
            },
          });
        },
        fail(err) {
          console.error('authorize fail', err);
          if (err.errorCode === 9004 || err.errorCode === 10002) {
            globalToast.fail(Strings.getLang('noPermissionPleaseEnablePermissionsInTheSettings'));
          } else {
            globalToast.fail(
              Strings.getLang('anErrorOccurredPleaseEnsureThatPermissionsAreEnabled')
            );
          }
          reject(err);
        },
      });
    });
  }

  __mkdir(dirPath) {
    return new Promise((resolve, reject) => {
      this.fileManager.mkdir({
        dirPath,
        recursive: true,
        success(res) {
          resolve(res);
        },
        fail(err) {
          console.error('__mkdir fail', err);
          reject(err);
        },
      });
    });
  }

  __readFile(filePath) {
    return new Promise((resolve, reject) => {
      this.fileManager.readFile({
        filePath,
        success(res) {
          resolve(res);
        },
        fail(err) {
          console.log(err, '__readFile fail');
          reject(err);
        },
      });
    });
  }

  async get(name) {
    if (isInIDE) {
      return null;
    }
    await this.init();
    const thisPrefixName = this.getPrefixName();
    const dirPath = `${fileRoot}/${thisPrefixName}`;
    return new Promise((resolve, reject) => {
      if (!thisPrefixName) {
        resolve(null);
        return;
      }
      const filePath = `${fileRoot}/${thisPrefixName}/${name}`;
      this.__access(dirPath)
        .then(res => {
          this.__readFile(filePath)
            .then(res1 => {
              // @ts-ignore
              let data = res1?.data ?? res1;
              try {
                data = JSON.parse(data as string);
              } catch (err) {
                console.error(err);
              }
              resolve(data);
            })
            .catch(err => {
              console.log(err, '__readFile fail');
              resolve(null);
            });
        })
        .catch(err => {
          this.__readFile(filePath)
            .then(res3 => {
              // @ts-ignore
              let data = res3?.data ?? res3;
              try {
                data = JSON.parse(data as string);
              } catch (err) {
                console.error(data);
              }
              resolve(data);
            })
            .catch(err => {
              console.log(err, '__readFile fail');
              resolve(null);
            });
        });
    });
  }

  __writeFile(filePath: string, data: any, encoding?: string) {
    return new Promise((resolve, reject) => {
      const params = {
        filePath,
        data,
      } as any;
      if (encoding) {
        params.encoding = encoding;
      }
      console.log('writeFile params', params);
      this.fileManager.writeFile({
        ...params,
        success(res) {
          resolve(res);
        },
        fail(err) {
          console.log(err, 'writeFile fail');
          reject(err);
        },
      });
    });
  }

  async set(name: string, data: any, encoding?: string) {
    if (isInIDE) {
      return new Promise(resolve => {
        resolve(true);
      });
    }
    if (typeof data !== 'string') {
      try {
        data = JSON.stringify(data);
      } catch (err) {
        console.error(err);
      }
    }
    const thisPrefixName = this.getPrefixName();
    const dirPath = `${fileRoot}/${thisPrefixName}`;
    const filePath = `${fileRoot}/${thisPrefixName}/${name}`;
    return new Promise((resolve, reject) => {
      if (!thisPrefixName) {
        const err = new Error('StorageManager prefixName is null');
        reject(err);
        return;
      }
      this.__access(dirPath)
        .then(res => {
          this.__writeFile(filePath, data, encoding)
            .then(res1 => {
              resolve(filePath);
            })
            .catch(err => {
              console.warn('__writeFile fail', err);
              reject(err);
            });
        })
        .catch(err => {
          console.error('access fail', err);
          reject(err);
        });
    });
  }

  remove(name) {
    if (isInIDE) {
      return new Promise(resolve => {
        resolve(true);
      });
    }
    const thisPrefixName = this.getPrefixName();
    const dirPath = `${fileRoot}/${thisPrefixName}`;
    const filePath = `${fileRoot}/${thisPrefixName}/${name}`;
    return new Promise((resolve, reject) => {
      if (!thisPrefixName) {
        const err = new Error('StorageManager prefixName is null');
        reject(err);
        return;
      }
      this.__access(dirPath)
        .then(res => {
          this.fileManager.removeSavedFile({
            filePath,
            success(res) {
              resolve(res);
            },
            fail(err) {
              console.log(err, 'removeSavedFile fail');
              reject(err);
            },
          });
        })
        .catch(err => {
          console.error(err, 'access fail');
          reject(err);
        });
    });
  }

  md5(path) {
    const file = this.fileManager.readFileSync({
      filePath: path,
      encoding: 'base64',
    });
    return md5(file.data);
  }

  readFileBase64(path) {
    const file = this.fileManager.readFileSync({
      filePath: path,
      encoding: 'base64',
    });
    return file.data;
  }
}

export const getStorageManager = (prefixName?: string) => {
  return new StorageManager(prefixName);
};

export default StorageManager;
