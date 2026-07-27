import { IapResult, IapType } from "../types";
import { isAndroid } from "../utils";
import { IAPTypeConfig } from "@/constants";

interface IapPayParams {
  productId: string;
  orderId?: string;
  isSubscribe: boolean;
  preFlowCode: string;
}

export const startIapPay = async ({
  productId,
  orderId,
  isSubscribe,
  preFlowCode,
}: IapPayParams): Promise<{
  code: IapResult;
  token?: string;
  errorMsg?: string;
}> => {
  return new Promise<{ code: IapResult; errorMsg?: string; token?: string }>((resolve) => {
    const params = {
      productID: productId,
    } as any;

    if (preFlowCode) {
      params.preFlowCode = preFlowCode;
    } else {
      params.orderID = orderId;
    }

    if (isAndroid()) {
      params.subscription = isSubscribe ? 1 : 0;
    }

    if (!ty.iapPay) {
      resolve({ code: IapResult.NOT_SUPPORT });
      return;
    }
    try {
      ty.iapPay({
        ...params,
        success(res) {
          if (res.paymentType === 1) {
            resolve({
              code: IapResult.IAP_ALT,
              token: res.token,
            });
          } else {
            resolve({ code: IapResult.SUCCESS });
          }
        },
        fail(err) {
          const target = err.innerError || err;
          const code = +target.errorCode || IapResult.ERROR;
          const errorMsg = `${target.errorMsg || ""} code:${target.errorCode || "?"}`;
          resolve({ code, errorMsg });
        },
      });
    } catch (e) {
      resolve({ code: IapResult.ERROR, errorMsg: `${e}` });
    }
  });
};

export async function iapPayReady(_categoryCode: string): Promise<any> {
  if (!ty.iapPayReady) {
    return Promise.reject(new Error("当前版本不支持iapPayReady"));
  }
  return new Promise((resolve, reject) => {
    // 订阅与非订阅的 iapPayReady 区别：有附加条件验证， 订阅要google pay那边判断是否是支持订阅。
    const subscription = 0;
    ty.iapPayReady({
      subscription,
      success(res) {
        /**
         * iap是否准备就绪
         * true: 准备就绪, 可以支付
         */
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/**
 * 获取支付相关常量信息 >= BizKit 3.1.2
 * 获取支付方式
 * 目前仅Android可用
 * 0: 三方支付方式
 * 1: 苹果支付
 * 2: google支付
 */
export async function getIapInfo(): Promise<{ iapType: number }> {
  if (!ty.getIapInfo) {
    return Promise.reject(new Error("当前版本不支持getIapInfo"));
  }

  return new Promise((resolve, reject) => {
    ty.getIapInfo({
      success(res) {
        resolve({
          iapType: res?.iapType ?? 0,
        });
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/**
 * support iap
 */
export function isNeedIapPayment(iapType: number): boolean {
  return Boolean(iapType && +iapType !== IAPTypeConfig.ThirdParty);
}

export const getIapType = async (): Promise<IapType> => {
  return new Promise((resolve) => {
    try {
      ty.iapType({
        success(res) {
          if (!isAndroid()) {
            resolve(res.data);
          } else {
            // 0:三方支付; 1:苹果支付; 2:google支付; 3:google支付支持备选结算
            resolve([2, 3].includes(res.data) ? IapType.GOOGLE_PAY : IapType.OTHER_PAY);
          }
        },
        fail() {
          resolve(IapType.OTHER_PAY);
        },
      });
    } catch {
      resolve(IapType.OTHER_PAY);
    }
  });
};
