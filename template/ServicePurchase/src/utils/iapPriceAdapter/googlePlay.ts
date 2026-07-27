import { extractGoogleIapId, updatePriceItem } from "./utils";
import {
  SUBSCRIPTION_OPTION_TYPE,
  type ProductItem,
  type QueryProductDetailsResult,
  type PriceUpdateInfo,
  type IapPriceAdapterOptions,
  type AdapterResult,
} from "./types";

declare const ty: any;

function groupProductsByType(skuList: any[]): {
  subscriptionProducts: ProductItem[];
  oneTimeProducts: ProductItem[];
} {
  const subscriptionProducts: ProductItem[] = [];
  const oneTimeProducts: ProductItem[] = [];
  const processedIds = new Set<string>(); // 避免重复商品

  for (const sku of skuList) {
    if (!sku.priceList) continue;

    for (const priceItem of sku.priceList) {
      const googleIapId = extractGoogleIapId(priceItem);

      if (!googleIapId || processedIds.has(googleIapId)) {
        continue;
      }

      processedIds.add(googleIapId);
      const isSubscription = priceItem.optionType === SUBSCRIPTION_OPTION_TYPE;
      const productItem: ProductItem = {
        productId: googleIapId,
        subscription: isSubscription ? 1 : 0,
      };

      if (isSubscription) {
        subscriptionProducts.push(productItem);
      } else {
        oneTimeProducts.push(productItem);
      }
    }
  }

  return { subscriptionProducts, oneTimeProducts };
}

function queryProductDetails(
  productList: ProductItem[],
  type: "subscription" | "one-time",
): Promise<QueryProductDetailsResult> {
  return new Promise((resolve, reject) => {
    ty.queryProductDetails({
      productList,
      success: (result: QueryProductDetailsResult) => {
        resolve(result);
      },
      fail: (err: any) => {
        console.warn(`${type} products query error:`, err);
        reject(err);
      },
    });
  });
}

async function queryGooglePlayPrices(
  subscriptionProducts: ProductItem[],
  oneTimeProducts: ProductItem[],
): Promise<QueryProductDetailsResult[]> {
  const queries: Promise<QueryProductDetailsResult | null>[] = [];

  // 并行发起查询请求
  if (subscriptionProducts.length > 0) {
    queries.push(
      queryProductDetails(subscriptionProducts, "subscription").catch((error) => {
        console.warn("Failed to query subscription products:", error);
        return null;
      }),
    );
  }

  if (oneTimeProducts.length > 0) {
    queries.push(
      queryProductDetails(oneTimeProducts, "one-time").catch((error) => {
        console.warn("Failed to query one-time products:", error);
        return null;
      }),
    );
  }

  const results = await Promise.all(queries);

  return results.filter((result): result is QueryProductDetailsResult => result !== null);
}

function combineQueryResults(results: QueryProductDetailsResult[]): QueryProductDetailsResult {
  const combined: QueryProductDetailsResult = {
    productSubsMap: {},
    productInAppMap: {},
  };

  for (const result of results) {
    if (result.productSubsMap) {
      Object.assign(combined.productSubsMap, result.productSubsMap);
    }
    if (result.productInAppMap) {
      Object.assign(combined.productInAppMap, result.productInAppMap);
    }
  }

  return combined;
}

/**
 * 从查询结果中提取价格信息
 */
function extractPriceInfo(
  googleIapId: string,
  combinedResult: QueryProductDetailsResult,
): PriceUpdateInfo | null {
  // 尝试从订阅商品结果中获取
  const subscriptionDetail = combinedResult.productSubsMap?.[googleIapId];
  if (subscriptionDetail?.subscriptionOfferDetailList) {
    const offerList = subscriptionDetail.subscriptionOfferDetailList;

    // 优先处理有offerId的offer（优惠offer）
    for (const offer of offerList) {
      if (offer.offerId && offer.pricingPhases?.length) {
        const firstPhase = offer.pricingPhases[0];
        if (firstPhase?.priceCode) {
          return {
            googleIapId,
            priceInfo: firstPhase,
            isSubscription: true,
            offerToken: offer.offerToken,
            offerInfo: {
              offerId: offer.offerId,
              allPricingPhases: offer.pricingPhases,
              allOffers: offerList.map((o) => ({
                offerId: o.offerId,
                pricingPhases: o.pricingPhases,
              })),
            },
          };
        }
      }
    }

    // 如果没有优惠offer，使用第一个普通offer
    const firstOffer = offerList[0];
    if (firstOffer?.pricingPhases?.[0]) {
      const pricingPhase = firstOffer.pricingPhases[0];
      if (pricingPhase.priceAmountMicros !== undefined && pricingPhase.priceCode) {
        return {
          googleIapId,
          priceInfo: pricingPhase,
          isSubscription: true,
          offerToken: firstOffer.offerToken,
        };
      }
    }
  }

  // 尝试从一次性购买商品结果中获取
  const oneTimeDetail = combinedResult.productInAppMap?.[googleIapId];
  if (oneTimeDetail?.priceAmountMicros && oneTimeDetail?.priceCode) {
    return {
      googleIapId,
      priceInfo: oneTimeDetail,
      isSubscription: false,
    };
  }

  return null;
}

/**
 * 更新商品详情中的价格信息
 */
function updateDetailPrices(
  skuList: any[],
  combinedResult: QueryProductDetailsResult,
): {
  updatedSkuList: any[];
  iapCurrency: string;
} {
  let iapCurrency = "";
  let updatedSkuList = [];

  if (!skuList?.length) {
    return { updatedSkuList, iapCurrency };
  }

  updatedSkuList = skuList.map((sku) => {
    if (!sku.priceList) return sku;

    const updatedPriceList = sku.priceList.map((priceItem) => {
      const googleIapId = extractGoogleIapId(priceItem);
      if (!googleIapId) return priceItem;

      const updateInfo = extractPriceInfo(googleIapId, combinedResult);
      if (!updateInfo) return priceItem;

      // 记录第一个有效的IAP币种
      if (!iapCurrency) {
        iapCurrency = updateInfo.priceInfo.priceCode;
      }

      return updatePriceItem(priceItem, updateInfo);
    });

    return { ...sku, priceList: updatedPriceList };
  });

  return { updatedSkuList, iapCurrency };
}

export async function adaptIapPriceForAndroid(
  options: IapPriceAdapterOptions,
): Promise<AdapterResult> {
  const { skuList } = options;

  try {
    // 1. 按类型分组商品
    const { subscriptionProducts, oneTimeProducts } = groupProductsByType(skuList);

    if (subscriptionProducts.length === 0 && oneTimeProducts.length === 0) {
      return { skuList, iapCurrency: "" };
    }

    // 2. 查询Google Play价格
    const queryResults = await queryGooglePlayPrices(subscriptionProducts, oneTimeProducts);

    if (queryResults.length === 0) {
      console.warn("All Google Play price queries failed");
      return { skuList, iapCurrency: "" };
    }

    // 3. 合并查询结果
    const combinedResult = combineQueryResults(queryResults);

    // 4. 更新商品价格
    const { updatedSkuList, iapCurrency } = updateDetailPrices(skuList, combinedResult);

    return { skuList: updatedSkuList, iapCurrency };
  } catch (error) {
    console.error("IAP price adaptation failed:", error);
    return { skuList, iapCurrency: "" };
  }
}
