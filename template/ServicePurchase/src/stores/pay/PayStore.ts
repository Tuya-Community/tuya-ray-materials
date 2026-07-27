/**
 * @file PayStore.ts
 * @brief Central payment store: SKU fetch, IAP init, order creation, payment flow.
 * @note This file stays above 500 lines on purpose: third-party and IAP payment
 *       orchestration is kept in one place for easier regression review. Pure
 *       formatting and SKU selection live under ./helpers/.
 */

import { hookstate } from "@hookstate/core";
import { PaymentItem, IapResult, PaymentScopeEnum } from "@/types";
import { SkuClientItem, MallInfo } from "@/types/sku";
import { getIapInfo, iapPayReady, isNeedIapPayment, startIapPay } from "@/utils/payment";
import { adaptIapPrice } from "@/utils/iapPriceAdapter";
import { getAppInfo, getCurrentHomeId, isAndroid } from "@/utils";
import { goToPay, routerBackClose } from "@/utils/navigate";
import {
  getMallInfo,
  getSkuList,
  getSkuPayment,
  createOrder,
  getPrepay,
  VasPaymentScope,
  VasPaymentOS,
  VasBindingObjectType,
} from "@/services/vas";
import { CATEGORY_CODE, miniAppId, IAPTypeConfig, paymentScopeCode } from "@/constants";
import { IAP_SUCCESS_BACK_DELAY_MS } from "@/constants/pay";
import { formatHomeName } from "./helpers/formatHomeName";
import { formatSkuListItems } from "./helpers/formatSkuList";
import { convertPaidConfigList } from "./helpers/convertPaymentList";
import { computeAutoSelectSkuIndices } from "./helpers/autoSelectSku";

interface PayState {
  startTime: number;
  intervalId: number | null;
  openMore: boolean;
  iapCurrency: string;
  priceLoaded: boolean;
  categoryCode: string;
  homeId: string;
  homeName: string;
  appId: string;
  appScheme: string;
  appEnv: number;
  appVersion: string;
  appBundleId: string;
  language: string;
  mallInfo: MallInfo;
  skuList: SkuClientItem[];
  selectedSkuIndex: {
    skuIndex: number;
    priceIndex: number;
  };
  showPayChannel: boolean;
  currentPayChannelIndex: number;
  orderId: string;
  paymentUrl: string;
  domain: string;
  exchangeUrl: string;
  payLoading: boolean;
  regionCode: string;
  iapType: number;
  iapReady: boolean;
  payConfigList: PaymentItem[];
  alternativePay: {
    userOrderId: string;
    enabled: boolean;
    token: string;
    list: PaymentItem[];
  };
  orderDetailUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
}

const initialPayState: PayState = {
  startTime: Date.now(),
  intervalId: null,
  openMore: false,
  iapCurrency: "",
  priceLoaded: false,
  categoryCode: CATEGORY_CODE,
  homeId: "",
  homeName: "",
  appId: "",
  appScheme: "",
  appEnv: 2, // 0=daily 1=pre-release 2=production
  appVersion: "",
  appBundleId: "",
  language: "en",
  mallInfo: {
    mallCode: "",
    siteCode: "",
    shopCode: "",
    currency: "",
  },
  skuList: [],
  selectedSkuIndex: {
    skuIndex: -1,
    priceIndex: -1,
  },
  showPayChannel: false,
  currentPayChannelIndex: 0,
  orderId: "",
  paymentUrl: "",
  domain: "",
  exchangeUrl: "",
  payLoading: false,
  regionCode: "",
  iapType: IAPTypeConfig.ThirdParty,
  iapReady: false,
  payConfigList: [],
  alternativePay: {
    userOrderId: "",
    enabled: false,
    token: "",
    list: [],
  },
  orderDetailUrl: "",
  termsOfServiceUrl: "",
  privacyPolicyUrl: "",
};

const payState = hookstate(initialPayState);

class PayStore {
  private state: typeof payState;

  constructor(state: typeof payState) {
    this.state = state;
  }

  get data() {
    return this.state.value;
  }

  currentSku() {
    const list = this.state.skuList.get({ noproxy: false });
    return list[this.data.selectedSkuIndex.skuIndex];
  }

  currentPrice() {
    const list = this.state.skuList.get({ noproxy: false });
    return list[this.data.selectedSkuIndex.skuIndex]?.priceList?.[
      this.data.selectedSkuIndex.priceIndex
    ];
  }

  /** Initialize product data: app info, mall info, IAP, then fetch SKU list */
  initProduct = async ({
    autoYear = false,
    autoMonth = false,
    refresh = false,
  }: {
    autoSelect?: boolean;
    autoMonth?: boolean;
    refresh?: boolean;
    autoYear?: boolean;
  } = {}) => {
    if (this.data.priceLoaded && !refresh) {
      return;
    }

    await Promise.allSettled([this.initAppInfo(), this.initMallInfo(), this.initIap()]);
    await this.fetchSkuList({ autoYear, autoMonth, isEntryRefresh: refresh });

    console.log("this.state", this.state);
  };

