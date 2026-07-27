import { IPeriodUnit, DiscountType } from "@/types";
import { VasPriceClientModel, SkuItem, SkuClientItem } from "@/types/sku";
import { getI18nHelper, getSubscriptionUnitText, isAndroid } from "@/utils";
import { getCurrencySignFromCode } from "@/utils/currency";
import { dateType, dateTypePlural } from "@/constants";

export function formatSkuListItems(items: SkuItem[]): SkuClientItem[] {
  const { t } = getI18nHelper();
  const formatPriceItem = (priceItem: any): VasPriceClientModel => {
    const {
      originalPrice,
      price,
      currency,
      marketingStrategy,
      periodUnit,
      periodValue,
      optionType,
    } = priceItem;
    let monthUnit = 1;
    let perMonthPrice = null;
    let perMonthPeriodValueText = null;
    const canBuy = true;

    const periodUnitText = dateType[periodUnit];
    const periodUnitPluralText = dateTypePlural[periodUnit];
    const periodValueText =
      periodValue > 1 ? `${periodValue}${periodUnitPluralText}` : periodUnitText;

    const {
      discountType,
      discount,
      initialDiscount,
      initialDiscountCycle,
      initialDiscountType,
      periodUnit: trialUnit,
      periodValue: trialValue,
    } = marketingStrategy || {};
    const trialUnitText = dateType[trialUnit];
    const trialUnitPluralText = dateTypePlural[trialUnit];
    const trialText = trialValue
      ? `${trialValue} ${trialValue > 1 ? trialUnitPluralText : trialUnitText}`
      : "";

    const trialDiscountText = trialText ? t("trialDiscountText", { trial: trialText }) : null;
    const fixPercent =
      originalPrice > price ? Math.floor(((originalPrice - price) / originalPrice) * 100) : 0;
    const discountValue = discountType === DiscountType.FIXED_PRICE ? fixPercent : discount;
    const showPercentDiscount = [DiscountType.PERCENT, DiscountType.FIXED_PRICE].includes(
      discountType,
    );
    const showFixedDiscount = discountType === DiscountType.AMOUNT;
    const fixPrice = `${getCurrencySignFromCode(currency)}${discount}`;
    const disCountText = showPercentDiscount
      ? `${t("discount_percent", { percent: discountValue })}`
      : showFixedDiscount
      ? `${t("discount_fixed", { price: fixPrice })}`
      : null;

    let cycelDiscountText = null;
    if (initialDiscountCycle) {
      const initialFixPrice = `${getCurrencySignFromCode(currency)}${initialDiscount}`;
      const text =
        initialDiscountType === 0
          ? `${t("discount_percent", { percent: initialDiscount })}`
          : `${t("discount_fixed", {
              price: initialFixPrice,
            })}`;
      cycelDiscountText =
        initialDiscountCycle > 1
          ? t("sub.planInitialDiscountTitle.plural", {
              discount: text,
              cycle: initialDiscountCycle,
            })
          : t("sub.planInitialDiscountTitle.single", {
              discount: text,
            });
    }

    if (priceItem.periodUnit === IPeriodUnit.month && priceItem.periodValue > 1) {
      monthUnit = priceItem.periodValue;
      perMonthPrice = (price / monthUnit).toFixed(2);
      perMonthPeriodValueText = `${dateType[IPeriodUnit.month]}`;
    } else if (priceItem.periodUnit === IPeriodUnit.year) {
      monthUnit = priceItem.periodValue * 12;
      perMonthPrice = (price / monthUnit).toFixed(2);
      perMonthPeriodValueText = `${dateType[IPeriodUnit.month]}`;
    }

    const isOneTime = optionType === 0;
    const subscriptionName = getSubscriptionUnitText(periodUnit, periodValue);

    return {
      ...priceItem,
      optionName: isOneTime ? t("sub.oneTime") : subscriptionName,
      isOneTime,
      canBuy,
      marketingStrategy,
      trialText,
      trialDiscountText,
      periodValueText,
      disCountText,
      cycelDiscountText,
      perMonthPrice,
      perMonthPeriodValueText,
      monthUnit,
      sign: getCurrencySignFromCode(priceItem.currency),
      isIapPay: isAndroid()
        ? !!priceItem?.marketingStrategy?.googleIapId
        : !!priceItem?.marketingStrategy?.appleIapId,
    };
  };

  return items.map((item) => ({
    ...item,
    priceList: item.priceList.map((priceItem) => formatPriceItem(priceItem)),
  }));
}
