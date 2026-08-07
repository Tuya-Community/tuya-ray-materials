import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { CustomTemplateItem, SummaryTemplateInfo, TemplateIconItem } from '@/api/interface';
import {
  atopCreateCustomTemplate,
  atopUpdateCustomTemplate,
  atopDeleteCustomTemplate,
  atopGetTemplateIconList,
} from '@/api/customTemplate';
import { CustomTemplateSaveParams } from '@/api/interface';
import { atopGetSummaryTemplateListByCategory } from '@/api/common';
import { JsonUtil } from '@/utils';

const CATEGORY_CODE_MY_TEMPLATE = 'my_template';

/** 与 resolveTemplateIcons 配对，合并并发中的单次 icon.list 请求 */
let templateIconsInflight: Promise<TemplateIconItem[]> | null = null;

/**
 * 图标列表：优先 Redux 缓存；无缓存时合并 in-flight，避免 create 的 fetchTemplateIconsIfNeeded
 * 与 manage/MoreTemplate 的 fetchCustomTemplates 并发时各打一次 icon.list。
 */
function resolveTemplateIcons(getState: () => unknown): Promise<TemplateIconItem[]> {
  const cached = (getState() as ReduxState).customTemplate.templateIconList;
  if (cached.length > 0) {
    return Promise.resolve(cached);
  }
  if (!templateIconsInflight) {
    templateIconsInflight = atopGetTemplateIconList()
      .catch(() => [] as TemplateIconItem[])
      .finally(() => {
        templateIconsInflight = null;
      });
  }
  return templateIconsInflight;
}

/** 模板图标列表变化极少，仅在 Redux 中无缓存时请求接口 */
export const fetchTemplateIconsIfNeeded = createAsyncThunk(
  'customTemplate/fetchIconsIfNeeded',
  async (_, { getState }) => {
    return resolveTemplateIcons(getState);
  }
);

export const fetchCustomTemplates = createAsyncThunk(
  'customTemplate/fetchList',
  async (_, { getState }) => {
    const iconList = await resolveTemplateIcons(getState);

    const res = await atopGetSummaryTemplateListByCategory({
      categoryCode: CATEGORY_CODE_MY_TEMPLATE,
      pageNo: 1,
      pageSize: 50,
    });

    const iconMap: Record<string, string> = {};
    iconList.forEach(row => {
      if (row.objectKey) {
        iconMap[row.objectKey] = row.iconUrl;
      }
    });

    const list: CustomTemplateItem[] =
      res.list?.map((t: SummaryTemplateInfo) => {
        return {
          templateId: String(t.id),
          templateCode: t.templateCode,
          icon: t?.icon || undefined,
          objectKey: t?.objectKey || undefined,
          templateName: t.templateName,
          prompt: t.prompt ?? '',
          templateDesc: t.templateDesc,
          customize: true,
          needColorAdapt: t.needColorAdapt,
          sort: t.sort,
        };
      }) ?? [];

    return {
      list,
      // 方案明确最多 3 个；如后端后续给 maxCount 再替换
      maxCount: 3,
      templateIconList: iconList,
    };
  }
);

export const saveCustomTemplate = createAsyncThunk(
  'customTemplate/save',
  async (params: CustomTemplateSaveParams, { rejectWithValue }) => {
    try {
      const iconParam =
        params.objectKey !== undefined && params.objectKey !== '' ? { icon: params.objectKey } : {};

      if (params.templateId !== undefined && params.templateId !== '') {
        await atopUpdateCustomTemplate({
          templateId: params.templateId,
          templateName: params.templateName,
          prompt: params.prompt,
          ...iconParam,
        });
        return { templateId: params.templateId };
      }

      const res = await atopCreateCustomTemplate({
        templateName: params.templateName,
        prompt: params.prompt,
        ...iconParam,
      });
      return res;
    } catch (err: any) {
      const parsed = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;
      return rejectWithValue(parsed);
    }
  }
);

export const deleteCustomTemplate = createAsyncThunk(
  'customTemplate/delete',
  async (templateId: string) => {
    await atopDeleteCustomTemplate({ templateId });
    return templateId;
  }
);

interface CustomTemplateState {
  list: CustomTemplateItem[];
  maxCount: number;
  loading: boolean;
  error: string | null;
  /** m.wearable.template.icon.list 缓存，避免每次拉列表都请求 */
  templateIconList: TemplateIconItem[];
}

const initialState: CustomTemplateState = {
  list: [],
  maxCount: 3,
  loading: false,
  error: null,
  templateIconList: [],
};

const customTemplateSlice = createSlice({
  name: 'customTemplate',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCustomTemplates.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomTemplates.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.list ?? [];
      state.maxCount = action.payload?.maxCount ?? 3;
      const icons = action.payload?.templateIconList;
      if (icons && icons.length > 0) {
        state.templateIconList = icons;
      }
    });
    builder.addCase(fetchTemplateIconsIfNeeded.fulfilled, (state, action) => {
      const icons = action.payload ?? [];
      if (icons.length > 0) {
        state.templateIconList = icons;
      }
    });
    builder.addCase(fetchCustomTemplates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'fetch failed';
    });
    builder.addCase(deleteCustomTemplate.fulfilled, (state, action) => {
      state.list = state.list.filter(item => item.templateId !== action.payload);
    });
  },
});

export const selectCustomTemplates = (state: ReduxState) => state.customTemplate;

export default customTemplateSlice.reducer;
