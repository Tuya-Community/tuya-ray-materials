import { PaymentItem, PaidConfig } from "@/types";
import { payChannelConfig } from "@/constants";

export function convertPaidConfigList(
  list: PaidConfig[],
  info: { appleIapId?: string; googleIapId?: string } | undefined,
): PaymentItem[] {
  const items: PaymentItem[] = [];
  if (!list) {
    return items;
  }

  list.forEach((item) => {
    const config = payChannelConfig[item.paidProviderName];
    if (config) {
      if (item.paidProviderName === "apple_iap_pay") {
        if (info?.appleIapId) {
          items.push({
            paymentProvider: item.paidProviderName,
            paymentType: item.paidTypeName,
            iapCode: info.appleIapId,
            icon: config.icon,
            text: config.text,
            sub: [],
          });
        }
      } else if (item.paidProviderName === "google_iap_pay") {
        if (info?.googleIapId) {
          items.push({
            paymentProvider: item.paidProviderName,
            paymentType: item.paidTypeName,
            iapCode: info.googleIapId,
            icon: config.icon,
            text: config.text,
            sub: [],
          });
        }
      } else if (item.paymentMethods?.length) {
        const [method, ...rest] = item.paymentMethods;
        items.push({
          paymentProvider: item.paidProviderName,
          paymentType: item.paidTypeName,
          iapCode: "",
          icon: method.icon,
          text: method.name,
          sub: rest.map(({ icon, name, code }) => ({
            icon,
            text: name,
            code,
          })),
        });
      } else {
        items.push({
          paymentProvider: item.paidProviderName,
          paymentType: item.paidTypeName,
          iapCode: "",
          icon: config.icon,
          text: config.text,
          sub: [],
        });
      }
    }
  });
  return items;
}
