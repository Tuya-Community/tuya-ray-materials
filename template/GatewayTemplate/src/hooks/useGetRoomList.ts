import { useRequest } from 'ahooks';
import { RoomItem, GetUseRequestResult, GetUseRequestOptions } from '@/types';
import { getRoomList } from '@/api';

type Result = GetUseRequestResult<RoomItem[], any[]>;

type UseGetRoomListResult = {
  roomList: Result['data'];
} & Result;

/** 获取家庭下房间列表的hooks */
const useGetRoomList = (
  homeId: string,
  options?: GetUseRequestOptions<RoomItem[], any[]>
): UseGetRoomListResult => {
  const fetchData = () => {
    if (!homeId) return Promise.resolve([] as RoomItem[]);
    return getRoomList(homeId);
  };

  const { data, ...rest } = useRequest<RoomItem[], any[]>(fetchData, {
    refreshDeps: [homeId],
    ...options,
  });

  return { roomList: data, data, ...rest };
};

export default useGetRoomList;
