import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image } from '@ray-js/components';
import { router } from '@ray-js/ray';
import ThemedImage from '@/components/ThemedImage';
import { SummaryImageStatus } from '@/constant/enums';
import Strings from '@/i18n';
import Res from '@/res';
import { setPendingImagePreviewUrl } from '@/pages/imagePreview/store';
import styles from './index.module.less';

interface Props {
  imageUrl: string;
  summaryImageStatus?: number;
  onRetry: () => void;
}

const SummaryImageSection: FC<Props> = ({ imageUrl, summaryImageStatus, onRetry }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePreview = () => {
    setPendingImagePreviewUrl(imageUrl);
    router.push('/imagePreview');
  };

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  if (
    !imageUrl &&
    summaryImageStatus !== SummaryImageStatus.Generating &&
    summaryImageStatus !== SummaryImageStatus.Failed &&
    summaryImageStatus !== SummaryImageStatus.Complete
  ) {
    return null;
  }

  if (summaryImageStatus === SummaryImageStatus.Failed) {
    return (
      <View className={styles.container}>
        <View className={styles.failedCard} onClick={onRetry}>
          <ThemedImage src={Res.summaryRetry} className={styles.failedIcon} />
          <Text className={styles.failedText}>{Strings.getLang('summary_image_failed')}</Text>
        </View>
      </View>
    );
  }

  if (summaryImageStatus === SummaryImageStatus.Generating) {
    return (
      <View className={styles.container}>
        <View className={styles.skeletonCard}>
          <View className={`${styles.skeletonItem} ${styles.skeletonItem1}`} />
          <View className={`${styles.skeletonItem} ${styles.skeletonItem2}`} />
          <View className={`${styles.skeletonItem} ${styles.skeletonItem3}`} />
          <View className={`${styles.skeletonItem} ${styles.skeletonItem4}`} />
          <View className={`${styles.skeletonItem} ${styles.skeletonItem5}`} />
          <View className={styles.generatingTextRow}>
            <Text className={styles.generatingText}>
              {Strings.getLang('summary_image_generating')}
            </Text>
            <Text className={`${styles.dot} ${styles.dot1}`}>.</Text>
            <Text className={`${styles.dot} ${styles.dot2}`}>.</Text>
            <Text className={`${styles.dot} ${styles.dot3}`}>.</Text>
          </View>
        </View>
      </View>
    );
  }

  if (summaryImageStatus === SummaryImageStatus.Complete || imageUrl) {
    return (
      <View className={styles.container}>
        {!imageLoaded && (
          <View className={styles.skeletonCard}>
            <View className={`${styles.skeletonItem} ${styles.skeletonItem1}`} />
            <View className={`${styles.skeletonItem} ${styles.skeletonItem2}`} />
            <View className={`${styles.skeletonItem} ${styles.skeletonItem3}`} />
            <View className={`${styles.skeletonItem} ${styles.skeletonItem4}`} />
            <View className={`${styles.skeletonItem} ${styles.skeletonItem5}`} />
          </View>
        )}
        {imageUrl && (
          <View className={imageLoaded ? styles.imageWrapper : styles.imageWrapperHidden}>
            <Image
              className={styles.image}
              src={imageUrl}
              mode="widthFix"
              onLoad={() => setImageLoaded(true)}
              onClick={handlePreview}
            />
          </View>
        )}
      </View>
    );
  }

  return null;
};

export default SummaryImageSection;
