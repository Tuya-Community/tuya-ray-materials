import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { useDispatch } from 'react-redux';

import systemInfoReducer from './modules/systemInfoSlice';
import themeReducer from './modules/themeSlice';
import albumReducer from './modules/albumSlice';
import diyReducer from './modules/diySlice';
import otherReducer from './modules/otherSlice';
import messageReducer from './modules/messageSlice';

const isDev = process.env.NODE_ENV === 'development';

const logger = createLogger({
  predicate: () => isDev,
  collapsed: true,
  duration: true,
});

const middlewares = isDev ? [logger] : [];

const store = configureStore({
  reducer: {
    systemInfo: systemInfoReducer,
    theme: themeReducer,
    album: albumReducer,
    diy: diyReducer,
    other: otherReducer,
    message: messageReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
