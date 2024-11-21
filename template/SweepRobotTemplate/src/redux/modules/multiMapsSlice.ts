import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import Strings from '@/i18n';
import { ReduxState } from '..';
import { getDevInfo, getMultipleMapFiles } from '@ray-js/ray';
import { JsonUtil } from '@/utils';

const readFile = (filePath: string, encoding: string) => {
  return new Promise<string>((resolve, reject) => {
    ty.getFileSystemManager().readFile({
      filePath,
      encoding,
      position: 0,
      success: (params: { data: string }) => {
        resolve(params.data);
      },
      fail: () => {
        reject();
      },
    });
  });
};

const writeFile = (filePath: string, data: string, encoding: string) => {
  return new Promise<void>((resolve, reject) => {
    ty.getFileSystemManager().writeFile({
      filePath,
      encoding,
      data,
      success: (params: null) => {
        resolve();
      },
      fail: () => {
        reject();
      },
    });
  });
};

export const saveJsonFile = async (jsonData: any, filename: string) => {
  try {
    const dirs = (ty as any).env.USER_DATA_PATH;
    const path = `${dirs}/${filename}`;
    const jsonString = typeof jsonData !== 'string' ? JSON.stringify(jsonData) : jsonData;
    await writeFile(path, jsonString, 'utf8');
  } catch (error) {
    console.log('saveJsonFile error', error);
  }
};

export const readJsonFile = async (filename: string) => {
  try {
    const dirs = (ty as any).env.USER_DATA_PATH;
    const path = `${dirs}/${filename}`;
    const data = await readFile(path, 'utf8');
    return data;
  } catch (error) {
    return null;
  }
};

export const translateFileName = (path: string) =>
  path
    .replace(/\//g, '-')
    .replace('bin', 'json')
    .slice(1);

const multiMapsAdapter = createEntityAdapter<MultiMap>({
  selectId: (multiMap: MultiMap) => multiMap.filePathKey,
});

export const fetchMultiMaps = createAsyncThunk<MultiMap[], void, { state: ReduxState }>(
  'multiMaps/fetchMultiMaps',
  async (nothing, { getState }) => {
    const { datas } = await getMultipleMapFiles({
      devId: getDevInfo().devId,
    });
    const existMapIds = getState().multiMaps.ids;

    const newMultiMaps = [];

    for (let i = 0; i < datas.length; i++) {
      const { file, bucket, time, id, extend } = datas[i];
      const [robotUseFile, appUseFile] = file.split(',');

      const filePathKey = `${time}_${appUseFile}`;

      if (!existMapIds.includes(filePathKey)) {
        const mapId = parseInt(extend.replace(/(.*_)(\d*)(_.*)/, '$2'), 10);
        const localJson = await readJsonFile(translateFileName(filePathKey));
        const snapshotImage = JsonUtil.parseJSON(localJson) as {
          image: string;
          width: number;
          height: number;
        };

        newMultiMaps.push({
          id,
          file: appUseFile,
          filePathKey,
          robotUseFile,
          snapshotImage,
          bucket,
          title: Strings.getLang(`dsc_multi_map_title_${i}` as any),
          time: moment(time * 1000).format('YYYY-MM-DD HH:mm'),
          mapId,
        });
      } else {
        newMultiMaps.push(getState().multiMaps.entities[filePathKey] as MultiMap);
      }
    }

    return newMultiMaps;
  }
);

/**
 * Slice
 */
const multiMapsSlice = createSlice({
  name: 'multiMaps',
  initialState: multiMapsAdapter.getInitialState(),
  reducers: {
    updateMultiMap: multiMapsAdapter.updateOne,
  },
  extraReducers(builder) {
    builder.addCase(fetchMultiMaps.fulfilled, (state, action) => {
      multiMapsAdapter.setAll(state, action.payload);
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
} = multiMapsAdapter.getSelectors((state: ReduxState) => state.multiMaps);

export const { updateMultiMap } = multiMapsSlice.actions;

export default multiMapsSlice.reducer;
