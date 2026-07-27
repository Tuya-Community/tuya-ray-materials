import React from "react";
import { View, Text, Image } from "@ray-js/ray";
import cls from "classnames";
import { Icon, HeyLogo, FooterWrapper, PrimaryBtn } from "@/components";
import styles from "./index.module.less";

const ServiceInfo = (): React.JSX.Element => {
  const features = [
    {
      icon: require("@/static/img/features/hey_ty.png"),
      title: I18n.t("feat.hey_ty.title"),
    },
    {
      icon: require("@/static/img/features/smart_home.png"),
      title: I18n.t("feat.smart_home.title"),
    },
    {
      icon: require("@/static/img/features/ai_calories.png"),
      title: I18n.t("feat.ai_calories.title"),
    },
    {
      icon: require("@/static/img/features/ai_lens.png"),
      title: I18n.t("feat.ai_lens.title"),
    },
    {
      icon: require("@/static/img/features/voice_mode.png"),
      title: I18n.t("feat.voice_mode.title"),
    },
    {
      icon: require("@/static/img/features/web_search.png"),
      title: I18n.t("feat.web_search.title"),
    },
  ];

  return (
    <>
      <View className={styles.header}>
        <HeyLogo sizeRpx={128} style={{ marginBottom: "24rpx" }} />
        <View className={styles.title}>
          <View className={cls(styles.titleText, styles.titleTextPlus)}>
            {I18n.t("plus_title")}
          </View>
        </View>
      </View>

      <View className={styles.upgradeCard}>
        <View className={cls(styles.planBlock, styles.planFree)}>
          <Text className={styles.planLabel}>{I18n.t("level.free")}</Text>
          <View className={styles.planValueRow}>
            <Text className={styles.planValue}>30</Text>
          </View>
          <Text className={styles.planPeriod}>{I18n.t("credits_day")}</Text>
        </View>

        <View className={styles.planTransfer}>
          <View className={styles.planTransferBadge}>
            <Icon type="lineRight" size={20} color="#d0d0d0" noInverse />
          </View>
        </View>

        <View className={cls(styles.planBlock, styles.planPlus)}>
          <Text className={styles.planLabel}>{I18n.t("level.plus")}</Text>
          <View className={styles.planValueRow}>
            <Text className={styles.planValue}>2000</Text>
          </View>
          <Text className={styles.planPeriod}>{I18n.t("credits_month")}</Text>
        </View>
      </View>

      <View className={styles.cardTitle}>{I18n.t("feat_title")}</View>
      <View className={styles.featuresList}>
        {features.map((item) => (
          <View className={styles.featureItem} key={item.title}>
            <Image className={styles.featureIcon} src={item.icon} />
            <Text className={styles.featureTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

interface FooterProps {
  noProduct: boolean;
  handleBuyClick: () => void;
  payLoading: boolean;
  priceLoaded: boolean;
  BtnTextList: any[];
  BtnTips: React.ReactNode;
  openPrivacyPolicy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  noProduct,
  handleBuyClick,
  payLoading,
  priceLoaded,
  BtnTextList,
  BtnTips,
  openPrivacyPolicy,
}) => {
  return (
    <FooterWrapper>
      {BtnTips}
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
      <View className={styles.agreement}>
        <Text onClick={openPrivacyPolicy}>{I18n.t("privacy_policy")}</Text>
      </View>
    </FooterWrapper>
  );
};

export default ServiceInfo;
