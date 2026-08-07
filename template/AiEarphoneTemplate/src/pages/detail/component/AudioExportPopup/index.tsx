/*
 * @Author: hkc
 * @Date: 2025-10-22 10:45:32
 * @LastEditors: hkc
 * @LastEditTime: 2026-02-06 20:49:23
 * @Description:
 */
import React from 'react';
import { View } from '@ray-js/ray';
import { Button } from '@ray-js/smart-ui';

import Strings from '@/i18n';
import Res from '@/res';
import ThemedImage from '@/components/ThemedImage';
import BottomSheetWithCustomTitle from '@/components/BottomSheetWithCustomTitle';
import CustomCoverView from '@/components/CustomCoverView';
import styles from './index.module.less';

interface IProps {
  show: boolean;
  onClose: () => void;
}

const Index: React.FC<IProps> = props => {
  const { show, onClose } = props;

  return (
    <CustomCoverView>
      <BottomSheetWithCustomTitle
        customClass={styles.bottomSheet}
        show={show}
        onClose={onClose}
        title={Strings.getLang('share_modal_export_audio')}
      >
        <View className={styles.content}>
          <ThemedImage
            imageName="downloadImg"
            src={Res.downloadImg}
            className={styles.downloadImg}
          />
          <Button
            loading
            type="info"
            customClass={styles.button}
            loadingText={Strings.getLang('export_ing')}
          />
        </View>
      </BottomSheetWithCustomTitle>
    </CustomCoverView>
  );
};

export default Index;
