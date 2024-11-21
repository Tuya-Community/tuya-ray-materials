import { configureStore } from '@reduxjs/toolkit';
import { shallowEqual, useDispatch, useSelector as useSelectorBase } from 'react-redux';
import { createLogger } from 'redux-logger';

import devInfoReducer from './modules/devInfoSlice';
import systemInfoReducer from './modules/systemInfoSlice';
import themeReducer from './modules/themeSlice';
import uiReducer from './modules/uiSlice';
import userInformationReducer from './modules/userInformationSlice';

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
    uiState: uiReducer,
    devInfo: devInfoReducer,
    userInformation: userInformationReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useSelector = <TSelected>(
  selector: (state: ReduxState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useSelectorBase<ReduxState, TSelected>(selector, equalityFn || shallowEqual);

export default store;
