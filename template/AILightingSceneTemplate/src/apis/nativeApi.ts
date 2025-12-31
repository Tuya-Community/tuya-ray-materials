type AnyFn = (...args: any) => any;

const nativeFnWrap = <T extends AnyFn>(nativeApi: T, name: string) => {
  const n = name || nativeApi?.name;
  return args => {
    return new Promise<any>((resolve, reject) => {
      console.log(`🚀 ~ ttt: ${n} run ~ args`, args);
      if (typeof nativeApi !== 'function') {
        console.log(`🚀 ~ ttt: ${n} ~ not exist:`);
        setTimeout(() => {
          reject(`${n} not exist`);
        }, 100);
        return;
      }
      nativeApi({
        ...args,
        success: (data: GetTTTSuccessData<T>) => {
          console.log(`🚀 ~ ttt: ${n} ~ success:`, data);
          resolve(data);
        },
        fail: err => {
          console.log(`🚀 ~ ttt: ${n} ~ fail:`, err);
          reject(err);
        },
      });
    });
  };
};

/**
 * AI生成灯光场景
 */
export const predictLightScenes = nativeFnWrap(
  ty.ai.predictLightScenes,
  'ty.ai.predictLightScenes'
);

export const getRoomList = nativeFnWrap(ty.home.getRoomList, 'ty.home.getRoomList');