  initAppInfo = async () => {
    const appInfo = await getAppInfo();
    const { appScheme, appId, regionCode, appVersion, appBundleId, language, appEnv } =
      appInfo || {};

    this.state.appScheme.set(appScheme || "tuyasmartiot");
    this.state.appEnv.set(appEnv ?? initialPayState.appEnv);
    this.state.regionCode.set(regionCode);
    this.state.appId.set(appId);
    this.state.appVersion.set(appVersion);
    this.state.appBundleId.set(appBundleId);
    this.state.language.set(language);
  };

  async initIap() {
    if (paymentScopeCode === PaymentScopeEnum.ONLY_NON_IAP) {
      this.state.iapReady.set(false);
      this.state.iapType.set(IAPTypeConfig.ThirdParty);
      return;
    }

    let iapType = IAPTypeConfig.ThirdParty;

    try {
      const info = await getIapInfo();
      ({ iapType } = info);
    } catch (error) {
      console.warn("getIapInfo error:", error);
    }

    try {
      const { result: iapReady } = await iapPayReady(this.data.categoryCode);
      if (iapReady && isNeedIapPayment(iapType)) {
        this.state.iapReady.set(true);
        this.state.iapType.set(iapType);
      } else {
        this.state.iapReady.set(false);
        this.state.iapType.set(IAPTypeConfig.ThirdParty);
      }
    } catch (error) {
      console.warn("iapPayReady error:", error);
    }
  }

  async initMallInfo() {
    let mallInfo = null;
    try {
      mallInfo = await getMallInfo({
        bindingObjectType: VasBindingObjectType.MINI_APP,
        bindingObjectCode: miniAppId,
        catalogCode: this.data.categoryCode,
      });
    } catch (error) {
      console.error("initMallInfo error:", error);
    }
    this.state.mallInfo.set(mallInfo ?? initialPayState.mallInfo);
  }

  changeSkuPriceItem(skuIndex: number, priceIndex: number) {
    this.state.selectedSkuIndex.set({
      skuIndex,
      priceIndex,
    });
  }

  fetchSkuList = async ({
    autoYear = false,
    autoMonth = false,
    isEntryRefresh = false,
  }: {
    isEntryRefresh?: boolean;
    autoMonth?: boolean;
    autoYear?: boolean;
  } = {}) => {
    if (!this.data.mallInfo?.mallCode) {
      return;
    }

    getCurrentHomeId();
    try {
      const res = await getSkuList({
        catalogCode: this.data.categoryCode,
        mallCode: this.data.mallInfo.mallCode,
        siteCode: this.data.mallInfo.siteCode,
        shopCode: this.data.mallInfo.shopCode,
        currency: this.data.mallInfo.currency,
        bindingObjectType: VasBindingObjectType.MINI_APP,
        bindingObjectCode: miniAppId,
        bindingTags: [],
        iapType: this.data.iapType,
      });

      const iapRes = await adaptIapPrice({ skuList: res });

      const originList = (iapRes?.skuList || []).sort(
        (a, b) => a.priceList?.[0]?.periodUnit - b.priceList?.[0]?.periodUnit,
      );

      const skuList = formatSkuListItems(originList);

      this.state.iapCurrency.set(iapRes?.iapCurrency);
      this.state.skuList.set(skuList);
      if (!isEntryRefresh) {
        this.autoSelectSku({ autoMonth, autoYear });
      }
      this.state.priceLoaded.set(true);
    } catch (err) {
      console.error("fetchSkuList error", err);
    }
  };

  getOrderId = async (isIap: boolean) => {
    const selectSku = this.currentSku();
    const priceItem = this.currentPrice();
    let { currency } = this.data.mallInfo;
    if (this.data.iapCurrency && isIap) {
      currency = this.data.iapCurrency;
    }

    const res = await createOrder({
      mallCode: this.data.mallInfo.mallCode,
      siteCode: this.data.mallInfo.siteCode,
      paymentScopeCode: isIap ? VasPaymentScope.ONLY_IAP : VasPaymentScope.ONLY_NON_IAP,
      orderItemList: [
        {
          skuCode: selectSku.skuCode,
          quantity: 1,
          optionType: priceItem.optionType as 0 | 2, // 0=one-time 2=subscription
          optionNo: priceItem.optionNo,
          trial: false,
        },
      ],
      currency,
      groupId: this.data.homeId,
    }).catch((error) => {
      const detail = error?.innerError || error;
      if (detail?.errorMsg) {
        ty.showToast({
          title: detail.errorMsg,
          icon: "error",
        });
      }
      this.state.payLoading.set(false);
      throw error;
    });

    this.state.orderId.set(res?.orderId);
    return res?.orderId;
  };

