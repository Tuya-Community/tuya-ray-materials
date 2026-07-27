// IAP价格适配相关类型定义

export const MICROS_TO_CENTS_RATIO = 10000;
export const MICROS_TO_YUAN_RATIO = 1000000;
export const SUBSCRIPTION_OPTION_TYPE = 2;

// Google Play查询结果类型定义
export interface GooglePlayPriceInfo {
  priceAmountMicros: number;
  priceCode: string;
  price: string;
  billingPeriod: string;
  billingCycleCount?: number;
  recurrenceMode?: number;
}

export interface SubscriptionProduct {
  subscriptionOfferDetailList?: Array<{
    basePlanId: string;
    offerId?: string;
    offerToken?: string;
    offerTags?: string[];
    pricingPhases?: GooglePlayPriceInfo[];
  }>;
}

export interface QueryProductDetailsResult {
  productSubsMap?: Record<string, SubscriptionProduct>;
  productInAppMap?: Record<string, GooglePlayPriceInfo>;
}

export interface ProductItem {
  productId: string;
  subscription: number;
}

export interface AppIapOffer {
  offerId: string;
  type: "introductory" | "promotional" | "winBack";
  productId?: string;
}

export interface PriceUpdateInfo {
  googleIapId: string;
  priceInfo: GooglePlayPriceInfo;
  isSubscription: boolean;
  // Google Play offerToken
  offerToken?: string;
  offer?: AppIapOffer;
  // 优惠相关信息
  offerInfo?: {
    offerId: string;
    allPricingPhases: GooglePlayPriceInfo[];
    allOffers: Array<{
      offerId?: string;
      pricingPhases?: GooglePlayPriceInfo[];
    }>;
  };
}

export interface IapPriceAdapterOptions {
  skuList: any[];
}

export interface AdapterResult {
  skuList: any[];
  iapCurrency: string;
}

// iOS相关类型定义
export interface AppleProductOffer {
  offerId?: string;
  type: "introductory" | "promotional" | "winBack";
  price: number;
  displayPrice: string;
  period: string;
  periodUnit: "day" | "week" | "month" | "year";
  periodValue: number;
  periodCount: number;
  paymentMode: "payUpFront" | "payAsYouGo" | "freeTrial";
  eligible: boolean;
}

export interface AppleProductInfo {
  productId: string;
  price: number;
  displayPrice: string;
  currencyCode: string;
  periodUnit: "day" | "week" | "month" | "year";
  periodValue: number;
  period: string;
  introductoryOffer?: AppleProductOffer;
  promotionalOffers: AppleProductOffer[];
  winBackOffers: AppleProductOffer[];
}

export type AppleProductInfosResult = {
  result: Record<string, AppleProductInfo>;
};
