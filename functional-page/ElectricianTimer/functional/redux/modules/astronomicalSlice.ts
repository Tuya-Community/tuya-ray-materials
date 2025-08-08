import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { useSelector } from 'react-redux';
import { AstronomicalData, AstronomicalParams } from '@/interface';
import {
  updateAstronomicalStatus,
  getAstronomicalList,
  addAstronomical,
  updateAstronomical,
  removeAstronomical,
} from '@ray-js/ray';

type TimerData = {
  list: AstronomicalData[];
  status: 'idle' | 'loading' | 'loaded' | 'failure';
};

export const fetchAstronomicalList = createAsyncThunk('fetchAstronomicalList', async (devId: string) => {
  const res = await getAstronomicalList({ bizId: devId });
  return {
    // @ts-expect-error
    list: res.map((item) => {
      return {
        ...item,
        dps: JSON.parse(item.dps),
      };
    }),
  };
});
// 创建定时
export const createAstronomical = createAsyncThunk<any, AstronomicalParams>(
  'createAstronomical',
  // eslint-disable-next-line consistent-return
  async (params, { rejectWithValue, dispatch }) => {
    try {
      // @ts-expect-error
      await addAstronomical(params);
      dispatch(fetchAstronomicalList(params.bizId));
    } catch (e) {
      console.log('eeee', e);
      return rejectWithValue(e);
    }
  },
);
// 更新定时
export const editAstronomical = createAsyncThunk<any, { id: string } & AstronomicalParams>(
  'editAstronomical',
  // eslint-disable-next-line consistent-return
  async (params, { rejectWithValue, dispatch }) => {
    try {
      // @ts-expect-error
      await updateAstronomical(params);
      dispatch(fetchAstronomicalList(params.bizId));
    } catch (e) {
      console.error('error', e);
      return rejectWithValue(e);
    }
  },
);
// 启用定时
export const enabledAstronomical = createAsyncThunk<any, { timerId: string; bizId: string }>(
  'enabledAstronomical',
  // eslint-disable-next-line consistent-return
  async (params, { rejectWithValue, dispatch }) => {
    try {
      await updateAstronomicalStatus({ id: params.timerId, status: 1 });
      dispatch(fetchAstronomicalList(params.bizId));
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
// 禁用定时
export const disabledAstronomical = createAsyncThunk<any, { timerId: string; bizId: string }>(
  'disabledAstronomical',
  // eslint-disable-next-line consistent-return
  async (params, { rejectWithValue, dispatch }) => {
    try {
      await updateAstronomicalStatus({ id: params.timerId, status: 0 });
      dispatch(fetchAstronomicalList(params.bizId));
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
// 删除定时
export const deleteAstronomical = createAsyncThunk<any, { timerId: string; bizId: string }>(
  'deleteAstronomical',
  // eslint-disable-next-line consistent-return
  async (params, { rejectWithValue, dispatch }) => {
    try {
      await removeAstronomical({ id: params.timerId });
      dispatch(fetchAstronomicalList(params.bizId));
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

/**
 * Slice
 */
const astronomicalSlice = createSlice({
  name: 'astronomical',
  initialState: {
    list: [],
    status: 'idle',
  } as TimerData,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAstronomicalList.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAstronomicalList.rejected, (state, action) => {
        state.status = 'failure';
      })
      .addCase(fetchAstronomicalList.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.list = action.payload.list;
      });
  },
});

/**
 * Selectors
 */
export const useAstronomical = () => useSelector<ReduxState, TimerData>((state) => state.astronomical);

/**
 * 获取当前需要展示的列表
 * @returns
 */
export const useAstronomicalList = () =>
  useSelector<ReduxState, AstronomicalData[]>((state) => {
    return state.astronomical.list;
    // return state.astronomical.list.filter((item) => {
    //   return Object.keys(item.dps).some((id) => {
    //     const found = config.switchDps.find((item) => (item.id = id));
    //     return !!found;
    //   });
    // });
  });

export default astronomicalSlice.reducer;
