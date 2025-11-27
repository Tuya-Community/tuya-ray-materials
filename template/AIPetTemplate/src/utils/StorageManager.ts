import { getDevInfo } from './devInfo';
import { isInIDE } from './isInIDE';
import { env } from 'ray';
import { getFileSystemManager, authorize, showToast } from '@ray-js/ray';
import { GetFileSystemManagerTask } from '@/types';

/* eslint-disable @typescript-eslint/no-this-alias */
let fileRoot = '';
try {
  fileRoot = env.USER_DATA_PATH;
} catch (err) {
  console.error(err);
}

class StorageManager {
  prefixName: string;
  fileManager: GetFileSystemManagerTask;
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

  async init() {
    if (this.fileManager) {
      return;
    }
    this.fileManager = await getFileSystemManager();
  }

  __access(dirPath) {
    const that = this;
    return new Promise((resolve, reject) => {
      authorize({
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
          console.warn('authorize fail', err);
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
          this.__mkdir(dirPath)
            .then(res2 => {
              this.__readFile(filePath)
                .then(res3 => {
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
            })
            .catch(err => {
              console.log(err, '__mkdir fail');
              resolve(null);
            });
        });
    });
  }

  __writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
      this.fileManager.writeFile({
        filePath,
        data,
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

  async set(name: string, data: any) {
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
        return;
      }
      this.__access(dirPath)
        .then(res => {
          this.__writeFile(filePath, data)
            .then(res1 => {
              resolve(res1);
            })
            .catch(err => {
              console.warn('__writeFile fail', err);
              reject(err);
            });
        })
        .catch(err => {
          this.__mkdir(fileRoot)
            .then(res => {
              this.__writeFile(filePath, data)
                .then(res2 => {
                  resolve(res2);
                })
                .catch(err => {
                  console.warn(err, '__writeFile fail');
                  reject(err);
                });
            })
            .catch(err => {
              console.warn(err, '__mkdir fail');
              showToast({
                title: err?.errMsg || err?.message || err?.msg || 'save file fail',
                icon: 'error',
              });
            });
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
          console.log(err, 'access fail');
          showToast({
            title: err?.errMsg || err?.message || err?.msg || 'remove file fail',
            icon: 'error',
          });
        });
    });
  }
}

export const getStorageManager = (prefixName?: string) => {
  return new StorageManager(prefixName);
};

export default StorageManager;
