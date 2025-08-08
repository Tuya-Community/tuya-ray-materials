import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { getDpsInfos, getGroupDpsInfos, getStorageSync, setStorageSync } from '@ray-js/ray';
import { isEqual } from 'lodash-es';
import { useSelector } from 'react-redux';

type CommonState = {
  dpNames: Record<string, string>;
};

const dpNamesCacheKey = 'dpNames_cache';

export const fetchDpNames = createAsyncThunk(
  'fetchDpNames',
  async (params: { devId: string; gwId: string; groupId: string }, { dispatch }) => {
    return new Promise<Record<string, string>>((resolve, reject) => {
      const cacheKey = `${params.devId || params.gwId}_${dpNamesCacheKey}`;
      // 从缓存读取
      const cache = getStorageSync({ key: cacheKey });
      console.log('cache', cache);
      let dpNames: Record<string, string> = {};
      let hasCache = false;
      try {
        if (cache) {
          dpNames = JSON.parse(cache as string);
          hasCache = true;
          console.log('Dp name use location', dpNames);
          resolve(dpNames);
        }
      } catch (e) {
        console.warn('Dp name parse error by location', e);
      }
      console.log('hasCache', hasCache);

      (params.groupId ? getGroupDpsInfos(params.groupId) : getDpsInfos(params))
        .then((dps) => {
          // @ts-expect-error
          const result = dps.reduce((res, cur) => {
            res[cur.code] = cur.name;
            return res;
          }, {} as Record<string, string>);
          if (hasCache) {
            // 比较是否数据一致
            if (!isEqual(dpNames, result)) {
              console.log('Dp name update location', result);
              dispatch(updaetDpNames(result));
              setStorageSync({ key: cacheKey, data: JSON.stringify(result) });
            }
          } else {
            console.log('Dp name update location', result);
            resolve(result);
            setStorageSync({ key: cacheKey, data: JSON.stringify(result) });
          }
        })
        .catch((e) => {
          if (!hasCache) {
            reject(e);
          }
        });
    });
  },
);

/**
 * Slice
 */
const commonSlice = createSlice({
  name: 'theme',
  initialState: {
    dpNames: {},
  } as CommonState,
  reducers: {
    updaetDpNames(state, action: PayloadAction<Partial<Record<string, string>>>) {
      state.dpNames = { ...state.dpNames, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchDpNames.fulfilled, (state, action) => {
      state.dpNames = action.payload;
    });
  },
});

/**
 * Actions
 */

export const { updaetDpNames } = commonSlice.actions;

/**
 * Selectors
 */
export const useCommon = () => useSelector((state: ReduxState) => state.common);

export default commonSlice.reducer;
