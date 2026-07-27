/** 订单类型码 */
export enum OrderTypeCode {
  mall = "INT_OEM_APP_MALL", // 商城订单
  fuxi = "SERVICE_CONSUMPTION", // fuxi订单
}

export enum IapType {
  OTHER_PAY, // 三方支付方式
  APPLE_PAY, // 苹果支付
  GOOGLE_PAY, // google支付
}

export interface PaidConfig {
  paidProviderName: string;
  paidProvider: number;
  paidTypeName: string;
  paymentMethods?: {
    icon: string;
    name: string;
    code: string;
  }[];
}

export interface PaymentItem {
  paymentProvider: string;
  paymentType: string; // subscribe_pay、app_pay、cod
  iapCode?: string;
  icon: string;
  text: string;
  sub: {
    code: string;
    icon: string;
    text: string;
  }[];
}

export enum PaymentOS {
  ANDROID = 1,
  IOS = 2,
}

// 订阅状态
export const SubscriptionStatus = {
  cancelSubscribed: 3, // 用户取消
  subscription: 2, // 已订阅(已扣款)
  subscribedNotDebited: 1, // 订阅中(已激活未扣款)
  notSubscribed: 0, // 未订阅(立即开通)
};

// 1=年，2=月，3=天，4=星期
export enum IPeriodUnit {
  year = 1,
  month = 2,
  day = 3,
  week = 4,
}

export enum SubscriptionDuration {
  year = 1,
  month = 2,
  day = 3,
  week = 4,
  halfYear = 5,
  quarterYear = 6,
}

export enum IapResult {
  SUCCESS = 0, // 支付成功 (跳转支付成功结果页)
  CANCEL = 2001, // 用于取消了支付 (跳转支付失败结果页面)
  LIMIT = 2002, // 支付失败(比如，比如苹果规定同一商品组内，用户只能有一个订阅计划，此时用户在发起订阅就会返回 2002，此时不跳转结果页，停留在当前页面)
  LIMIT2 = 2005, // 支付失败(比如，比如苹果规定同一商品组内，用户只能有一个订阅计划，此时用户在发起订阅就会返回 2002，此时不跳转结果页，停留在当前页面)
  NOT_SUPPORT = 9998,
  ERROR = 9999,
  IAP_CODE_MISSED = 10001, // 支付接口没有返回 code
  IAP_ALT = 10002, // Google 支付使用备选结算
}

export enum IapReadyResult {
  NO_IAP,
  APPLE_IAP,
  GOOGLE_IAP,
}

export enum PaymentScopeEnum {
  ALL = 0,
  ONLY_IAP = 1,
  ONLY_NON_IAP = 2,
  AUTO_IAP = 99,
}

export type QueryProductDetailsResult = Record<
  string,
  {
    productSubsMap: Record<
      string,
      {
        subscriptionOfferDetailList: ProductSubscribeOfferDetails[];
      }
    >;
  }
>;

export enum RecurrenceMode {
  FINITE_RECURRING = 2, // 依照 billingCycleCount 订阅周期数，循环扣款
  INFINITE_RECURRING = 1, // 无限循环扣款直到取消
  NON_RECURRING = 3, // 不循环
}

export interface PricingPhase {
  price: string; // 原 formattedPrice 价格，当期周期的价格，包含币种符号
  priceCode: string; // 原 priceCurrencyCode，ISO4217 币种符号
  priceAmountMicros: number; // 1,000,000 micro-units equal one unit of the currency, For example, if price is "€7.99", price_amount_micros is "7990000". This value represents the localized, rounded price for a particular currency.
  billingPeriod: string; // 付款周期 ISO 8601, For example, P1W equates to one week, P1M equates to one month, P3M equates to three months, P6M equates to six months, and P1Y equates to one year.
  recurrenceMode: RecurrenceMode; // 订阅模式
  billingCycleCount: number; // 订阅周期数
}

export interface ProductSubscribeOfferDetails {
  basePlanId: string;
  offerId: string;
  offerToken: string; // 原 offerIdToken 用于下单时选择哪个购买选项，目前 IAP 只会传第一个
  offerTags: string[];
  // 先只取第一个
  pricingPhases: PricingPhase[];
}

export interface Credential {
  catalogCode: string;
  effectiveEndDate: number;
  effectiveStartDate: number;
  externalCode: string;
  metering: Record<string, unknown>;
  objectId: string;
  objectType: number;
  order: {
    commodityCode: string;
    orderId: string;
    skuCode: string;
    subscribeOrder: boolean;
  };
  performance: {
    consumeInCurrentMonth: boolean;
    consumeType: number;
  };
  state: CredentialState;
  usageState: string;
}

export enum CredentialState {
  // 待使用
  PENDING_USE = 1,
  // 使用中
  IN_USE,
  // 已使用
  USED,
  // 已过期
  EXPIRED,
}

export enum DiscountType {
  PERCENT, // 百分比抵扣
  AMOUNT, // 固定值抵扣
  FIXED_PRICE = 3, // 固定股买价格
}

// 会员等级代码
export enum MemberLevelCode {
  FREE = "FREE", // 免费
  PLUS = "PLUS", // PLUS 会员
}

// 计费时间单位
export enum BillTimeUnit {
  DAY = "day", // 按日
  MONTH = "month", // 按月
  YEAR = "year", // 按年
}

// 计费单位
export enum BillUnit {
  POINTS = "points", // 积分
  USAGE = "usage", // 按次
}

// 规则代码
export enum RuleCode {
  NEW_USER_GIFT = "NEW_USER_GIFT", // 新用户赠送
}

// 升级信息
export interface UpgradeInfo {
  levelCode: MemberLevelCode; // 会员等级
  externalCode: string; // 能力编码
}

// 额外规则
export interface ExtraRule {
  ruleCode: RuleCode; // 规则代码
  count: number; // 赠送次数/积分
}

// 权益摘要
export interface BenefitSummary {
  benefitName: string; // 权益名称
  benefitDesc?: string; // 权益描述，可为空
  used: number; // 已使用额度
  total: number; // 总额，-1代表无限
  beta: boolean; // 是否测试版
  billTimeUnit: BillTimeUnit; // 计费时间单位
  billUnit: BillUnit; // 计费单位
  extraRule?: ExtraRule; // 额外规则
}

// 会员信息
export interface MemberInfo {
  levelCode: MemberLevelCode; // 当前会员版本
  expirationTime: number; // 过期时间
  upgradeInfo: UpgradeInfo; // 升级信息
  benefitsSummary: BenefitSummary[]; // 权益摘要列表
}

export interface BenefitInfoByLevel {
  benefitsSummary: BenefitSummary[]; // 权益摘要列表
  benefitsDesc: string[]; // 权益描述列表
}
