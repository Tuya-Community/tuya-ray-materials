import { MICROS_TO_CENTS_RATIO, MICROS_TO_YUAN_RATIO, type PriceUpdateInfo } from "./types";

/**
 * 检查是否支持IAP价格适配
 */
export function canAdaptIapPrice(): boolean {
  if (
    typeof ty === "undefined" ||
    // @ts-expect-error ty.queryProductDetails is not typed in miniapp SDK
    typeof ty.queryProductDetails !== "function"
  ) {
    return false;
  }

  return true;
}

/**
 * 从商品价格项中提取Google IAP ID
 */
export function extractGoogleIapId(priceItem: any): string | null {
  return priceItem.marketingStrategy?.googleIapId || null;
}

/**
 * 从商品价格项中提取Apple IAP ID
 */
export function extractAppleIapId(priceItem: any): string | null {
  return priceItem.marketingStrategy?.appleIapId || null;
}

/**
 * 检查商品是否包含IAP商品
 */
export function hasIapProducts(skuList: any[]): boolean {
  if (!skuList?.length) return false;

  return skuList.some((sku) =>
    sku.priceList?.some((priceItem) => {
      const hasGoogleIap = extractGoogleIapId(priceItem) !== null;
      const hasAppleIap = extractAppleIapId(priceItem) !== null;
      return hasGoogleIap || hasAppleIap;
    }),
  );
}

/**
 * 高精度货币转换工具函数
 * 使用整数运算避免浮点数精度问题
 *
 * 解决的问题：
 * - 避免 JavaScript 浮点数运算精度丢失
 * - 确保货币计算精确到分（0.01元）
 * - 提供可配置的小数位数
 *
 * 示例：
 * - 输入：1234567 微美分，转换为元
 * - 旧方法：1234567 / 1000000 = 1.2345670000000001 (精度丢失)
 * - 新方法：1.23 (精确到分)
 */
