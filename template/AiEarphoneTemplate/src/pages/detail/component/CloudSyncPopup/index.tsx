import React, { FC } from 'react';
import { View, Text, Button, router } from '@ray-js/ray';
import { BottomSheet } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import ThemedImage from '@/components/ThemedImage';
import res from '@/res';

import CustomCoverView from '@/components/CustomCoverView';
import styles from './index.module.less';

interface Props {
  show: boolean;
  onClose: () => void;
}

const CloudSyncPopup: FC<Props> = ({ show, onClose }) => {
  const handleOpenCloudSync = () => {
    router.push('/cloud', { subpackage: 'pkgSettings' });
    onClose();
  };

  return (
    <CustomCoverView>
      <BottomSheet customClass={styles.bottomSheet} show={show} closeOnClickOverlay={false}>
        <View className={styles.content}>
          <View className={styles.illustration}>
            <ThemedImage className={styles.illustrationPlaceholder} src={res.shareSyncImg} />
            <ThemedImage
              imageName="closeCircleIcon"
              src={res.closeIcon}
              className={styles.closeIcon}
              onClick={onClose}
            />
          </View>

          <Text className={styles.mainTitle}>{Strings.getLang('cloud_sync_share_link_title')}</Text>

          <Text className={styles.subTitle}>{Strings.getLang('cloud_desc')}</Text>

          <View className={styles.benefitsList}>
            <View className={styles.benefitItem}>
              <View className={styles.benefitContent}>
                <Text className={styles.benefitDesc}>
                  {Strings.getLang('cloud_intro_title_1')}
                  {Strings.getLang('cloud_intro_desc_1')}
                </Text>
              </View>
            </View>

            <View className={styles.benefitItem}>
              <View className={styles.benefitContent}>
                <Text className={styles.benefitDesc}>
                  {Strings.getLang('cloud_intro_title_2')}
                  {Strings.getLang('cloud_intro_desc_2')}
                </Text>
              </View>
            </View>
          </View>

          <View className={styles.buttonWrapper}>
            <Button type="primary" className={styles.openButton} onClick={handleOpenCloudSync}>
              {Strings.getLang('open_cloud_sync')}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </CustomCoverView>
  );
};

export default React.memo(CloudSyncPopup);
