import { configureStore } from '@reduxjs/toolkit';
import lockHomeReducer from './modules/lockHomeSlice';

const store = configureStore({ reducer: { lockHome: lockHomeReducer } });
export type ReduxState = ReturnType<typeof store.getState>;
export default store;
