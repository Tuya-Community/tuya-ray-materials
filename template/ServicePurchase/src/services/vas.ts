/**
 * @file services/vas.ts
 * @brief Value-added service (VAS) API layer for mall / product / order flow.
 *
 * Thin wrapper over the `@tuya-miniapp/cloud-api` SDK with mock passthrough:
 * when `CATEGORY_CODE === "MOCK_CATEGORY_CODE"` the fixture from
 * `./vas.mock-data` is returned instead of hitting the SDK, preserving the
 * template's no-backend demo mode. Otherwise the SDK is called directly and its
 * raw result / rejection propagate unchanged — call sites own error handling
 * (the Highway fail payload nests `errorMsg` under `innerError`).
 *
 * Input params use cloud-api's own types verbatim, including its
 * VasBindingObjectType / VasPaymentScope / VasPaymentOS enums. Results stay as
 * the project's client-facing types, which carry fields cloud-api's result
 * types omit (SKU `initialDiscount*`, `GetSkuPaymentResult.alternativePaidConfigList`,
 * `PaidConfig.paidProvider`).
 */

import {
  getCredentialList as sdkGetCredentialList,
  getVasSpuList as sdkGetVasSpuList,
  getMallInfoV2 as sdkGetMallInfoV2,
  getSkuListV2 as sdkGetSkuListV2,
  getSkuPayment as sdkGetSkuPayment,
  createOrderV2 as sdkCreateOrderV2,
  getPrepay as sdkGetPrepay,
} from "@tuya-miniapp/cloud-api";
import type {
  GetCredentialListParams,
  GetVasSpuListParams,
  GetMallInfoV2Params,
  GetSkuListV2Params,
  GetSkuPaymentParams,
  CreateOrderV2Params,
  GetPrepayParams,
  GetVasSpuListResult,
} from "@tuya-miniapp/cloud-api";
import { CATEGORY_CODE } from "@/constants";
import { PaidConfig } from "@/types";
import { MallInfo, SkuItem } from "@/types/sku";
import { VasCredential } from "@/types/credential";
import { MockKey, MOCK_RESPONSES } from "./vas.mock-data";

/**
 * Re-export cloud-api's payment enums so call sites depend on the service layer
 * rather than the SDK package directly. `bindingObjectType` / `paymentScopeCode`
 * / `os` on the param types above are typed as these.
 */
export { VasBindingObjectType, VasPaymentScope, VasPaymentOS } from "@tuya-miniapp/cloud-api";

const isMockMode = (): boolean => CATEGORY_CODE === "MOCK_CATEGORY_CODE";

/** Return a mock response in mock mode, otherwise undefined so the real SDK runs. */
function mockResult<T>(key: MockKey, body?: unknown): T | undefined {
  if (!isMockMode()) return undefined;
  const item = MOCK_RESPONSES[key];
  if (!item?.enable) return undefined;
  return (
    typeof item.response === "function"
      ? (item.response as (b: unknown) => unknown)(body)
      : item.response
  ) as T;
}

/* --------------------------------- mall --------------------------------- */

/** 根据绑定对象和服务分类查询商城信息（商城、店铺、站点、币种）。 */
export async function getMallInfo(params: GetMallInfoV2Params): Promise<MallInfo> {
  const mock = mockResult<MallInfo>(MockKey.GetMallInfo, params);
  if (mock !== undefined) return mock;
  return sdkGetMallInfoV2(params);
}

/* ------------------------------ credential ------------------------------ */

/** 查看某个增值服务是否已开通以及剩余额度。 */
export async function getCredentialList(params: GetCredentialListParams): Promise<VasCredential[]> {
  const mock = mockResult<VasCredential[]>(MockKey.GetCredentialList, params);
  if (mock !== undefined) return mock;
  return sdkGetCredentialList(params) as Promise<VasCredential[]>;
}

/* --------------------------------- spu ---------------------------------- */

/** 获取服务对应的商品（SPU）列表。 */
export async function getVasSpuList(params: GetVasSpuListParams): Promise<GetVasSpuListResult> {
  const mock = mockResult<GetVasSpuListResult>(MockKey.GetVasSpuList, params);
  if (mock !== undefined) return mock;
  return sdkGetVasSpuList(params);
}

/* --------------------------------- sku ---------------------------------- */

/** 查询指定商城下的商品规格（SKU）列表。 */
export async function getSkuList(params: GetSkuListV2Params): Promise<SkuItem[]> {
  const mock = mockResult<SkuItem[]>(MockKey.GetSkuList, params);
  if (mock !== undefined) return mock;
  return sdkGetSkuListV2(params) as unknown as Promise<SkuItem[]>;
}

/* ----------------------------- sku payment ------------------------------ */

export interface SkuPaymentInfoItem {
  appleIapId?: string;
  googleIapId?: string;
}

/** 查询 SKU 支付信息结果（比 cloud-api 类型多了 IAP 相关字段，后端实际返回）。 */
export interface GetSkuPaymentResult {
  paidConfigList: PaidConfig[];
  skuPaymentInfoList?: SkuPaymentInfoItem[];
  alternativePaidConfigList?: PaidConfig[];
}

/** 查询指定 SKU 的支付信息与可用支付渠道（terminal:'AppH5' 由 SDK 注入）。 */
export async function getSkuPayment(params: GetSkuPaymentParams): Promise<GetSkuPaymentResult> {
  const mock = mockResult<GetSkuPaymentResult>(MockKey.GetSkuPayment, params);
  if (mock !== undefined) return mock;
  return sdkGetSkuPayment(params) as Promise<GetSkuPaymentResult>;
}

/* ----------------------------- create order ---------------------------- */

export interface CreateOrderResult {
  orderId: string;
  amountOrigin?: number;
  amountTrade?: number;
}

/** 在指定商城创建增值服务订单（terminal:'Miniapp' 由 SDK 注入）。 */
export async function createOrder(params: CreateOrderV2Params): Promise<CreateOrderResult> {
  const mock = mockResult<CreateOrderResult>(MockKey.CreateOrder, params);
  if (mock !== undefined) return mock;
  return sdkCreateOrderV2(params);
}

/* -------------------------------- prepay -------------------------------- */

export interface GetPrepayResult {
  orderId?: string;
  paymentUrl: string;
  preFlowCode: string;
  ext?: Record<string, unknown>;
}

/** 发起订单预支付，获取支付页面信息。 */
export async function getPrepay(params: GetPrepayParams): Promise<GetPrepayResult> {
  const mock = mockResult<GetPrepayResult>(MockKey.GetPrepay, params);
  if (mock !== undefined) return mock;
  return sdkGetPrepay(params);
}
