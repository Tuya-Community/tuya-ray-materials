import { utils } from '@ray-js/panel-sdk';
import { apiRequestByAtop } from '@ray-js/ray';

const errStyle = 'background: red; color: #fff;';

export const api = <T>(a: string, postData: Record<string, any>, v = '1.0') => {
  return new Promise<T>((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    apiRequestByAtop({
      ...params,
      success: (d) => {
        const data = typeof d === 'string' ? utils.parseJSON(d) : d;
        resolve(data as T);
      },
      fail: (err) => {
        const e = typeof err === 'string' ? (utils.parseJSON(err) as typeof err) : err;
        console.log(`API Failed: %c${a}%o`, errStyle, e.errorMsg || e);
        reject();
      },
    });
  });
};

interface ProductAbility {
  abilityCode: string;
  isOpen: boolean;
  extConfig: string;
  ext?: any;
}

export const getAbility = (devId: string, code: string) => {
  return api<ProductAbility>('m.life.app.device.product.ability', {
    deviceId: devId,
    abilityCode: code,
  });
};
