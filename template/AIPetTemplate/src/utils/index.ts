import {
  authorize,
  showToast,
  router,
  fetchDeviceFileSign,
  fetchDeviceFileUploadState,
  fetchBigPublicFileUploadState,
  getCdnUrl,
} from '@ray-js/ray';
import mitt from 'mitt';
import { throttle } from 'lodash-es';
import dayjs from 'dayjs';
import cdnMap from 'cdn/cdnImage.json';
import Strings from '@/i18n';
import { parseFileName, uploadFile } from './file';

export { normalizeFilePath } from './normalizeFilePath';
export { isInIDE } from './isInIDE';
export { getFileNameAndExtension } from './getFileNameAndExtension';

export const emitter = mitt();

export const JsonUtil = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },
};

// 获取CDN路径
export function getCdnPath(path: string): string {
  return getCdnUrl(path, cdnMap);
}

export const toHexByte = (number: number, bytes = 1) => {
  // Convert the number to a hexadecimal string and pad it with zeros
  return number.toString(16).padStart(bytes * 2, '0');
};

export const authorizeCamera = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scope: 'scope.camera',
      success: () => {
        resolve(true);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

export const authorizeAlbum = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        resolve(true);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

export const errorToast = err => {
  // 部分云端错误信息可供展示
  showToast({
    title: err?.message ?? Strings.getLang('error'),
    icon: 'fail',
  });
};

const throttledRouterPush = throttle(
  (url: string) => {
    router.push(url);
  },
  1000,
  { trailing: false }
);

export const routerPush = (url: string) => {
  throttledRouterPush(url);
};

export const getAvatarByPetType = (type: string) => {
  return {
    cat: getCdnPath('cat.png'),
    dog: getCdnPath('dog.png'),
  }[type];
};

export const formatTimeDifference = (timestamp: number) => {
  const now = dayjs().endOf('day');
  const then = dayjs(timestamp).endOf('day');

  const diffInYears = now.diff(then, 'years');
  then.add(diffInYears, 'years');

  const diffInMonths = now.diff(then, 'months');
  then.add(diffInMonths, 'months');

  const diffInDays = now.diff(then, 'days');

  if (diffInYears >= 1) {
    return diffInMonths === 0
      ? Strings.formatValue('age_format_years', String(diffInYears))
      : Strings.formatValue('age_format_years_months', String(diffInYears), String(diffInMonths));
  }
  if (diffInMonths >= 1) {
    return diffInDays === 0
      ? Strings.formatValue('age_format_months', String(diffInMonths))
      : Strings.formatValue('age_format_months_days', String(diffInMonths), String(diffInDays));
  }
  return Strings.formatValue('age_format_days', String(diffInDays));
};

export const authorizeRecord = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scope: 'scope.record',
      success: () => {
        resolve(true);
      },
      fail: err => {
        reject(err);
      },
    });
  });
};

function pollUntilTargetValue(fetchFunction, pollingToken, interval = 2500) {
  let intervalTimer: NodeJS.Timeout; // 定义 timer，以便能够使用 clearInterval
  return new Promise((resolve, reject) => {
    function poll() {
      fetchFunction(pollingToken)
        .then(data => {
          if (data?.end) {
            clearInterval(intervalTimer); // 停止轮询
            resolve(data); // 返回获取到的数据
          } else {
            console.log(`继续轮询...`);
          }
        })
        .catch(error => {
          console.error('请求失败:', error);
          clearInterval(intervalTimer); // 出现错误时停止轮询
          reject(error); // 将异常传递给 Promise
        });
    }

    // 启动轮询
    intervalTimer = setInterval(poll, interval);
  });
}

export const uploadAudio = async (
  filePath: string,
  bizType: UploadFileBizType,
  contentType?: string
) => {
  const fileName = parseFileName(filePath);
  const signInfo = await fetchDeviceFileSign(bizType, fileName, contentType);
  const { action, token, headers } = signInfo;

  // 上传文件到指定云服务
  await uploadFile(action, filePath, fileName, headers);

  // 获取文件时上传状态
  const uploadFileRes = (await fetchDeviceFileUploadState(token)) as {
    bizUrl?: string;
    pollingToken?: string;
  };

  const { bizUrl, pollingToken } = uploadFileRes;

  if (bizUrl) {
    return { cloudKey: bizUrl };
  }
  const uploadState = await pollUntilTargetValue(fetchBigPublicFileUploadState, pollingToken);
  const { bizUrl: pollingBizUrl } = uploadState;
  return { cloudKey: pollingBizUrl ?? '' };
};
