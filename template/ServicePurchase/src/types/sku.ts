export interface SkuItem {
  commodityCode: string;
  skuCode: string;
  extendSkuCode: string;
  skuName: string;
  priceList: VasPriceModel[];
}

export interface VasPriceModel {
  optionType: number;
  optionNo: number;
  periodType: number;
  periodUnit: number;
  periodValue: number;
  currency: string;
  price: number;
  originalPrice: number;
  marketingStrategy: MarketingStrategyModel;
}

export interface VasPriceClientModel extends VasPriceModel {
  optionName: string;
  originalPrice: number;
  price: number;
  currency: string;
  marketingStrategy: MarketingStrategyModel;
  periodUnit: number;
  periodValue: number;
  optionType: number;
  trialText: string;
  periodValueText: string;
  disCountText: string;
  cycelDiscountText: string;
  trialDiscountText: string;
  perMonthPrice: number;
  perMonthPeriodValueText: string;
  monthUnit: number;
  sign: string;
  isIapPay: boolean;
  isOneTime: boolean;
  canBuy: boolean;
}

export interface MarketingStrategyModel {
  periodNo: number;
  periodUnit: number;
  periodValue: number;
  orderNo: number;
  discountType: number;
  discount: number;
  initialDiscount: number;
  initialDiscountCycle: number;
  initialDiscountType: number;
  googleIapId: string;
  appleIapId: string;
}

export interface SkuClientItem extends SkuItem {
  priceList: VasPriceClientModel[];
}

export interface MallInfo {
  mallCode: string;
  siteCode: string;
  shopCode: string;
  currency: string;
}
