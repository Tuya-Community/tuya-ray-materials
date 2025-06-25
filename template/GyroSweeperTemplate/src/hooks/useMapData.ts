import { useCallback, useEffect, useRef } from 'react';
import { useProps } from '@ray-js/panel-sdk';
import { getMapConfigFromDp } from '@ray-js/gyro-map-sdk';
import { getDevInfo, usePageEvent } from 'ray';
import { useInterval } from 'ahooks';
import { fetchCleanRecordDetailApi } from '@/api/request';
import { useQuery, useQueryClient } from '@ray-js/query';

// 通用的分页数据获取函数
const fetchAllPaginatedData = async (fetchFunction, ...params) => {
  const allDataList = [];

  const fetchRecursively = async startRow => {
    const response = await fetchFunction(...params, startRow);

    if (response.dataList && response.dataList.length > 0) {
      allDataList.push(...response.dataList);
    }

    if (response.hasNext) {
      await fetchRecursively(response.startRow);
    }

    return {
      completeMapData: allDataList.join(''),
      subRecordId: response.subRecordId,
    };
  };

  return fetchRecursively(undefined);
};

export const useMapData = subRecordId => {
  const dpMapConfig = useProps(props => props.map_config);
  const queryClient = useQueryClient();
  const mapIdRef = useRef<string>('');

  // 地图配置引用
  const mapConfigRef = useRef({
    mapMatrix: 199,
    isTopLeft: true,
  });

  // 保留原有的 MQTT 轮询逻辑
  useInterval(
    () => {
      ty.device.sendMqttMessage({
        protocol: 64,
        message: {
          reqType: 'StreamTransParamSet',
          version: '1.0.0',
          interval: 3000, // 时间间隔
        },
        deviceId: getDevInfo().devId,
        options: {},
      });
    },
    subRecordId ? null : 2000 // 传入null禁用定时器
  );

  // 更新地图配置
  useEffect(() => {
    if (dpMapConfig) {
      mapConfigRef.current = getMapConfigFromDp(dpMapConfig);
    }
  }, [dpMapConfig]);

  // MQTT 消息处理函数
  const handleMessage = useCallback(
    response => {
      const { topic, messageData } = response;
      if (topic === `m/m/i/${getDevInfo().devId}`) {
        let { data } = messageData;

        queryClient.setQueryData(['mapData', subRecordId || 'realtime'], old => {
          const previousData = old as { mapData: string } | undefined;

          if (!previousData) return { mapData: '' };
          let currentMapData = previousData.mapData;

          while (data.length > 0) {
            const header = data.slice(0, 26);
            const dataLength = parseInt(header.slice(22, 26), 16) * 2;
            const mapId = parseInt(header.slice(0, 4), 16);
            const mapDataChunk = data.slice(26, 26 + dataLength);
            data = data.slice(26 + dataLength);

            if (mapIdRef.current !== String(mapId)) {
              currentMapData = mapDataChunk;
            } else {
              currentMapData += mapDataChunk;
            }

            mapIdRef.current = String(mapId);
          }

          return { mapData: currentMapData };
        });
      }
    },
    [queryClient, subRecordId]
  );

  // 统一的地图数据获取函数
  const fetchMapData = useCallback(async () => {
    // 使用你原本的 fetchMapDataWithPagination 逻辑
    try {
      if (subRecordId) {
        // 使用历史记录API获取特定清扫记录的地图数据
        const { completeMapData, subRecordId: respSubRecordId } = await fetchAllPaginatedData(
          fetchCleanRecordDetailApi,
          subRecordId
        );

        const mapId =
          respSubRecordId.length === 15 ? parseInt(respSubRecordId.slice(-5), 10) : respSubRecordId;

        mapIdRef.current = String(mapId);
        return { mapData: completeMapData };
      }
      // 使用实时地图API
      const { devId } = getDevInfo();
      const { completeMapData, subRecordId: respSubRecordId } = await fetchAllPaginatedData(
        async (_, startRow) =>
          ty.getGyroLatestCleanMap?.({
            devId,
            start: startRow,
            size: 500,
          }),
        null
      );

      const mapId =
        respSubRecordId.length === 15 ? parseInt(respSubRecordId.slice(-5), 10) : respSubRecordId;

      mapIdRef.current = String(mapId);

      // 如果是实时地图，获取成功后注册MQTT监听
      if (!subRecordId) {
        ty.device.onMqttMessageReceived(handleMessage);
      }

      return { mapData: completeMapData };
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      throw error;
    }
  }, [subRecordId, handleMessage]);

  // 使用 React Query 获取地图数据
  const { data } = useQuery({
    queryKey: ['mapData', subRecordId || 'realtime'],
    queryFn: fetchMapData,
    staleTime: subRecordId ? Infinity : 0, // 历史数据永不过期，实时数据立即过期
    gcTime: subRecordId ? 1000 * 60 * 30 : 0, // 历史数据缓存30分钟，实时数据不缓存
    refetchInterval: !subRecordId ? 3000 : false, // 只在实时模式下定期刷新
  });

  // 注册MQTT监听的逻辑
  useEffect(() => {
    // 如果是实时数据（没有subRecordId），才注册MQTT监听
    if (!subRecordId) {
      ty.device.registerTopicListListener({
        topicList: [`m/m/i/${getDevInfo().devId}`],
        success: () => {
          console.log('registerTopicListListener success');
        },
        fail: error => {
          console.log('registerTopicListListener fail', error);
        },
      });
    }

    return () => {
      // 清理MQTT监听，仅在没有subRecordId时需要
      if (!subRecordId) {
        ty.device.offMqttMessageReceived(handleMessage);
        ty.device.unregisterTopicListListener();
      }
    };
  }, [subRecordId, handleMessage]);

  // 保留你原有的 usePageEvent 逻辑
  usePageEvent('onUnload', () => {
    // 仅在没有subRecordId时需要清理MQTT监听
    if (!subRecordId) {
      ty.device.offMqttMessageReceived(handleMessage);
      ty.device.unregisterTopicListListener();
    }
  });

  return {
    mapData: data?.mapData || '',
    mapConfig: mapConfigRef.current,
  };
};
