import { localStorage } from "@/utils";

/**
 * Mock key per cloud-api value-added-service function.
 * Used as the lookup key in MOCK_RESPONSES so the service layer can return
 * fixture data when CATEGORY_CODE === "MOCK_CATEGORY_CODE".
 */
export enum MockKey {
  GetCredentialList = "getCredentialList",
  GetVasSpuList = "getVasSpuList",
  GetMallInfo = "getMallInfo",
  GetSkuList = "getSkuList",
  GetSkuPayment = "getSkuPayment",
  CreateOrder = "createOrder",
  GetPrepay = "getPrepay",
}

/** 单条 mock：enable 控制该 api 是否启用 mock，response 为完整响应或 (body) => response */
export interface ApiMockItem {
  enable: boolean;
  response: Record<string, any> | ((body: any) => Record<string, any>);
}

/** Mock table keyed by MockKey (one entry per cloud-api VAS function). */
export const MOCK_RESPONSES: Record<MockKey, ApiMockItem> = {
  [MockKey.GetMallInfo]: {
    enable: true,
    response: {
      currency: "USD",
      mallCode: "MOCK_M9kk1h",
      shopCode: "MOCK_Pd5lu",
      siteCode: "US",
    },
  },
  [MockKey.GetSkuList]: {
    enable: true,
    response: (_body: Record<string, any>): Record<string, any>[] => {
      return [
        {
          capability: {
            capabilityType: 2,
            catalogCode: "MOCK_ASSISTANT",
            externalCode: "mock_assistant_evqi7i6r7g2",
            meteringRule: {
              meteringType: 1,
              meteringUnit: 10,
              quota: 2000,
              quotaPeriodUnit: 0,
            },
            performanceRule: {
              consumeInCurrentMonth: false,
              consumeType: 1,
            },
          },
          commodityCode: "MOCK_pl3gkav5",
          extendSkuCode: "",
          priceList: [
            {
              currency: "USD",
              marketingStrategy: {
                appleIapId: "mock.aiassistant.basic",
                googleIapId: "mock.aiassistant.basic",
              },
              optionNo: 1,
              optionType: 2,
              originalPrice: 9.99,
              periodType: 1,
              periodUnit: 2,
              periodValue: 1,
              price: 9.99,
            },
          ],
          skuCode: "MOCK_aq2u644l73",
          skuName: "Monthly",
          skuPicList: [],
          subCapabilities: [],
        },
        {
          capability: {
            capabilityType: 2,
            catalogCode: "MOCK_ASSISTANT",
            externalCode: "mock_assistant_evqi7i6r7g2",
            meteringRule: {
              meteringType: 1,
              meteringUnit: 10,
              quota: 2000,
              quotaPeriodUnit: 0,
            },
            performanceRule: {
              consumeInCurrentMonth: false,
              consumeType: 1,
            },
          },
          commodityCode: "MOCK_pl3gkav5",
          extendSkuCode: "mock_y",
          priceList: [
            {
              currency: "USD",
              marketingStrategy: {
                appleIapId: "mock.aiassistant.basic.y",
                discount: 64,
                discountType: 0,
                googleIapId: "mock.aiassistant.basic.y",
                periodUnit: 3,
                periodValue: 7,
              },
              optionNo: 2,
              optionType: 2,
              originalPrice: 99.99,
              periodType: 1,
              periodUnit: 1,
              periodValue: 1,
              price: 36,
            },
          ],
          skuCode: "MOCK_aq2u644l74",
          skuName: "Yearly",
          skuPicList: [],
          subCapabilities: [],
        },
        {
          capability: {
            capabilityType: 2,
            catalogCode: "MOCK_ASSISTANT",
            externalCode: "mock_assistant_fg8x3gixi7n",
            meteringRule: {
              meteringType: 1,
              meteringUnit: 10,
              quota: 10000,
              quotaPeriodUnit: 0,
            },
            performanceRule: {
              consumeInCurrentMonth: false,
              consumeType: 1,
            },
          },
          commodityCode: "MOCK_pl3gkav5",
          extendSkuCode: "",
          priceList: [
            {
              currency: "USD",
              marketingStrategy: {
                appleIapId: "mock.aiassistant.plus",
                googleIapId: "mock.aiassistant.plus",
              },
              optionNo: 3,
              optionType: 2,
              originalPrice: 49.99,
              periodType: 1,
              periodUnit: 3,
              periodValue: 30,
              price: 49.99,
            },
          ],
          skuCode: "MOCK_dn710lb8r",
          skuName: "Pro",
          skuPicList: [],
          subCapabilities: [],
        },
        {
          capability: {
            meteringRule: {},
            performanceRule: {},
          },
          commodityCode: "MOCK_pl3gkav5",
          extendSkuCode: "",
          priceList: [],
          skuCode: "MOCK_h25ul40ly5w",
          skuName: "1000 credit",
          skuPicList: [],
          subCapabilities: [],
        },
        {
          capability: {
            meteringRule: {},
            performanceRule: {},
          },
          commodityCode: "MOCK_pl3gkav5",
          extendSkuCode: "",
          priceList: [],
          skuCode: "MOCK_h25ul40ly5x",
          skuName: "3500 credit",
          skuPicList: [],
          subCapabilities: [],
        },
        {
          capability: {
            meteringRule: {},
            performanceRule: {},
          },
          commodityCode: "MOCK_pl3gkav5",
          extendSkuCode: "",
          priceList: [],
          skuCode: "MOCK_h25ul40ly5y",
          skuName: "8000 credit",
          skuPicList: [],
          subCapabilities: [],
        },
      ];
    },
  },
  [MockKey.GetSkuPayment]: {
    enable: true,
    response: (_params: Record<string, any>): Record<string, any> => {
      return {
        amountOrigin: 3600,
        amountTrade: 3600,
        currency: "USD",
        missingContactInfos: [],
        paidConfigList: [
          {
            customName: "",
            paidCode: "mock-gf8wtcH6i-06713wTn",
            paidProvider: 4,
            paidProviderCode: "PPBRCOWRGI9ZWZ",
            paidProviderName: "stripe",
            paidType: 7,
            paidTypeCode: "PTBRCP7D9MZEV6",
            paidTypeName: "subscribe_pay",
          },
          {
            customName: "",
            paidCode: "mock-gf8wtcH6i-06713wTn",
            paidProvider: 3,
            paidProviderCode: "PPBRCOWRGI9ZWY",
            paidProviderName: "paypal",
            paidType: 7,
            paidTypeCode: "PTBRCP7D9MZEV6",
            paidTypeName: "subscribe_pay",
          },
        ],
        skuPaymentInfoList: [
          {
            appleIapId: "mock.aiassistant.basic.y",
            googleIapId: "mock.aiassistant.basic.y",
            optionNo: 2,
            optionType: 2,
            payModel: {
              initialDiscountType: 2,
              renewPeriodPay: {
                amountOrigin: 3600,
                amountTrade: 3600,
                periodUnit: 1,
                periodValue: 1,
              },
              trialPeriodPay: {
                amountOrigin: 3600,
                amountTrade: 0,
                periodUnit: 3,
                periodValue: 7,
              },
            },
            skuCode: "MOCK_aq2u644l74",
          },
        ],
        subscribePolicyCode: "MOCK_TPcuwg41f391rs",
        totalOriginalPrice: 9999,
      };
    },
  },
  [MockKey.CreateOrder]: {
    enable: true,
    response: (): Record<string, any> => {
      return {
        amountOrigin: 3600,
        amountTrade: 0,
        orderId: "MOCKSO26032569R0",
      };
    },
  },
  [MockKey.GetPrepay]: {
    enable: true,
    response: (): Record<string, any> => {
      return {
        orderId: "MOCKSO26032569R0",
        paymentUrl: "MOCK_PAYMENT_URL",
        preFlowCode: "MOCK_PRE_FLOW_CODE",
      };
    },
  },
  [MockKey.GetCredentialList]: {
    enable: true,
    response: (): Record<string, any>[] => {
      if (localStorage.getItem(localStorage.keys.mockPaySuccess) === "1") {
        return [
          {
            catalogCode: "MOCK_CATEGORY_CODE",
            externalCode: "mock_external_code",
            effectiveStartDate: 1699977600000,
            effectiveEndDate: 1731600000000,
            state: 2,
            usageState: "using",
            metering: {
              meteringType: 2,
              meteringUnit: 1,
              quotaPeriodUnit: 0,
              quota: 10000,
            },
            performance: {
              consumeType: 1,
              consumeInCurrentMonth: true,
            },
            quotaUsage: {
              leftQuantity: 9000,
              usedQuantity: 1000,
            },
            order: {
              orderId: "SO231109FCMS61A8",
              commodityCode: "CMd3lveqqhsu1d",
              skuCode: "SKbrxiiaqxkbj1",
              subscribeOrder: true,
            },
          },
        ];
      }

      return [];
    },
  },
  [MockKey.GetVasSpuList]: {
    enable: true,
    response: (): Record<string, any>[] => {
      return [
        {
          commodityCode: "MOCK_pl3gkav5",
          title: "AI Assistant",
          subTitle: "Value-added service demo",
          mainPicture: "",
          mallCode: "MOCK_M9kk1h",
          siteCode: "US",
          bindingTag: "",
          commodityUrl: "",
          targetUrlType: 1,
          requiredCheckoutParams: [],
        },
      ];
    },
  },
};
