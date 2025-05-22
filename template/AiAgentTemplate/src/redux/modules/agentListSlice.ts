import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { cloneDeep, differenceWith, isEqual } from 'lodash-es';
import { AgentListItem } from '@/types';

type Agent = {
  list?: Array<AgentListItem>;
  boundList?: Array<AgentListItem>;
  top10List?: Array<AgentListItem>;
  newNumber?: number;
  tagState?: string;
};

/**
 * Slice
 */
const agentListSlice = createSlice({
  name: 'agentList',
  initialState: {
    list: [],
    boundList: [],
    top10List: [],
    newNumber: 0,
    tagState: 'recommend',
  } as Agent,
  reducers: {
    initAgentList(state, action: PayloadAction<Array<AgentListItem>>) {
      state.list = [...action.payload];
    },
    refreshAgentList(state, action: PayloadAction<Array<AgentListItem>>) {
      const oldList = cloneDeep(state.list);

      const uniqueInArray2 = differenceWith(action.payload, oldList, isEqual);

      if (uniqueInArray2?.length > 0 && state.tagState !== 'dialog') {
        state.newNumber += uniqueInArray2?.length;
      }

      state.list = [...action.payload];
    },
    updateTagState(state, action: PayloadAction<string>) {
      state.tagState = action.payload;
    },
    updateNewNumber(state, action: PayloadAction<number>) {
      state.newNumber = action.payload;
    },
    updateTop10List(state, action: PayloadAction<Array<AgentListItem>>) {
      state.top10List = [...action.payload];
    },
    updateAgentList(state, action: PayloadAction<Array<AgentListItem>>) {
      const tempList = [...state.list];
      state.list = [...tempList, ...action.payload];
    },
    updateBoundAgentList(state, action: PayloadAction<Array<AgentListItem>>) {
      state.boundList = [...action.payload];
    },
  },
});

/**
 * Actions
 */

export const {
  initAgentList,
  updateAgentList,
  updateBoundAgentList,
  updateTop10List,
  updateTagState,
  refreshAgentList,
  updateNewNumber,
} = agentListSlice.actions;

/**
 * Selectors
 */
export const selectAgentList = (state: ReduxState) => state.agentList;

export default agentListSlice.reducer;
