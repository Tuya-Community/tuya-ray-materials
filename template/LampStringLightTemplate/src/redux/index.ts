import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { shallowEqual, useDispatch, useSelector as useSelectorBase } from 'react-redux';

import systemInfoReducer, { systemInfoActions } from './modules/systemInfoSlice';
import themeReducer, { themeActions } from './modules/themeSlice';
import commonReducer, { commonActions } from './modules/commonSlice';

export const actions = {
  common: commonActions,
  systemInfo: systemInfoActions,
  theme: themeActions,
};

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
    common: commonReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useSelector<TSelected>(
  selector: (state: ReduxState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) {
  return useSelectorBase<ReduxState, TSelected>(selector, equalityFn || shallowEqual);
}

export default store;
