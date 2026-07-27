import React from "react";
import { View, Text } from "@ray-js/ray";
import { useHookstate } from "@hookstate/core";
import cls from "classnames";
import payStore, { payState } from "../../stores/pay";
import { getCurrencySignFromCode, lightVibrateShort } from "../../utils";
import Icon from "../../components/Icon";
import styles from "./SkuList.module.less";

const SkuList: React.FC = () => {
  const $pay = useHookstate(payState);
  const skuList = $pay.skuList.get({ noproxy: true });
  const { skuIndex, priceIndex } = $pay.selectedSkuIndex.get({ noproxy: true });

  const handleSkuSelect = (index: number, pindex: number) => {
    if (skuIndex !== index || priceIndex !== pindex) {
      lightVibrateShort();
      payStore.changeSkuPriceItem(index, pindex);
    }
  };

  return (
    <View className={styles.skuBox}>
      {skuList.map((skuItem, index) => {
        return (
          <View key={skuItem.skuCode}>
            {skuItem.priceList.map((item, pindex) => {
              const isSelected = skuIndex === index && priceIndex === pindex;
              const { disCountText, cycelDiscountText, trialDiscountText } = item || {};
              const showOriginalPrice =
                item?.originalPrice > 0 && item?.originalPrice > item?.price;
              const showPerMonthPrice = !!item?.perMonthPeriodValueText;

              return (
                <View
                  key={`${skuItem.skuCode}-${item.optionNo}`}
                  onClick={() => handleSkuSelect(index, pindex)}
                  className={cls("clickable-mini", styles.skuItemBorder, {
                    [styles.selected]: isSelected,
                  })}
                >
                  <View className={styles.skuItem}>
                    <View className={styles.itemContent}>
                      <View className={styles.itemLeft}>
                        <View className={styles.checkbox}>
                          {isSelected && <Icon type="check" size={11} color="#fff" />}
                        </View>
                        <View className={styles.leftContent}>
                          <View className={styles.skuTitle}>{item?.optionName || ""}</View>
                          {(showOriginalPrice || showPerMonthPrice) && (
                            <View className={styles.originPriceLine}>
                              {showOriginalPrice && (
                                <Text className={styles.originPrice}>
                                  {getCurrencySignFromCode(item.currency)}
                                  {item?.originalPrice}/{item?.periodValueText}
                                </Text>
                              )}
                              {item?.perMonthPeriodValueText && (
                                <Text className={styles.smallPrice}>
                                  {getCurrencySignFromCode(item.currency)}
                                  {item?.price || ""}/{item?.periodValueText}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                      <View className={styles.itemRight}>
                        <Text className={styles.sign}>
                          {getCurrencySignFromCode(item?.currency)}
                        </Text>
                        {item?.perMonthPeriodValueText ? (
                          <Text className={styles.price}>
                            {item?.perMonthPrice || ""}/{item?.perMonthPeriodValueText}
                          </Text>
                        ) : (
                          <Text className={styles.price}>
                            {item?.price || ""}/{item?.periodValueText}
                          </Text>
                        )}
                      </View>
                    </View>
                    {}
                  </View>
                  {(!!cycelDiscountText || disCountText || trialDiscountText) && (
                    <View className={styles.coner}>
                      {cycelDiscountText || disCountText || trialDiscountText}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default SkuList;
