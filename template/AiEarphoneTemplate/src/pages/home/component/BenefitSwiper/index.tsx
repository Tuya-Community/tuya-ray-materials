/*
 * @Author: hkc
 * @Date: 2025-09-17 19:50:09
 * @LastEditors: hkc
 * @LastEditTime: 2026-06-03 21:52:26
 * @Description: 权益展示
 */
import React, { useMemo, useState } from 'react';
import { Swiper, View, SwiperItem, router } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';
import clsx from 'clsx';

import EllipsisText from '@/components/EllipsisText';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import { getProcessedBenefitList } from '../../util';
import Progress from './Progress';

import styles from './index.module.less';

// 卡片固定高度（rpx）：有进度条 232，无进度条 168，intro 占位卡 272
const CARD_HEIGHT_WITH_PROGRESS = 232;
const CARD_HEIGHT_NO_PROGRESS = 196;
const INTRO_CARD_HEIGHT = 272;

// 卡片背景：装饰图按原始尺寸（438×232rpx 不拉伸）贴右上角，叠在渐变之上，超出由卡片裁切；
// 图无 dark 版会回退 light，深浅色一致
const cardBgStyle: React.CSSProperties = {
  backgroundImage: `url(${Res.benefitCardBg}), linear-gradient(288deg, #92baff 3%, #2a7efc 97%)`,
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundSize: '438rpx 232rpx, 100% 100%',
  backgroundPosition: 'top right, center',
};

const Index = () => {
  const [current, setCurrent] = useState(0);
  const { benefits } = useSelector(state => state.shopInfo);
  const switchConfig = useSelector(state => state.uiState.switchConfig);

  // 权益列表
  const benefitList = useMemo(() => {
    const list = getProcessedBenefitList(benefits, false);
    const filteredList = list.filter(item => item.isShow);
    return filteredList;
  }, [benefits]);

  // 当前卡片高度（rpx）：无权益时为 intro 占位卡，否则按是否有进度条取固定值
  const swiperHeight = useMemo(() => {
    if (benefitList.length === 0) return INTRO_CARD_HEIGHT;
    return benefitList[current]?.showProgress ? CARD_HEIGHT_WITH_PROGRESS : CARD_HEIGHT_NO_PROGRESS;
  }, [benefitList, current]);

  // 权益卡片点击
  const handleCardClick = () => {
    if (!switchConfig?.vasList) return;
    router.push('/shop', { subpackage: 'pkgShop' });
  };

  // 介绍列表
  const introList = useMemo(() => {
    return [
      {
        title: Strings.getLang('benefit_intro_lang'),
        img: Res.introLangImg,
        imgName: 'introLangImg',
      },
      {
        title: Strings.getLang('benefit_intro_transfer'),
        img: Res.introTransferImg,
        imgName: 'introTransferImg',
      },
      {
        title: Strings.getLang('benefit_intro_share'),
        img: Res.introShareImg,
        imgName: 'introShareImg',
      },
      {
        title: Strings.getLang('benefit_intro_summary'),
        img: Res.introSummaryImg,
        imgName: 'introSummaryImg',
      },
    ];
  }, []);

  return (
    <View className={styles.container}>
      <Swiper
        className={styles.swiper}
        style={{
          height: `${swiperHeight}rpx`,
          transition: 'height 0.3s ease-in-out',
        }}
        dataSource={benefitList}
        current={current}
        onChange={event => {
          // @ts-ignore
          const current = event?.detail?.current;
          setCurrent(current);
        }}
      >
        {benefitList.length > 0 ? (
          <>
            {benefitList.map(item => (
              <SwiperItem
                key={`${item.scopeType}-${item.vasType}-${item.effectiveEndDate}-${item.title}`}
                style={{ width: '100%' }}
                className={styles.benefitSlide}
                onClick={handleCardClick}
              >
                <View className={styles.benefitItem} style={cardBgStyle}>
                  <View className={styles.header}>
                    <EllipsisText className={styles.title} text={item.title} numberOfLines={2} />
                    {item.buyButtonText && (
                      <Button customClass={styles.buyButton}>{item.buyButtonText}</Button>
                    )}
                  </View>
                  {/* 适用范围：标题下方 */}
                  <View className={styles.scope}>
                    <View className={styles.label}>{Strings.getLang('benefit_scope')}</View>
                    <View className={styles.separator}>|</View>
                    <View>{item.scope}</View>
                  </View>
                  {/* 进度条 + 左下角剩余时长 + 右下角过期时间 */}
                  <Progress
                    showProgress={item.showProgress}
                    totalMin={item.totalMin}
                    leftMin={item.leftMin}
                    vasType={item.vasType}
                    dateLabel={item.dateLabel}
                    effectiveEndDate={item.effectiveEndDate}
                    isExpired={item.isExpired}
                  />
                </View>
              </SwiperItem>
            ))}
          </>
        ) : (
          <SwiperItem className={styles.benefitSlide} onClick={handleCardClick}>
            <View className={clsx(styles.benefitItem, styles.introItem)} style={cardBgStyle}>
              <View className={styles.header}>
                <EllipsisText
                  className={styles.title}
                  text={Strings.getLang('benefit_intro_title')}
                  numberOfLines={2}
                />
                <Button customClass={styles.buyButton}>
                  {Strings.getLang('benefit_intro_buy')}
                </Button>
              </View>
              <View className={styles.intro}>
                {introList.map(item => (
                  <View key={item.imgName} className={styles.item}>
                    <View className={styles.imgWrapper}>
                      <ThemedImage
                        src={item.img}
                        className={styles.img}
                        imageName={item?.imgName}
                      />
                    </View>
                    <View className={styles.itemTitle}>{item.title}</View>
                  </View>
                ))}
              </View>
            </View>
          </SwiperItem>
        )}
      </Swiper>
      {benefitList.length > 1 && (
        <View className={styles.dots}>
          {benefitList.map((item, index) => (
            <View
              key={`${item.scopeType}-${item.vasType}-${item.effectiveEndDate}-${item.title}`}
              className={clsx(styles.dot, { [styles.active]: current === index })}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Index;
