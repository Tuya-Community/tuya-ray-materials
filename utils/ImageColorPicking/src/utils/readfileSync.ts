/*
 * @Author: mjh
 * @Date: 2025-01-02 11:30:38
 * @LastEditors: mjh
 * @LastEditTime: 2025-01-02 14:35:28
 * @Description:
 */
import { getFileSystemManager } from '@ray-js/ray';
const managerRef = {
  value: null,
};
export const readImgSync = (path: string): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (!managerRef.value) {
      managerRef.value = getFileSystemManager();
    }
    managerRef.value.readFile({
      filePath: path,
      encoding: 'base64',
      success: res => {
        const base64 = `data:image/${path.split('.').slice(-1)[0]};base64,${res.data}`;
        resolve(base64);
      },
      fail: error => {
        console.log(error);
        reject(error);
      },
    });
  });
};
