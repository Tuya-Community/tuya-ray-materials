import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { tttGetDidDisplayDIYHomeCard, tttAddDIYHomeCard } from '@/api/ttt';

// 14 对应 AI NOTE 卡片
const AI_NOTE_TYPE = 14;
// 3 对应 AI NOTE 大卡片
const AI_NOTE_STYLE = 3;
// contentId 标识符
const AI_NOTE_CONTENTID = 'ai_bt_headset';

type AiNoteCardState = {
  isHomeCardDisplay: boolean | null; // null 表示未加载，true/false 表示已加载
  loading: boolean;
  error: string | null;
};

const initialState: AiNoteCardState = {
  isHomeCardDisplay: null,
  loading: false,
  error: null,
};

/**
 * 获取 AI 笔记卡片是否已添加到首页
 */
export const fetchAiNoteCardDisplayStatus = createAsyncThunk(
  'aiNoteCard/fetchDisplayStatus',
  async (homeId: string, { rejectWithValue }) => {
    try {
      const res = await tttGetDidDisplayDIYHomeCard({
        card: { type: AI_NOTE_TYPE },
        gid: Number(homeId),
      });
      return res.result;
    } catch (error: any) {
      return rejectWithValue(error?.message || '获取卡片状态失败');
    }
  }
);

/**
 * 添加 AI 笔记卡片到首页
 */
export const addAiNoteCardToHome = createAsyncThunk(
  'aiNoteCard/addToHome',
  async (homeId: string, { rejectWithValue }) => {
    try {
      await tttAddDIYHomeCard({
        card: { type: AI_NOTE_TYPE, style: AI_NOTE_STYLE, contentId: AI_NOTE_CONTENTID },
        gid: Number(homeId),
      });
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);

/**
 * Slice
 */
const aiNoteCardSlice = createSlice({
  name: 'aiNoteCard',
  initialState,
  reducers: {
    // 重置状态
    resetAiNoteCardState() {
      return initialState;
    },
    // 手动设置卡片显示状态（用于添加卡片后更新状态）
    setAiNoteCardDisplay(state, action: PayloadAction<boolean>) {
      state.isHomeCardDisplay = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // fetchAiNoteCardDisplayStatus
      .addCase(fetchAiNoteCardDisplayStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiNoteCardDisplayStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isHomeCardDisplay = payload;
        state.error = null;
      })
      .addCase(fetchAiNoteCardDisplayStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // addAiNoteCardToHome
      .addCase(addAiNoteCardToHome.fulfilled, state => {
        state.isHomeCardDisplay = true;
        state.error = null;
      })
      .addCase(addAiNoteCardToHome.rejected, (state, { payload }) => {
        state.error = payload as string;
      });
  },
});

/**
 * Actions
 */
export const { resetAiNoteCardState, setAiNoteCardDisplay } = aiNoteCardSlice.actions;

/**
 * Selectors
 */
export const selectAiNoteCard = (state: ReduxState) => state.aiNoteCard;
export const selectIsHomeCardDisplay = (state: ReduxState) => state.aiNoteCard.isHomeCardDisplay;
export const selectAiNoteCardLoading = (state: ReduxState) => state.aiNoteCard.loading;

export default aiNoteCardSlice.reducer;
