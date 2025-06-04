import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { useDispatch } from 'react-redux';

import systemInfoReducer from './modules/systemInfoSlice';
import themeReducer from './modules/themeSlice';
import homeInfoReducer from './modules/homeInfoSlice';
import ipcCommonReducer from './modules/ipcCommonSlice';
import petsReducer from './modules/petsSlice';
import petBreedReducer from './modules/petBreedSlice';
import globalReducer from './modules/globalSlice';
import accountInfoReducer from './modules/accountInfoSlice';
import uploadFileReducer from './modules/uploadFileSlice';
import audiosReducer from './modules/audiosSlice';

const isDev = process.env.NODE_ENV === 'development';

const logger = createLogger({
  predicate: () => isDev,
  collapsed: true,
  duration: true,
});

const middlewares = isDev ? [logger] : [];

const store = configureStore({
  reducer: {
    homeInfo: homeInfoReducer,
    systemInfo: systemInfoReducer,
    theme: themeReducer,
    ipcCommon: ipcCommonReducer,
    pets: petsReducer,
    petBreed: petBreedReducer,
    global: globalReducer,
    accountInfo: accountInfoReducer,
    uploadFile: uploadFileReducer,
    audios: audiosReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const getHomeId = () => store.getState().homeInfo.homeId;

export default store;
