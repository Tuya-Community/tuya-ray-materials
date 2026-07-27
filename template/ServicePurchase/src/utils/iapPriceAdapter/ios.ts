import { updatePriceItem } from "./utils";
import type {
  IapPriceAdapterOptions,
  AdapterResult,
  PriceUpdateInfo,
  AppleProductInfo,
  AppleProductInfosResult,
  AppleProductOffer,
} from "./types";

declare const ty: any;

/**
 * 将 Apple 的周期单位转换为 Google Play 的 billingPeriod 格式
 */
function convertApplePeriodToBillingPeriod(periodUnit: string, periodValue: number): string {
  switch (periodUnit) {
    case "day":
      return `P${periodValue}D`;
    case "week":
      return `P${periodValue}W`;
    case "month":
      return `P${periodValue}M`;
    case "year":
      return `P${periodValue}Y`;
    default:
      return `P${periodValue}M`;
  }
}

function extractAppleIapIds(skuList: any[]): string[] {
  const appleIapIds: string[] = [];
  const processedIds = new Set<string>(); // 避免重复商品

  for (const sku of skuList) {
    if (!sku.priceList) continue;

    for (const priceItem of sku.priceList) {
      const appleIapId = priceItem.marketingStrategy?.appleIapId;

      if (appleIapId && !processedIds.has(appleIapId)) {
        processedIds.add(appleIapId);
        appleIapIds.push(appleIapId);
      }
    }
  }

  return appleIapIds;
}

function queryAppleProductInfos(productIds: string[]): Promise<AppleProductInfosResult> {
  if (!ty.getProductInfos) {
    return Promise.reject(new Error("当前版本不支持 ty.getProductInfos"));
  }

  return new Promise((resolve, reject) => {
    ty.getProductInfos({
      productIds,
      ignoreIneligibleOffer: false,
      success: (result: AppleProductInfosResult) => {
        resolve(result);
      },
      fail: (err: any) => {
        reject(err);
      },
    });
  });
}

