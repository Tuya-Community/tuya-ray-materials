import { publishDps } from '@ray-js/ray';
import { Action, configureStore, Middleware, ThunkDispatch } from '@reduxjs/toolkit';
import { createDpKitMiddleware } from '@ray-js/tuya-dp-kit';
import { createLogger } from 'redux-logger';
import devInfoReducer from './modules/devInfoSlice';
import dpStateReducer, { DpState, DpStateKey } from './modules/dpStateSlice';
import devsDpStateReducer from './modules/devsDpStateSlice';
import themeReducer from './modules/themeSlice';
import systemInfoReducer from './modules/systemInfoSlice';
import audioFileReducer, { updateRecordTransferResultList } from './modules/audioFileSlice';
import uiStateSliceReducer from './modules/uiStateSlice';
import userInfoReducer from './modules/userInfoSlice';
import shopInfoReducer from './modules/shopInfoSlice';
import fileSyncReducer from './modules/fileSyncSlice';
import homeInfoReducer from './modules/homeInfoSlice';
import deviceListReducer from './modules/deviceListSlice';
import agentReducer from './modules/agentSlice';
import fileDetailReducer from './modules/fileDetailSlice';
import recordConfigReducer from './modules/recordConfigSlice';
import appInfoReducer from './modules/appInfoSlice';
import aiNoteCardReducer from './modules/aiNoteCardSlice';
import customTemplateReducer from './modules/customTemplateSlice';
import f2fLangSelectsReducer from './modules/f2fLangSelectsSlice';
import { getDevId, getDpIdByCode } from '@/utils';
import { shallowEqual, useDispatch, useSelector as useSelectorBase } from 'react-redux';
import { emitFileListReadyBus } from '@/utils/fileListReadyBus';

const isDebug = process.env.NODE_ENV === 'development';
const logger = createLogger({
  predicate: () => isDebug,
  collapsed: true,
  duration: true,
});

export const fileListMiddleware: Middleware = () => next => action => {
  const result = next(action);
  if (action.type === updateRecordTransferResultList.fulfilled.type) {
    // tttGetFilesList 完成后的副作用
    emitFileListReadyBus();
  }

  return result;
};

const dpKitMiddleware: Middleware = createDpKitMiddleware<DpState, ReduxState>({
  putDeviceData: (dpState: Partial<DpState>) => {
    const dps = {};
    Object.keys(dpState).forEach((dpCode: DpStateKey) => {
      dps[getDpIdByCode(dpCode)] = dpState[dpCode];
    });

    publishDps({
      deviceId: getDevId(),
      dps,
      mode: 2,
      pipelines: [],
      options: {}, // 0，静音； 1，震动；2,声音； 3，震动声音
    });
  },
  rawDpMap: {},
});

const middlewares = isDebug
  ? [logger, dpKitMiddleware, fileListMiddleware]
  : [dpKitMiddleware, fileListMiddleware];

const store = configureStore({
  reducer: {
    devInfo: devInfoReducer,
    dpState: dpStateReducer,
    theme: themeReducer,
    systemInfo: systemInfoReducer,
    audioFile: audioFileReducer,
    uiState: uiStateSliceReducer,
    userInfo: userInfoReducer,
    shopInfo: shopInfoReducer,
    fileSync: fileSyncReducer,
    homeInfo: homeInfoReducer,
    deviceList: deviceListReducer,
    agent: agentReducer,
    fileDetail: fileDetailReducer,
    recordConfig: recordConfigReducer,
    appInfo: appInfoReducer,
    devsDpState: devsDpStateReducer,
    aiNoteCard: aiNoteCardReducer,
    customTemplate: customTemplateReducer,
    f2fLangSelects: f2fLangSelectsReducer,
  },
  /**
   * toolkit默认有检测serializable的中间件 state.theme有很多函数 会导致serializable检测的报错 是否考虑重新对theme的组织？
   * https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
   */
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type ThunkAppDispatch = ThunkDispatch<ReduxState, void, Action>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector = <TSelected>(
  selector: (state: ReduxState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useSelectorBase<ReduxState, TSelected>(selector, equalityFn || shallowEqual);

export default store;
