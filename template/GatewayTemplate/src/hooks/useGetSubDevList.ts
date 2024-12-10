import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import {
  getSubDeviceList,
  registerGateWaySubDeviceListener,
  unregisterGateWaySubDeviceListener,
} from '@/api';
import { GetUseRequestResult, GetUseRequestOptions, DevInfo } from '@/types';

type Result = GetUseRequestResult<DevInfo[], [string]>;

type UseGetSubDevListResult = {
  subDevList: Result['data'];
} & Result;

const THROTTLE_TIME = 300; // 300ms

/** 获取网关子设备列表的hooks */
const useGetSubDevList = (
  devId: string,
  options?: GetUseRequestOptions<DevInfo[], [string]>
): UseGetSubDevListResult => {
  const { data, refresh, ...rest } = useRequest<DevInfo[], [string]>(
    () => getSubDeviceList(devId),
    {
      refreshDeps: [devId],
      throttleWait: THROTTLE_TIME,
      throttleTrailing: true,
      ...options,
    }
  );

  useEffect(() => {
    registerGateWaySubDeviceListener(devId, refresh);
    return () => {
      unregisterGateWaySubDeviceListener(devId, refresh);
    };
  }, []);

  return { subDevList: data, data, refresh, ...rest };
};

export default useGetSubDevList;