  async buyByIap() {
    const selectSku = this.currentSku();
    const priceItem = this.currentPrice();
    if (!priceItem) return;

    if (this.data.payLoading) {
      return;
    }

    this.state.payLoading.set(true);

    let { currency } = this.data.mallInfo;
    if (this.data.iapCurrency) {
      currency = this.data.iapCurrency;
    }

    const res = await getSkuPayment({
      mallCode: this.data.mallInfo.mallCode,
      shopCode: this.data.mallInfo.shopCode,
      siteCode: this.data.mallInfo.siteCode,
      paymentScopeCode: VasPaymentScope.ONLY_IAP,
      os: isAndroid() ? VasPaymentOS.ANDROID : VasPaymentOS.IOS,
      skuCode: selectSku.skuCode,
      optionType: priceItem.optionType as 0 | 2,
      optionNo: priceItem.optionNo,
      quantity: 1,
      trial: false,
      currency,
      includeBetaPaidProvider: true,
    }).catch((error) => {
      const detail = error?.innerError || error;
      const message = detail.errMessage || detail.errorMsg || detail.message;
      if (message) {
        ty.showToast({
          title: message,
          icon: "none",
        });
      }

      this.state.payLoading.set(false);
      throw error;
    });

    const { paidConfigList = [], skuPaymentInfoList = [], alternativePaidConfigList = [] } = res;
    const info = skuPaymentInfoList[0];
    this.state.payConfigList.set(convertPaidConfigList(paidConfigList, info));
    this.state.alternativePay.set({
      userOrderId: "",
      enabled: false,
      token: "",
      list: convertPaidConfigList(alternativePaidConfigList, info),
    });
    this.state.currentPayChannelIndex.set(
      this.data.payConfigList.findIndex((item) => {
        return (
          item.paymentProvider === "apple_iap_pay" || item.paymentProvider === "google_iap_pay"
        );
      }),
    );
    if (this.data.currentPayChannelIndex >= 0) {
      await this.payNow(true);
    } else {
      this.state.payLoading.set(false);
    }
  }

  /** Purchase flow entry: routes to IAP or third-party payment */
  async buyNow() {
    const selectSku = this.currentSku();
    const priceItem = this.currentPrice();
    if (!priceItem) return;

    if (priceItem?.isIapPay && this.data.iapType !== IAPTypeConfig.ThirdParty) {
      await this.buyByIap();
      return;
    }

    if (this.data.payLoading) {
      return;
    }
    this.state.payLoading.set(true);
    this.state.startTime.set(Date.now());

    let { currency } = this.data.mallInfo;
    if (this.data.iapCurrency && priceItem?.isIapPay) {
      currency = this.data.iapCurrency;
    }

    const res = await getSkuPayment({
      mallCode: this.data.mallInfo.mallCode,
      shopCode: this.data.mallInfo.shopCode,
      siteCode: this.data.mallInfo.siteCode,
      paymentScopeCode: VasPaymentScope.ONLY_NON_IAP,
      os: isAndroid() ? VasPaymentOS.ANDROID : VasPaymentOS.IOS,
      skuCode: selectSku.skuCode,
      optionType: priceItem.optionType as 0 | 2,
      optionNo: priceItem.optionNo,
      quantity: 1,
      trial: false,
      currency,
      includeBetaPaidProvider: true,
    }).catch((error) => {
      const detail = error?.innerError || error;
      const message = detail.errMessage || detail.errorMsg || detail.message;
      if (message) {
        ty.showToast({
          title: message,
          icon: "none",
        });
      }
      this.state.payLoading.set(false);
      throw error;
    });

    const { paidConfigList = [], skuPaymentInfoList = [] } = res;
    const info = skuPaymentInfoList[0];
    this.state.payConfigList.set(convertPaidConfigList(paidConfigList, info));
    this.state.showPayChannel.set(true);
    this.state.payLoading.set(false);
  }

  handleCancel() {
    this.state.showPayChannel.set(false);
    this.state.currentPayChannelIndex.set(0);
    this.state.payLoading.set(false);
    this.state.orderId.set("");
    this.state.paymentUrl.set("");
  }

  initAlternativePay = async (userOrderId: string, token: string) => {
    this.state.alternativePay.set({
      ...this.data.alternativePay,
      userOrderId,
      enabled: true,
      token,
    });
    this.state.payConfigList.set(JSON.parse(JSON.stringify(this.data.alternativePay.list)));
    this.state.currentPayChannelIndex.set(0);
    this.state.showPayChannel.set(true);
  };

