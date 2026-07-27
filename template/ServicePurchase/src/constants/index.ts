/**
 * @file constants/index.ts
 * @brief Business constants: category codes, payment channel configs,
 *        subscription period mappings, and IAP type definitions.
 */

import WECHAT_PAY_ICON from "@/static/img/payment/wechat.png";
import ALIPAY_ICON from "@/static/img/payment/alipay.png";
import PAYPAL_ICON from "@/static/img/payment/paypal.png";
import STRIPE_ICON from "@/static/img/payment/credit_card.png";
import GOOGLE_IAP_PAY_ICON from "@/static/img/payment/google_iap.svg";
import APPLE_IAP_PAY_ICON from "@/static/img/payment/apple_pay.png";
import OFFLINE_PAY_ICON from "@/static/img/payment/offline_pay.png";
import { IPeriodUnit, SubscriptionDuration, PaymentScopeEnum } from "@/types";

export const CATEGORY_CODE = "MOCK_CATEGORY_CODE";
export const miniAppId = "<YOUR-MINIAPP-ID>";
/**
 * Payment scope code
 * 0: All
 * 1: Only IAP
 * 2: Only non-IAP
 * 99: Auto IAP
 */
export const paymentScopeCode = PaymentScopeEnum.ONLY_NON_IAP;

export const payChannelConfig = {
  wechat_pay: {
    icon: WECHAT_PAY_ICON,
    text: I18n.t("index_wechat"),
  },
  alipay: {
    icon: ALIPAY_ICON,
    text: I18n.t("index_alipay"),
  },
  paypal: {
    icon: PAYPAL_ICON,
    text: I18n.t("index_paypal"),
  },
  stripe: {
    icon: STRIPE_ICON,
    text: I18n.t("index_stripe"),
  },
  google_iap_pay: {
    icon: GOOGLE_IAP_PAY_ICON,
    text: "Google Pay",
  },
  apple_iap_pay: {
    icon: APPLE_IAP_PAY_ICON,
    text: "Apple Pay",
  },
  offline_pay: {
    icon: OFFLINE_PAY_ICON,
    text: "COD",
  },
  wooshPay: {
    icon: "",
    text: "WooshPay",
  },
};

export const CANT_PAY_OTHERCOMMODITY = false;

export const IAPTypeConfig = {
  ThirdParty: 0,
  Apple: 1,
  Google: 2,
};

export const iapPaidProvider = {
  [IAPTypeConfig.Apple]: "apple_iap_pay",
  [IAPTypeConfig.Google]: "google_iap_pay",
};

export const paidType = "app_pay";

export const paidModelType = "ORDER_COMMODITY";

/** Subscription lifecycle states */
export const SubscriptionStatus = {
  cancelSubscribed: 3,
  subscription: 2,
  subscribedNotDebited: 1,
  notSubscribed: 0,
};

export const dateType = {
  [IPeriodUnit.year]: I18n.t("unit.year"),
  [IPeriodUnit.month]: I18n.t("unit.month"),
  [IPeriodUnit.day]: I18n.t("unit.day"),
  [IPeriodUnit.week]: I18n.t("unit.week"),
};

export const dateTypePlural = {
  [IPeriodUnit.year]: I18n.t("plural.years"),
  [IPeriodUnit.month]: I18n.t("plural.months"),
  [IPeriodUnit.day]: I18n.t("plural.days"),
  [IPeriodUnit.week]: I18n.t("plural.weeks"),
};

export const subscriptionUnitText = {
  [SubscriptionDuration.year]: I18n.t("sub.year"),
  [SubscriptionDuration.month]: I18n.t("sub.month"),
  [SubscriptionDuration.day]: I18n.t("sub.day"),
  [SubscriptionDuration.week]: I18n.t("sub.week"),
  [SubscriptionDuration.halfYear]: I18n.t("sub.halfYear"),
  [SubscriptionDuration.quarterYear]: I18n.t("sub.quarterYear"),
};
