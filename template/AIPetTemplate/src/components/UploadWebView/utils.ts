import store from '@/redux';

/**
 * 默认组件ID
 */
export const UPLOAD_COMPONENT_ID = 'upload-component-id';

/**
 * 获取组件实例
 * @param componentId
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUploadInstance = (componentId: number | string = UPLOAD_COMPONENT_ID) => {
  const uploadState = store.getState().uploadFile;
  return uploadState[componentId];
};

/**
 * 判断是否ready
 * @returns
 */
export const getUploadIsReady = (
  componentId: number | string = UPLOAD_COMPONENT_ID,
  timeout = 20000
) => {
  let remain = timeout;
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (remain <= 0) {
        reject(new Error('Get upload instance timeout'));
        clearInterval(interval);
      }
      remain -= 4;

      const uploadInstance = getUploadInstance(componentId);
      if (uploadInstance) {
        console.log('getUploadIsReady ===>', true);
        clearInterval(interval);
        resolve(uploadInstance);
      }
    }, 4);
  });
};
