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
      return { ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateSingleAgent } = singleAgentSlice.actions;

/**
 * Selectors
 */
export const selectSingleAgent = (state: ReduxState) => state.singleAgent;

export default singleAgentSlice.reducer;
