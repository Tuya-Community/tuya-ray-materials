import {
  getPurchaseOrder,
  getAccountDetail,
  getAccountQuota,
  getSubscriptionPackage,
} from './commonHighway';
import {
  getMallInfoV2,
  getCredentialList,
  getVasSpuList,
  getSkuListV2,
} from '@tuya-miniapp/cloud-api';
import { MINI_PROGRAM_ID } from '@/constant';

// 获取商城信息
export const atopGetVasMallData = catalogCode => {
  return getMallInfoV2({
    catalogCode,
    bindingObjectType: 1,
    bindingObjectCode: MINI_PROGRAM_ID,
  });
};

/**
 * 获取 VAS 商品列表。
 * Highway spu/list 常返回空 skuList，需再用 sku/list 按 commodityCode 补齐，
 * 否则套餐页按 optionType 过滤后会为空。
 */
export const atopGetVasSpuList = async (postData: {
  catalogCode: string;
  mallCode?: string;
  shopCode?: string;
  siteCode?: string;
  currency?: string;
}) => {
  const { catalogCode, mallCode, shopCode, siteCode, currency } = postData || {};
  const spuList = await getVasSpuList({
    bindingObjectType: 1,
    bindingObjectCode: MINI_PROGRAM_ID,
    catalogCode,
    purchaseBack: true,
    needSkuList: true,
  });
  const list = Array.isArray(spuList) ? spuList : [];
  const missingSku = list.filter(item => !item?.skuList?.length);
  if (!missingSku.length) {
    return list;
  }

  try {
    const skuList = await getSkuListV2({
      bindingObjectType: 1,
      bindingObjectCode: MINI_PROGRAM_ID,
      catalogCode,
      mallCode,
      shopCode,
      siteCode,
      currency,
      commodityCodes: missingSku.map(item => item.commodityCode).filter(Boolean),
    });
    const skus = Array.isArray(skuList) ? skuList : [];
    const skuMap: Record<string, typeof skus> = {};
    skus.forEach(sku => {
      const code = sku?.commodityCode;
      if (!code) return;
      if (!skuMap[code]) skuMap[code] = [];
      skuMap[code].push(sku);
    });
    return list.map(spu => ({
      ...spu,
      skuList: spu?.skuList?.length ? spu.skuList : skuMap[spu.commodityCode] || [],
    }));
  } catch {
    return list;
  }
};

// 获取服务凭证列表
export const atopGetCredentialList = (catalogCode: string) => {
  return getCredentialList({ catalogCode });
};

// 个人额度信息
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const atopGetAudioAccountDetail = (type: 'rts' | 'audio') => {
  return Promise.resolve({});
};

/** 消费详情（@tuya-miniapp/cloud-api） */
export const atopGetPurchaseOrder = ownerId => {
  return getPurchaseOrder({ ownerId, offset: 0, limit: 200 });
};

/** 权益详情（@tuya-miniapp/cloud-api） */
export const atopGetAccountBenefits = ownerId => {
  return getAccountDetail({ ownerId });
};

/** 余额（@tuya-miniapp/cloud-api） */
export const atopCheckBalance = param => {
  return getAccountQuota({ ...param });
};

/** 获取配置的订阅套餐（@tuya-miniapp/cloud-api） */
export const atopGetSubscriptionPackages = () => {
  return getSubscriptionPackage();
};
