import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

interface UiState {
  bindingTipsDone?: boolean;
  cloneDone?: boolean;
  historyEndpointAgentId?: number;
  deviceStatement?: {
    show: boolean;
    dataSource: any;
  };
  playType?: string;
}

/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    deviceStatement: { show: false, dataSource: {} },

    playType: '',
  } as UiState,
  reducers: {
    updateUiState(state, action: PayloadAction<UiState>) {
      return { ...state, ...action.payload };
    },
  },
});

/**
 * Actions
 */

export const { updateUiState } = uiStateSlice.actions;

/**
 * Selectors
 */
export const selectUiState = (state: ReduxState) => state.uiState;

export default uiStateSlice.reducer;
