import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { useDispatch } from 'react-redux';

import systemInfoReducer from './modules/systemInfoSlice';
import themeReducer from './modules/themeSlice';
import agentListReducer from './modules/agentListSlice';
import singleAgentReducer from './modules/singleAgentSlice';
import agentInfoReducer from './modules/agentInfoSlice';
import uiStateReducer from './modules/uiStateSlice';
import voiceListReducer from './modules/voiceListSlice';
import cloneInfoReducer from './modules/cloneInfoSlice';

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
    agentList: agentListReducer,
    singleAgent: singleAgentReducer,
    agentInfo: agentInfoReducer,
    uiState: uiStateReducer,
    voiceList: voiceListReducer,
    cloneInfo: cloneInfoReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