function extractApplePriceInfo(
  appleIapId: string,
  productInfo: AppleProductInfo,
): PriceUpdateInfo | null {
  const availableOffers: Array<{ offer: AppleProductOffer; priority: number }> = [];

  // 优先级: introductory(优先级3) > promotional(优先级2) > winBack(优先级1)
  if (productInfo.introductoryOffer?.eligible) {
    availableOffers.push({ offer: productInfo.introductoryOffer, priority: 3 });
  }

  productInfo.promotionalOffers.forEach((offer) => {
    if (offer.eligible) {
      availableOffers.push({ offer, priority: 2 });
    }
  });

  productInfo.winBackOffers.forEach((offer) => {
    if (offer.eligible) {
      availableOffers.push({ offer, priority: 1 });
    }
  });

  availableOffers.sort((a, b) => b.priority - a.priority);

  let selectedOffer: AppleProductOffer | null = null;
  let { price } = productInfo;
  let { price: originalPrice } = productInfo;

  if (availableOffers.length > 0) {
    selectedOffer = availableOffers[0].offer;

    // 对于免费试用，price 应该是试用结束后的正常价格，而不是试用期的0价格
    if (selectedOffer.paymentMode === "freeTrial") {
      ({ price } = productInfo);
      ({ price: originalPrice } = productInfo);
    } else {
      ({ price } = selectedOffer);
      ({ price: originalPrice } = productInfo);
    }
  }

  // 构建价格更新信息，兼容现有的GooglePlay结构
  const priceInfo = {
    priceAmountMicros: price * 1000000, // 转换为微分（乘以100是因为iOS的price已经是分）
    priceCode: productInfo.currencyCode,
    price: productInfo.displayPrice,
    billingPeriod: productInfo.periodUnit
      ? convertApplePeriodToBillingPeriod(productInfo.periodUnit, productInfo.periodValue)
      : "",
  };

  const updateInfo: PriceUpdateInfo = {
    googleIapId: appleIapId, // 复用字段名以保持兼容性
    priceInfo,
    isSubscription: true, // iOS的IAP通常都是订阅
    offer: {
      offerId: selectedOffer?.offerId,
      type: selectedOffer?.type,
      productId: productInfo.productId,
    },
  };

  // 如果有优惠，添加优惠信息
  if (selectedOffer) {
    updateInfo.offerInfo = {
      offerId: selectedOffer.offerId || selectedOffer.type,
      allPricingPhases:
        selectedOffer.paymentMode === "freeTrial"
          ? [
              // 免费试用：第一阶段是试用期（价格0），第二阶段是正常价格
              {
                priceAmountMicros: selectedOffer.price * 1000000, // 试用期价格（0）
                priceCode: productInfo.currencyCode,
                price: selectedOffer.displayPrice,
                billingPeriod: convertApplePeriodToBillingPeriod(
                  selectedOffer.periodUnit,
                  selectedOffer.periodValue,
                ),
                billingCycleCount: selectedOffer.periodCount,
              },
              {
                priceAmountMicros: originalPrice * 1000000, // 试用结束后的正常价格
                priceCode: productInfo.currencyCode,
                price: productInfo.displayPrice,
                billingPeriod: productInfo.periodValue
                  ? convertApplePeriodToBillingPeriod(
                      productInfo.periodUnit,
                      productInfo.periodValue,
                    )
                  : "",
                billingCycleCount: 0,
              },
            ]
          : [
              // 非免费试用：只有优惠价格阶段
              {
                priceAmountMicros: selectedOffer.price * 1000000,
                priceCode: productInfo.currencyCode,
                price: selectedOffer.displayPrice,
                billingPeriod: convertApplePeriodToBillingPeriod(
                  selectedOffer.periodUnit,
                  selectedOffer.periodValue,
                ),
                billingCycleCount: selectedOffer.periodCount,
              },
              {
                priceAmountMicros: originalPrice * 1000000,
                priceCode: productInfo.currencyCode,
                price: productInfo.displayPrice,
                billingPeriod: productInfo.periodValue
                  ? convertApplePeriodToBillingPeriod(
                      productInfo.periodUnit,
                      productInfo.periodValue,
                    )
                  : "",
                billingCycleCount: 0,
              },
            ],
      allOffers: [
        {
          offerId: selectedOffer.offerId,
          pricingPhases: [
            {
              priceAmountMicros: selectedOffer.price * 1000000,
              priceCode: productInfo.currencyCode,
              price: selectedOffer.displayPrice,
              billingPeriod: convertApplePeriodToBillingPeriod(
                selectedOffer.periodUnit,
                selectedOffer.periodValue,
              ),
              billingCycleCount: selectedOffer.periodCount,
            },
          ],
        },
      ],
    };
  }

  return updateInfo;
}

/**
 * 更新商品详情中的价格信息
 */
function updateDetailPrices(
  skuList: any[],
  productInfosResult: AppleProductInfosResult,
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
      const appleIapId = priceItem.marketingStrategy?.appleIapId;
      if (!appleIapId) return priceItem;

      const productInfo = productInfosResult.result[appleIapId];
      if (!productInfo) return priceItem;

      const updateInfo = extractApplePriceInfo(appleIapId, productInfo);
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

/**
 * iOS下对IAP商品进行价格适配
 */
export async function adaptIapPriceForIOS(options: IapPriceAdapterOptions): Promise<AdapterResult> {
  const { skuList } = options;

  try {
    // 1. 提取Apple IAP产品ID
    const appleIapIds = extractAppleIapIds(skuList);

    if (appleIapIds.length === 0) {
      return { skuList, iapCurrency: "" };
    }

    // 2. 查询Apple产品信息
    const productInfosResult = await queryAppleProductInfos(appleIapIds);

    if (!productInfosResult?.result || Object.keys(productInfosResult.result).length === 0) {
      console.warn("Apple IAP products query returned no results");
      return { skuList, iapCurrency: "" };
    }

    // 3. 更新商品价格
    const { updatedSkuList, iapCurrency } = updateDetailPrices(skuList, productInfosResult);

    return { skuList: updatedSkuList, iapCurrency };
  } catch (error) {
    console.error("iOS IAP price adaptation failed:", error);
    return { skuList, iapCurrency: "" };
  }
}
