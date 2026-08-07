import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

/**
 * Slice
 */
const agentSlice = createSlice({
  name: 'agent',
  initialState: { agentId: '' } as { agentId: string },
  reducers: {
    updateAgentSync(state, action: PayloadAction<any>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateAgentSync } = agentSlice.actions;

/**
 * Selectors
 */
export const getAgentId = (state: ReduxState) => state.agent.agentId;

export default agentSlice.reducer;
