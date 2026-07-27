import React, { useState, useMemo } from "react";
import { View, Text, usePageEvent } from "@ray-js/ray";
import { lightVibrateShort, formatTime } from "@/utils";
import { Card, PrimaryBtn } from "@/components";
import { goToProductV1, goToProductV2 } from "@/utils/navigate";
import { getCredentialList } from "@/services/vas";
import { CATEGORY_CODE } from "@/constants";
import { VasCredential, CredentialState } from "@/types/credential";
import styles from "./index.module.less";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [credentialList, setCredentialList] = useState<VasCredential[]>([]);

  // 存在可用服务凭证
  const activeCredential = useMemo(() => {
    return credentialList.find(
      (credential) =>
        credential.state === CredentialState.IN_USE ||
        credential.state === CredentialState.PENDING_USE,
    );
  }, [credentialList]);

  usePageEvent("onShow", async () => {
    // 页面初始化时，获取会员信息
    const res = await getCredentialList({
      catalogCode: CATEGORY_CODE,
    });
    setCredentialList(res || []);
    setLoading(false);
  });

  return (
    <View className={styles.mainContent}>
      <Card padding="p-24-16" style={{ marginBottom: "24rpx" }}>
        <View className={styles.templateIntro}>
          <Text className={styles.templateIntroText}>{I18n.t("home.intro_template")}</Text>
          <Text className={styles.templateIntroText}>{I18n.t("home.intro_support")}</Text>
          <Text className={styles.templateIntroText}>{I18n.t("home.intro_preview")}</Text>
          <View className={styles.templateIntroActions}>
            <PrimaryBtn
              onClick={() => {
                lightVibrateShort();
                goToProductV1();
              }}
            >
              {I18n.t("home.style_case_1")}
            </PrimaryBtn>
            <PrimaryBtn
              onClick={() => {
                lightVibrateShort();
                goToProductV2();
              }}
            >
              {I18n.t("home.style_case_2")}
            </PrimaryBtn>
          </View>
        </View>
      </Card>
      <Card style={{ marginBottom: "24rpx" }}>
        <View className={styles.statusTitle}>{I18n.t("credential_status")}</View>
        {!!activeCredential && (
          <View className={styles.credentialInfo}>
            <View className={styles.infoItem}>
              {I18n.t("home.start_time")}：{formatTime(activeCredential.effectiveStartDate)}
            </View>
            <View className={styles.infoItem}>
              {I18n.t("home.end_time")}：{formatTime(activeCredential.effectiveEndDate)}
            </View>
            <View className={styles.infoItem}>
              {I18n.t("home.usage")}：{activeCredential.quotaUsage.usedQuantity}
            </View>
            <View className={styles.infoItem}>
              {I18n.t("home.remaining_usage")}：{activeCredential.quotaUsage.leftQuantity}
            </View>
          </View>
        )}
        {!activeCredential && !loading && (
          <View style={{ textAlign: "center", color: "var(--text-color-05)" }}>
            {I18n.t("home.service_inactive")}
          </View>
        )}
      </Card>
    </View>
  );
};

HomePage.displayName = "HomePage";

export default HomePage;
