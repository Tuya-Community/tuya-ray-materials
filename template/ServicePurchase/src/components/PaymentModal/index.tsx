import React, { forwardRef, useImperativeHandle } from "react";
import { View, Image } from "@ray-js/ray";
import { Popup, Button } from "@ray-js/smart-ui";
import { useHookstate } from "@hookstate/core";
import cls from "classnames";
import payStore, { payState } from "../../stores/pay";
import { getCurrencySignFromCode, lightVibrateShort } from "../../utils";
import Icon from "../Icon";

import styles from "./index.module.less";

export interface PaymentModalRef {
  buyNow: () => Promise<void>;
}

const PaymentModal = forwardRef((props, ref) => {
  const $pay = useHookstate(payState);
  const showPayChannel = $pay.showPayChannel.get();
  const currentPayChannelIndex = $pay.currentPayChannelIndex.get();
  const payConfigList = $pay.payConfigList.get({ noproxy: true });
  const payLoading = $pay.payLoading.get();

  const skuList = $pay.skuList.get({ noproxy: false });
  const { skuIndex, priceIndex } = $pay.selectedSkuIndex.get({
    noproxy: false,
  });
  const selectSku = skuList[skuIndex];
  const priceItem = selectSku?.priceList?.[priceIndex];

  useImperativeHandle(ref, () => ({
    buyNow: async () => {
      await payStore.buyNow();
    },
  }));

  const handleClose = () => {
    payStore.handleCancel();
  };

  const handlePayNow = async () => {
    lightVibrateShort();
    await payStore.payNow(false);
    $pay.showPayChannel.set(false);
  };

  const handleChangePayChannel = (index: number) => {
    if (currentPayChannelIndex === index) {
      return;
    }

    lightVibrateShort();
    $pay.currentPayChannelIndex.set(index);
  };

  return (
    <Popup
      show={showPayChannel}
      closeable
      round
      position="bottom"
      onClose={handleClose}
      safeAreaInsetBottom={false}
      lockScroll
    >
      <View className={styles.payChannel}>
        <View className={styles.payChannelDes}>
          <View className={styles.name}>{priceItem?.optionName || selectSku?.skuName}</View>
          <View className={styles.price}>
            {getCurrencySignFromCode(priceItem?.currency)}
            {priceItem?.price}
          </View>
        </View>
        <View className={styles.payChannelList}>
          {payConfigList.map((item, index) => (
            <View
              key={`${item.paymentProvider}-${item.paymentType}`}
              className={styles.payChannelListItem}
              onClick={() => handleChangePayChannel(index)}
            >
              <View className={styles.payChannelListItemFront}>
                <Image className={styles.payIcon} src={item.icon} />
                <View>
                  <View className={styles.payText}>{item.text}</View>
                  {item.sub.length > 0 && (
                    <View className={styles.paySub}>
                      {item.sub.map((subItem) => (
                        <Image
                          key={subItem.code}
                          className={styles.paySubItemIcon}
                          src={subItem.icon}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View
                className={cls(styles.selectedIcon, {
                  [styles.selected]: currentPayChannelIndex === index,
                })}
              >
                {currentPayChannelIndex === index ? (
                  <Icon type="check" size={16} color="#fff" noInverse />
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <Button
          className={`clickable-mini ${styles.payChannelBtn}`}
          type="primary"
          block
          size="large"
          round
          onClick={handlePayNow}
          loading={payLoading}
        >
          {I18n.t("pay_config_button")}
        </Button>
      </View>
    </Popup>
  );
});

export default PaymentModal;