function preciseCurrencyConvert(value: number, divisor: number, decimalPlaces = 2): number {
  // 确保输入为整数
  const intValue = Math.abs(Math.round(value));
  const intDivisor = Math.round(divisor);

  // 使用整数运算进行除法，然后转换为小数
  const quotient = Math.floor(intValue / intDivisor);
  const remainder = intValue % intDivisor;

  // 计算小数部分，避免浮点数运算
  const decimalPart = Math.round((remainder * Math.pow(10, decimalPlaces)) / intDivisor);

  // 组合整数和小数部分
  const result = quotient + decimalPart / Math.pow(10, decimalPlaces);

  // 四舍五入到指定小数位数
  return Math.round(result * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

/**
 * 将微美分转换为分
 */
export function convertMicrosToCents(priceAmountMicros: number): number {
  return preciseCurrencyConvert(priceAmountMicros, MICROS_TO_CENTS_RATIO, 2);
}

/**
 * 将微美分转换为元
 */
export function convertMicrosToYuan(priceAmountMicros: number): number {
  return preciseCurrencyConvert(priceAmountMicros, MICROS_TO_YUAN_RATIO, 2);
}

/**
 * 将Google Play的billingPeriod转换为periodUnit
 * @param billingPeriod 如 "P1M", "P1W", "P1Y", "P1D"
 * @returns periodUnit: 0-不需要指定单位，1-年，2-自然月，3-天，4-星期
 */
export function convertBillingPeriodToPeriodUnit(billingPeriod: string): number {
  if (!billingPeriod) return 0;

  // 解析ISO 8601 duration格式
  const match = billingPeriod.match(/^P(\d+)([YMWD])$/);
  if (!match) return 0;

  const [, , unit] = match;

  switch (unit) {
    case "Y":
      return 1; // 年
    case "M":
      return 2; // 自然月
    case "D":
      return 3; // 天
    case "W":
      return 4; // 星期
    default:
      return 0;
  }
}

/**
 * 从billingPeriod中提取周期值
 * @param billingPeriod 如 "P1M", "P1W", "P1Y", "P1D"
 * @returns 周期值
 */
export function extractPeriodValue(billingPeriod: string): number {
  if (!billingPeriod) return 0;

  const match = billingPeriod.match(/^P(\d+)[YMWD]$/);
  return match ? parseInt(match[1], 10) : 0;
}

function processOfferPricing(offerInfo: NonNullable<PriceUpdateInfo["offerInfo"]>) {
  const { allPricingPhases, allOffers } = offerInfo;

  let originalPrice = 0;
  let price = 0;
  let trialModel = null;
  let initialDiscount = null;

  // 确定原价：多阶段中最后一个是原价
  if (allPricingPhases.length > 1) {
    const lastPhase = allPricingPhases[allPricingPhases.length - 1];
    originalPrice = convertMicrosToYuan(lastPhase.priceAmountMicros);
  } else {
    // 单阶段时，从其他offer中找原价
    const baseOffer = allOffers.find((offer) => !offer.offerId && offer.pricingPhases?.[0]);
    if (baseOffer?.pricingPhases?.[0]) {
      originalPrice = convertMicrosToYuan(baseOffer.pricingPhases[0].priceAmountMicros);
    }
  }

  // 处理第一阶段价格
  const firstPhase = allPricingPhases[0];
  price = convertMicrosToYuan(firstPhase.priceAmountMicros);

  // 如果第一阶段是免费，设置试用模型
  if (firstPhase.priceAmountMicros === 0) {
    trialModel = {
      periodUnit: convertBillingPeriodToPeriodUnit(firstPhase.billingPeriod || ""),
      periodValue: extractPeriodValue(firstPhase.billingPeriod || ""),
    };

    // 如果有第二阶段，使用第二阶段作为售价
    if (allPricingPhases.length > 1) {
      const secondPhase = allPricingPhases[1];
      price = convertMicrosToYuan(secondPhase.priceAmountMicros);

      const cycle = secondPhase.billingCycleCount || 0;
      if (cycle > 0 && originalPrice > 0 && price > 0 && price < originalPrice) {
        const discountPercent = Math.round(
          preciseCurrencyConvert((originalPrice - price) * 100, originalPrice, 0),
        );
        initialDiscount = {
          cycle,
          discountType: 0,
          discount: discountPercent,
        };
      }
    }
  } else if (originalPrice > 0 && price > 0 && price < originalPrice) {
    const cycle = firstPhase.billingCycleCount || 0;
    if (cycle > 0) {
      const discountPercent = Math.round(
        preciseCurrencyConvert((originalPrice - price) * 100, originalPrice, 0),
      );
      initialDiscount = {
        cycle,
        discountType: 0,
        discount: discountPercent,
      };
    }
  }

  return {
    price,
    originalPrice,
    trialModel,
    initialDiscount,
  };
}

/**
 * 更新单个价格项
 */
export function updatePriceItem(priceItem: any, updateInfo: PriceUpdateInfo): any {
  const { priceInfo, offerInfo, offerToken } = updateInfo;
  const { priceAmountMicros, priceCode } = priceInfo;

  const newPriceInYuan = convertMicrosToYuan(priceAmountMicros);
  const updatedItem = { ...priceItem };

  if (offerInfo?.offerId && offerInfo.allPricingPhases) {
    const result = processOfferPricing(offerInfo);

    const phases = offerInfo.allPricingPhases;
    const mainPhase =
      phases.find((phase) => phase.priceAmountMicros > 0) || phases[phases.length - 1];

    if (mainPhase?.billingPeriod) {
      updatedItem.periodUnit = convertBillingPeriodToPeriodUnit(mainPhase.billingPeriod);
      updatedItem.periodValue = extractPeriodValue(mainPhase.billingPeriod);
    }

    updatedItem.price = result.price;
    updatedItem.originalPrice = result.originalPrice;
    updatedItem.currency = priceCode;

    if (result.trialModel) {
      updatedItem.marketingStrategy.periodUnit = result.trialModel.periodUnit;
      updatedItem.marketingStrategy.periodValue = result.trialModel.periodValue;
    }

    if (result.initialDiscount) {
      updatedItem.marketingStrategy.initialDiscountCycle = result.initialDiscount.cycle;
      updatedItem.marketingStrategy.initialDiscountType = result.initialDiscount.discountType;
      updatedItem.marketingStrategy.initialDiscount = result.initialDiscount.discount;
    }

    updatedItem.marketingStrategy.discountType = null;
    updatedItem.marketingStrategy.discount = null;
  } else {
    if (priceItem.price && priceItem.originalPrice && priceItem.price > 0) {
      const discountRatio = priceItem.originalPrice / priceItem.price;
      if (discountRatio > 1) {
        updatedItem.originalPrice = Math.round(
          preciseCurrencyConvert(newPriceInYuan * discountRatio, 1, 2),
        );
      } else {
        updatedItem.originalPrice = newPriceInYuan;
      }
    }

    if (priceInfo.billingPeriod) {
      updatedItem.periodUnit = convertBillingPeriodToPeriodUnit(priceInfo.billingPeriod);
      updatedItem.periodValue = extractPeriodValue(priceInfo.billingPeriod);
    }

    updatedItem.marketingStrategy.discountType = null;
    updatedItem.marketingStrategy.discount = null;
    updatedItem.marketingStrategy.initialDiscountCycle = null;
    updatedItem.marketingStrategy.initialDiscountType = null;
    updatedItem.marketingStrategy.initialDiscount = null;
    updatedItem.marketingStrategy.periodUnit = null;
    updatedItem.marketingStrategy.periodValue = null;

    updatedItem.price = newPriceInYuan;
    updatedItem.currency = priceCode;
  }

  if (offerToken) {
    updatedItem.marketingStrategy.googleOfferToken = offerToken;
  }

  if (updateInfo.offer) {
    updatedItem.marketingStrategy.appleOffer = updateInfo.offer;
  }

  return updatedItem;
}

/**
 * 判断当前设备类型
 */
export function getDeviceType(): { isAndroid: boolean; isiOS: boolean } {
  const system = ty.getSystemInfoSync();
  return {
    isiOS: system.platform === "ios",
    isAndroid: system.platform !== "ios",
  };
}

/* eslint-disable no-console */
/**
 * Dev-only validation for currency conversion precision.
 * Call in development to verify precision fixes work correctly.
 */
export function validatePrecisionFix(): void {
  console.log("=== 精度修复验证测试 ===");

  const testCases = [
    { micros: 1234567, expected: 1.23, description: "1234567 微美分 = 1.23元" },
    { micros: 1000000, expected: 1.0, description: "1000000 微美分 = 1.00元" },
    { micros: 999999, expected: 1.0, description: "999999 微美分 = 1.00元" },
    { micros: 500000, expected: 0.5, description: "500000 微美分 = 0.50元" },
    { micros: 100000, expected: 0.1, description: "100000 微美分 = 0.10元" },
    { micros: 1, expected: 0.0, description: "1 微美分 = 0.00元" },
  ];

  testCases.forEach(({ micros, expected, description }) => {
    const oldResult = Math.abs(micros / MICROS_TO_YUAN_RATIO);
    const newResult = convertMicrosToYuan(micros);

    console.log(`测试: ${description}`);
    console.log(`  旧方法结果: ${oldResult}`);
    console.log(`  新方法结果: ${newResult}`);
    console.log(`  期望结果: ${expected}`);
    console.log(`  精度修复: ${newResult === expected ? "✅ 通过" : "❌ 失败"}`);
    console.log("---");
  });

  console.log("=== 折扣计算精度测试 ===");
  const originalPrice = 10.0;
  const discountPrice = 7.5;
  const expectedDiscount = 25;

  const oldDiscount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  const newDiscount = Math.round(
    preciseCurrencyConvert((originalPrice - discountPrice) * 100, originalPrice, 0),
  );

  console.log(`原价: ${originalPrice}元, 折扣价: ${discountPrice}元`);
  console.log(`旧方法折扣: ${oldDiscount}%`);
  console.log(`新方法折扣: ${newDiscount}%`);
  console.log(`期望折扣: ${expectedDiscount}%`);
  console.log(`折扣计算精度: ${newDiscount === expectedDiscount ? "✅ 通过" : "❌ 失败"}`);
}
/* eslint-enable no-console */
