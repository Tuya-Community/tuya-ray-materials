/**
 * @file product-v1/index.tsx
 * @brief Product page variant A — service-info focused layout with
 *        auto-select monthly plan and payment modal integration.
 */

import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { View, ScrollView, RichText } from "@ray-js/ray";
import { useHookstate } from "@hookstate/core";
import payStore, { payState } from "@/stores/pay";
import { lightVibrateShort, getI18nHelper } from "@/utils";
import { goToOrderCenter } from "@/utils/navigate";
import { HEADER_HEIGHT, NavBarPlus } from "@/components";
import PaymentModal, { PaymentModalRef } from "@/components/PaymentModal";
import { usePageShow, useSystemContext } from "@/hooks";
import ServiceInfo, { Footer } from "./ServiceInfo";
import styles from "./index.module.less";

const ProductV1: React.FC = () => {
  const { t } = getI18nHelper();
  const $pay = useHookstate(payState);
  const system = useSystemContext();
  const paymentModalRef = useRef<PaymentModalRef>(null);
  const priceLoaded = $pay.priceLoaded.get();
  const payLoading = $pay.payLoading.get();

  const skuList = $pay.skuList.get({ noproxy: true });
  const { skuIndex, priceIndex } = $pay.selectedSkuIndex.get({ noproxy: true });
  const selectSku = skuList[skuIndex];
  const priceItem = selectSku?.priceList?.[priceIndex];

  const noProduct = priceLoaded && !priceItem;

  useEffect(() => {
    const initData = async () => {
      await Promise.allSettled([
        payStore.initProduct({
          autoMonth: true,
        }),
      ]);
    };

    initData();
  }, []);

  usePageShow((first) => {
    if (!first) {
      payStore.fetchSkuList({
        autoMonth: true,
        isEntryRefresh: true,
      });
    }
  });

  const BtnTextListV2 = useMemo(() => {
    if (!priceLoaded) {
      return [];
    }

    if (noProduct) {
      return [
        {
          text: t("no_product"),
          className: styles.noProductText,
        },
      ];
    }

    const { trialText, isOneTime } = priceItem;

    if (isOneTime) {
      return [
        {
          text: t("buy.now"),
          className: styles.footerPrice,
        },
      ];
    }

    if (trialText) {
      return [
        {
          text: t("buy.trialBtnV2", { trial: trialText }),
          className: styles.footerPrice,
        },
      ];
    }

    return [
      {
        text: `${t("upgrade_now_btn")}`,
        className: styles.footerPrice,
      },
    ];
  }, [t, noProduct, priceItem, priceLoaded]);

  console.log("priceItem::", priceItem);

  const BtnTipsV2 = !priceItem ? null : (
    <RichText
      className={styles.footerTipsV2}
      nodes={
        priceItem?.trialText
          ? t("buy.trialBtnTipsV2", {
              trial: priceItem?.trialText || "",
              price: `${priceItem?.sign || ""}${priceItem?.price || ""}/${
                priceItem?.periodValueText || ""
              }`,
            })
          : t("buy.upgradeNowBtnTips", {
              price: `${priceItem?.sign || ""}${priceItem?.price || ""}/${
                priceItem?.periodValueText || ""
              }`,
            })
      }
    />
  );

  const onRightClick = useCallback((key) => {
    if (key === "order") {
      goToOrderCenter();
    }
  }, []);

  const handleBuyClick = () => {
    if (payLoading || !priceLoaded) {
      return;
    }

    lightVibrateShort();
    paymentModalRef.current?.buyNow();
  };

  return (
    <>
      <View className={styles.container}>
        <NavBarPlus
          navZIndex={100}
          rightIcons={[
            {
              key: "order",
              icon: "order",
            },
          ]}
          onRightClick={onRightClick}
        />
        <ScrollView className={styles.main} scrollY scrollWithAnimation hideScrollbar>
          <View
            className={styles.mainContent}
            style={{
              paddingTop: `${20 + HEADER_HEIGHT + system.statusBarHeight}px`,
            }}
          >
            <ServiceInfo />
          </View>
        </ScrollView>
        <Footer
          noProduct={noProduct}
          handleBuyClick={handleBuyClick}
          payLoading={payLoading}
          priceLoaded={priceLoaded}
          BtnTextList={BtnTextListV2}
          BtnTips={BtnTipsV2}
          openPrivacyPolicy={() => payStore.openPrivacyPolicy()}
        />
      </View>
      <PaymentModal ref={paymentModalRef} />
    </>
  );
};

ProductV1.displayName = "ProductV1";

export default ProductV1;
