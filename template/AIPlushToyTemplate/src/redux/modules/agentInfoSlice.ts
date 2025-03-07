import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { AgentInfo } from '@/types';

/**
 * Slice
 */
const agentInfoSlice = createSlice({
  name: 'agentInfo',
  initialState: {} as AgentInfo,
  reducers: {
    updateAgentInfo(state, action: PayloadAction<AgentInfo>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateAgentInfo } = agentInfoSlice.actions;

/**
 * Selectors
 */
export const selectAgentInfo = (state: ReduxState) => state.agentInfo;

export default agentInfoSlice.reducer;
