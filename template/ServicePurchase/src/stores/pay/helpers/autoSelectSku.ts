import { IPeriodUnit } from "@/types";
import { SkuClientItem } from "@/types/sku";

export function computeAutoSelectSkuIndices(
  skuList: readonly SkuClientItem[],
  {
    autoYear = true,
    autoMonth = false,
  }: {
    autoYear?: boolean;
    autoMonth?: boolean;
  },
): { skuIndex: number; priceIndex: number } {
  let skuIndex = -1;
  let priceIndex = -1;

  if (autoMonth) {
    skuIndex = skuList.findIndex((item) => {
      if (priceIndex === -1) {
        priceIndex = item.priceList.findIndex(
          (priceItem) =>
            priceItem.periodUnit === IPeriodUnit.month &&
            priceItem.periodValue === 1 &&
            priceItem.canBuy,
        );
        return priceIndex !== -1;
      }
      return false;
    });
  } else if (autoYear) {
    skuIndex = skuList.findIndex((item) => {
      if (priceIndex === -1) {
        priceIndex = item.priceList.findIndex(
          (priceItem) => priceItem.periodUnit === IPeriodUnit.year && priceItem.canBuy,
        );
        return priceIndex !== -1;
      }
      return false;
    });
  }

  if (skuIndex === -1 && priceIndex === -1) {
    skuIndex = skuList.findIndex((item) => {
      if (priceIndex === -1) {
        priceIndex = item.priceList.findIndex(
          (priceItem) => !priceItem.isOneTime && priceItem.canBuy,
        );
        return priceIndex !== -1;
      }
      return false;
    });
  }

  if (skuIndex === -1 && priceIndex === -1) {
    skuIndex = skuList.findIndex((item) => {
      if (priceIndex === -1) {
        priceIndex = item.priceList.findIndex((priceItem) => priceItem.canBuy);
        return priceIndex !== -1;
      }
      return false;
    });
  }

  return { skuIndex, priceIndex };
}