  getClientOptions = async () => {
    const { paymentProvider } = this.data.payConfigList[this.data.currentPayChannelIndex] || {};
    const { appBundleId } = await getAppInfo();
    const options: Record<string, string> = {};
    if (paymentProvider === "apple_iap_pay" && appBundleId) {
      options.packageName = appBundleId;
    }
    if (this.data.alternativePay?.token) {
      options.googleIapReportToken = this.data.alternativePay.token;
    }
    return options;
  };

  payNow = async (isIap: boolean) => {
    const clientOptions = await this.getClientOptions();
    const { paymentProvider, paymentType, iapCode } =
      this.data.payConfigList[this.data.currentPayChannelIndex] || {};

    this.state.payLoading.set(true);
    this.state.startTime.set(Date.now());

    const orderId = await this.getOrderId(isIap);

    const params = {
      shopCode: this.data.mallInfo.shopCode,
      mallCode: this.data.mallInfo.mallCode,
      siteCode: this.data.mallInfo.siteCode,
      orderId,
      os: isAndroid() ? VasPaymentOS.ANDROID : VasPaymentOS.IOS,
      clientInfo: clientOptions,
      returnPage: `/payment-center/miniapp-result?appscheme=${this.data.appScheme}`,
      expireUrl: `/payment-center/miniapp-expire?appscheme=${this.data.appScheme}`,
      cancelPage: `/payment-center/miniapp-expire?appscheme=${this.data.appScheme}`,
      paymentProvider,
      paymentType: paymentType,
      commodityRelateContactInfos: [
        {
          code: "3",
          value: JSON.stringify({
            groupId: this.data.homeId,
            groupName: formatHomeName(this.data?.homeName || ""),
          }),
        },
      ],
    };

    const result = await getPrepay(params).catch((error) => {
      const detail = error?.innerError || error;
      if (detail.errMessage || detail.errorMsg) {
        ty.showToast({
          title: detail.errMessage || detail.errorMsg,
          icon: "error",
        });
      }
      this.state.payLoading.set(false);
      throw error;
    });

    if (["apple_iap_pay", "google_iap_pay"].includes(paymentProvider)) {
      if (!iapCode) {
        ty.showToast({
          title: I18n.t("payment_method_unavailable"),
          icon: "none",
        });
        this.state.payLoading.set(false);
        return;
      }

      const iapParams = {
        isSubscribe: paymentType === "subscribe_pay",
        productId: iapCode,
        orderId,
        preFlowCode: result.preFlowCode,
      };
      const { code: iapResult, token } = await startIapPay(iapParams);

      if (iapResult === IapResult.IAP_ALT) {
        this.initAlternativePay(orderId, token ?? "");
        return;
      }

      switch (iapResult) {
        case IapResult.SUCCESS:
          ty.showToast({
            title: I18n.t("pay_success"),
            icon: "success",
          });

          setTimeout(() => {
            routerBackClose();
          }, IAP_SUCCESS_BACK_DELAY_MS);

          break;
        case IapResult.CANCEL:
          this.handleCancel();
          ty.showToast({
            title: I18n.t("tip_pay_fail"),
            icon: "error",
          });
          break;
        case IapResult.LIMIT:
        case IapResult.LIMIT2:
          this.handleCancel();
          break;
        case IapResult.NOT_SUPPORT:
          ty.showToast({
            title: I18n.t("payment_method_unavailable"),
          });
          break;
        case IapResult.ERROR:
        default:
          ty.showToast({
            title: I18n.t("tip_pay_fail"),
            icon: "error",
          });
          break;
      }

      this.state.payLoading.set(false);

      return;
    }

    this.state.paymentUrl.set(result.paymentUrl);
    this.state.payLoading.set(false);
    goToPay(orderId);
  };

  openPrivacyPolicy = async () => {
    if (!this.data.privacyPolicyUrl) {
      return;
    }
    ty.openInnerH5({ url: this.data.privacyPolicyUrl });
  };

  /** Auto-select a SKU: prefer yearly, then monthly, then first subscription, then any purchasable */
  autoSelectSku = ({
    autoYear = true,
    autoMonth = false,
  }: {
    autoYear?: boolean;
    autoMonth?: boolean;
  }) => {
    // noproxy:true returns the raw underlying array; hookstate's deep-readonly
    // Immutable<T> wrapper is narrower than reality here, so widen to the read-only view.
    const skuList = this.state.skuList.get({ noproxy: true }) as readonly SkuClientItem[];
    const { skuIndex, priceIndex } = computeAutoSelectSkuIndices(skuList, {
      autoYear,
      autoMonth,
    });
    this.changeSkuPriceItem(skuIndex, priceIndex);
  };
}

const payStore = new PayStore(payState);

export default payStore;
export { payState };
