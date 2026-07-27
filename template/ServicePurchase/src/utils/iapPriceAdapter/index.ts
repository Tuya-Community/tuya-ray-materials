import { canAdaptIapPrice, getDeviceType, hasIapProducts } from "./utils";
import { adaptIapPriceForAndroid } from "./googlePlay";
import { adaptIapPriceForIOS } from "./ios";
import type { IapPriceAdapterOptions, AdapterResult } from "./types";

export async function adaptIapPrice(options: IapPriceAdapterOptions): Promise<AdapterResult> {
  const { skuList } = options;

  if (!canAdaptIapPrice() || !hasIapProducts(skuList)) {
    return { skuList, iapCurrency: "" };
  }

  const { isAndroid, isiOS } = getDeviceType();

  if (isAndroid) {
    return adaptIapPriceForAndroid(options);
  }

  if (isiOS) {
    return adaptIapPriceForIOS(options);
  }

  return { skuList, iapCurrency: "" };
}

export { hasIapProducts } from "./utils";
export type { IapPriceAdapterOptions, AdapterResult } from "./types";
