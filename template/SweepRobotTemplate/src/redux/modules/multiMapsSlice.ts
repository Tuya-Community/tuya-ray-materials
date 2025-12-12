import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import Strings from '@/i18n';
import store, { ReduxState } from '..';
import { getMultipleMapFiles, getStorageSync, setStorage } from '@ray-js/ray';
import { decodeAreas, fetchMapFile } from '@/utils';
import ossApiInstance from '@/api/ossApi';
import { decodeMapHeader, getFeatureProtocolVersion } from '@ray-js/robot-protocol';
import { base64ToRaw } from '@ray-js/panel-sdk/lib/utils';
import { createAsyncQueue } from '@/utils/createAsyncQueue';
import { devices } from '@/devices';
import { decodeRoomProperties, SpotParam, VirtualWallParam, ZoneParam } from '@ray-js/robot-map';

const taskQueue = createAsyncQueue(
  async (params: { filePathKey: string; bucket: string; file: string; realTimeMapId: string }) => {
    try {
      const { filePathKey, bucket, file, realTimeMapId } = params;

      const data = await getMapInfoFromCloudFile({
        bucket,
        file,
      });

      const {
        virtualState: { virtualWalls, forbiddenMopZones, forbiddenSweepZones },
      } = data;

      const homeMapApi = store.getState().mapApis.home;

      if (homeMapApi) {
        // 生成快照图片
        const snapshotImage = await homeMapApi.snapshotByData({
          map: data.originMap,
          roomProperties: decodeRoomProperties(data.originMap),
          virtualWalls,
          forbiddenMopZones,
          forbiddenSweepZones,
        });

        // 将快照存储到 Redux store
        store.dispatch(
          upsertSnapshotImage({
            key: filePathKey,
            snapshotImage: {
              image: snapshotImage,
              mapWidth: decodeMapHeader(data.originMap)?.mapWidth ?? 0,
              mapHeight: decodeMapHeader(data.originMap)?.mapHeight ?? 0,
            },
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  },
  () => {
    const { snapshotImageMap } = store.getState().multiMaps;

    setStorage({
      key: `snapshotImageMap_${devices.common.getDevInfo().devId}`,
      data: JSON.stringify(snapshotImageMap),
    });
  }
);

const getAreasFromMixedCommand = (command: string) => {
  const protocolVersion = getFeatureProtocolVersion(command);
  const wallLength =
    protocolVersion === '1'
      ? parseInt(command.slice(4, 12), 16) * 2 + 14
      : parseInt(command.slice(4, 6), 16) * 2 + 8;
  const wallCommand = command.slice(0, wallLength);
  const areaCommand = command.slice(wallLength);

  return { ...decodeAreas(areaCommand), ...decodeAreas(wallCommand) };
};

export const getMapInfoFromCloudFile = async (history: {
  bucket: string;
  file: string;
  mapLen?: number;
  pathLen?: number;
}): Promise<{
  originMap: string;
  originPath: string;
  virtualState: {
    virtualWalls?: VirtualWallParam[];
    forbiddenSweepZones?: ZoneParam[];
    forbiddenMopZones?: ZoneParam[];
    spots?: SpotParam[];
    cleanZones?: ZoneParam[];
  };
}> => {
  const { bucket, file, mapLen, pathLen } = history;

  const getMapData = (data: string) => {
    if (mapLen || pathLen) {
      const mapStrLength = mapLen * 2;
      const pathStrLength = pathLen * 2;
      const mapData = data.slice(0, mapStrLength);
      const pathData = data.slice(mapStrLength, mapStrLength + pathStrLength);
      const virtualData = data.slice(mapStrLength + pathStrLength);

      return {
        originMap: mapData,
        originPath: pathData,
        virtualState: getAreasFromMixedCommand(virtualData),
      };
    }

    const { dataLengthBeforeCompress, dataLengthAfterCompress, mapHeaderStr } = decodeMapHeader(
      data
    );
    let mapLength = 0;
    if (dataLengthAfterCompress) {
      mapLength = mapHeaderStr.length + dataLengthAfterCompress * 2;
    } else {
      mapLength = mapHeaderStr.length + dataLengthBeforeCompress * 2;
    }
    const virtualData = data.slice(mapLength);

    return {
      originMap: data,
      originPath: '',
      virtualState: getAreasFromMixedCommand(virtualData),
    };
  };

  const { type, data } = await ossApiInstance.getCloudFileUrl(bucket, file);

  if (type === 'url') {
    // 真机环境下载地图文件url得到数据
    const res = await fetchMapFile(data, file, {
      method: 'GET',
    });

    if (res.status === 200) {
      return getMapData(base64ToRaw(res.data));
    }
  }

  if (type === 'data') {
    // IDE环境直接获取到数据
    return getMapData(data);
  }
};

export const fetchMultiMaps = createAsyncThunk<MultiMap[], void, { state: ReduxState }>(
  'multiMaps/fetchMultiMaps',
  async (nothing, { getState, dispatch }) => {
    const storagedMultiMapsJSONString = getStorageSync({
      key: `snapshotImageMap_${devices.common.getDevInfo().devId}`,
    }) as string | null;

    const storagedMultiMaps = storagedMultiMapsJSONString
      ? JSON.parse(storagedMultiMapsJSONString)
      : {};

    const { datas } = await getMultipleMapFiles({
      devId: devices.common.getDevInfo().devId,
    });

    if (Object.keys(storagedMultiMaps).length > 0) {
      Object.keys(storagedMultiMaps).forEach(key => {
        const isExist = datas.some(item => {
          const { file, time } = item;
          const [_, appUseFile] = file.split(',');
          const filePathKey = `${time}_${appUseFile}`;
          return key === filePathKey;
        });
        if (!isExist) {
          delete storagedMultiMaps[key];
        }
      });

      dispatch(setSnapshotImageMap(storagedMultiMaps));
    }

    const { mapId: realTimeMapId } = getState().mapState;

    const newMultiMaps = [];

    for (let i = 0; i < datas.length; i++) {
      const { file, bucket, time, id, extend } = datas[i];
      const [robotUseFile, appUseFile] = file.split(',');

      const filePathKey = `${time}_${appUseFile}`;

      const mapId = parseInt(extend.replace(/(.*_)(\d*)(_.*)/, '$2'), 10);

      if (!getState().multiMaps.snapshotImageMap[filePathKey]) {
        taskQueue.enqueue([
          {
            filePathKey,
            bucket,
            file: appUseFile,
            realTimeMapId,
          },
        ]);
      }

      newMultiMaps.push({
        id,
        file: appUseFile,
        filePathKey,
        robotUseFile,
        bucket,
        title: Strings.getLang(`dsc_multi_map_title_${i}` as any),
        time: dayjs(time * 1000).format('YYYY-MM-DD HH:mm'),
        mapId,
      });
    }

    return newMultiMaps;
  }
);

const multiMapsAdapter = createEntityAdapter<MultiMap>({
  selectId: (multiMap: MultiMap) => multiMap.filePathKey,
});

/**
 * Slice
 */
const multiMapsSlice = createSlice({
  name: 'multiMaps',
  initialState: {
    list: multiMapsAdapter.getInitialState(),
    snapshotImageMap: {} as Record<string, { image: string; mapWidth: number; mapHeight: number }>,
  },
  reducers: {
    updateMultiMap: (state, action: PayloadAction<MultiMap>) => {
      multiMapsAdapter.updateOne(state.list, {
        id: action.payload.filePathKey,
        changes: action.payload,
      });
    },
    deleteMultiMap: (state, action: PayloadAction<string>) => {
      multiMapsAdapter.removeOne(state.list, action.payload);
    },
    setSnapshotImageMap: (
      state,
      action: PayloadAction<Record<string, { image: string; mapWidth: number; mapHeight: number }>>
    ) => {
      state.snapshotImageMap = action.payload;
    },
    /**
     * 插入或更新单个快照图片
     * @param state 当前状态
     * @param action 包含快照键和图片数据的 action
     */
    upsertSnapshotImage: (
      state,
      action: PayloadAction<{
        key: string;
        snapshotImage: { image: string; mapWidth: number; mapHeight: number };
      }>
    ) => {
      state.snapshotImageMap[action.payload.key] = action.payload.snapshotImage;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMultiMaps.fulfilled, (state, action: PayloadAction<MultiMap[]>) => {
      multiMapsAdapter.setAll(state.list, action.payload);
    });
  },
});

/**
 * Selectors
 */
export const {
  selectIds: selectMultiMapIds,
  selectById: selectMultiMapById,
  selectAll: selectMultiMaps,
  selectTotal: selectMultiMapsTotal,
} = multiMapsAdapter.getSelectors((state: ReduxState) => state.multiMaps.list);

export const selectSnapshotImageByFilePathKey = (state: ReduxState, filePathKey: string) => {
  return state.multiMaps.snapshotImageMap[filePathKey];
};

export const {
  updateMultiMap,
  deleteMultiMap,
  upsertSnapshotImage,
  setSnapshotImageMap,
} = multiMapsSlice.actions;

export default multiMapsSlice.reducer;
