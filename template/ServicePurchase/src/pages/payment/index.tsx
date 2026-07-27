/**
 * @file payment/index.tsx
 * @brief Payment page — renders a WebView for the payment gateway,
 *        or a mock payment UI when using MOCK_CATEGORY_CODE.
 */

import React, { useRef } from "react";
import { WebView, View, Button } from "@ray-js/components";
import { useHookstate } from "@hookstate/core";
import { payState } from "@/stores/pay";
import { routerBackClose } from "@/utils/navigate";
import { CATEGORY_CODE } from "@/constants";
import Card from "@/components/Card";
import { localStorage } from "@/utils";

interface WebViewMessageDetail {
  type: string;
  fnName?: string;
  fnParams?: { url: string };
}

interface WebViewMessage {
  detail: WebViewMessageDetail;
}

function Payment(): React.JSX.Element {
  const entered = useRef<boolean>(false);
  const $pay = useHookstate(payState);
  const payUrl = $pay.paymentUrl.get();

  const isMockData = CATEGORY_CODE === "MOCK_CATEGORY_CODE";

  const onWebViewMessage = async (message: WebViewMessage) => {
    const detail = message?.detail;
    const type = detail?.type;
    if (entered.current) return;

    if (type === "result") {
      entered.current = true;
      ty.showToast({
        title: I18n.t("pay_success"),
        icon: "success",
      });
      // Go back 2 pages: skip the product page and return to service detail
      routerBackClose(2);
    } else if (type === "expire") {
      entered.current = true;
      routerBackClose();
    } else if (type === "callBridgeFn") {
      const ALLOWED_BRIDGE_FNS = ["openUrlForceDefaultBrowser", "openURL"];
      if (!ALLOWED_BRIDGE_FNS.includes(detail.fnName)) {
        console.warn("Blocked bridge call:", detail.fnName);
        return;
      }
      if (detail.fnName === "openUrlForceDefaultBrowser" || detail.fnName === "openURL") {
        ty.openURL({ url: detail.fnParams?.url || "" });
      }
    }
  };

  const onLoadError = (e: unknown) => {
    console.error("WebView load error:", e);
  };

  const mockPaySuccess = () => {
    ty.showToast({
      title: I18n.t("pay_success"),
      icon: "success",
    });

    localStorage.setItem(localStorage.keys.mockPaySuccess, "1");

    routerBackClose(2);
  };

  const mockPayFail = () => {
    ty.showToast({
      title: I18n.t("pay_fail"),
      icon: "error",
    });

    if (localStorage.getItem(localStorage.keys.mockPaySuccess) === "1") {
      localStorage.removeItem(localStorage.keys.mockPaySuccess);
    }
    routerBackClose();
  };

  if (isMockData) {
    return (
      <View style={{ padding: "32rpx" }}>
        <Card>
          <View
            style={{
              fontSize: "32rpx",
              fontWeight: "bold",
              marginBottom: "16rpx",
            }}
          >
            {I18n.t("mock.environment")}
          </View>
          <View style={{ color: "var(--text-color-05)", marginBottom: "16rpx" }}>
            {I18n.t("mock.category_code_tip")}
          </View>
          <Button type="primary" onClick={mockPaySuccess}>
            {I18n.t("mock.pay_success")}
          </Button>
          <Button type="warn" onClick={mockPayFail}>
            {I18n.t("mock.pay_fail")}
          </Button>
        </Card>
      </View>
    );
  }

  return (
    <View
      style={{
        minHeight: "100vh",
      }}
    >
      <WebView src={payUrl} onError={onLoadError} onMessage={onWebViewMessage} />
    </View>
  );
}

Payment.displayName = "Payment";

export default Payment;
