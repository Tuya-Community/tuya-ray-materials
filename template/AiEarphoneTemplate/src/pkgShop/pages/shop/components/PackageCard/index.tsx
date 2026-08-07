/*
 * @Author: hkc
 * @Date: 2025-09-22 14:55:49
 * @LastEditors: hkc
 * @LastEditTime: 2025-12-11 20:55:51
 * @Description: 套餐卡片
 */
import React, { useEffect, useMemo, useState } from 'react';
import { openInnerH5, View } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';

import EllipsisText from '@/components/EllipsisText';
import { useSelector } from '@/redux';
import { CURRENCY_MARK_MAP } from '@/constant';
import Strings from '@/i18n';
import { SkuItem } from '@/types/shop';

import styles from './index.module.less';

interface IProps {
  data: SkuItem;
}

const Index: React.FC<IProps> = ({ data }) => {
  const { AI_WEARABLE_BT } = useSelector(state => state.shopInfo);
  // 离线转写订阅
  const [subscribeOrder, setSubscribeOrder] = useState(null);

  useEffect(() => {
    if (!AI_WEARABLE_BT?.credentialList) return;
    // 获取月订阅商品
    const subscribeOrder = AI_WEARABLE_BT?.credentialList?.find(
      item => item?.order?.subscribeOrder
    );
    if (!subscribeOrder) return;
    setSubscribeOrder(subscribeOrder);
  }, [AI_WEARABLE_BT]);

  // 价格对象
  const priceObj = useMemo(() => data?.skuList?.[0]?.priceList?.[0], [data]);
  // 是否是订阅
  const isSubs = useMemo(() => data?.skuList?.[0]?.priceList[0]?.optionType === 2, [data]);

  // 是否禁用
  const isDisabled = useMemo(
    () =>
      subscribeOrder?.order?.commodityCode === data.commodityCode && subscribeOrder?.state === 2,
    [data, subscribeOrder]
  );

  return (
    <View className={styles.container} style={{ opacity: isDisabled ? 0.5 : 1 }}>
      <View>
        <EllipsisText className={styles.title} text={data?.title} numberOfLines={2} />
        {isSubs && <EllipsisText className={styles.subTitle} text={data?.subTitle} />}
      </View>
      <View className={styles.bottom}>
        <View className={styles.price}>
          <View className={styles.currency}>
            {CURRENCY_MARK_MAP[priceObj?.currency] || priceObj?.currency}
          </View>
          {priceObj?.price}
        </View>
        <Button
          customClass={styles.button}
          onClick={() => {
            if (isDisabled) return;
            openInnerH5({ url: data?.commodityUrl });
          }}
        >
          {isSubs ? Strings.getLang('shop_subscribe') : Strings.getLang('shop_buy')}
        </Button>
      </View>
    </View>
  );
};

export default Index;
