import { isNotNullOrUndefined, isNullOrUndefined } from './kit';

export const getDataId = (dataId: any) => (isNullOrUndefined(dataId) ? -1 : dataId);
export const isDataId = (dataId: any) =>
  isNotNullOrUndefined(dataId) && /^\d+$/.test(dataId) && dataId >= 0;
