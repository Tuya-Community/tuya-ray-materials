import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import {
  atopGetAudioAccountDetail,
  atopGetCredentialList,
  atopGetVasMallData,
  atopGetVasSpuList,
  atopGetAccountBenefits,
  atopGetSubscriptionPackages,
} from '@/api/shop';
import { cloneDeep } from 'lodash-es';
import { BenefitItem } from '@/api/ttt.interface';
import { CredentialItem, SpuItem } from '@/types/shop';
import { SHOP_CATALOG, SHOP_CATALOG_ACCOUNT_TYPE, type ShopCatalogCode } from '@/constant';

export type { ShopCatalogCode };

const getShopDataByCatalogCodeFun = async (catalogCode: ShopCatalogCode) => {
  try {
    const audioVasMallData: any = await atopGetVasMallData(catalogCode);
    const audioSpuList = await atopGetVasSpuList({
      ...audioVasMallData,
      catalogCode,
    });
    const list = Array.isArray(audioSpuList) ? audioSpuList : [];
    // 按价格从低到高排序
    const getMinPrice = (spu: SpuItem): number => {
      const prices = (spu?.skuList || [])
        .flatMap(sku => (sku?.priceList || []).map(p => p?.price))
        .filter((p): p is number => p != null);
      return prices.length ? Math.min(...prices) : 0;
    };
    const sortedSpuList = [...list].sort((a, b) => getMinPrice(a) - getMinPrice(b));
    return {
      vasMallData: audioVasMallData,
      spuList: sortedSpuList,
    };
  } catch {
    return undefined;
  }
};

export const getAllVasMallData = createAsyncThunk(
  'shopInfo/getAllVasMallData',
  async (_option: { isSupportRealtime?: boolean }) => {
    const catalogCode = SHOP_CATALOG.AI_WEARABLE_BT as ShopCatalogCode;
    const shopData = await getShopDataByCatalogCodeFun(catalogCode);
    let credentialList: any[] = [];
    try {
      credentialList = await atopGetCredentialList(catalogCode);
    } catch {
      // keep empty credentialList
    }
    return {
      catalogCode,
      shopData,
      credentialList,
    };
  }
);

// 获取服务凭证列表（仅更新 credentialList，避免覆盖已有 spuList）
export const getCredentialListByCatalogCode = createAsyncThunk(
  'shopInfo/getCredentialList',
  async () => {
    const catalogCode = SHOP_CATALOG.AI_WEARABLE_BT as ShopCatalogCode;
    const credentialList: any = await atopGetCredentialList(catalogCode);
    return {
      catalogCode,
      credentialList,
    };
  }
);

// 获取账号信息
export const getAudioAccountDetailByCatalogCode = createAsyncThunk(
  'shopInfo/getAccountDetail',
  async (catalogCode: ShopCatalogCode, { getState }) => {
    try {
      const accountDetail: any = await atopGetAudioAccountDetail(
        SHOP_CATALOG_ACCOUNT_TYPE[catalogCode]
      );
      let resetTime = 0;
      let remainingTimePercent = 0;
      let total = 0;
      let used = 0;
      let left = 0;
      if (accountDetail.length) {
        const subscriptionData = accountDetail.find(item => item.supportSubscription);
        if (subscriptionData) {
          // 有订阅优先展示订阅
          resetTime = subscriptionData.effectiveEndDate;
        }
        accountDetail.forEach(item => {
          total += item.totalQuantity;
          used += item.usedQuantity;
          left += item.leftQuantity;
        });
        if (total > 0) {
          remainingTimePercent = (total - used) / total;
        }
      }
      const accountData = {
        accountDetail,
        resetTime,
        remainingTimePercent,
        totalTime: total,
        leftTime: left,
        usedTime: used,
      };
      const { shopInfo } = getState() as any;
      const newSingleShopInfo = cloneDeep(shopInfo?.[catalogCode]);
      newSingleShopInfo.accountData = accountData;
      return {
        [catalogCode]: newSingleShopInfo,
      };
    } catch (error) {
      return {};
    }
  }
);

// 获取账号信息
export const getAccountBenefits = createAsyncThunk(
  'shopInfo/getAccountBenefits',
  async (ownerId: string, { getState }) => {
    try {
      const benefits: any = await atopGetAccountBenefits(ownerId);
      return {
        benefits,
      };
    } catch (error) {
      return {};
    }
  }
);

// 获取订阅套餐
export const getSubscriptionPackages = createAsyncThunk(
  'shopInfo/getSubscriptionPackages',
  async () => {
    try {
      const res = await atopGetSubscriptionPackages();
      return { subscribeTagList: res || [] };
    } catch (error) {
      return { subscribeTagList: [] };
    }
  }
);

interface AccountData {
  accountDetail: any; // 账号相亲
  resetTime: number; // 重置时间
  remainingTimePercent: number; // 剩余时长百分比
  totalTime: number; // 总时长
  leftTime: number; // 剩余时长
  usedTime: number; // 已用时长
}

interface SingleShopInfo {
  accountData: AccountData | null; // 账号信息
  vasMallData: any; // 商城信息
  spuList: SpuItem[]; // 商品列表
  credentialList: CredentialItem[]; // 服务凭证
}

type State = {
  benefits: BenefitItem[]; // 权益列表
  subscribeTagList: string[]; // 订阅套餐标签列表
  [SHOP_CATALOG.AI_WEARABLE_BT]: SingleShopInfo;
  [SHOP_CATALOG.AI_AUDIO_TRANS]: SingleShopInfo;
};

/**
 * Slice
 */
const shopInfoSlice = createSlice({
  name: 'shopInfo',
  initialState: {
    // 离线转写
    [SHOP_CATALOG.AI_WEARABLE_BT]: {
      accountData: {},
      vasMallData: {},
      credentialList: [],
      spuList: [],
    },
    // 实时转写
    [SHOP_CATALOG.AI_AUDIO_TRANS]: {
      accountData: {},
      vasMallData: {},
      credentialList: [],
      spuList: [],
    },
    benefits: [], // 权益列表
    subscribeTagList: [],
  } as State,
  reducers: {
    updateShopInfo(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(getAllVasMallData.fulfilled, (state, action) => {
      const { catalogCode, shopData, credentialList } = action.payload || {};
      if (!catalogCode) return;
      state[catalogCode] = {
        ...state[catalogCode],
        ...(shopData || {}),
        credentialList: credentialList ?? state[catalogCode]?.credentialList,
      };
    });
    builder.addCase(getCredentialListByCatalogCode.fulfilled, (state, action) => {
      const { catalogCode, credentialList } = action.payload || {};
      if (!catalogCode) return;
      state[catalogCode] = {
        ...state[catalogCode],
        credentialList,
      };
    });
    builder.addCase(getAudioAccountDetailByCatalogCode.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
    builder.addCase(getAccountBenefits.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
    builder.addCase(getSubscriptionPackages.fulfilled, (state, action) => {
      state.subscribeTagList = action.payload?.subscribeTagList ?? [];
    });
  },
});

/**
 * Actions
 */
export const { updateShopInfo } = shopInfoSlice.actions;

/**
 * Selectors
 */

export const selectShopInfo = (state: ReduxState) => state.shopInfo;

export const selectShopInfoByKey = key => state => state.shopInfo[key];

export default shopInfoSlice.reducer;
