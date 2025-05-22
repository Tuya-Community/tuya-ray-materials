import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { AgentListItem } from '@/types';

/**
 * Slice
 */
const singleAgentSlice = createSlice({
  name: 'singleAgent',
  initialState: {} as AgentListItem,
  reducers: {
    updateSingleAgent(state, action: PayloadAction<AgentListItem>) {
      state = { ...action.payload };
      return state;
    },
    resetSingleAgent(state) {
      state = {};
      return state;
    },
  },
});

/**
 * Actions
 */

export const { updateSingleAgent, resetSingleAgent } = singleAgentSlice.actions;

/**
 * Selectors
 */
export const selectSingleAgent = (state: ReduxState) => state.singleAgent;

export default singleAgentSlice.reducer;
