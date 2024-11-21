import { utils } from '@ray-js/panel-sdk';
import { apiRequestByAtop } from '@ray-js/ray';

const errStyle = 'background: red; color: #fff;';

export const api = (a, postData, v = '1.0') => {
  return new Promise((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'string' ? utils.parseJSON(d) : d;
        resolve(data);
      },
      fail: err => {
        const e = typeof err === 'string' ? utils.parseJSON(err) : err;
        console.log(`API Failed: %c${a}%o`, errStyle, e.message || e.errorMsg || e);
        reject();
      },
    });
  });
};
