import { JsonUtil } from '@/utils';
import { apiRequestByAtop } from '@ray-js/ray';
import Strings from '@/i18n';

const apiStyle = 'background: #778899; color: #fff;';
const errStyle = 'background: red; color: #fff;';
const successStyle = 'background: green; color: #fff;';

const systemInfo = ty.getSystemInfoSync();

export const api = (a, postData, v = '1.0') => {
  return new Promise((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    console.log(`API params: %c${a}`, apiStyle, params);
    apiRequestByAtop({
      ...params,
      // IDE里指定clientId
      extData:
        systemInfo?.brand === 'devtools'
          ? {
            // bizData: '{"clientId":
            // "ysuayhmg4jfxgykkj3nw"}',
          }
          : {},
      success: d => {
        const data = typeof d === 'string' ? JsonUtil.parseJSON(d) : d;
        console.log(`API Success: %c${a}`, successStyle, data);
        // console.log('API Res', data);
        resolve(data);
      },
      fail: err => {
        console.log('err', err);
        const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;
        let errText = e.message || e.errorMsg || e;
        console.log(`API Failed: %c${a}`, errStyle, errText);
        // 兼容错误码方式翻译
        if (e?.errorCode && Strings[e?.errorCode]) {
          errText = Strings.getLang(e?.errorCode);
        }
        // 暂时隐藏atop request error错误弹窗
        if (errText !== 'atop request error') {
          ty.showToast({ title: errText, icon: 'error' });
        }
        reject();
      },
    });
  });
};
