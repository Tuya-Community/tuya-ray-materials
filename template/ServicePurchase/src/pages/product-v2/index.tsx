/**
 * @file product-v2/index.tsx
 * @brief Product page variant B — feature showcase + SKU list layout
 *        with auto-select yearly plan and payment modal integration.
 */

import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, ScrollView, Image } from "@ray-js/ray";
import { useHookstate } from "@hookstate/core";
import cls from "classnames";
import payStore, { payState } from "@/stores/pay";
import { lightVibrateShort, getI18nHelper } from "@/utils";
import { useSystemContext, usePageShow } from "@/hooks";
import PaymentModal, { PaymentModalRef } from "@/components/PaymentModal";
import { FooterWrapper, PrimaryBtn, HeyLogo, NavBarPlus, HEADER_HEIGHT } from "@/components";
import SkuList from "./SkuList";
import styles from "./index.module.less";

const ProductV2: React.FC = () => {
  const { t } = getI18nHelper();
  const $pay = useHookstate(payState);
  const system = useSystemContext();
  const paymentModalRef = useRef<PaymentModalRef>(null);
  const priceLoaded = $pay.priceLoaded.get();

  const skuList = $pay.skuList.get({ noproxy: false });
  const { skuIndex, priceIndex } = $pay.selectedSkuIndex.get({
    noproxy: false,
  });
  const selectSku = skuList[skuIndex];
  const priceItem = selectSku?.priceList?.[priceIndex];

  const payLoading = $pay.payLoading.get();

  const noProduct = priceLoaded && !priceItem;

  const features = [
    {
      icon: require("../../static/img/features/hey_ty.png"),
      title: I18n.t("feat.hey_ty.title"),
    },
    {
      icon: require("../../static/img/features/smart_home.png"),
      title: I18n.t("feat.smart_home.title"),
    },
    {
      icon: require("../../static/img/features/ai_calories.png"),
      title: I18n.t("feat.ai_calories.title"),
    },
    {
      icon: require("../../static/img/features/ai_lens.png"),
      title: I18n.t("feat.ai_lens.title"),
    },
    {
      icon: require("../../static/img/features/voice_mode.png"),
      title: I18n.t("feat.voice_mode.title"),
    },
    {
      icon: require("../../static/img/features/web_search.png"),
      title: I18n.t("feat.web_search.title"),
    },
  ];

  useEffect(() => {
    const initData = async () => {
      await payStore.initProduct({ autoMonth: false });
    };

    initData();
  }, []);

  usePageShow((first) => {
    if (!first) {
      payStore.fetchSkuList({
        autoMonth: false,
        isEntryRefresh: true,
      });
    }
  });

  const handleBuyClick = () => {
    if (payLoading || !priceLoaded) {
      return;
    }

    lightVibrateShort();
    paymentModalRef.current?.buyNow();
  };

  const BtnTextList = useMemo(() => {
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

    const { trialText, periodValueText, isOneTime, sign, price } = priceItem;

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
          text: t("buy.trialBtn", { trial: trialText }),
          className: styles.footerPrice,
        },
      ];
    }

    return [
      {
        text: `${t("start_at")} ${sign}${price}`,
        className: styles.footerPrice,
      },
      {
        text: `/ ${periodValueText}`,
        className: styles.footerUnit,
      },
    ];
  }, [t, noProduct, priceItem, priceLoaded]);

  const BtnTips = priceItem?.trialText ? (
    <Text className={styles.footerTips}>
      {t("buy.trialBtnTips", {
        trial: priceItem.trialText,
        price: `${priceItem?.sign}${priceItem?.price}/${priceItem.periodValueText}`,
      })}
    </Text>
  ) : null;

  return (
    <>
      <View className={styles.container}>
        <NavBarPlus navZIndex={100} />
        <ScrollView className={styles.main} scrollY scrollWithAnimation hideScrollbar>
          <View
            className={styles.mainContent}
            style={{
              paddingTop: `${20 + HEADER_HEIGHT + system.statusBarHeight}px`,
            }}
          >
            <View className={styles.header}>
              <HeyLogo sizeRpx={196} style={{ marginBottom: "56rpx" }} />
              <View className={styles.title}>
                <Text className={cls(styles.titleText, styles.titleUpto)}>
                  {I18n.t("p2.upgrade")}
                </Text>
                <View className={cls(styles.titleText, styles.titleTextPlus)}>
                  {I18n.t("p.plus")}
                </View>
              </View>
            </View>

            <View className={styles.listWrapper}>
              <View className={styles.list}>
                {features.map((item) => (
                  <View className={styles.listItem} key={item.title}>
                    <Image className={styles.itemIcon} src={item.icon} />

                    <Text className={styles.itemTitle}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </View>

            <SkuList />
          </View>
        </ScrollView>

        <FooterWrapper>
          <PrimaryBtn
            disabled={noProduct}
            onClick={handleBuyClick}
            loading={payLoading || !priceLoaded}
          >
            {BtnTextList.map((item) => (
              <Text className={item.className} key={item.text}>
                {item.text}
              </Text>
            ))}
          </PrimaryBtn>

          {BtnTips}
          <View className={styles.agreement}>
            <Text onClick={() => payStore.openPrivacyPolicy()}>{I18n.t("privacy_policy")}</Text>
          </View>
        </FooterWrapper>
      </View>
      <PaymentModal ref={paymentModalRef} />
    </>
  );
};

ProductV2.displayName = "ProductV2";

export default ProductV2;
