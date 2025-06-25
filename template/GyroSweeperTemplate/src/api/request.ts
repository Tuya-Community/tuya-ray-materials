/* eslint-disable no-param-reassign */
import { CLEAN_RECORDS_PAGE_SIZE } from '@/constant';
import { JsonUtil } from '@/utils';
import { apiRequestByAtop, getDevInfo } from '@ray-js/ray';

export const api = <T>(url, postData, v = '1.0') => {
  return new Promise<T>((resolve, reject) => {
    const params = {
      api: url,
      postData: postData,
      version: v,
    };

    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'string' ? JsonUtil.parseJSON(d) : d;

        console.log(
          `%c API调用成功: ${url}`,
          'color: white; background-color: green; padding: 2px;',
          params,
          data
        );

        resolve(data);
      },
      fail: err => {
        const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;

        console.log(
          `%c API调用失败: ${url}`,
          'color: white; background-color: red; padding: 2px;',
          params,
          e
        );
        reject(e?.innerError?.errorMsg);
      },
    });
  });
};

export const useRequest = (url: string, params: any = {}) => {
  return api(url, params);
};

export const fetchCleanRecordsApi = (offset: number) => {
  const { devId, codeIds } = getDevInfo();

  return (
    ty.getGyroCleanRecords?.({
      devId,
      dpIds: [Number(codeIds.clean_record)],
      offset,
      limit: CLEAN_RECORDS_PAGE_SIZE,
      userId: '0',
    }) ?? Promise.reject(new Error('getGyroCleanRecords is not supported'))
  );
};

export const fetchCleanRecordDetailApi = (subRecordId: number, startRow: number) => {
  const { devId } = getDevInfo();

  return (
    ty.getGyroCleanRecordDetail?.({
      devId,
      subRecordId,
      start: startRow,
      size: 500,
    }) ?? Promise.reject(new Error('getGyroCleanRecordDetail is not supported'))
  );
};

export const deleteCleanRecordsApi = (recordIds: string[]) => {
  const { devId } = getDevInfo();

  return (
    ty.deleteGyroCleanRecord?.({
      uuid: recordIds.join(','),
      devId,
    }) ?? Promise.reject(new Error('deleteGyroCleanRecord is not supported'))
  );
};
